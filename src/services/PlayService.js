

export const PlayService = {
    setGame,
    getGame
}

function setGame(game) {
    window.localStorage["game"] = JSON.stringify(game)
}
function getGame() {
    return JSON.parse(window.localStorage["game"]);
}