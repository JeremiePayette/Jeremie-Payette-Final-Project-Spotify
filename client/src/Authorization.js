import {
  client_id,
  AUTHORIZE,
  redirect_uri,
  SCOPES,
  SCOPES_ULR_PARAM,
} from "./Variables";

export const handleAuthorization = () => {
  window.location = `${AUTHORIZE}?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${SCOPES_ULR_PARAM}&response_type=token&show_dialog=true`;
};

export const getReturnedParamsSpotify = (url) => {
  const removeHash = url.substring(1);
  const urlParams = removeHash.split("&");
  const splitParams = urlParams.reduce((acc, curr) => {
    const [key, value] = curr.split("=");
    acc[key] = value;
    return acc;
  }, {});
  return splitParams;
};
