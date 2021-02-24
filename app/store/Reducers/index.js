import {
  SAVE_TOKEN,
  SAVE_MESSAGE,
  SET_CONNECTED,
  SET_CURRENT_ROUTE,
  SET_WEBSCOKET_CLIENT,
  SET_QRCODE,
} from '../Actions/types';
import jwt from 'jwt-decode';
const initialState = {
  connected: false,
  token: '',
  userData: {},
  message: {},
  currentRoute: '',
  webscoketClient: {},
  qrCode: '',
};

const Reducer = (state = initialState, action) => {
  switch (action.type) {
    case SAVE_TOKEN:
      const token = action.payload;
      let tokenDecodeDecode = {};
      if (token.length > 0) {
        // decode token
        tokenDecodeDecode = jwt(token);
      }
      console.log('tokenDecodeDecode', tokenDecodeDecode);
      return {
        ...state,
        token: token,
        userData: tokenDecodeDecode,
      };
    case SET_CONNECTED:
      return {
        ...state,
        connected: action.payload,
      };
    case SAVE_MESSAGE:
      return {
        ...state,
        message: action.payload,
      };
    case SET_CURRENT_ROUTE:
      return {
        ...state,
        currentRoute: action.payload,
      };
    case SET_WEBSCOKET_CLIENT:
      return {
        ...state,
        webscoketClient: action.payload,
      };
    case SET_QRCODE:
      return {
        ...state,
        qrCode: action.payload,
      };

    default:
      return state;
  }
};
export default Reducer;
