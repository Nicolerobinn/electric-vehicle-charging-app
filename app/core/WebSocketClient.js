import * as Actions from '../store/Actions';
const WSSURL = 'wss://dev.evnrgy.com:7777';
// instance of websocket connection as a class property

let that = null;

// callback function
const onClose = (dispatch) => {
  console.log('disconnected');
  // clear all redux data
  dispatch(Actions.setConnected(false));
  dispatch(Actions.saveMessage({}));
  dispatch(Actions.saveToken(''));
  // automatically try to reconnect on connection loss
};
const onMessage = (evt, dispatch) => {
  // listen to data sent from the webscoket server
  // TODO: 修改接收模式，改为派发，优先级低
  const message = JSON.parse(evt.data);
  dispatch(Actions.saveMessage(message));
  console.log('message', message);
  if (message?.status === 'SUCCESS' && message?.token) {
    dispatch(Actions.saveToken(message.token));
  }
};
const onOpen = (dispatch) => {
  console.log('ws 连接成功');
  dispatch(Actions.setConnected(true));
};

// singleton pattern class
export default class WebSocketClient {
  constructor(dispatch) {
    this.ws = null;
    that = this;
    this.dispatch = dispatch;
  }

  /**
   * 获取WebSocket单例
   * @returns {WebSocketClient}
   */
  static getInstance(dispatch) {
    if (!this.instance) {
      console.log('初始化webscoket 单例');
      if (!dispatch) {
        console.log('未注入派发器,请检查代码');
      }
      this.instance = new WebSocketClient(dispatch);
      // 添加初始化节流，防止提前调用方法导致error
      this.instance.isInit = true;
    }
    return this.instance;
  }
  /**
   * 初始化WebSocket
   */
  initWebSocket() {
    try {
      this.ws = new WebSocket(WSSURL);
      this.initWsEvent();
    } catch (e) {
      //重连
      this.reconnect(e);
    }
  }

  /**
   * 初始化WebSocket相关事件
   */
  initWsEvent() {
    //建立WebSocket连接
    this.ws.onopen = () => {
      // open后关闭节流
      this.isInit = false;
      onOpen(this.dispatch, this);
    };

    //客户端接收服务端数据时触发
    this.ws.onmessage = (evt) => {
      onMessage(evt, this.dispatch);
    };
    //连接错误
    this.ws.onerror = (e) => {
      console.log('WebSocket:', 'connect to server error');
      //重连
      that.reconnect(e);
    };
    //连接关闭
    this.ws.onclose = () => {
      onClose(this.dispatch);
    };
  }

  close() {
    this.ws.onclose();
  }
  //发送消息
  sendMessage(requestBody, connected) {
    // 根据节流判断是否允许send
    if (this.isInit) {
      console.log('ws 初始化中');
      return;
    }
    if (!connected) {
      try {
        this.ws.onopen(); //send data to the server
      } catch (error) {
        console.log(error); // catch error
        return {status: 'fail'};
      } finally {
        this.ws.send(JSON.stringify(requestBody)); //send data to the server
      }
    } else {
      this.ws.send(JSON.stringify(requestBody));
    }

    return {status: 'success'};
  }

  //重连
  reconnect(e) {
    this.onerrorCallBack && this.onerrorCallBack(e);
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(() => {
      //重新连接WebSocket
      this.initWebSocket();
    }, 15000);
  }
}
