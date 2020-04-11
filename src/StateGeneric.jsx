import React, { createContext, useEffect, useReducer } from "react";

import { UserService } from "./services/UserSerivce";

let AppContext = createContext();

const initialState = {};

let persistedState;
try {
    persistedState = UserService.getCurrentUser();
} catch (ex) {
    persistedState = {};
}

let reducer = (state, action) => {
    switch (action.type) {
        case "Login": {
            return { ...state, ...action.user };
        }
        case "Logout": {
            return {};
        }
        default:
            return {};
    }
};

function AppContextProvider(props) {
    const fullInitialState = {
        ...initialState,
        ...persistedState
    };

    let [state, dispatch] = useReducer(loggerReducer, fullInitialState);
    let value = { state, dispatch };
    useEffect(() => {
        UserService.setCurrentUser(state);
    }, [state]);

    return (
        <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
    );
}

const logger = reducer => {
    const reducerWithLogger = (state, action) => {
        console.log(
            "%cPrevious State:",
            "color: #9E9E9E; font-weight: 700;",
            state
        );
        console.log("%cAction:", "color: #00A7F7; font-weight: 700;", action);
        console.log(
            "%cNext State:",
            "color: #47B04B; font-weight: 700;",
            reducer(state, action)
        );
        return reducer(state, action);
    };
    return reducerWithLogger;
};

const loggerReducer = logger(reducer);

let AppContextConsumer = AppContext.Consumer;

export { AppContext, AppContextProvider, AppContextConsumer };

