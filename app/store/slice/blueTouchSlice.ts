import { createSlice, PayloadAction } from '@reduxjs/toolkit'; 

export interface BlueTouchState {
  peripheralsList: any[]; 
  connectedPeripheralsList: any[]; 
}
const initialState: BlueTouchState = {
  peripheralsList: [],
  connectedPeripheralsList: [],
};

export const blueTouchSlice = createSlice({
  name: 'blue_touch',
  initialState,
  reducers: { 
    setBlueTouchCollection: (state: BlueTouchState, action: PayloadAction<{
      connectedPeripherals:any[]
      peripherals:any[]
    }>) => {
      const { connectedPeripherals = [], peripherals = [] } = action.payload;
      state.connectedPeripheralsList= connectedPeripherals
      state.peripheralsList= peripherals
    },
  }
});

export const { 
  setBlueTouchCollection
} = blueTouchSlice.actions;

export default blueTouchSlice.reducer;
