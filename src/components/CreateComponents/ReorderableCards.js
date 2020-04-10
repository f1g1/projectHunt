import { IonItem, IonReorder, IonReorderGroup } from "@ionic/react";
import React, { useContext } from "react";

import { AppContext } from "../../StateCreateGame";
import InnerCard from "./Cards/InnerCard";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";

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
  const deleteCard = (id) => {
    dispatch({
      type: "deleteStep",
      id
    });
  }


  return (
    <>
      <IonReorderGroup disabled={false} onIonItemReorder={doReorder}>
        {state.cloneSteps.map(x => (
          <IonItem lines="none" key={x.id}>
            <InnerCard step={x} delete={deleteCard} edit={props.edit}>
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
