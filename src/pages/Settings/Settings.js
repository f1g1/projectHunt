import {
  IonBackButton,
  IonButtons,
  IonCheckbox,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React, { useEffect, useState } from "react";

import MiscService from "../../services/MiscService";
import NotificationsIcon from "@material-ui/icons/Notifications";

export default function Settings(props) {
  const [notifications, setNotifications] = useState(
    MiscService.getNotificationSettings()
  );
  useEffect(() => {
    MiscService.setNotificationSettings(notifications);
  }, [notifications]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons style={{ display: "inline-block" }}>
            <IonBackButton defaultHref="/home"></IonBackButton>
          </IonButtons>
          <IonTitle
            style={{ display: "inline-block" }}
            className="ion-text-center"
          >
            Settings
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonGrid>
          <IonRow>
            <IonCol sizeXl="4" offsetXl="4">
              <IonTitle className="ion-padding-vertical">Settings</IonTitle>

              <IonList>
                <IonItem>
                  <NotificationsIcon />
                  <IonLabel
                    className="ion-padding-start"
                    style={{ fontWeight: "bold" }}
                  >
                    Notifications settings!
                  </IonLabel>
                </IonItem>
                <IonListHeader>
                  <h2>In game Notifications</h2>
                </IonListHeader>

                <IonItem>
                  Message Notification
                  <IonCheckbox
                    onIonChange={(e) =>
                      setNotifications({
                        ...notifications,
                        message: e.detail.checked,
                      })
                    }
                    slot="end"
                    checked={notifications.message}
                  ></IonCheckbox>
                </IonItem>

                <IonListHeader>
                  <h2>General Notifications</h2>
                </IonListHeader>

                <IonItem>
                  Map Notification
                  <IonCheckbox
                    onIonChange={(e) =>
                      setNotifications({
                        ...notifications,
                        map: e.detail.checked,
                      })
                    }
                    slot="end"
                    checked={notifications.map}
                  ></IonCheckbox>
                </IonItem>
                <IonItem>
                  Challenge added Notification
                  <IonCheckbox
                    onIonChange={(e) =>
                      setNotifications({
                        ...notifications,
                        newChallenge: e.detail.checked,
                      })
                    }
                    slot="end"
                    checked={notifications.newChallenge}
                  ></IonCheckbox>
                </IonItem>
              </IonList>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
}
