import AsyncStorage from '@react-native-community/async-storage';

export const emailValidator = (email) => {
  const re = /\S+@\S+\.\S+/;

  if (!email || email.length <= 0) {
    return 'Email cannot be empty.';
  }
  if (!re.test(email)) {
    return 'Ooops! We need a valid email address.';
  }
  return '';
};

export const passwordValidator = (password) => {
  if (!password || password.length <= 0) {
    return 'Password cannot be empty.';
  }
  return '';
};

export const confirmPasswordValidator = (password) => {
  if (!password || password.length <= 0) {
    return 'Comfirm password cannot be empty.';
  }
  return '';
};

export const passwordMatch = (password1, password2) => {
  if (!password1 && !password2 && password1 !== password2) {
    return "Two Passwords don't match, please check again.";
  }
  return '';
};

/**
 * Use this function to call websocket.
 *
 * @param {Object} websocket - websocket object
 * @param {Object} requestBody - An object of the request body, need to run JSON.stringify() before submit the call
 * @param {boolean} connected - websocket is connected or not, default connected
 * @return {Object} response - true/false
 *
 */
export const websocketCall = (websocket, requestBody, connected = true) => {
  // todo: add connect condition
  // on submitting the ChatInput form, send the message, add it to the list and reset the input
  if (!connected) {
    try {
      websocket.onopen(); //send data to the server
    } catch (error) {
      console.log(error); // catch error
      return {status: 'fail'};
    } finally {
      websocket.send(JSON.stringify(requestBody)); //send data to the server
    }
  } else {
    websocket.send(JSON.stringify(requestBody));
  }

  return {status: 'success'};
};

/**
 * Station AC/DC type checker.
 * Rule: Check string contains "_CCS" or "_AA" then they are DC type, otherwise are AC type
 * todo: need to confirm this function
 *
 * @param {Object} connectorList - list of connecter
 * @return {String} type - AC/DC
 *
 */
export const connecterTypeChecker = (connectorList) => {
  const type = new Set();
  connectorList.forEach((connector) => {
    if (connector.includes('_CCS') || connector.includes('_AA')) {
      type.add('DC');
    } else {
      type.add('AC');
    }
  });

  return Array.from(type).join(' ');
};

// Async storage read/write function
// todo: js doc
const _storeDataToAsyncStorage = async (key, strValue) => {
  try {
    await AsyncStorage.setItem(key, strValue);
  } catch (error) {
    // Error saving data
  }
};

// todo: js doc
const _retrieveDataFromAsyncStorage = async (key) => {
  try {
    return await AsyncStorage.getItem(key);
  } catch (error) {
    alert('Failed to save the data to the storage');
  }
};

// For example:
// recentStations = {
//   {station object}
// }

export const saveToRecentStation = (stationSerialNumber) => {
  // const recentStationList =
};
export const getRecentStations = async (key) => {
  // const result = _retrieveDataFromAsyncStorage('recentStations');
  // console.log('result', result);
  // return result;

  try {
    return (await AsyncStorage.getItem(key)) || [];
  } catch (error) {
    alert('Failed to save the data to the storage');
  }
};
