// handle all async storage related functions
import AsyncStorage from '@react-native-community/async-storage';

const _stationLookup = (stationList, serialNumber) => {
  return stationList.some((station) => station.smpctNumber === serialNumber);
};

const RECENT_STATION_LIST = 'recentStationList';
const HOME_STATION__LIST = 'stationPasswordList';
/**
 * Store current station to asyncStorage
 *
 * @param {String} serialNumber -Current station serialNumber
 * @param {Object} station - station object
 *
 */
export const writeRecentStationToAsyncStorage = async (
  station,
  serialNumber,
) => {
  console.log(station, serialNumber);
  let recentStationList = await AsyncStorage.getItem(RECENT_STATION_LIST);
  if (recentStationList) {
    recentStationList = JSON.parse(recentStationList);
    // if current serialNumber exist, then we ignore it
    if (!_stationLookup(recentStationList, serialNumber)) {
      recentStationList.unshift(station);
      await AsyncStorage.setItem(
        RECENT_STATION_LIST,
        JSON.stringify(recentStationList),
      );
    }
  } else {
    await AsyncStorage.setItem(RECENT_STATION_LIST, JSON.stringify([station]));
  }
};

// 关于station 储存本地密码的函数

export const homeStationPasswordCompare = async (station, callBack) => {
  let list = await AsyncStorage.getItem(HOME_STATION__LIST);
  if (list) {
    list = JSON.parse(list);
    const stationObj = list.filter((e, i) => e.number === station.number);
    return stationObj.password === station.password;
  }
  // 用于处理不存在情况下的的回调，一般不可能用到
  callBack && callBack();
};

export const removeHomeStation = async (station, callBack) => {
  let list = await AsyncStorage.getItem(HOME_STATION__LIST);
  if (list) {
    list = JSON.parse(list);
    list = list.filter((e) => e.number !== station.number);
    AsyncStorage.setItem(HOME_STATION__LIST, JSON.stringify(list));
  }
  callBack && callBack();
};

export const setHomeStation = async (station, password, callBack) => {
  let list = await AsyncStorage.getItem(HOME_STATION__LIST);
  const obj = {number: station.number, password: password};
  if (list) {
    list = JSON.parse(list);
    list = list.filter((e) => e.number !== obj.number);
    list.unshift(obj);
    AsyncStorage.setItem(HOME_STATION__LIST, JSON.stringify(list));
  } else {
    AsyncStorage.setItem(HOME_STATION__LIST, JSON.stringify([obj]));
  }
  callBack && callBack();
};
