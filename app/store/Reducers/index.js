import {
  SAVE_TOKEN,
  SAVE_MESSAGE,
  SET_CURRENT_ROUTE,
  SET_QRCODE,
  SET_LOAD,
  SET_BLUE_COLL,
} from '../Actions/types';
import {setLoginPersistent} from '../../core/asyncStorage';
import jwt from 'jwt-decode';
const initialState = {
  token: '',
  userData: {},
  message: {},
  currentRoute: '',
  qrCode: '',
  isLoading: true,
  peripheralsList: [],
  connectedPeripheralsList: [],
};

const Reducer = (state = initialState, action) => {
  switch (action.type) {
    case SAVE_TOKEN:
      const token = action.payload;
      let tokenDecodeDecode = {};
      if (token.length > 0) {
        // decode token
        setLoginPersistent(token);
        tokenDecodeDecode = jwt(token);
      }
      return {
        ...state,
        token: token,
        userData: tokenDecodeDecode,
      };
    case SET_LOAD:
      return {
        ...state,
        isLoading: action.isLoading,
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
    case SET_QRCODE:
      return {
        ...state,
        qrCode: action.payload,
      };
    case SET_BLUE_COLL:
      const {connectedPeripherals = [], peripherals = []} = action.payload;
      return {
        ...state,
        connectedPeripheralsList: connectedPeripherals,
        peripheralsList: peripherals,
      };
    default:
      return state;
  }
};
export default Reducer;
