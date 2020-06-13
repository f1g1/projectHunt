import { Geolocation } from "@capacitor/core";
import { fireStore } from "../firebase";

const MiscService = {
  getCachedGeolocation,
  getQr,
  getLiveGeolocation,
  getNotificationSettings,
  setNotificationSettings,
  setChatNr,
  getChatNr,
  setAvalaibleLocation,
  getAvalaibleLocation,
  sendBugReport,
};

function sendBugReport(value) {
  return fireStore.collection("bugReport").add(value);
}

function setAvalaibleLocation(value) {
  window.localStorage["avalaibleLocation"] = value;
}
function getAvalaibleLocation() {
  console.log(window.localStorage["avalaibleLocation"]);

  return window.localStorage["avalaibleLocation"];
}

function getChatNr() {
  return window.localStorage["chatNo"] || 0;
}
function setChatNr(nr) {
  window.localStorage["chatNo"] = nr;
}

function getQr(data, color) {
  const controller = new AbortController();
  // signal to pass to fetch
  const signal = controller.signal;

  // fetch as usual
  return fetch(
    `https://api.qrserver.com/v1/create-qr-code/?size=200x200&color=${color}&data=${data} `,
    { signal }
  )
    .then((response) => {
      return response;
    })
    .catch((e) => {
      if (e.name === "AbortError") {
      }
    });

  controller.abort();
}

function getNotificationSettings() {
  try {
    return JSON.parse(window.localStorage["notificationSettings"]);
  } catch {
    let n = {
      message: true,
      adminMessage: true,
      map: true,
      newChallenge: true,
    };
    window.localStorage["notificationSettings"] = JSON.stringify(n);
    return n;
  }
}
function setNotificationSettings(notificationSettings) {
  window.localStorage["notificationSettings"] = JSON.stringify(
    notificationSettings
  );
}
async function getCachedGeolocation() {
  setAvalaibleLocation(true);
  let coords = await Geolocation.getCurrentPosition();
  return coords.coords;
}

function getLiveGeolocation(setLocation) {
  Geolocation.watchPosition().subscribe((position) => {
    console.log(position.coords.longitude + " " + position.coords.latitude);
    setLocation(position);
  });
}

export default MiscService;
