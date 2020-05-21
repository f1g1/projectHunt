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
import NotificationsIcon from "@material-ui/icons/Notifications";
import { Plugins } from "@capacitor/core";
import React from "react";
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
          <IonItem>
            <NotificationsIcon />
            <IonLabel className="menu-label">Notifications</IonLabel>
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
