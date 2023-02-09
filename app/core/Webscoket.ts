function WsClient(serviceUrl) {
  // eventName => Set(handlers)
  let registry = {};
  let pending_calls = {};
  let connected = false;
  let timestamp = Date.now();

  let ws = new WebSocket(serviceUrl);
  ws.onmessage = function (event) {
    console.debug(`Received msg: ${event.data}`);
    // WebSocket passing event as ...
    let msg = JSON.parse(event.data);
    // msg now contains __seq__, name and payload
    if (!msg.name) {
      console.error(`Malformed msg ${msg}`);
    }

    // handle RPC call first. RPC call is one sent by us, and wait for response.
    if (msg.__seq__ && pending_calls[msg.__seq__]) {
      // line 1
      let resolve = pending_calls[msg.__seq__].resolve;
      delete pending_calls[msg.__seq__];
      return resolve(msg);
    }
    //  call each handler
    let handlers = registry[msg.name];

    if (handlers) {
      handlers.forEach(function (func) {
        func(msg);
      });
    }
  };

  ws.onopen = function (event) {
    console.info('connected with server');
    let handlers = registry.Open;
    connected = true;

    if (handlers) {
      handlers.forEach(function (handler) {
        handler(event);
      });
    }
  };

  ws.onclose = function (event) {
    console.info('disconnected with server');
    let handlers = registry.Close;
    connected = false;

    if (handlers) {
      handlers.forEach(function (handler) {
        handler(event);
      });
    }
  };

  function on(event, handler) {
    /**
     * handler is callable(msg)
     * @type {*|Set<any>}
     */
    let handlers = registry[event] || new Set();
    handlers.add(handler);
    registry[event] = handlers;
  }

  function removeHandler(event, handler) {
    let handlers = registry[event];

    if (!handlers) {
      return;
    }

    handlers.delete(handler);
    registry[event] = handlers;
  }

  function send(msg) {
    ws.send(JSON.stringify(msg));
  }

  async function call(msg) {
    let __seq__ = guid();
    msg.__seq__ = __seq__;
    // line 2
    let promise = new Promise(function (resolve, reject) {
      pending_calls[__seq__] = {
        resolve: resolve,
        reject: reject,
      };
      setTimeout(function () {
        delete pending_calls[__seq__];
        reject(`${msg.name}:${__seq__} failed due to timeout`);
      }, 20 * 1000);
    });

    ws.send(JSON.stringify(msg));
    return promise;
  }

  return {
    on: on,
    removeHandler: removeHandler,
    send: send /*send(msg)*/,
    call: call /*async call(msg)*/,
    isConnected: function () {
      return connected;
    },
  };
}
