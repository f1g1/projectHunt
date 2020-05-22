import { Geolocation } from "@capacitor/core";

const MiscService = {
  getCachedGeolocation,
  getQr,
  getLiveGeolocation,
};

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

async function getCachedGeolocation() {
  // let parsed;
  // try {
  //   parsed = JSON.parse(window.localStorage["cachedCoords"]);
  // } catch {}
  // if (!parsed || !parsed.coords || Date.now() - parsed.timestamp > 3600000) {
  let coords = await Geolocation.getCurrentPosition();
  //   window.localStorage["cachedCoords"] = JSON.stringify({
  //     ...coords.coords,
  //   });

  return coords.coords;
  // } else {
  //   return parsed.coords;
  // }
}

function getLiveGeolocation(setLocation) {
  Geolocation.watchPosition().subscribe((position) => {
    console.log(position.coords.longitude + " " + position.coords.latitude);
    setLocation(position);
  });
}

export default MiscService;
