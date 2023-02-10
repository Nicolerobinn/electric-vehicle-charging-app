// handle all async storage related functions
import AsyncStorage from '@react-native-community/async-storage';
import { type StationInter , STORAGE_STATION } from '../typings/stationType'
 
const _stationLookup = (stationList:StationInter[], serialNumber?:number):boolean => {
  return stationList.some((station) => station.smpctNumber === serialNumber);
};

export const setLoginPersistent = (token?:string) => {
  AsyncStorage.setItem(STORAGE_STATION.LOGIN_PERSISTENT, token || '');
};
export const checkLoginPersistent = async () => {
  const account = await AsyncStorage.getItem(STORAGE_STATION.LOGIN_PERSISTENT);
  return account;
};
export const loginOut = async () => {
  AsyncStorage.removeItem(STORAGE_STATION.LOGIN_PERSISTENT);
};

export const readRecentStationListFromAsyncStorage = async ( ) => {
  const list = await AsyncStorage.getItem(STORAGE_STATION.RECENT_STATION_LIST);
  return list ? JSON.parse(list) : [];
};
/**
 * Store current station to asyncStorage
 *
 * @param {String} serialNumber -Current station serialNumber
 * @param {Object} station - station object
 *
 */
export const writeRecentStationToAsyncStorage = async (
  station:StationInter,
  serialNumber?:number,
) => {
  let recentStationList = await AsyncStorage.getItem(STORAGE_STATION.RECENT_STATION_LIST);
  if (recentStationList) {
   const  list = JSON.parse(recentStationList) as StationInter[];
    // if current serialNumber exist, then we ignore it
    if (!_stationLookup(list, serialNumber)) {
      list.unshift(station);
      await AsyncStorage.setItem(
        STORAGE_STATION.RECENT_STATION_LIST,
        JSON.stringify(list),
      );
    }
  } else {
    await AsyncStorage.setItem(STORAGE_STATION.RECENT_STATION_LIST, JSON.stringify([station]));
  }
};

// 关于station 储存本地密码的函数

export const homeStationPasswordCompare = async (station:StationInter) => {
  const stationPassword = await AsyncStorage.getItem(STORAGE_STATION.HOME_STATION__LIST);
  if (stationPassword) {
   const list = JSON.parse(stationPassword);
    const stationFilter = list.filter((e:StationInter) => e.number === station.number);
    return stationFilter.password === station.password;
  }
  return 'error'
};

export const removeHomeStation = async (station:StationInter) => {
  const stationList = await AsyncStorage.getItem(STORAGE_STATION.HOME_STATION__LIST);
  if (stationList) {
    const list = JSON.parse(stationList);
    AsyncStorage.setItem(STORAGE_STATION.HOME_STATION__LIST, JSON.stringify(list.filter((s:StationInter) => s.number !== station.number)));
  }
  return 'error'
};

export const setHomeStation = async (station:StationInter, password:string) => {
  const stationList = await AsyncStorage.getItem(STORAGE_STATION.HOME_STATION__LIST);
  const obj = { number: station.number, password: password };
  if (stationList) {
    const list = JSON.parse(stationList) as StationInter[]
    const listFilter = list.filter((e:StationInter) => e.number !== obj.number);
    listFilter.unshift(obj);
    AsyncStorage.setItem(STORAGE_STATION.HOME_STATION__LIST, JSON.stringify(list));
  } else {
    AsyncStorage.setItem(STORAGE_STATION.HOME_STATION__LIST, JSON.stringify([obj]));
  }
};
