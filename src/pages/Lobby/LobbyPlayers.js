import {
  IonButton,
  IonButtons,
  IonCol,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonRow,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React, { useEffect, useState } from "react";

import CloseIcon from "@material-ui/icons/Close";
import PlayerTag from "./PlayerTag";

export default function LobbyPlayers(props) {
  const [searchString, setSearchString] = useState();
  const [filtered, setfiltered] = useState(props.game.players);

  useEffect(() => {
    if (searchString && searchString !== "")
      setfiltered(
        props.game.players.filter((x) =>
          x.toLowerCase().includes(searchString.toLowerCase())
        )
      );
    else {
      setfiltered(props.game.players);
    }
  }, [searchString, props.game]);
  return (
    <div>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons style={{ display: "inline-block" }}>
            <IonButton onclick={props.handleClose}>
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
            All Players
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonRow style={{ height: "100%" }}>
        <IonCol offsetXl="1" sizeXl="10" size="12">
          <IonList>
            <IonListHeader>Players:</IonListHeader>
            {filtered.map((x) => (
              <PlayerTag
                playerName={x}
                game={props.game}
                key={x + "p"}
                handleKick={props.handleKick}
                teams={props.teams}
                advanced
              />
            ))}
          </IonList>
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol offsetXl="2" sizeXl="8">
          <IonItem>
            <IonLabel>Search:</IonLabel>
            <IonInput
              value={searchString}
              onIonChange={(e) => setSearchString(e.target.value)}
              placeholder="Type player name here"
            />
          </IonItem>
        </IonCol>
      </IonRow>
    </div>
  );
}
