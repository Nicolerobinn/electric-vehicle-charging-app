import {
  SAVE_TOKEN,
  SAVE_MESSAGE,
  SET_CONNECTED,
  SET_CURRENT_ROUTE,
  SET_WEBSCOKET_CLIENT,
  SET_QRCODE,
} from './types';
export const saveToken = (key) => ({
  type: SAVE_TOKEN,
  payload: key,
});
export const saveMessage = (value) => ({
  type: SAVE_MESSAGE,
  payload: value,
});
export const setConnected = (value) => ({
  type: SET_CONNECTED,
  payload: value,
});
export const setCurrentRoute = (value) => ({
  type: SET_CURRENT_ROUTE,
  payload: value,
});
export const setWebscoketClient = (value) => ({
  type: SET_WEBSCOKET_CLIENT,
  payload: value,
});
export const setQRCode = (str) => ({
  type: SET_QRCODE,
  payload: str,
});
// export const setRecentStation = (value) => ({
//   type: SET_RECENT_STATION,
//   payload: value
// });
