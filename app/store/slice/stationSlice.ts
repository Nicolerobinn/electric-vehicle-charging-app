import { createSlice, PayloadAction } from '@reduxjs/toolkit'; 
import type { StationInter} from '../../typings/stationType'
export interface StationState {
  homeStationList: StationInter[]; 
  favouriteStationList: StationInter[]; 
}
const initialState: StationState = {
  homeStationList: [],
  favouriteStationList: [],
};

export const stationSlice = createSlice({
  name: 'blue_touch',
  initialState,
  reducers: { 
    setHomeStation: (state: StationState, action: PayloadAction<StationInter[]>) => {
      state.homeStationList=  action.payload

    },
    setFavouriteStation: (state: StationState, action: PayloadAction<StationInter[]>) => {
      state.favouriteStationList=  action.payload
    },
  }
});

export const { 
  setHomeStation,
  setFavouriteStation
} = stationSlice.actions;

export default stationSlice.reducer;
