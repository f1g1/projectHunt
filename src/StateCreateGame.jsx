import React, { createContext, useReducer } from "react";

let AppContext = createContext();

// const initialState = {
//     startLat: 0,
//     startLng: 0,
//     startRadius: 1,
//     finishLat: 0,
//     finishLng: 0,
//     finishRadius: 1,
// }

const initialState = {
    maxPlayers: 4,
    steps: [
        {
            clue: "",
            code: "qmMohp"
        },
        {
            clue: "",
            code: "WVOs2o"
        },
        {
            clue: "",
            code: "5xN0vz"
        }
    ],
    cloneSteps: [
        {
            clue: "",
            code: "qmMohp"
        },
        {
            clue: "",
            code: "WVOs2o"
        },
        {
            clue: "",
            code: "5xN0vz"
        }
    ]
};
// const initialState = {
//   startRadius: 1,
//   finishRadius: 1,
//   steps: []
// };

let reducer = (state, action) => {
    switch (action.type) {
        case "setStartCoords": {
            return { ...state, startLat: action.lat, startLng: action.lng, startRadius: action.radius };
        }
        case "setFinishCoords": {
            return { ...state, finishLat: action.lat, finishLng: action.lng, finishRadius: action.radius };
        }
        case "setTitle": {
            return { ...state, title: action.title };
        }
        case "setMaxPlayers": {
            return { ...state, maxPlayers: action.maxPlayers }
        }
        case "addStep": {
            return {
                ...state,
                steps: [...state.steps, action.step],
                cloneSteps: [...state.cloneSteps, action.step]
            };
        }
        case "swapSteps": {
            let arr = [...state.steps];
            [arr[action.from], arr[action.to]] = [arr[action.to], arr[action.from]];
            debugger;
            return { ...state, steps: arr };
        }
        default: {
        }
    }
    return state;
};

function CreateGameContextProvider(props) {
    const fullInitialState = {
        ...initialState
    };

    let [state, dispatch] = useReducer(loggerReducer, fullInitialState);
    let value = { state, dispatch };

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

export {
    AppContext,
    CreateGameContextProvider,
    AppContextConsumer as CreateGaneContextConsumer
};