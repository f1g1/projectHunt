import React, { useContext, useEffect } from "react";
import {
  IonRow,
  IonCol,
  IonReorderGroup,
  IonItem,
  IonReorder,
  IonButton
} from "@ionic/react";
import InnerCard from "../../components/CreateComponents/Cards/InnerCard";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import { AppContext } from "../../StateCreateGame";

export default function ReorderableCards(props) {
  const { state, dispatch } = useContext(AppContext);

  function doReorder(event) {
    console.log("Dragged from index", event.detail.from, "to", event.detail.to);
    debugger;
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
              <div className="arrow">
                <KeyboardArrowDownIcon />
              </div>
            </InnerCard>
          </IonItem>
        ))}
      </IonReorderGroup>
    </>
  );
}
