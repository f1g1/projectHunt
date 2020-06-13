import {
  IonButton,
  IonButtons,
  IonCardContent,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from "@ionic/react";

import CloseIcon from "@material-ui/icons/Close";
import { DashboardService } from "../../services/DashboardService";
import { PhotoViewer } from "@ionic-native/photo-viewer";
import React from "react";

export default function AnswerModal(props) {
  return (
    <>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons style={{ display: "inline-block" }}>
            <IonButton shape="round" shape="round" onclick={props.handleClose}>
              <CloseIcon />
            </IonButton>
          </IonButtons>
          <IonTitle
            className="ion-no-padding"
            style={{
              display: "inline-block",
              position: "absolute",
              bottom: "15px",
            }}
          >
            See response
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonCardContent>
          {props.step.image && (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <img
                src={props.step.image}
                style={{ maxWidth: "100%" }}
                onClick={() => PhotoViewer.show(props.step.image)}
              />
            </div>
          )}
          <h2 style={{ paddingTop: "50px" }}>Clue:</h2>
          <IonTitle className="ion-text-wrap">{props.step.clue}</IonTitle>
          {props.step.code && props.step.code !== "" && (
            <>
              <h2>Expected Answer:</h2>
              <IonTitle>{props.step.code}</IonTitle>
            </>
          )}
          {props.team[props.step.id].byAdmin ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                paddingTop: "40px",
              }}
              className="ion-padding-vertical"
            >
              <IonTitle color="danger" className="ion-text-center">
                Completed by admin
              </IonTitle>
            </div>
          ) : (
            <>
              <h2 style={{ paddingTop: "50px" }}>Answer:</h2>
              <div>
                {props.team[props.step.id].answer ? (
                  props.team[props.step.id].answer
                ) : (
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <img
                      src={props.team[props.step.id].imageAnswer}
                      onClick={() =>
                        PhotoViewer.show(props.team[props.step.id].imageAnswer)
                      }
                    />
                  </div>
                )}
              </div>
            </>
          )}

          <IonButton
            shape="round"
            color="danger"
            onClick={() => {
              DashboardService.revokeChallenge(props.team.name, props.step);
              props.handleClose();
            }}
            expand="full"
          >
            Revoke!
          </IonButton>
        </IonCardContent>
      </IonContent>
    </>
  );
}
