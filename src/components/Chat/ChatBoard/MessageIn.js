import { IonBadge, IonImg } from "@ionic/react";

import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import { PhotoViewer } from "@ionic-native/photo-viewer";
import React from "react";
import moment from "moment";

export default function MessageIn(props) {
  return props.item.type === 0 ? (
    <div
      className="viewWrapItemLeft ion-padding-bottom"
      key={props.item.timestamp + "l"}
    >
      {props.owner === props.item.idFrom &&
      !props.item.toTeam &&
      !props.item.toAdmin &&
      props.item.fromAdmin ? (
        <IonBadge color="danger">Admin</IonBadge>
      ) : (
        !props.item.forTeam && <IonBadge color="primary">{props.team}</IonBadge>
      )}
      {props.item.toAdmin && (
        <>
          <ArrowForwardIcon fontSize="small" />{" "}
          <IonBadge color="danger">Admin</IonBadge>
        </>
      )}

      {props.item.toTeam && !props.item.toAdmin && (
        <>
          {props.item.fromAdmin && <IonBadge color="danger">Admin</IonBadge>}
          <ArrowForwardIcon fontSize="small" />

          <IonBadge color="primary">{props.item.toTeam}</IonBadge>
        </>
      )}

      <div
        className={
          props.item.toAdmin || props.item.fromAdmin
            ? "viewItemLeft forAdmin"
            : "viewItemLeft"
        }
      >
        <span className="textContentItem">{props.item.content}</span>
      </div>
      <span className="textTimeLeft">
        {props.item.idFrom}{" "}
        {moment(Number(props.item.timestamp)).format("DD/MM hh:mm")}
      </span>
    </div>
  ) : (
    <div
      className="viewWrapItemLeft ion-padding-bottom"
      key={props.item.timestamp + "l"}
    >
      {props.owner === props.item.idFrom ? (
        <IonBadge color="danger">Admin</IonBadge>
      ) : (
        <IonBadge color="primary">{props.team}</IonBadge>
      )}
      <div className="viewItemLeft2">
        <IonImg
          className="imgItemLeft"
          src={props.item.content}
          alt="content message"
          onClick={() => PhotoViewer.show(props.item.content)}
        />
      </div>
      <span className="textTimeLeft">
        {props.item.idFrom}{" "}
        {moment(Number(props.item.timestamp)).format("DD/MM hh:mm")}
      </span>
    </div>
  );
}
