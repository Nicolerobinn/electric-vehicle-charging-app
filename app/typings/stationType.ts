
export interface StationInter {
  name:string
  number: number
  smpctNumber?:number
  password:string
  addressLineOne:string
  addressLineTwo:string
  city:string
  state:string
  connectorList:string[]
  serialNumber?:number
}
export interface BueTouchConnectionInter{
  title:string;
  id:string
  name?:string
  lock?:boolean
}
export enum STORAGE_STATION {
 RECENT_STATION_LIST = 'recentStationList',
 HOME_STATION__LIST = 'stationPasswordList',
 LOGIN_PERSISTENT = 'loginPersistent',
}