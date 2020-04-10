import React, { createContext, useReducer, useEffect } from "react";

let PlayContext = createContext();

const initialState = {};


let reducer = (state, action) => {
    switch (action.type) {
        case "setSuccesStepTrue": {
            return { ...state, showSuccesStepToast: true };
        }
        case "setSuccesStepFalse": {
            return { ...state, showSuccesStepToast: true };
        }
        case "setMyTeam": {
            return { ...state, myTeam: action.value };
        }
        case "setCurrentStepIndex": {
            return { ...state, currentStepIndex: action.value };

        }

        default: {
        }
    }
    return state;
};



let persistedState;
try {
    persistedState = JSON.parse(window.localStorage['persistedPlaytate']);
} catch (ex) {
    persistedState = {};
}
function PlayContextProvider(props) {
    const fullInitialState = {
        ...initialState
    };

    let [state, dispatch] = useReducer(loggerReducer, fullInitialState);
    let value = { state, dispatch };
    useEffect(() => {
        if (state && state !== {})
            window.localStorage['persistedPlaytate'] = JSON.stringify({
                myTeam: state.myTeam
            });
    }, [state]);
    return (
        <PlayContext.Provider value={value}>{props.children}</PlayContext.Provider>
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

let PlayContextConsumer = PlayContext.Consumer;

export {
    PlayContext,
    PlayContextProvider,
    PlayContextConsumer
};