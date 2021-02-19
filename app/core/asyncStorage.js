// handle all async storage related functions
import AsyncStorage from '@react-native-community/async-storage';

const _stationLookup = (stationList, serialNumber) => {
  return stationList.filter((station) => {
    // todo: after we settled this, we can cleanup
    return (
      station.serialNumber === serialNumber ||
      station.smpctNumber === serialNumber
    );
  });
};

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
  let recentStationList = await AsyncStorage.getItem();
  if (recentStationList) {
    recentStationList = JSON.parse(recentStationList);
    // if current serialNumber exist, then we ignore it
    if (_stationLookup(recentStationList, serialNumber)) {
      // do nothing
    } else {
      recentStationList.unshift(station);
      await AsyncStorage.setItem(
        'recentStationList',
        JSON.stringify(recentStationList),
      );
    }
  } else {
    await AsyncStorage.setItem('recentStationList', JSON.stringify([station]));
  }

  // try {
  //   let recentStationList = await AsyncStorage.getItem();
  //   if (recentStationList) {
  //     recentStationList = JSON.parse(recentStationList);
  //     // if current serialNumber exist, then we ignore it
  //     if (_stationLookup(recentStationList, serialNumber)){
  //       // do nothing
  //     }
  //     else{
  //       recentStationList.unshift(station);
  //       await AsyncStorage.setItem("recentStationList", JSON.stringify(recentStationList));
  //     }
  //   }
  //   else{
  //     await AsyncStorage.setItem("recentStationList", JSON.stringify([station]));
  //   }
  // } catch (e) {
  //   alert('Failed to save the data to the storage')
  // }
};
