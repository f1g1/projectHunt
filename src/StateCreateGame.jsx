import React, { createContext, useReducer } from "react";

import { GameService } from "./services/GameService";

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
  description: null,
  title: null,
  inOrder: true,
  password: null,
  image: null,

  steps: [
    // {
    //     clue: "",
    //     code: "qmMohp"
    // },
    // {
    //     clue: "",
    //     code: "WVOs2o"
    // },
    // {
    //     clue: "",
    //     code: "5xN0vz"
    // }
  ],
  cloneSteps: [
    // {
    //     clue: "",
    //     code: "qmMohp"
    // },
    // {
    //     clue: "",
    //     code: "WVOs2o"
    // },
    // {
    //     clue: "",
    //     code: "5xN0vz"
    // }
  ],
};
// const initialState = {
//   startRadius: 1,
//   finishRadius: 1,
//   steps: []
// };

let reducer = (state, action) => {
  switch (action.type) {
    case "setGame": {
      return action.game;
    }
    case "setStartCoords": {
      return {
        ...state,
        startLat: action.lat,
        startLng: action.lng,
        startRadius: action.radius,
      };
    }

    case "setTitle": {
      return { ...state, title: action.title };
    }
    case "setInOrder": {
      return { ...state, inOrder: action.inOrder };
    }
    case "setPassword": {
      return { ...state, password: action.password };
    }
    case "setDescription": {
      return { ...state, description: action.description };
    }
    case "setImage": {
      return {
        ...state,
        image: URL.createObjectURL(action.image),
        imageFile: action.image,
      };
    }
    case "setMaxPlayers": {
      if (action.maxPlayers < 1) action.maxPlayers = 1;
      if (action.maxPlayers > 20) action.maxPlayers = 20;
      return { ...state, maxPlayers: action.maxPlayers };
    }
    case "setArea": {
      return { ...state, area: action.value };
    }
    case "setSteps": {
      return {
        ...state,
        steps: [...action.steps],
        cloneSteps: [...action.steps],
      };
    }
    case "addStep": {
      return {
        ...state,
        steps: [...state.steps, action.step],
        cloneSteps: [...state.cloneSteps, action.step],
      };
    }
    case "deleteStep": {
      state.steps = state.steps.filter((x) => x.id !== action.id) || [];
      state.cloneSteps =
        state.cloneSteps.filter((x) => x.id !== action.id) || [];
      return { ...state };
    }
    case "swapSteps": {
      let arr = [...state.steps];
      [arr[action.from], arr[action.to]] = [arr[action.to], arr[action.from]];
      return { ...state, steps: arr };
    }
    default: {
    }
  }
  return state;
};

function CreateGameContextProvider(props) {
  const fullInitialState = {
    ...initialState,
  };

  let [state, dispatch] = useReducer(loggerReducer, fullInitialState);
  let value = { state, dispatch };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
}

const logger = (reducer) => {
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
    GameService.saveToLocal(reducer(state, action));
    return reducer(state, action);
  };
  return reducerWithLogger;
};

const loggerReducer = logger(reducer);

let AppContextConsumer = AppContext.Consumer;

export {
  AppContext,
  CreateGameContextProvider,
  AppContextConsumer as CreateGaneContextConsumer,
};
