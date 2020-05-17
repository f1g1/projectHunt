import {
  IonCard,
  IonCardContent,
  IonCol,
  IonGrid,
  IonItem,
  IonLabel,
  IonModal,
  IonRow,
} from "@ionic/react";
import React, { useState } from "react";

import ApproveModal from "./ApproveModal";

var moment = require("moment");

export default function DasboardApprove(props) {
  const [showApproveModal, setShowApproveModal] = useState();
  const [currentTeamName, setCurrentTeamName] = useState();

  return (
    <>
      <IonCol sizeXl="6" offsetXl="3">
        <IonCard color="light" style={{ marginBottom: "30px" }}>
          <IonCardContent>
            <IonRow color="priamry">
              <IonCol>
                <h2 style={{ textDecoration: "bold" }}>Team</h2>
              </IonCol>
              <IonCol>
                <IonLabel>challenge</IonLabel>
              </IonCol>
              <IonCol>
                <IonLabel>Timestamp</IonLabel>
              </IonCol>
            </IonRow>
          </IonCardContent>
        </IonCard>

        {props.toBeValidated &&
          props.toBeValidated.map((x) => (
            <IonItem
              style={{ cursor: "pointer" }}
              button
              onClick={() => {
                setCurrentTeamName(x.name);

                setShowApproveModal(x);
              }}
            >
              <IonGrid>
                <IonRow key={x.name}>
                  <IonCol>{x.name}</IonCol>
                  <IonCol>
                    <IonLabel>#{x.index + 1}</IonLabel>
                  </IonCol>
                  <IonCol>
                    <IonLabel>
                      {moment(x.time * 1000).format("DD/MM HH:mm")}
                    </IonLabel>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </IonItem>
          ))}
      </IonCol>

      <IonModal
        isOpen={showApproveModal !== undefined}
        onDidDismiss={() => setShowApproveModal()}
      >
        {props.game && (
          <ApproveModal
            handleClose={() => setShowApproveModal()}
            {...showApproveModal}
            team={currentTeamName}
            finished={
              (props.teams.find((x) => x.name === currentTeamName) &&
                props.teams.find((x) => x.name === currentTeamName).completed &&
                props.teams.find((x) => x.name === currentTeamName).completed
                  .length >=
                  props.game.steps.length - 1) ||
              false
            }
          />
        )}
      </IonModal>
    </>
  );
}
