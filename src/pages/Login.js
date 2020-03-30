import {
  IonContent,
  IonText,
  IonRow,
  IonCol,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonImg
} from "@ionic/react";
import React, { useContext, useEffect } from "react";
import "./Login.css";
import { Plugins } from "@capacitor/core";
import * as firebase from "firebase";
import "@codetrix-studio/capacitor-google-auth";
import { AppContext } from "../StateGeneric";

const Login = props => {
  const { state: userState, dispatch } = useContext(AppContext);
  useEffect(() => {
    try {
      if (userState.authentication.idToken)
        doLogin(userState);
    } catch { }
  }, [userState]);


  const saveUser = user => {
    dispatch({
      type: "Login",
      user
    });
  };

  const signIn = async () => {
    let result;
    result = await Plugins.GoogleAuth.signIn();
    console.info("resultSignIN", result);
    if (result) {
      saveUser(result);
    } else {
      console.log("I FAILEd", result);
    }
  };

  const doLogin = async user => {
    let token = user.authentication.idToken;
    let r = await firebase
      .auth()
      .signInWithCredential(firebase.auth.GoogleAuthProvider.credential(token));
    console.info("firebase Response: ", r);

    const { history } = props;
    history.push({
      pathname: "/home",
      state: {
        name: user.name || user.displayName,
        image: user.imageUrl,
        email: user.email
      }
    });
  };

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
            <IonImg className="title-img" src="assets/capacitor.png"></IonImg>
          </IonCol>
        </IonRow>

        <IonButton
          className="login-button"
          onClick={() => signIn()}
          expand="block"
          fill="solid"
          color="danger"
        >
          Login with Google
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Login;
