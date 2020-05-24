import { IonBadge, IonImg } from "@ionic/react";

import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import { PhotoViewer } from "@ionic-native/photo-viewer";
import React from "react";
import moment from "moment";

export default function MessageOut(props) {
  return props.item.type === 0 ? (
    <>
      <div
        className="viewWrapItemRight ion-padding-bottom"
        key={props.item.timestamp + "l"}
      >
        {props.item.toAdmin && (
          <>
            <ArrowForwardIcon fontSize="small" />{" "}
            <IonBadge color="danger">Admin</IonBadge>
          </>
        )}
        {props.item.toTeam && !props.item.toAdmin && (
          <>
            {/* {props.item.fromAdmin && <IonBadge color="danger">Admin</IonBadge>} */}
            <ArrowForwardIcon fontSize="small" />
            <IonBadge color="primary">{props.item.toTeam}</IonBadge>
          </>
        )}

        <div className={"viewItemRight"}>
          <span className="textContentItem">{props.item.content}</span>
        </div>

        <span className="textTimeRight" key={props.item.timestamp + "s"}>
          {moment(Number(props.item.timestamp)).format("DD/MM hh:mm")}
        </span>
      </div>
    </>
  ) : (
    <>
      <div className="viewItemRight2" key={props.item.timestamp + "r1"}>
        <IonImg
          className="imgItemRight"
          src={props.item.content}
          alt="content message"
          onClick={() => PhotoViewer.show(props.item.content)}
        />
      </div>
      <span className="textTimeRight" key={props.item.timestamp + "s1"}>
        {moment(Number(props.item.timestamp)).format("DD/MM hh:mm")}
      </span>{" "}
    </>
  );
}
