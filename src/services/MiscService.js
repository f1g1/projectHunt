import { Geolocation } from "@capacitor/core";

const MiscService = {
    getCachedGeolocation,
    getQr
}

function getQr(data) {
    const controller = new AbortController();
    // signal to pass to fetch
    const signal = controller.signal;

    // fetch as usual
    return fetch(`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${data}`, { signal }).then(response => {
        debugger; return response
    }).catch(e => {
        // catch the abort if you like
        if (e.name === 'AbortError') { }
    });

    controller.abort();
}

async function getCachedGeolocation() {
    let parsed;
    try {
        parsed = JSON.parse(window.localStorage["cachedCoords"])
    }
    catch{ }
    if (!parsed || !parsed.coords || Date.now() - parsed.timestamp > 3600000) {
        let coords = await Geolocation.getCurrentPosition();
        window.localStorage["cachedCoords"] = JSON.stringify({
            ...coords.coords
        });

        return coords.coords;
    }
    else { return parsed.coords }
}

export default MiscService