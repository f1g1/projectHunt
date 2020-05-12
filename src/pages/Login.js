import "@codetrix-studio/capacitor-google-auth";
import "./Login.css";

import * as firebase from "firebase";

import {
  IonButton,
  IonCol,
  IonContent,
  IonHeader,
  IonImg,
  IonPage,
  IonRow,
} from "@ionic/react";
import React, { useContext, useEffect } from "react";

import { AppContext } from "../StateGeneric";
import { Plugins } from "@capacitor/core";
import { UserService } from "../services/UserSerivce";

const Login = (props) => {
  const { state: userState, dispatch } = useContext(AppContext);
  useEffect(() => {
    try {
      if (userState.authentication.idToken) doLogin(userState);
    } catch {}
  }, [userState]);
  useEffect(() => {
    let user = UserService.getCurrentUser();
    user && user.authentication && doLogin(user);
  }, []);

  const saveUser = (user) => {
    dispatch({
      type: "Login",
      user,
    });
  };

  const signIn = async () => {
    let result;
    result = await Plugins.GoogleAuth.signIn();
    if (result) {
      doLogin(result);
    } else {
      console.log("I FAILEd", result);
    }
  };

  const doLogin = async (user) => {
    let token = user.authentication.idToken;
    await firebase
      .auth()
      .signInWithCredential(firebase.auth.GoogleAuthProvider.credential(token));

    const { history } = props;
    UserService.getUserFirebase(user.email).then((u) => {
      let userFromDb = u.data();
      debugger;
      saveUser({ ...userFromDb, ...u.data() });
      let x = u.exists && userFromDb.userName;
      !x
        ? history.replace({
            pathname: "/username",
            user,
          })
        : history.replace({
            pathname: "/home",
            state: {
              name: userFromDb.name || userFromDb.displayName,
              image: userFromDb.imageUrl,
              email: userFromDb.email,
            },
          });
    });
  };

  return (
    <IonPage>
      <IonHeader></IonHeader>
      <IonContent className="ion-padding">
        <IonRow>
          <IonCol className="text-center">
            <IonImg className="title-img" src="assets/capacitor.png"></IonImg>
          </IonCol>
        </IonRow>

        <IonButton
          style={{
            minHeight: "50px",
            marginBottom: "30px",
            fontWeight: "bold",
            fontSize: "1em",
            mode: "ios",
          }}
          className="login-button"
          onClick={() => signIn()}
          expand="block"
          fill="solid"
          color="primary"
        >
          Login with Google
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Login;
