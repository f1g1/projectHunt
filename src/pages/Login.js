import "@codetrix-studio/capacitor-google-auth";
import "./Login.css";

import * as firebase from "firebase";

import {
  IonButton,
  IonCol,
  IonContent,
  IonHeader,
  IonPage,
  IonRow,
} from "@ionic/react";
import React, { useContext } from "react";

import { AppContext } from "../StateGeneric";
import { Plugins } from "@capacitor/core";
import { UserService } from "../services/UserSerivce";

const Login = (props) => {
  const { state: userState, dispatch } = useContext(AppContext);

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
    firebase
      .auth()
      .signInWithCredential(firebase.auth.GoogleAuthProvider.credential(token))
      .then(() => {
        const { history } = props;
        UserService.getUserFirebase(user.email).then((qs) => {
          let exists = false;
          let userFromDb;
          qs.forEach((doc) => {
            exists = true;
            userFromDb = doc.data();
          });

          saveUser({ ...user, ...userFromDb });
          let x = userFromDb && userFromDb.userName;
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
      });
  };

  return (
    <IonPage>
      <IonHeader></IonHeader>
      <IonContent className="ion-padding">
        <IonRow>
          <IonCol className="text-center">
            <img
              style={{ width: "200px", height: "200px", marginTop: "100px" }}
              src={require("../resources/logo1.png")}
            />
          </IonCol>
        </IonRow>

        <IonButton
          shape="round"
          style={{
            minHeight: "50px",
            marginBottom: "30px",
            fontWeight: "bold",
            fontSize: "1em",
            mode: "ios",
          }}
          className="login-button"
          onClick={signIn}
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
