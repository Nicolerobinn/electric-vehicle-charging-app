const WSSURL = 'wss://dev.evnrgy.com:7777';
// instance of websocket connection as a class property

let that = null;

export default class WebSocketClient {
  constructor({onOpen, onMessage, onClose}) {
    this.ws = null;
    that = this;
    this.onopenCalllBack = onOpen;
    this.onmessageCallBack = onMessage;
    this.oncloseCallBack = onClose;
  }

  /**
   * 获取WebSocket单例
   * @returns {WebSocketClient}
   */
  static getInstance() {
    if (!this.instance) {
      this.instance = new WebSocketClient();
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
      console.log('WebSocket err:', e);
      //重连
      this.reconnect();
    }
  }

  /**
   * 初始化WebSocket相关事件
   */
  initWsEvent() {
    //建立WebSocket连接
    this.ws.onopen = () => {
      console.log('123');
      this.onopenCalllBack && this.onopenCalllBack();
      console.log('WebSocket:', 'connect to server');
    };

    //客户端接收服务端数据时触发
    this.ws.onmessage = (evt) => {
      this.onmessageCallBack && this.onmessageCallBack(evt);
    };
    //连接错误
    this.ws.onerror = (err) => {
      console.log('WebSocket:', 'connect to server error');
      //重连
      that.reconnect();
    };
    //连接关闭
    this.ws.onclose = () => {
      this.oncloseCallBack && this.oncloseCallBack();
    };
  }

  //发送消息
  sendMessage(requestBody, connected) {
    // todo: add connect condition
    // on submitting the ChatInput form, send the message, add it to the list and reset the input
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
  reconnect() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(() => {
      //重新连接WebSocket
      this.initWebSocket();
    }, 15000);
  }
}
