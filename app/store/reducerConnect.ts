import { combineReducers } from 'redux';
import userSlice from './slice/userSlice';
import blueTouchSlice from './slice/blueTouchSlice';
import stationSlice from './slice/stationSlice';
const combinedReducer = combineReducers({
  user: userSlice,
  blueTouch:blueTouchSlice,
  station:stationSlice
});

export default combinedReducer;
