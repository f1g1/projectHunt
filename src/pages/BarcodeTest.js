import {
  IonButton,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React, { useState } from "react";

import { BarcodeScanner } from "@ionic-native/barcode-scanner";

const Tabb = () => {
  const [value, setvalue] = useState();
  const openScanner = async () => {
    // const data = await BarcodeScanner.scan(function (err, result) {

    //     //Handle Errors
    //     if (err) return;

    //     //Do something with the data.
    //     alert(result);

    // });
    // // console.log(`Barcode data: ${data.text}`);
    // setvalue(data);
    BarcodeScanner.scan()
      .then((barcodeData) => {
        setvalue(barcodeData.text);
        // success. barcodeData is the data returned by scanner
      })
      .catch((err) => {
        // error
      });
  };
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tab 1</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonButton shape="round" shape="round" onClick={openScanner}>
          Scan barcode
        </IonButton>
        {value}
      </IonContent>
    </IonPage>
  );
};
export default Tabb;
