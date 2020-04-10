import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Home from './pages/Home';
import Login from './pages/Login';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import Test from './pages/Test';
import { CreateGameContextProvider } from "./StateCreateGame";
import { AppContextProvider } from './StateGeneric';
import { PlayContextProvider } from './StatePlayGame';
import ChatBoard from './components/Chat/ChatBoard/ChatBoard';
import Lobby from './pages/Lobby/Lobby';
import MyGames from './pages/MyGames/MyGames';
import Create from './pages/Create/Create';
import LobbySearch from './pages/LobbySearch/LobbySearch';
import Tabb from './pages/BarcodeTest';
import Play from './pages/Play/Play';
import SeeClue from './pages/Play/SeeClue';
import UserName from './pages/Username/UserName';
const App: React.FC = () => (
  <IonApp>



    <IonReactRouter>

      <IonRouterOutlet>

        <Route path="/login" component={Login} exact={true} />
        <Route path="/home" component={Home} exact={true} />

        <Route path="/game" component={withCreateContext(Create)} />

        <Route path="/test" component={Test} exact={true} />
        <Route path="/chat" component={ChatBoard} exact={true} />
        <Route path="/lobbysearch" component={LobbySearch} exact={true} />
        <Route path="/mygames" component={MyGames} exact={true} />
        <Route path="/tab1" component={Tabb} exact={true} />

        <Route exact path="/" render={() => <Redirect to="/login" />} />
        <Route path="/lobby" component={Lobby} exact={true} />
        <Route path="/play" component={Play} exact={true} />
        <Route path="/seeClue" component={SeeClue} exact={true} />
        <Route path="/username" component={UserName} exact={true} />

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

export function withPlayContext(Component: any) {
  return function WrapperComponent(props: any) {
    return (
      <PlayContextProvider>
        {<Component {...props} />}
      </PlayContextProvider>
    );
  };
}

export default App;
