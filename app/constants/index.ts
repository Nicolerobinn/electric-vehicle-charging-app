export const MESSAGE_CHANGE = 'MESSAGE_CHANGE';
// 状态常量
export const START = 'Start Charging';
export const STOP = 'Stop Charging';
export const WAITING = 'Waiting';
export const CONNECTOR_LIST:{
  [key:string]:{
    url:any
    type: 'AC'| 'DC'
  }
} = {
  IEC_62196_TYPE_1: {
    url: require('../assets/IEC_62196_TYPE_1.png'),
    type: 'AC',
  },
  IEC_62196_TYPE_2: {
    url: require('../assets/IEC_62196_TYPE_2.png'),
    type: 'AC',
  },
  IEC_62196_CCS_TYPE_1: {
    url: require('../assets/IEC_62196_CCS_TYPE_1.png'),
    type: 'DC',
  },
  IEC_62196_CCS_TYPE_2: {
    url: require('../assets/IEC_62196_CCS_TYPE_2.png'),
    type: 'DC',
  },
  IEC_62196_AA: {
    url: require('../assets/IEC_62196_AA.png'),
    type: 'DC',
  },
};
