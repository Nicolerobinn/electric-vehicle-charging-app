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
