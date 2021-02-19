import {SAVE_TOKEN, SAVE_MESSAGE, SET_CONNECTED} from './types';
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
// export const setRecentStation = (value) => ({
//   type: SET_RECENT_STATION,
//   payload: value
// });
