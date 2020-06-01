import "./Menu.scss";

import {
  IonContent,
  IonFooter,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonMenu,
  IonMenuButton,
  IonTitle,
  IonToolbar,
} from "@ionic/react";

import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import HistoryIcon from "@material-ui/icons/History";
import { Plugins } from "@capacitor/core";
import React from "react";
import SettingsIcon from "@material-ui/icons/Settings";
import { UserService } from "../../services/UserSerivce";
import { menuController } from "@ionic/core";

export default function Menu(props) {
  const signOut = async () => {
    await Plugins.GoogleAuth.signOut();
    props.history.replace("/login");
    UserService.logout();
  };

  const handleGoHistory = () => {
    props.history.push("/history");
    menuController.close();
  };
  const handleGoNotifications = () => {
    props.history.push("/settings");
    menuController.close();
  };

  return (
    <IonMenu side="start" menuId="first" swipeGesture="true" contentId="main">
      <IonHeader>
        <IonToolbar color="primary">
          <IonMenuButton slot="end" color="light">
            X
          </IonMenuButton>

          <IonTitle>Menu</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <IonItem button onClick={handleGoNotifications}>
            <SettingsIcon />
            <IonLabel className="menu-label">Settings</IonLabel>
          </IonItem>
          <IonItem button onClick={handleGoHistory}>
            <HistoryIcon />
            <IonLabel className="menu-label">History</IonLabel>
          </IonItem>
        </IonList>
      </IonContent>
      <IonFooter mode="ios" translucent>
        <IonItem
          button
          color="danger"
          className="ion-margin-vertical"
          onClick={() => signOut()}
        >
          <ExitToAppIcon />
          <IonLabel className="menu-label">Logout</IonLabel>
        </IonItem>
      </IonFooter>
    </IonMenu>
  );
}
