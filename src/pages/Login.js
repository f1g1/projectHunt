import { IonContent, IonText, IonRow, IonCol, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonImg, IonList } from '@ionic/react';
import React, { useContext, FunctionComponent } from 'react';
import './Login.css';
import { Plugins } from '@capacitor/core';
import * as firebase from "firebase";
import "@codetrix-studio/capacitor-google-auth";
import { AppContext } from '../StateGeneric';


const Login = (props) => {
  const { state, dispatch } = useContext(AppContext);

  const saveUser = (user) => {
    debugger;
    dispatch({
      type: "Login",
      user
    })
  }

  const signIn = async () => {
    console.log("da")
    const { history } = props;
    let result;
    result = await Plugins.GoogleAuth.signIn();
    debugger;
    console.info('result', result);
    if (result) {
      console.log("I succeded,", result)
      let token = result.authentication.accessToken;
      saveUser(result);
      let r = await firebase.auth().signInWithCredential(firebase.auth.GoogleAuthProvider.credential(result.authentication.idToken));
      console.info("firebase Response: ", r)


      history.push({
        pathname: '/home',
        state: { name: result.name || result.displayName, image: result.imageUrl, email: result.email }
      });
    }
    else {
      console.log("I FAILEd", result)
    }

  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Ionic React App</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonRow>
          <IonCol className="text-center">
            <IonImg className="title-img" src="assets/capacitor.png" ></IonImg>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol className="text-center">
            <IonText className="title">
              Google Login in Capacitor app
              </IonText>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol className="text-center">
            <IonText className="text-center">
              By Enappd Team
              </IonText>
          </IonCol>
        </IonRow>

        <IonButton className="login-button" onClick={() => signIn()} expand="block" fill="solid" color="danger">
          Login with Google
        </IonButton>
      </IonContent>
    </IonPage>
  )
}

export default Login;
