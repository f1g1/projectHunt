import React, { useContext } from "react";
import {
  IonReorderGroup,
  IonItem,
  IonReorder,
} from "@ionic/react";
import InnerCard from "./Cards/InnerCard";
import { AppContext } from "../../StateCreateGame";

export default function ReorderableCards(props) {
  const { state, dispatch } = useContext(AppContext);

  function doReorder(event) {
    console.log("Dragged from index", event.detail.from, "to", event.detail.to);
    dispatch({
      type: "swapSteps",
      from: event.detail.from,
      to: event.detail.to
    });
    event.detail.complete();
  }
  return (
    <>
      <IonReorderGroup disabled={false} onIonItemReorder={doReorder}>
        {state.cloneSteps.map(x => (
          <IonItem lines="none">
            <InnerCard clue={x.clue} code={x.code}>
              <div className="arrow">
                <IonReorder slot="start" />
              </div>
            </InnerCard>
          </IonItem>
        ))}
      </IonReorderGroup>
    </>
  );
}
