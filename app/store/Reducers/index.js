import { SAVE_TOKEN, SAVE_MESSAGE, SET_CONNECTED  } from '../Actions/types';
import jwt from 'jwt-decode'


const initialState = {
  connected: false,
  token: '',
  userData: '',
  message: {}

};
const Reducer = (state = initialState, action) => {
  switch (action.type) {
    case SAVE_TOKEN:
      const token = action.payload;
      // TODO: fake token since DB error
  // const token = "eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJkZXYuZXZucmd5LmNvbSIsImlhdCI6MTYxMjczNDAwOSwiZXhwIjoxNjQ0MjcwMDA5LCJzdWIiOiI4IiwiZmF2b3VyaXRlU3RhdGlvbkxpc3QiOltdLCJob21lU3RhdGlvbkxpc3QiOltdLCJwZXJtaXNzaW9uTGlzdCI6WyJEUklWRVJfREFTSEJPQVJEIiwiUkVDRU5UTFlfVklTSVRFRCIsIlVTRVJfVVNBR0VfUkVQT1JUIiwiTU9ESUZZX0ZBVk9VUklURVMiLCJNT0RJRllfSE9NRSJdfQ.Raszq2keXNQB2dBWbVulQ9jV573dHYIUizVgm5JqHMBjP9W1Qeo_whBGuwKc1EZ55TwB_HWZrH9g9QCe0PEGRQ"
      let tokenDecodeDecode = {};
      if (token.length > 0) {
        // decode token
        tokenDecodeDecode = jwt(token);
      }
      return {
        ...state,
        token: token,
        userData: tokenDecodeDecode
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
    default:
      return state;
  }
};
export default Reducer;
