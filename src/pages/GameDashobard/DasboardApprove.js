import {
  IonCard,
  IonCardContent,
  IonCol,
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
      <IonCard color="light" style={{ marginBottom: "30px" }}>
        <IonCardContent>
          <IonRow color="priamry">
            <IonCol size="4">
              <h2 style={{ textDecoration: "bold" }}>Team:</h2>
            </IonCol>
            <IonCol size="4">
              <IonLabel>Challenge:</IonLabel>
            </IonCol>
            <IonCol size="4">
              <IonLabel>Timestamp:</IonLabel>
            </IonCol>
          </IonRow>
        </IonCardContent>
      </IonCard>

      {props.toBeValidated &&
        props.toBeValidated.map((x) => (
          <IonCard
            style={{ cursor: "pointer" }}
            button
            onClick={() => {
              setCurrentTeamName(x.name);

              setShowApproveModal(x);
            }}
            color="primary"
          >
            <IonCardContent>
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
            </IonCardContent>
          </IonCard>
        ))}

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
