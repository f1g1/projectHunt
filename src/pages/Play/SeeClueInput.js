import { IonButton, IonInput, IonItem, IonLabel } from "@ionic/react";
import React, { useEffect, useRef, useState } from "react";

import { BarcodeScanner } from "@ionic-native/barcode-scanner";
import MiscService from "../../services/MiscService";
import { PlayService } from "../../services/PlayService";

function TextInput(props) {
  const [input, setinput] = useState();

  const handleSubmit = () => {
    if (input) {
      if (
        !props.step.freeAnswer &&
        props.step.code.toString().toLowerCase() === input.toLowerCase()
      ) {
        PlayService.submitAnswer(
          input,
          props.step,
          props.team,
          props.finished || false
        )
          .then(() => {
            props.handleSucces();
            MiscService.getCachedGeolocation().then((x) =>
              PlayService.shareLocation(x, props.team)
            );
          })
          .catch((x) => console.log(x));
      } else {
        if (props.step.freeAnswer) {
          PlayService.submitFreeAnswer(
            input,
            props.step,
            props.team,
            props.finished || false
          )
            .then(() => {
              props.handleSucces();
              MiscService.getCachedGeolocation().then((x) =>
                PlayService.shareLocation(x, props.team)
              );
            })
            .catch((x) => console.log(x));
        } else {
          if (!props.step.onlyOnce) props.handleWrong();
          else {
            PlayService.submitOnlyAnswerWrong(
              input,
              props.step,
              props.team,
              props.finished || false
            )
              .then(() => {
                props.handleWrong();
                MiscService.getCachedGeolocation().then((x) =>
                  PlayService.shareLocation(x, props.team)
                );
              })
              .catch((x) => console.log(x));
          }
        }
      }
    }
  };
  return (
    <>
      <IonItem className="ion-margin-bottom">
        <IonLabel>Answer:</IonLabel>
        <IonInput
          value={input}
          onIonChange={(e) => {
            setinput(e.target.value);
          }}
          maxlength="500"
        ></IonInput>
      </IonItem>
      {props.children}
      <IonButton
        className="ion-margin-top"
        expand="full"
        onClick={handleSubmit}
      >
        Submit
      </IonButton>
    </>
  );
}
function QrInput(props) {
  console.log("render qrinptu");
  const [input, setInput] = useState();
  const openScanner = async () => {
    BarcodeScanner.scan()
      .then((barcodeData) => {
        setInput(barcodeData.text);
      })
      .catch((err) => {
        console.log("Qr scan failed");
      });
  };
  useEffect(() => {
    if (input) {
      if (props.step.code.toString() === input) {
        PlayService.submitAnswer(
          input,
          props.step,
          props.team,
          props.finished || false
        )
          .then(() => {
            props.handleClose();
          })
          .catch((x) => console.log(x));
        MiscService.getCachedGeolocation().then((x) =>
          PlayService.shareLocation(x, props.team)
        );
        props.handleSucces();
      } else {
        props.handleWrong();
      }
    }
  }, [input]);
  return (
    <>
      {input}
      {props.children}

      <IonButton
        size="largest"
        color="tertiary"
        expand="full"
        onClick={openScanner}
        style={{ minHieght: "50px" }}
      >
        Scan!
      </IonButton>
    </>
  );
}
function ImageInput(props) {
  const refInput = useRef();
  const [loadingImage, setLoadingImage] = useState(false);
  const [image, setImage] = useState();
  const [imageFile, setImageFile] = useState();
  const onChoosePhoto = (event) => {
    if (event.target.files && event.target.files[0]) {
      setLoadingImage(true);
      const prefixFiletype = event.target.files[0].type.toString();
      if (prefixFiletype.indexOf("image/") === 0) {
        setImage(URL.createObjectURL(event.target.files[0]));
        setImageFile(event.target.files[0]);
      } else {
        setLoadingImage(false);
        console.log("This file is not an image");
      }
    } else {
      setLoadingImage(false);
    }
  };
  const handleSend = () => {
    PlayService.submitAnswerImage(
      imageFile,
      props.step,
      props.team,
      props.finished || false
    );
    MiscService.getCachedGeolocation().then((x) =>
      PlayService.shareLocation(x, props.team)
    );
  };
  return (
    <>
      <div style={{ width: "100%", justifyContent: "center", display: "flex" }}>
        <IonButton
          onClick={() => refInput.current.click()}
          className="ionic-padding-vertical"
        >
          {!image ? "Add Image!" : "Change Image!"}
        </IonButton>
        <input
          ref={refInput}
          accept="image/*"
          className="viewInputGallery"
          type="file"
          onChange={onChoosePhoto}
        />
      </div>

      {props.children}

      {image && (
        <>
          <div
            style={{ width: "100%", justifyContent: "center", display: "flex" }}
          >
            <img src={image} style={{ maxHeight: "350px" }} />
          </div>
          <IonButton expand="full" onClick={handleSend}>
            Send!
          </IonButton>{" "}
        </>
      )}
    </>
  );
}

export default function SeeClueInput(props) {
  const hanleRender = () => {
    switch (props.answerType) {
      case 0:
        return <TextInput {...props} />;
      case 1:
        return <QrInput {...props} />;
      case 2:
        return <ImageInput {...props} />;
      default:
        return <TextInput {...props} />;
    }
  };
  return hanleRender();
}
