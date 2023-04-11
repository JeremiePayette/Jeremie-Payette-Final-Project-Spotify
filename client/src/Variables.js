export const getRandomInt = (max) => {
    return Math.floor(Math.random() * Math.floor(max));
};
    export const client_id = '26cb17a61ca04ea3834781989e95cdee';
    export const client_secret = 'f96fc01ae9554be184837fb0c522c05f';
    export const redirect_uri = "http://localhost:3000/"; 
    export const TRACKS_RANDOM = `https://api.spotify.com/v1/tracks?limit=30&offset=${getRandomInt(1000)}`;
    export const AUTHORIZE = "https://accounts.spotify.com/authorize"
    export const TOKEN = "https://accounts.spotify.com/api/token";
    export const PLAYLISTS = "https://api.spotify.com/v1/me/playlists";
    export const DEVICES = "https://api.spotify.com/v1/me/player/devices";
    export const PLAY = "https://api.spotify.com/v1/me/player/play";
    export const PAUSE = "https://api.spotify.com/v1/me/player/pause";
    export const NEXT = "https://api.spotify.com/v1/me/player/next";
    export const PREVIOUS = "https://api.spotify.com/v1/me/player/previous";
    export const PLAYER = "https://api.spotify.com/v1/me/player";
    export const TRACKS = "https://api.spotify.com/v1/playlists/{{PlaylistId}}/tracks";
    export const CURRENTLYPLAYING = "https://api.spotify.com/v1/me/player/currently-playing";
    export const SHUFFLE = "https://api.spotify.com/v1/me/player/shuffle";
    export const SCOPES = [
        "user-read-currently-playing",
        "user-read-playback-state",
        "user-modify-playback-state",
        "playlist-modify-private",
        "playlist-modify-public",
        "user-library-read",
        "user-top-read",
    ];
    export const SPACE = "%20";
    export const SCOPES_ULR_PARAM = SCOPES.join(SPACE);