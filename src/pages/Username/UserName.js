import {
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonInput,
  IonItem,
  IonPage,
  IonRow,
  IonToast,
} from "@ionic/react";
import React, { useState } from "react";

import { UserService } from "../../services/UserSerivce";

export default function UserName(props) {
  const [name, setName] = useState();
  const [showToast, setShowToast] = useState(false);
  const [showToast1, setShowToast1] = useState(false);
  let handleSubmit = () => {
    let userName = (name && name.trim()) || "";

    if (!userName || userName.length < 3 || userName.includes(" ")) {
      setShowToast(true);
      return;
    } else {
      UserService.checkUserName(userName)
        .then((qs) => {
          let exists = false;
          qs.forEach((doc) => {
            exists = true;
          });
          if (!exists) {
            console.log("exists");

            UserService.SaveNewUser({
              ...props.location.user,
              userName,
              lowerUserName: userName.toLowerCase(),
            }).then(() =>
              props.history.replace({
                pathname: "/home",
                state: {
                  name:
                    props.location.username || props.location.userdisplayName,
                  image: props.location.userimageUrl,
                  email: props.location.useremail,
                },
              })
            );
          } else {
            console.log("user already exists");
            setShowToast1(true);
          }
        })
        .catch((x) => {
          console.log(x);
          console.log("failed to check if username already exists");
        });
    }
  };
  return (
    <IonPage>
      <IonContent color="primary">
        <IonGrid style={{ marginTop: "200px" }}>
          <IonRow>
            <IonCol size="5" offset="3">
              <h1>Choose your adventurer name:</h1>
              <IonItem>
                <IonInput
                  onIonChange={(e) => setName(e.target.value)}
                  type="text"
                  maxlength="25"
                  minlength="3"
                />
                <IonButton onClick={handleSubmit} size="large">
                  Save!
                </IonButton>
              </IonItem>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
      <IonToast
        color="danger"
        position="top"
        isOpen={showToast}
        onDidDismiss={() => setShowToast(false)}
        message="Uername must be at least 3 character long and shouldn't contain ' '."
        duration={2000}
      />

      <IonToast
        color="danger"
        position="top"
        isOpen={showToast1}
        onDidDismiss={() => setShowToast1(false)}
        message="Username is already taken! Please choose other username!"
        duration={2000}
      />
    </IonPage>
  );
}
