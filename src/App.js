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
import History from "./pages/History/History";
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
import { UserService } from "./services/UserSerivce";

function WithRedirect(props) {
  return props.login ? props.children : <Redirect to="/login" />;
}

export default function App() {
  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route path="/login" component={Login} exact={true} />
          {/* <WithRedirect login={UserService.getCurrentUser() || false}> */}
          <Route path="/home" component={Home} exact={true} />
          <Route path="/game" component={withCreateContext(Create)} />
          <Route path="/lobbysearch" component={LobbySearch} exact={true} />
          <Route path="/mygames" component={MyGames} exact={true} />
          <Route path="/lobby" component={Lobby} exact={true} />
          <Route
            path="/play"
            component={withCreateContext(Play)}
            exact={true}
          />
          <Route path="/seeClue" component={SeeClue} exact={true} />
          <Route path="/username" component={UserName} exact={true} />
          <Route path="/gameDashboard" component={Dashboard} exact={true} />
          <Route path="/finishedGame" component={FinishedGame} exact={true} />
          <Route path="/history" component={History} exact={true} />
          {/* </WithRedirect> */}

          <Route
            exact
            path="/"
            render={() =>
              UserService.getCurrentUser() ? (
                <Redirect to="/home" />
              ) : (
                <Redirect to="/login" />
              )
            }
          />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
}

export function withCreateContext(Component) {
  return function WrapperComponent(props) {
    return (
      <CreateGameContextProvider>
        {<Component {...props} />}
      </CreateGameContextProvider>
    );
  };
}
