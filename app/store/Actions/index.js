import {
  SAVE_TOKEN,
  SAVE_MESSAGE,
  SET_CURRENT_ROUTE,
  SET_QRCODE,
  SET_LOAD,
  SET_BLUE_COLL,
} from './types';
export const saveToken = (key) => ({
  type: SAVE_TOKEN,
  payload: key,
});
export const saveMessage = (value) => ({
  type: SAVE_MESSAGE,
  payload: value,
});
export const setCurrentRoute = (value) => ({
  type: SET_CURRENT_ROUTE,
  payload: value,
});
export const setQRCode = (str) => ({
  type: SET_QRCODE,
  payload: str,
});
export const setLoad = (boole) => ({
  type: SET_LOAD,
  payload: boole,
});
export const setBlueTouchCollection = (obj) => ({
  type: SET_BLUE_COLL,
  payload: obj,
});
