import {
  IonCheckbox,
  IonInput,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
} from "@ionic/react";
import React, { useEffect, useState } from "react";

import MiscService from "../../../services/MiscService";

const makeid = (length) => {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

function TextInput(props) {
  return (
    <>
      <IonItem>
        <IonLabel>Code:</IonLabel>
        <IonInput
          disabled={props.step.freeAnswer}
          value={props.step.code || null}
          onIonChange={(e) => {
            props.setStep({ ...props.step, code: e.target.value });
          }}
          maxlength="12"
        ></IonInput>
      </IonItem>
      <IonItem lines="none">
        <IonLabel>Admin validation</IonLabel>
        <IonCheckbox
          className="ion-no-padding"
          checked={props.step.freeAnswer || false}
          onIonChange={(x) =>
            props.setStep({
              ...props.step,
              freeAnswer: x.detail.checked,
              code: "",
            })
          }
        />
      </IonItem>
      <IonItem className="ion-no-padding">
        <p
          style={{ fontSize: "small", opacity: 0.5 }}
          className="ion-margin-start"
        >
          Allow any text response and needs to be validated by the admin and
          rated by admin
        </p>
      </IonItem>
    </>
  );
}
function QrInput(props) {
  const [qr, setQr] = useState();
  const [qrCode, setQrCode] = useState(makeid(6));
  const [color, setColor] = useState("");

  useEffect(() => {
    MiscService.getQr(qrCode, color).then((x) => {
      setQr(x.url);
    });
    props.setStep({ ...props.step, code: qrCode, color: color });
  }, [color]);

  return (
    <>
      <IonItem>
        <IonLabel>Color:</IonLabel>
        <IonSelect
          interface="popover"
          value={color}
          onIonChange={(e) => setColor(e.detail.value)}
        >
          <IonSelectOption defaultChecked value="">
            black
          </IonSelectOption>
          <IonSelectOption value="FF0000">red</IonSelectOption>
          <IonSelectOption value="0000ff">blue</IonSelectOption>
          <IonSelectOption value="0f0">green</IonSelectOption>
        </IonSelect>
      </IonItem>

      {qr && <img src={qr}></img>}

      <p>
        {qr && (
          <a href={qr.replace("size=200x200", "size=1000x1000")} download>
            Click to open on new page
          </a>
        )}
      </p>
    </>
  );
}
function ImageInput(props) {
  return (
    <>
      <IonItem>
        <IonLabel>Needs Validation?</IonLabel>
        <IonCheckbox
          onIonChange={(e) =>
            props.setStep({ ...props.step, needsValidation: e.detail.checked })
          }
          checked={props.step.needsValidation}
        ></IonCheckbox>
      </IonItem>
    </>
  );
}

export default function ChallengeInput(props) {
  const hanleRender = () => {
    switch (props.step.answerType) {
      case 0:
        return <TextInput {...props} />;
      case 1:
        return <QrInput {...props} />;
      case 2:
        return <ImageInput {...props} />;

      default:
        return <TextInput {...props} />;
        break;
    }
  };
  return hanleRender();
}
