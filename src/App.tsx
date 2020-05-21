import "@ionic/react/css/core.css";
import "@ionic/react/css/display.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/padding.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/typography.css";
import "./theme/variables.css";

import { IonApp, IonRouterOutlet } from "@ionic/react";
import { Redirect, Route } from "react-router-dom";

import Create from "./pages/Create/Create";
import { CreateGameContextProvider } from "./StateCreateGame";
import Dashboard from "./pages/GameDashobard/Dashboard";
import FinishedGame from "./pages/FinishedGame";
import Home from "./pages/Home";
import { IonReactRouter } from "@ionic/react-router";
import Lobby from "./pages/Lobby/Lobby";
import LobbySearch from "./pages/LobbySearch/LobbySearch";
import Login from "./pages/Login";
import MyGames from "./pages/MyGames/MyGames";
import Play from "./pages/Play/Play";
import React from "react";
import SeeClue from "./pages/Play/SeeClueChallenge";
import UserName from "./pages/Username/UserName";

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route path="/login" component={Login} exact={true} />
        <Route path="/home" component={Home} exact={true} />
        <Route path="/game" component={withCreateContext(Create)} />

        <Route path="/lobbysearch" component={LobbySearch} exact={true} />
        <Route path="/mygames" component={MyGames} exact={true} />

        <Route exact path="/" render={() => <Redirect to="/login" />} />
        <Route path="/lobby" component={Lobby} exact={true} />
        <Route path="/play" component={withCreateContext(Play)} exact={true} />
        <Route path="/seeClue" component={SeeClue} exact={true} />
        <Route path="/username" component={UserName} exact={true} />
        <Route path="/gameDashboard" component={Dashboard} exact={true} />
        <Route path="/finishedGame" component={FinishedGame} exact={true} />
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export function withCreateContext(Component: any) {
  return function WrapperComponent(props: any) {
    return (
      <CreateGameContextProvider>
        {<Component {...props} />}
      </CreateGameContextProvider>
    );
  };
}

// export function withPlayContext(Component: any) {
//   return function WrapperComponent(props: any) {
//     return (
//       <PlayContextProvider>{<Component {...props} />}</PlayContextProvider>
//     );
//   };
// }

export default App;
