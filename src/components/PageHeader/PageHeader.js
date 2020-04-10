import { IonAvatar, IonHeader, IonItem, IonNote, IonToolbar } from "@ionic/react";

import React from "react";

const PageHeader = props => {
  console.log("pageHeader", props.user);
  return (
    <IonHeader>
      <IonToolbar>
        {props.user && (
          <div className="generic-flex  ">
            <div className="home-title">Logged in as</div>
            <div className="home-title">
              <IonItem className="ion-item" mode="ios" lines="none">
                <IonAvatar slot="start">
                  <img src={props.user.image} alt={"avatar"} />
                </IonAvatar>
                <IonNote>
                  <h5>{props.user && props.user.name}</h5>
                </IonNote>
              </IonItem>
            </div>
          </div>
        )}
      </IonToolbar>
    </IonHeader>
  );
};

export default PageHeader;
