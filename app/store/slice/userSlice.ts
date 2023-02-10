import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {setLoginPersistent} from '../../core/asyncStorage';
import jwt from 'jwt-decode';

interface MessageInter {
  command:string
  status:string
  message:string
  payload:{ statusList :any[], noService :boolean } 
}
export interface UserState {
  token: string;
  userData:any
  load:boolean
  message:MessageInter
  currentRoute:string
  qrCode:string
  permissionList:any[]
}
const initialState: UserState = {
  token: '',
  userData: {},
  load:true,
  message:{
    command:'',
    status:'',
    message:'',
    payload:{ statusList : [], noService :false } 
  },
  currentRoute:'',
  qrCode:'',
  permissionList:[]
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateToken: (state: UserState, action: PayloadAction<string>) => {
      const token = action.payload;
      let tokenDecodeDecode = {};
      if (token.length > 0) {
        // decode token
        setLoginPersistent(token);
        tokenDecodeDecode = jwt(token);
      }
      state.token = token;
      state.userData = tokenDecodeDecode;
    },
    setLoad: (state: UserState, action: PayloadAction<boolean>) => {
       state.load = action.payload;
    },
    saveMessage: (state: UserState, action: PayloadAction<MessageInter|undefined>) => {
      state.message = action.payload || {
        command:'',
        status:'',
        message:'',
        payload:{ statusList : [], noService :false } 
      };
    },
    setCurrentRoute: (state: UserState, action: PayloadAction<string>) => {
      state.currentRoute = action.payload;
    },
    setQRCode: (state: UserState, action: PayloadAction<string>) => {
      state.qrCode = action.payload;
    },
  }
});

export const {
  updateToken,
  setLoad,
  saveMessage,
  setCurrentRoute,
  setQRCode
} = userSlice.actions;

export default userSlice.reducer;
