import React, { createContext, useReducer } from "react";

let AppContext = createContext();

const initialState = {
    startLat: 0,
    startLng: 0,
    startRadius: 1,
    finishLat: 0,
    finishLng: 0,
    finishRadius: 1,
}

let reducer = (state, action) => {
    switch (action.type) {
        case "setStartCoords": {
            return { ...state, startLat: action.lat, startLng: action.lng }
        }
        case "setStartRadius": {
            return { ...state, startRadius: action.Radius }

        }
        case "setFinishCoords": {
            return { ...state, finishLat: action.lat, finishLng: action.lng }
        }
        case "setStartRadius": {
            return { ...state, finishRadius: action.Radius }
        }
    }
    return state;
};

function AppContextProvider(props) {
    const fullInitialState = {
        ...initialState,
    }

    let [state, dispatch] = useReducer(loggerReducer, fullInitialState)
    let value = { state, dispatch };


    return (
        <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
    );
}

const logger = (reducer) => {
    const reducerWithLogger = (state, action) => {
        console.log("%cPrevious State:", "color: #9E9E9E; font-weight: 700;", state);
        console.log("%cAction:", "color: #00A7F7; font-weight: 700;", action);
        console.log("%cNext State:", "color: #47B04B; font-weight: 700;", reducer(state, action));
        return reducer(state, action);
    };
    return reducerWithLogger;
}

const loggerReducer = logger(reducer);

let AppContextConsumer = AppContext.Consumer;

export { AppContext, AppContextProvider, AppContextConsumer };