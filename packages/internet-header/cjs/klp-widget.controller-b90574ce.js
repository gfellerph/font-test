'use strict';

const _commonjsHelpers = require('./_commonjsHelpers-537d719a.js');

/**
 * ATTENTION:
 * This is a de-umdified build of the sockjs-client https://github.com/sockjs/sockjs-client
 *
 * To reproduce this build, follow the steps:
 * 1. Clone the sockjs-client repo
 * 2. npm i -D deumdify
 * 3. Edit ./gulpfile.js on line 40 (the 'browserify' gulp task)
 *    browserify(browserifyOptions).plugin(require('deumdify')).bundle(),
 *
 *    This pipes the deumdify plugin to the browserify build process
 * 4. npm run gulp release (this will create ./build and ./dist)
 * 5. Copy & paste ./build/sockjs.js down below
 * 6. Bask in the glory of this marvellous hack
 */

/* sockjs-client v1.6.1 | http://sockjs.org | MIT license */
(function(f){var g;if(typeof window!=='undefined'){g=window;}else if(typeof self!=='undefined'){g=self;}g.SockJS=f();})(function(){return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t);}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
  (function (global){(function (){

  var transportList = require('./transport-list');

  module.exports = require('./main')(transportList);

  // TODO can't get rid of this until all servers do
  if ('_sockjs_onload' in global) {
    setTimeout(global._sockjs_onload, 1);
  }

  }).call(this);}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});

  },{"./main":14,"./transport-list":16}],2:[function(require,module,exports){

  var inherits = require('inherits')
    , Event = require('./event')
    ;

  function CloseEvent() {
    Event.call(this);
    this.initEvent('close', false, false);
    this.wasClean = false;
    this.code = 0;
    this.reason = '';
  }

  inherits(CloseEvent, Event);

  module.exports = CloseEvent;

  },{"./event":4,"inherits":57}],3:[function(require,module,exports){

  var inherits = require('inherits')
    , EventTarget = require('./eventtarget')
    ;

  function EventEmitter() {
    EventTarget.call(this);
  }

  inherits(EventEmitter, EventTarget);

  EventEmitter.prototype.removeAllListeners = function(type) {
    if (type) {
      delete this._listeners[type];
    } else {
      this._listeners = {};
    }
  };

  EventEmitter.prototype.once = function(type, listener) {
    var self = this
      , fired = false;

    function g() {
      self.removeListener(type, g);

      if (!fired) {
        fired = true;
        listener.apply(this, arguments);
      }
    }

    this.on(type, g);
  };

  EventEmitter.prototype.emit = function() {
    var type = arguments[0];
    var listeners = this._listeners[type];
    if (!listeners) {
      return;
    }
    // equivalent of Array.prototype.slice.call(arguments, 1);
    var l = arguments.length;
    var args = new Array(l - 1);
    for (var ai = 1; ai < l; ai++) {
      args[ai - 1] = arguments[ai];
    }
    for (var i = 0; i < listeners.length; i++) {
      listeners[i].apply(this, args);
    }
  };

  EventEmitter.prototype.on = EventEmitter.prototype.addListener = EventTarget.prototype.addEventListener;
  EventEmitter.prototype.removeListener = EventTarget.prototype.removeEventListener;

  module.exports.EventEmitter = EventEmitter;

  },{"./eventtarget":5,"inherits":57}],4:[function(require,module,exports){

  function Event(eventType) {
    this.type = eventType;
  }

  Event.prototype.initEvent = function(eventType, canBubble, cancelable) {
    this.type = eventType;
    this.bubbles = canBubble;
    this.cancelable = cancelable;
    this.timeStamp = +new Date();
    return this;
  };

  Event.prototype.stopPropagation = function() {};
  Event.prototype.preventDefault = function() {};

  Event.CAPTURING_PHASE = 1;
  Event.AT_TARGET = 2;
  Event.BUBBLING_PHASE = 3;

  module.exports = Event;

  },{}],5:[function(require,module,exports){

  /* Simplified implementation of DOM2 EventTarget.
   *   http://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-EventTarget
   */

  function EventTarget() {
    this._listeners = {};
  }

  EventTarget.prototype.addEventListener = function(eventType, listener) {
    if (!(eventType in this._listeners)) {
      this._listeners[eventType] = [];
    }
    var arr = this._listeners[eventType];
    // #4
    if (arr.indexOf(listener) === -1) {
      // Make a copy so as not to interfere with a current dispatchEvent.
      arr = arr.concat([listener]);
    }
    this._listeners[eventType] = arr;
  };

  EventTarget.prototype.removeEventListener = function(eventType, listener) {
    var arr = this._listeners[eventType];
    if (!arr) {
      return;
    }
    var idx = arr.indexOf(listener);
    if (idx !== -1) {
      if (arr.length > 1) {
        // Make a copy so as not to interfere with a current dispatchEvent.
        this._listeners[eventType] = arr.slice(0, idx).concat(arr.slice(idx + 1));
      } else {
        delete this._listeners[eventType];
      }
      return;
    }
  };

  EventTarget.prototype.dispatchEvent = function() {
    var event = arguments[0];
    var t = event.type;
    // equivalent of Array.prototype.slice.call(arguments, 0);
    var args = arguments.length === 1 ? [event] : Array.apply(null, arguments);
    // TODO: This doesn't match the real behavior; per spec, onfoo get
    // their place in line from the /first/ time they're set from
    // non-null. Although WebKit bumps it to the end every time it's
    // set.
    if (this['on' + t]) {
      this['on' + t].apply(this, args);
    }
    if (t in this._listeners) {
      // Grab a reference to the listeners list. removeEventListener may alter the list.
      var listeners = this._listeners[t];
      for (var i = 0; i < listeners.length; i++) {
        listeners[i].apply(this, args);
      }
    }
  };

  module.exports = EventTarget;

  },{}],6:[function(require,module,exports){

  var inherits = require('inherits')
    , Event = require('./event')
    ;

  function TransportMessageEvent(data) {
    Event.call(this);
    this.initEvent('message', false, false);
    this.data = data;
  }

  inherits(TransportMessageEvent, Event);

  module.exports = TransportMessageEvent;

  },{"./event":4,"inherits":57}],7:[function(require,module,exports){

  var iframeUtils = require('./utils/iframe')
    ;

  function FacadeJS(transport) {
    this._transport = transport;
    transport.on('message', this._transportMessage.bind(this));
    transport.on('close', this._transportClose.bind(this));
  }

  FacadeJS.prototype._transportClose = function(code, reason) {
    iframeUtils.postMessage('c', JSON.stringify([code, reason]));
  };
  FacadeJS.prototype._transportMessage = function(frame) {
    iframeUtils.postMessage('t', frame);
  };
  FacadeJS.prototype._send = function(data) {
    this._transport.send(data);
  };
  FacadeJS.prototype._close = function() {
    this._transport.close();
    this._transport.removeAllListeners();
  };

  module.exports = FacadeJS;

  },{"./utils/iframe":47}],8:[function(require,module,exports){
  (function (process){(function (){

  var urlUtils = require('./utils/url')
    , eventUtils = require('./utils/event')
    , FacadeJS = require('./facade')
    , InfoIframeReceiver = require('./info-iframe-receiver')
    , iframeUtils = require('./utils/iframe')
    , loc = require('./location')
    ;

  module.exports = function(SockJS, availableTransports) {
    var transportMap = {};
    availableTransports.forEach(function(at) {
      if (at.facadeTransport) {
        transportMap[at.facadeTransport.transportName] = at.facadeTransport;
      }
    });

    // hard-coded for the info iframe
    // TODO see if we can make this more dynamic
    transportMap[InfoIframeReceiver.transportName] = InfoIframeReceiver;
    var parentOrigin;

    /* eslint-disable camelcase */
    SockJS.bootstrap_iframe = function() {
      /* eslint-enable camelcase */
      var facade;
      iframeUtils.currentWindowId = loc.hash.slice(1);
      var onMessage = function(e) {
        if (e.source !== parent) {
          return;
        }
        if (typeof parentOrigin === 'undefined') {
          parentOrigin = e.origin;
        }
        if (e.origin !== parentOrigin) {
          return;
        }

        var iframeMessage;
        try {
          iframeMessage = JSON.parse(e.data);
        } catch (ignored) {
          return;
        }

        if (iframeMessage.windowId !== iframeUtils.currentWindowId) {
          return;
        }
        switch (iframeMessage.type) {
        case 's':
          var p;
          try {
            p = JSON.parse(iframeMessage.data);
          } catch (ignored) {
            break;
          }
          var version = p[0];
          var transport = p[1];
          var transUrl = p[2];
          var baseUrl = p[3];
          // change this to semver logic
          if (version !== SockJS.version) {
            throw new Error('Incompatible SockJS! Main site uses:' +
                      ' "' + version + '", the iframe:' +
                      ' "' + SockJS.version + '".');
          }

          if (!urlUtils.isOriginEqual(transUrl, loc.href) ||
              !urlUtils.isOriginEqual(baseUrl, loc.href)) {
            throw new Error('Can\'t connect to different domain from within an ' +
                      'iframe. (' + loc.href + ', ' + transUrl + ', ' + baseUrl + ')');
          }
          facade = new FacadeJS(new transportMap[transport](transUrl, baseUrl));
          break;
        case 'm':
          facade._send(iframeMessage.data);
          break;
        case 'c':
          if (facade) {
            facade._close();
          }
          facade = null;
          break;
        }
      };

      eventUtils.attachEvent('message', onMessage);

      // Start
      iframeUtils.postMessage('s');
    };
  };

  }).call(this);}).call(this,{ env: {} });

  },{"./facade":7,"./info-iframe-receiver":10,"./location":13,"./utils/event":46,"./utils/iframe":47,"./utils/url":52,"debug":55}],9:[function(require,module,exports){
  (function (process){(function (){

  var EventEmitter = require('events').EventEmitter
    , inherits = require('inherits')
    , objectUtils = require('./utils/object')
    ;

  function InfoAjax(url, AjaxObject) {
    EventEmitter.call(this);

    var self = this;
    var t0 = +new Date();
    this.xo = new AjaxObject('GET', url);

    this.xo.once('finish', function(status, text) {
      var info, rtt;
      if (status === 200) {
        rtt = (+new Date()) - t0;
        if (text) {
          try {
            info = JSON.parse(text);
          } catch (e) {
          }
        }

        if (!objectUtils.isObject(info)) {
          info = {};
        }
      }
      self.emit('finish', info, rtt);
      self.removeAllListeners();
    });
  }

  inherits(InfoAjax, EventEmitter);

  InfoAjax.prototype.close = function() {
    this.removeAllListeners();
    this.xo.close();
  };

  module.exports = InfoAjax;

  }).call(this);}).call(this,{ env: {} });

  },{"./utils/object":49,"debug":55,"events":3,"inherits":57}],10:[function(require,module,exports){

  var inherits = require('inherits')
    , EventEmitter = require('events').EventEmitter
    , XHRLocalObject = require('./transport/sender/xhr-local')
    , InfoAjax = require('./info-ajax')
    ;

  function InfoReceiverIframe(transUrl) {
    var self = this;
    EventEmitter.call(this);

    this.ir = new InfoAjax(transUrl, XHRLocalObject);
    this.ir.once('finish', function(info, rtt) {
      self.ir = null;
      self.emit('message', JSON.stringify([info, rtt]));
    });
  }

  inherits(InfoReceiverIframe, EventEmitter);

  InfoReceiverIframe.transportName = 'iframe-info-receiver';

  InfoReceiverIframe.prototype.close = function() {
    if (this.ir) {
      this.ir.close();
      this.ir = null;
    }
    this.removeAllListeners();
  };

  module.exports = InfoReceiverIframe;

  },{"./info-ajax":9,"./transport/sender/xhr-local":37,"events":3,"inherits":57}],11:[function(require,module,exports){
  (function (process,global){(function (){

  var EventEmitter = require('events').EventEmitter
    , inherits = require('inherits')
    , utils = require('./utils/event')
    , IframeTransport = require('./transport/iframe')
    , InfoReceiverIframe = require('./info-iframe-receiver')
    ;

  function InfoIframe(baseUrl, url) {
    var self = this;
    EventEmitter.call(this);

    var go = function() {
      var ifr = self.ifr = new IframeTransport(InfoReceiverIframe.transportName, url, baseUrl);

      ifr.once('message', function(msg) {
        if (msg) {
          var d;
          try {
            d = JSON.parse(msg);
          } catch (e) {
            self.emit('finish');
            self.close();
            return;
          }

          var info = d[0], rtt = d[1];
          self.emit('finish', info, rtt);
        }
        self.close();
      });

      ifr.once('close', function() {
        self.emit('finish');
        self.close();
      });
    };

    // TODO this seems the same as the 'needBody' from transports
    if (!global.document.body) {
      utils.attachEvent('load', go);
    } else {
      go();
    }
  }

  inherits(InfoIframe, EventEmitter);

  InfoIframe.enabled = function() {
    return IframeTransport.enabled();
  };

  InfoIframe.prototype.close = function() {
    if (this.ifr) {
      this.ifr.close();
    }
    this.removeAllListeners();
    this.ifr = null;
  };

  module.exports = InfoIframe;

  }).call(this);}).call(this,{ env: {} },typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});

  },{"./info-iframe-receiver":10,"./transport/iframe":22,"./utils/event":46,"debug":55,"events":3,"inherits":57}],12:[function(require,module,exports){
  (function (process){(function (){

  var EventEmitter = require('events').EventEmitter
    , inherits = require('inherits')
    , urlUtils = require('./utils/url')
    , XDR = require('./transport/sender/xdr')
    , XHRCors = require('./transport/sender/xhr-cors')
    , XHRLocal = require('./transport/sender/xhr-local')
    , XHRFake = require('./transport/sender/xhr-fake')
    , InfoIframe = require('./info-iframe')
    , InfoAjax = require('./info-ajax')
    ;

  function InfoReceiver(baseUrl, urlInfo) {
    var self = this;
    EventEmitter.call(this);

    setTimeout(function() {
      self.doXhr(baseUrl, urlInfo);
    }, 0);
  }

  inherits(InfoReceiver, EventEmitter);

  // TODO this is currently ignoring the list of available transports and the whitelist

  InfoReceiver._getReceiver = function(baseUrl, url, urlInfo) {
    // determine method of CORS support (if needed)
    if (urlInfo.sameOrigin) {
      return new InfoAjax(url, XHRLocal);
    }
    if (XHRCors.enabled) {
      return new InfoAjax(url, XHRCors);
    }
    if (XDR.enabled && urlInfo.sameScheme) {
      return new InfoAjax(url, XDR);
    }
    if (InfoIframe.enabled()) {
      return new InfoIframe(baseUrl, url);
    }
    return new InfoAjax(url, XHRFake);
  };

  InfoReceiver.prototype.doXhr = function(baseUrl, urlInfo) {
    var self = this
      , url = urlUtils.addPath(baseUrl, '/info')
      ;

    this.xo = InfoReceiver._getReceiver(baseUrl, url, urlInfo);

    this.timeoutRef = setTimeout(function() {
      self._cleanup(false);
      self.emit('finish');
    }, InfoReceiver.timeout);

    this.xo.once('finish', function(info, rtt) {
      self._cleanup(true);
      self.emit('finish', info, rtt);
    });
  };

  InfoReceiver.prototype._cleanup = function(wasClean) {
    clearTimeout(this.timeoutRef);
    this.timeoutRef = null;
    if (!wasClean && this.xo) {
      this.xo.close();
    }
    this.xo = null;
  };

  InfoReceiver.prototype.close = function() {
    this.removeAllListeners();
    this._cleanup(false);
  };

  InfoReceiver.timeout = 8000;

  module.exports = InfoReceiver;

  }).call(this);}).call(this,{ env: {} });

  },{"./info-ajax":9,"./info-iframe":11,"./transport/sender/xdr":34,"./transport/sender/xhr-cors":35,"./transport/sender/xhr-fake":36,"./transport/sender/xhr-local":37,"./utils/url":52,"debug":55,"events":3,"inherits":57}],13:[function(require,module,exports){
  (function (global){(function (){

  module.exports = global.location || {
    origin: 'http://localhost:80'
  , protocol: 'http:'
  , host: 'localhost'
  , port: 80
  , href: 'http://localhost/'
  , hash: ''
  };

  }).call(this);}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});

  },{}],14:[function(require,module,exports){
  (function (process,global){(function (){

  require('./shims');

  var URL = require('url-parse')
    , inherits = require('inherits')
    , random = require('./utils/random')
    , escape = require('./utils/escape')
    , urlUtils = require('./utils/url')
    , eventUtils = require('./utils/event')
    , transport = require('./utils/transport')
    , objectUtils = require('./utils/object')
    , browser = require('./utils/browser')
    , log = require('./utils/log')
    , Event = require('./event/event')
    , EventTarget = require('./event/eventtarget')
    , loc = require('./location')
    , CloseEvent = require('./event/close')
    , TransportMessageEvent = require('./event/trans-message')
    , InfoReceiver = require('./info-receiver')
    ;

  var transports;

  // follow constructor steps defined at http://dev.w3.org/html5/websockets/#the-websocket-interface
  function SockJS(url, protocols, options) {
    if (!(this instanceof SockJS)) {
      return new SockJS(url, protocols, options);
    }
    if (arguments.length < 1) {
      throw new TypeError("Failed to construct 'SockJS: 1 argument required, but only 0 present");
    }
    EventTarget.call(this);

    this.readyState = SockJS.CONNECTING;
    this.extensions = '';
    this.protocol = '';

    // non-standard extension
    options = options || {};
    if (options.protocols_whitelist) {
      log.warn("'protocols_whitelist' is DEPRECATED. Use 'transports' instead.");
    }
    this._transportsWhitelist = options.transports;
    this._transportOptions = options.transportOptions || {};
    this._timeout = options.timeout || 0;

    var sessionId = options.sessionId || 8;
    if (typeof sessionId === 'function') {
      this._generateSessionId = sessionId;
    } else if (typeof sessionId === 'number') {
      this._generateSessionId = function() {
        return random.string(sessionId);
      };
    } else {
      throw new TypeError('If sessionId is used in the options, it needs to be a number or a function.');
    }

    this._server = options.server || random.numberString(1000);

    // Step 1 of WS spec - parse and validate the url. Issue #8
    var parsedUrl = new URL(url);
    if (!parsedUrl.host || !parsedUrl.protocol) {
      throw new SyntaxError("The URL '" + url + "' is invalid");
    } else if (parsedUrl.hash) {
      throw new SyntaxError('The URL must not contain a fragment');
    } else if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
      throw new SyntaxError("The URL's scheme must be either 'http:' or 'https:'. '" + parsedUrl.protocol + "' is not allowed.");
    }

    var secure = parsedUrl.protocol === 'https:';
    // Step 2 - don't allow secure origin with an insecure protocol
    if (loc.protocol === 'https:' && !secure) {
      // exception is 127.0.0.0/8 and ::1 urls
      if (!urlUtils.isLoopbackAddr(parsedUrl.hostname)) {
        throw new Error('SecurityError: An insecure SockJS connection may not be initiated from a page loaded over HTTPS');
      }
    }

    // Step 3 - check port access - no need here
    // Step 4 - parse protocols argument
    if (!protocols) {
      protocols = [];
    } else if (!Array.isArray(protocols)) {
      protocols = [protocols];
    }

    // Step 5 - check protocols argument
    var sortedProtocols = protocols.sort();
    sortedProtocols.forEach(function(proto, i) {
      if (!proto) {
        throw new SyntaxError("The protocols entry '" + proto + "' is invalid.");
      }
      if (i < (sortedProtocols.length - 1) && proto === sortedProtocols[i + 1]) {
        throw new SyntaxError("The protocols entry '" + proto + "' is duplicated.");
      }
    });

    // Step 6 - convert origin
    var o = urlUtils.getOrigin(loc.href);
    this._origin = o ? o.toLowerCase() : null;

    // remove the trailing slash
    parsedUrl.set('pathname', parsedUrl.pathname.replace(/\/+$/, ''));

    // store the sanitized url
    this.url = parsedUrl.href;

    // Step 7 - start connection in background
    // obtain server info
    // http://sockjs.github.io/sockjs-protocol/sockjs-protocol-0.3.3.html#section-26
    this._urlInfo = {
      nullOrigin: !browser.hasDomain()
    , sameOrigin: urlUtils.isOriginEqual(this.url, loc.href)
    , sameScheme: urlUtils.isSchemeEqual(this.url, loc.href)
    };

    this._ir = new InfoReceiver(this.url, this._urlInfo);
    this._ir.once('finish', this._receiveInfo.bind(this));
  }

  inherits(SockJS, EventTarget);

  function userSetCode(code) {
    return code === 1000 || (code >= 3000 && code <= 4999);
  }

  SockJS.prototype.close = function(code, reason) {
    // Step 1
    if (code && !userSetCode(code)) {
      throw new Error('InvalidAccessError: Invalid code');
    }
    // Step 2.4 states the max is 123 bytes, but we are just checking length
    if (reason && reason.length > 123) {
      throw new SyntaxError('reason argument has an invalid length');
    }

    // Step 3.1
    if (this.readyState === SockJS.CLOSING || this.readyState === SockJS.CLOSED) {
      return;
    }

    // TODO look at docs to determine how to set this
    var wasClean = true;
    this._close(code || 1000, reason || 'Normal closure', wasClean);
  };

  SockJS.prototype.send = function(data) {
    // #13 - convert anything non-string to string
    // TODO this currently turns objects into [object Object]
    if (typeof data !== 'string') {
      data = '' + data;
    }
    if (this.readyState === SockJS.CONNECTING) {
      throw new Error('InvalidStateError: The connection has not been established yet');
    }
    if (this.readyState !== SockJS.OPEN) {
      return;
    }
    this._transport.send(escape.quote(data));
  };

  SockJS.version = require('./version');

  SockJS.CONNECTING = 0;
  SockJS.OPEN = 1;
  SockJS.CLOSING = 2;
  SockJS.CLOSED = 3;

  SockJS.prototype._receiveInfo = function(info, rtt) {
    this._ir = null;
    if (!info) {
      this._close(1002, 'Cannot connect to server');
      return;
    }

    // establish a round-trip timeout (RTO) based on the
    // round-trip time (RTT)
    this._rto = this.countRTO(rtt);
    // allow server to override url used for the actual transport
    this._transUrl = info.base_url ? info.base_url : this.url;
    info = objectUtils.extend(info, this._urlInfo);
    // determine list of desired and supported transports
    var enabledTransports = transports.filterToEnabled(this._transportsWhitelist, info);
    this._transports = enabledTransports.main;

    this._connect();
  };

  SockJS.prototype._connect = function() {
    for (var Transport = this._transports.shift(); Transport; Transport = this._transports.shift()) {
      if (Transport.needBody) {
        if (!global.document.body ||
            (typeof global.document.readyState !== 'undefined' &&
              global.document.readyState !== 'complete' &&
              global.document.readyState !== 'interactive')) {
          this._transports.unshift(Transport);
          eventUtils.attachEvent('load', this._connect.bind(this));
          return;
        }
      }

      // calculate timeout based on RTO and round trips. Default to 5s
      var timeoutMs = Math.max(this._timeout, (this._rto * Transport.roundTrips) || 5000);
      this._transportTimeoutId = setTimeout(this._transportTimeout.bind(this), timeoutMs);

      var transportUrl = urlUtils.addPath(this._transUrl, '/' + this._server + '/' + this._generateSessionId());
      var options = this._transportOptions[Transport.transportName];
      var transportObj = new Transport(transportUrl, this._transUrl, options);
      transportObj.on('message', this._transportMessage.bind(this));
      transportObj.once('close', this._transportClose.bind(this));
      transportObj.transportName = Transport.transportName;
      this._transport = transportObj;

      return;
    }
    this._close(2000, 'All transports failed', false);
  };

  SockJS.prototype._transportTimeout = function() {
    if (this.readyState === SockJS.CONNECTING) {
      if (this._transport) {
        this._transport.close();
      }

      this._transportClose(2007, 'Transport timed out');
    }
  };

  SockJS.prototype._transportMessage = function(msg) {
    var self = this
      , type = msg.slice(0, 1)
      , content = msg.slice(1)
      , payload
      ;

    // first check for messages that don't need a payload
    switch (type) {
      case 'o':
        this._open();
        return;
      case 'h':
        this.dispatchEvent(new Event('heartbeat'));
        return;
    }

    if (content) {
      try {
        payload = JSON.parse(content);
      } catch (e) {
      }
    }

    if (typeof payload === 'undefined') {
      return;
    }

    switch (type) {
      case 'a':
        if (Array.isArray(payload)) {
          payload.forEach(function(p) {
            self.dispatchEvent(new TransportMessageEvent(p));
          });
        }
        break;
      case 'm':
        this.dispatchEvent(new TransportMessageEvent(payload));
        break;
      case 'c':
        if (Array.isArray(payload) && payload.length === 2) {
          this._close(payload[0], payload[1], true);
        }
        break;
    }
  };

  SockJS.prototype._transportClose = function(code, reason) {
    if (this._transport) {
      this._transport.removeAllListeners();
      this._transport = null;
      this.transport = null;
    }

    if (!userSetCode(code) && code !== 2000 && this.readyState === SockJS.CONNECTING) {
      this._connect();
      return;
    }

    this._close(code, reason);
  };

  SockJS.prototype._open = function() {
    if (this.readyState === SockJS.CONNECTING) {
      if (this._transportTimeoutId) {
        clearTimeout(this._transportTimeoutId);
        this._transportTimeoutId = null;
      }
      this.readyState = SockJS.OPEN;
      this.transport = this._transport.transportName;
      this.dispatchEvent(new Event('open'));
    } else {
      // The server might have been restarted, and lost track of our
      // connection.
      this._close(1006, 'Server lost session');
    }
  };

  SockJS.prototype._close = function(code, reason, wasClean) {
    var forceFail = false;

    if (this._ir) {
      forceFail = true;
      this._ir.close();
      this._ir = null;
    }
    if (this._transport) {
      this._transport.close();
      this._transport = null;
      this.transport = null;
    }

    if (this.readyState === SockJS.CLOSED) {
      throw new Error('InvalidStateError: SockJS has already been closed');
    }

    this.readyState = SockJS.CLOSING;
    setTimeout(function() {
      this.readyState = SockJS.CLOSED;

      if (forceFail) {
        this.dispatchEvent(new Event('error'));
      }

      var e = new CloseEvent('close');
      e.wasClean = wasClean || false;
      e.code = code || 1000;
      e.reason = reason;

      this.dispatchEvent(e);
      this.onmessage = this.onclose = this.onerror = null;
    }.bind(this), 0);
  };

  // See: http://www.erg.abdn.ac.uk/~gerrit/dccp/notes/ccid2/rto_estimator/
  // and RFC 2988.
  SockJS.prototype.countRTO = function(rtt) {
    // In a local environment, when using IE8/9 and the `jsonp-polling`
    // transport the time needed to establish a connection (the time that pass
    // from the opening of the transport to the call of `_dispatchOpen`) is
    // around 200msec (the lower bound used in the article above) and this
    // causes spurious timeouts. For this reason we calculate a value slightly
    // larger than that used in the article.
    if (rtt > 100) {
      return 4 * rtt; // rto > 400msec
    }
    return 300 + rtt; // 300msec < rto <= 400msec
  };

  module.exports = function(availableTransports) {
    transports = transport(availableTransports);
    require('./iframe-bootstrap')(SockJS, availableTransports);
    return SockJS;
  };

  }).call(this);}).call(this,{ env: {} },typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});

  },{"./event/close":2,"./event/event":4,"./event/eventtarget":5,"./event/trans-message":6,"./iframe-bootstrap":8,"./info-receiver":12,"./location":13,"./shims":15,"./utils/browser":44,"./utils/escape":45,"./utils/event":46,"./utils/log":48,"./utils/object":49,"./utils/random":50,"./utils/transport":51,"./utils/url":52,"./version":53,"debug":55,"inherits":57,"url-parse":60}],15:[function(require,module,exports){

  // pulled specific shims from https://github.com/es-shims/es5-shim

  var ArrayPrototype = Array.prototype;
  var ObjectPrototype = Object.prototype;
  var FunctionPrototype = Function.prototype;
  var StringPrototype = String.prototype;
  var array_slice = ArrayPrototype.slice;

  var _toString = ObjectPrototype.toString;
  var isFunction = function (val) {
      return ObjectPrototype.toString.call(val) === '[object Function]';
  };
  var isArray = function isArray(obj) {
      return _toString.call(obj) === '[object Array]';
  };
  var isString = function isString(obj) {
      return _toString.call(obj) === '[object String]';
  };

  var supportsDescriptors = Object.defineProperty && (function () {
      try {
          Object.defineProperty({}, 'x', {});
          return true;
      } catch (e) { /* this is ES3 */
          return false;
      }
  }());

  // Define configurable, writable and non-enumerable props
  // if they don't exist.
  var defineProperty;
  if (supportsDescriptors) {
      defineProperty = function (object, name, method, forceAssign) {
          if (!forceAssign && (name in object)) { return; }
          Object.defineProperty(object, name, {
              configurable: true,
              enumerable: false,
              writable: true,
              value: method
          });
      };
  } else {
      defineProperty = function (object, name, method, forceAssign) {
          if (!forceAssign && (name in object)) { return; }
          object[name] = method;
      };
  }
  var defineProperties = function (object, map, forceAssign) {
      for (var name in map) {
          if (ObjectPrototype.hasOwnProperty.call(map, name)) {
            defineProperty(object, name, map[name], forceAssign);
          }
      }
  };

  var toObject = function (o) {
      if (o == null) { // this matches both null and undefined
          throw new TypeError("can't convert " + o + ' to object');
      }
      return Object(o);
  };

  //
  // Util
  // ======
  //

  // ES5 9.4
  // http://es5.github.com/#x9.4
  // http://jsperf.com/to-integer

  function toInteger(num) {
      var n = +num;
      if (n !== n) { // isNaN
          n = 0;
      } else if (n !== 0 && n !== (1 / 0) && n !== -(1 / 0)) {
          n = (n > 0 || -1) * Math.floor(Math.abs(n));
      }
      return n;
  }

  function ToUint32(x) {
      return x >>> 0;
  }

  //
  // Function
  // ========
  //

  // ES-5 15.3.4.5
  // http://es5.github.com/#x15.3.4.5

  function Empty() {}

  defineProperties(FunctionPrototype, {
      bind: function bind(that) { // .length is 1
          // 1. Let Target be the this value.
          var target = this;
          // 2. If IsCallable(Target) is false, throw a TypeError exception.
          if (!isFunction(target)) {
              throw new TypeError('Function.prototype.bind called on incompatible ' + target);
          }
          // 3. Let A be a new (possibly empty) internal list of all of the
          //   argument values provided after thisArg (arg1, arg2 etc), in order.
          // XXX slicedArgs will stand in for "A" if used
          var args = array_slice.call(arguments, 1); // for normal call
          // 4. Let F be a new native ECMAScript object.
          // 11. Set the [[Prototype]] internal property of F to the standard
          //   built-in Function prototype object as specified in 15.3.3.1.
          // 12. Set the [[Call]] internal property of F as described in
          //   15.3.4.5.1.
          // 13. Set the [[Construct]] internal property of F as described in
          //   15.3.4.5.2.
          // 14. Set the [[HasInstance]] internal property of F as described in
          //   15.3.4.5.3.
          var binder = function () {

              if (this instanceof bound) {
                  // 15.3.4.5.2 [[Construct]]
                  // When the [[Construct]] internal method of a function object,
                  // F that was created using the bind function is called with a
                  // list of arguments ExtraArgs, the following steps are taken:
                  // 1. Let target be the value of F's [[TargetFunction]]
                  //   internal property.
                  // 2. If target has no [[Construct]] internal method, a
                  //   TypeError exception is thrown.
                  // 3. Let boundArgs be the value of F's [[BoundArgs]] internal
                  //   property.
                  // 4. Let args be a new list containing the same values as the
                  //   list boundArgs in the same order followed by the same
                  //   values as the list ExtraArgs in the same order.
                  // 5. Return the result of calling the [[Construct]] internal
                  //   method of target providing args as the arguments.

                  var result = target.apply(
                      this,
                      args.concat(array_slice.call(arguments))
                  );
                  if (Object(result) === result) {
                      return result;
                  }
                  return this;

              } else {
                  // 15.3.4.5.1 [[Call]]
                  // When the [[Call]] internal method of a function object, F,
                  // which was created using the bind function is called with a
                  // this value and a list of arguments ExtraArgs, the following
                  // steps are taken:
                  // 1. Let boundArgs be the value of F's [[BoundArgs]] internal
                  //   property.
                  // 2. Let boundThis be the value of F's [[BoundThis]] internal
                  //   property.
                  // 3. Let target be the value of F's [[TargetFunction]] internal
                  //   property.
                  // 4. Let args be a new list containing the same values as the
                  //   list boundArgs in the same order followed by the same
                  //   values as the list ExtraArgs in the same order.
                  // 5. Return the result of calling the [[Call]] internal method
                  //   of target providing boundThis as the this value and
                  //   providing args as the arguments.

                  // equiv: target.call(this, ...boundArgs, ...args)
                  return target.apply(
                      that,
                      args.concat(array_slice.call(arguments))
                  );

              }

          };

          // 15. If the [[Class]] internal property of Target is "Function", then
          //     a. Let L be the length property of Target minus the length of A.
          //     b. Set the length own property of F to either 0 or L, whichever is
          //       larger.
          // 16. Else set the length own property of F to 0.

          var boundLength = Math.max(0, target.length - args.length);

          // 17. Set the attributes of the length own property of F to the values
          //   specified in 15.3.5.1.
          var boundArgs = [];
          for (var i = 0; i < boundLength; i++) {
              boundArgs.push('$' + i);
          }

          // XXX Build a dynamic function with desired amount of arguments is the only
          // way to set the length property of a function.
          // In environments where Content Security Policies enabled (Chrome extensions,
          // for ex.) all use of eval or Function costructor throws an exception.
          // However in all of these environments Function.prototype.bind exists
          // and so this code will never be executed.
          var bound = Function('binder', 'return function (' + boundArgs.join(',') + '){ return binder.apply(this, arguments); }')(binder);

          if (target.prototype) {
              Empty.prototype = target.prototype;
              bound.prototype = new Empty();
              // Clean up dangling references.
              Empty.prototype = null;
          }

          // TODO
          // 18. Set the [[Extensible]] internal property of F to true.

          // TODO
          // 19. Let thrower be the [[ThrowTypeError]] function Object (13.2.3).
          // 20. Call the [[DefineOwnProperty]] internal method of F with
          //   arguments "caller", PropertyDescriptor {[[Get]]: thrower, [[Set]]:
          //   thrower, [[Enumerable]]: false, [[Configurable]]: false}, and
          //   false.
          // 21. Call the [[DefineOwnProperty]] internal method of F with
          //   arguments "arguments", PropertyDescriptor {[[Get]]: thrower,
          //   [[Set]]: thrower, [[Enumerable]]: false, [[Configurable]]: false},
          //   and false.

          // TODO
          // NOTE Function objects created using Function.prototype.bind do not
          // have a prototype property or the [[Code]], [[FormalParameters]], and
          // [[Scope]] internal properties.
          // XXX can't delete prototype in pure-js.

          // 22. Return F.
          return bound;
      }
  });

  //
  // Array
  // =====
  //

  // ES5 15.4.3.2
  // http://es5.github.com/#x15.4.3.2
  // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/isArray
  defineProperties(Array, { isArray: isArray });


  var boxedString = Object('a');
  var splitString = boxedString[0] !== 'a' || !(0 in boxedString);

  var properlyBoxesContext = function properlyBoxed(method) {
      // Check node 0.6.21 bug where third parameter is not boxed
      var properlyBoxesNonStrict = true;
      var properlyBoxesStrict = true;
      if (method) {
          method.call('foo', function (_, __, context) {
              if (typeof context !== 'object') { properlyBoxesNonStrict = false; }
          });

          method.call([1], function () {
              properlyBoxesStrict = typeof this === 'string';
          }, 'x');
      }
      return !!method && properlyBoxesNonStrict && properlyBoxesStrict;
  };

  defineProperties(ArrayPrototype, {
      forEach: function forEach(fun /*, thisp*/) {
          var object = toObject(this),
              self = splitString && isString(this) ? this.split('') : object,
              thisp = arguments[1],
              i = -1,
              length = self.length >>> 0;

          // If no callback function or if callback is not a callable function
          if (!isFunction(fun)) {
              throw new TypeError(); // TODO message
          }

          while (++i < length) {
              if (i in self) {
                  // Invoke the callback function with call, passing arguments:
                  // context, property value, property key, thisArg object
                  // context
                  fun.call(thisp, self[i], i, object);
              }
          }
      }
  }, !properlyBoxesContext(ArrayPrototype.forEach));

  // ES5 15.4.4.14
  // http://es5.github.com/#x15.4.4.14
  // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/indexOf
  var hasFirefox2IndexOfBug = Array.prototype.indexOf && [0, 1].indexOf(1, 2) !== -1;
  defineProperties(ArrayPrototype, {
      indexOf: function indexOf(sought /*, fromIndex */ ) {
          var self = splitString && isString(this) ? this.split('') : toObject(this),
              length = self.length >>> 0;

          if (!length) {
              return -1;
          }

          var i = 0;
          if (arguments.length > 1) {
              i = toInteger(arguments[1]);
          }

          // handle negative indices
          i = i >= 0 ? i : Math.max(0, length + i);
          for (; i < length; i++) {
              if (i in self && self[i] === sought) {
                  return i;
              }
          }
          return -1;
      }
  }, hasFirefox2IndexOfBug);

  //
  // String
  // ======
  //

  // ES5 15.5.4.14
  // http://es5.github.com/#x15.5.4.14

  // [bugfix, IE lt 9, firefox 4, Konqueror, Opera, obscure browsers]
  // Many browsers do not split properly with regular expressions or they
  // do not perform the split correctly under obscure conditions.
  // See http://blog.stevenlevithan.com/archives/cross-browser-split
  // I've tested in many browsers and this seems to cover the deviant ones:
  //    'ab'.split(/(?:ab)*/) should be ["", ""], not [""]
  //    '.'.split(/(.?)(.?)/) should be ["", ".", "", ""], not ["", ""]
  //    'tesst'.split(/(s)*/) should be ["t", undefined, "e", "s", "t"], not
  //       [undefined, "t", undefined, "e", ...]
  //    ''.split(/.?/) should be [], not [""]
  //    '.'.split(/()()/) should be ["."], not ["", "", "."]

  var string_split = StringPrototype.split;
  if (
      'ab'.split(/(?:ab)*/).length !== 2 ||
      '.'.split(/(.?)(.?)/).length !== 4 ||
      'tesst'.split(/(s)*/)[1] === 't' ||
      'test'.split(/(?:)/, -1).length !== 4 ||
      ''.split(/.?/).length ||
      '.'.split(/()()/).length > 1
  ) {
      (function () {
          var compliantExecNpcg = /()??/.exec('')[1] === void 0; // NPCG: nonparticipating capturing group

          StringPrototype.split = function (separator, limit) {
              var string = this;
              if (separator === void 0 && limit === 0) {
                  return [];
              }

              // If `separator` is not a regex, use native split
              if (_toString.call(separator) !== '[object RegExp]') {
                  return string_split.call(this, separator, limit);
              }

              var output = [],
                  flags = (separator.ignoreCase ? 'i' : '') +
                          (separator.multiline  ? 'm' : '') +
                          (separator.extended   ? 'x' : '') + // Proposed for ES6
                          (separator.sticky     ? 'y' : ''), // Firefox 3+
                  lastLastIndex = 0,
                  // Make `global` and avoid `lastIndex` issues by working with a copy
                  separator2, match, lastIndex, lastLength;
              separator = new RegExp(separator.source, flags + 'g');
              string += ''; // Type-convert
              if (!compliantExecNpcg) {
                  // Doesn't need flags gy, but they don't hurt
                  separator2 = new RegExp('^' + separator.source + '$(?!\\s)', flags);
              }
              /* Values for `limit`, per the spec:
               * If undefined: 4294967295 // Math.pow(2, 32) - 1
               * If 0, Infinity, or NaN: 0
               * If positive number: limit = Math.floor(limit); if (limit > 4294967295) limit -= 4294967296;
               * If negative number: 4294967296 - Math.floor(Math.abs(limit))
               * If other: Type-convert, then use the above rules
               */
              limit = limit === void 0 ?
                  -1 >>> 0 : // Math.pow(2, 32) - 1
                  ToUint32(limit);
              while (match = separator.exec(string)) {
                  // `separator.lastIndex` is not reliable cross-browser
                  lastIndex = match.index + match[0].length;
                  if (lastIndex > lastLastIndex) {
                      output.push(string.slice(lastLastIndex, match.index));
                      // Fix browsers whose `exec` methods don't consistently return `undefined` for
                      // nonparticipating capturing groups
                      if (!compliantExecNpcg && match.length > 1) {
                          match[0].replace(separator2, function () {
                              for (var i = 1; i < arguments.length - 2; i++) {
                                  if (arguments[i] === void 0) {
                                      match[i] = void 0;
                                  }
                              }
                          });
                      }
                      if (match.length > 1 && match.index < string.length) {
                          ArrayPrototype.push.apply(output, match.slice(1));
                      }
                      lastLength = match[0].length;
                      lastLastIndex = lastIndex;
                      if (output.length >= limit) {
                          break;
                      }
                  }
                  if (separator.lastIndex === match.index) {
                      separator.lastIndex++; // Avoid an infinite loop
                  }
              }
              if (lastLastIndex === string.length) {
                  if (lastLength || !separator.test('')) {
                      output.push('');
                  }
              } else {
                  output.push(string.slice(lastLastIndex));
              }
              return output.length > limit ? output.slice(0, limit) : output;
          };
      }());

  // [bugfix, chrome]
  // If separator is undefined, then the result array contains just one String,
  // which is the this value (converted to a String). If limit is not undefined,
  // then the output array is truncated so that it contains no more than limit
  // elements.
  // "0".split(undefined, 0) -> []
  } else if ('0'.split(void 0, 0).length) {
      StringPrototype.split = function split(separator, limit) {
          if (separator === void 0 && limit === 0) { return []; }
          return string_split.call(this, separator, limit);
      };
  }

  // ECMA-262, 3rd B.2.3
  // Not an ECMAScript standard, although ECMAScript 3rd Edition has a
  // non-normative section suggesting uniform semantics and it should be
  // normalized across all browsers
  // [bugfix, IE lt 9] IE < 9 substr() with negative value not working in IE
  var string_substr = StringPrototype.substr;
  var hasNegativeSubstrBug = ''.substr && '0b'.substr(-1) !== 'b';
  defineProperties(StringPrototype, {
      substr: function substr(start, length) {
          return string_substr.call(
              this,
              start < 0 ? ((start = this.length + start) < 0 ? 0 : start) : start,
              length
          );
      }
  }, hasNegativeSubstrBug);

  },{}],16:[function(require,module,exports){

  module.exports = [
    // streaming transports
    require('./transport/websocket')
  , require('./transport/xhr-streaming')
  , require('./transport/xdr-streaming')
  , require('./transport/eventsource')
  , require('./transport/lib/iframe-wrap')(require('./transport/eventsource'))

    // polling transports
  , require('./transport/htmlfile')
  , require('./transport/lib/iframe-wrap')(require('./transport/htmlfile'))
  , require('./transport/xhr-polling')
  , require('./transport/xdr-polling')
  , require('./transport/lib/iframe-wrap')(require('./transport/xhr-polling'))
  , require('./transport/jsonp-polling')
  ];

  },{"./transport/eventsource":20,"./transport/htmlfile":21,"./transport/jsonp-polling":23,"./transport/lib/iframe-wrap":26,"./transport/websocket":38,"./transport/xdr-polling":39,"./transport/xdr-streaming":40,"./transport/xhr-polling":41,"./transport/xhr-streaming":42}],17:[function(require,module,exports){
  (function (process,global){(function (){

  var EventEmitter = require('events').EventEmitter
    , inherits = require('inherits')
    , utils = require('../../utils/event')
    , urlUtils = require('../../utils/url')
    , XHR = global.XMLHttpRequest
    ;

  function AbstractXHRObject(method, url, payload, opts) {
    var self = this;
    EventEmitter.call(this);

    setTimeout(function () {
      self._start(method, url, payload, opts);
    }, 0);
  }

  inherits(AbstractXHRObject, EventEmitter);

  AbstractXHRObject.prototype._start = function(method, url, payload, opts) {
    var self = this;

    try {
      this.xhr = new XHR();
    } catch (x) {
      // intentionally empty
    }

    if (!this.xhr) {
      this.emit('finish', 0, 'no xhr support');
      this._cleanup();
      return;
    }

    // several browsers cache POSTs
    url = urlUtils.addQuery(url, 't=' + (+new Date()));

    // Explorer tends to keep connection open, even after the
    // tab gets closed: http://bugs.jquery.com/ticket/5280
    this.unloadRef = utils.unloadAdd(function() {
      self._cleanup(true);
    });
    try {
      this.xhr.open(method, url, true);
      if (this.timeout && 'timeout' in this.xhr) {
        this.xhr.timeout = this.timeout;
        this.xhr.ontimeout = function() {
          self.emit('finish', 0, '');
          self._cleanup(false);
        };
      }
    } catch (e) {
      // IE raises an exception on wrong port.
      this.emit('finish', 0, '');
      this._cleanup(false);
      return;
    }

    if ((!opts || !opts.noCredentials) && AbstractXHRObject.supportsCORS) {
      // Mozilla docs says https://developer.mozilla.org/en/XMLHttpRequest :
      // "This never affects same-site requests."

      this.xhr.withCredentials = true;
    }
    if (opts && opts.headers) {
      for (var key in opts.headers) {
        this.xhr.setRequestHeader(key, opts.headers[key]);
      }
    }

    this.xhr.onreadystatechange = function() {
      if (self.xhr) {
        var x = self.xhr;
        var text, status;
        switch (x.readyState) {
        case 3:
          // IE doesn't like peeking into responseText or status
          // on Microsoft.XMLHTTP and readystate=3
          try {
            status = x.status;
            text = x.responseText;
          } catch (e) {
            // intentionally empty
          }
          // IE returns 1223 for 204: http://bugs.jquery.com/ticket/1450
          if (status === 1223) {
            status = 204;
          }

          // IE does return readystate == 3 for 404 answers.
          if (status === 200 && text && text.length > 0) {
            self.emit('chunk', status, text);
          }
          break;
        case 4:
          status = x.status;
          // IE returns 1223 for 204: http://bugs.jquery.com/ticket/1450
          if (status === 1223) {
            status = 204;
          }
          // IE returns this for a bad port
          // http://msdn.microsoft.com/en-us/library/windows/desktop/aa383770(v=vs.85).aspx
          if (status === 12005 || status === 12029) {
            status = 0;
          }
          self.emit('finish', status, x.responseText);
          self._cleanup(false);
          break;
        }
      }
    };

    try {
      self.xhr.send(payload);
    } catch (e) {
      self.emit('finish', 0, '');
      self._cleanup(false);
    }
  };

  AbstractXHRObject.prototype._cleanup = function(abort) {
    if (!this.xhr) {
      return;
    }
    this.removeAllListeners();
    utils.unloadDel(this.unloadRef);

    // IE needs this field to be a function
    this.xhr.onreadystatechange = function() {};
    if (this.xhr.ontimeout) {
      this.xhr.ontimeout = null;
    }

    if (abort) {
      try {
        this.xhr.abort();
      } catch (x) {
        // intentionally empty
      }
    }
    this.unloadRef = this.xhr = null;
  };

  AbstractXHRObject.prototype.close = function() {
    this._cleanup(true);
  };

  AbstractXHRObject.enabled = !!XHR;
  // override XMLHttpRequest for IE6/7
  // obfuscate to avoid firewalls
  var axo = ['Active'].concat('Object').join('X');
  if (!AbstractXHRObject.enabled && (axo in global)) {
    XHR = function() {
      try {
        return new global[axo]('Microsoft.XMLHTTP');
      } catch (e) {
        return null;
      }
    };
    AbstractXHRObject.enabled = !!new XHR();
  }

  var cors = false;
  try {
    cors = 'withCredentials' in new XHR();
  } catch (ignored) {
    // intentionally empty
  }

  AbstractXHRObject.supportsCORS = cors;

  module.exports = AbstractXHRObject;

  }).call(this);}).call(this,{ env: {} },typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});

  },{"../../utils/event":46,"../../utils/url":52,"debug":55,"events":3,"inherits":57}],18:[function(require,module,exports){
  (function (global){(function (){
  module.exports = global.EventSource;

  }).call(this);}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});

  },{}],19:[function(require,module,exports){
  (function (global){(function (){

  var Driver = global.WebSocket || global.MozWebSocket;
  if (Driver) {
    module.exports = function WebSocketBrowserDriver(url) {
      return new Driver(url);
    };
  } else {
    module.exports = undefined;
  }

  }).call(this);}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});

  },{}],20:[function(require,module,exports){

  var inherits = require('inherits')
    , AjaxBasedTransport = require('./lib/ajax-based')
    , EventSourceReceiver = require('./receiver/eventsource')
    , XHRCorsObject = require('./sender/xhr-cors')
    , EventSourceDriver = require('eventsource')
    ;

  function EventSourceTransport(transUrl) {
    if (!EventSourceTransport.enabled()) {
      throw new Error('Transport created when disabled');
    }

    AjaxBasedTransport.call(this, transUrl, '/eventsource', EventSourceReceiver, XHRCorsObject);
  }

  inherits(EventSourceTransport, AjaxBasedTransport);

  EventSourceTransport.enabled = function() {
    return !!EventSourceDriver;
  };

  EventSourceTransport.transportName = 'eventsource';
  EventSourceTransport.roundTrips = 2;

  module.exports = EventSourceTransport;

  },{"./lib/ajax-based":24,"./receiver/eventsource":29,"./sender/xhr-cors":35,"eventsource":18,"inherits":57}],21:[function(require,module,exports){

  var inherits = require('inherits')
    , HtmlfileReceiver = require('./receiver/htmlfile')
    , XHRLocalObject = require('./sender/xhr-local')
    , AjaxBasedTransport = require('./lib/ajax-based')
    ;

  function HtmlFileTransport(transUrl) {
    if (!HtmlfileReceiver.enabled) {
      throw new Error('Transport created when disabled');
    }
    AjaxBasedTransport.call(this, transUrl, '/htmlfile', HtmlfileReceiver, XHRLocalObject);
  }

  inherits(HtmlFileTransport, AjaxBasedTransport);

  HtmlFileTransport.enabled = function(info) {
    return HtmlfileReceiver.enabled && info.sameOrigin;
  };

  HtmlFileTransport.transportName = 'htmlfile';
  HtmlFileTransport.roundTrips = 2;

  module.exports = HtmlFileTransport;

  },{"./lib/ajax-based":24,"./receiver/htmlfile":30,"./sender/xhr-local":37,"inherits":57}],22:[function(require,module,exports){
  (function (process){(function (){

  // Few cool transports do work only for same-origin. In order to make
  // them work cross-domain we shall use iframe, served from the
  // remote domain. New browsers have capabilities to communicate with
  // cross domain iframe using postMessage(). In IE it was implemented
  // from IE 8+, but of course, IE got some details wrong:
  //    http://msdn.microsoft.com/en-us/library/cc197015(v=VS.85).aspx
  //    http://stevesouders.com/misc/test-postmessage.php

  var inherits = require('inherits')
    , EventEmitter = require('events').EventEmitter
    , version = require('../version')
    , urlUtils = require('../utils/url')
    , iframeUtils = require('../utils/iframe')
    , eventUtils = require('../utils/event')
    , random = require('../utils/random')
    ;

  function IframeTransport(transport, transUrl, baseUrl) {
    if (!IframeTransport.enabled()) {
      throw new Error('Transport created when disabled');
    }
    EventEmitter.call(this);

    var self = this;
    this.origin = urlUtils.getOrigin(baseUrl);
    this.baseUrl = baseUrl;
    this.transUrl = transUrl;
    this.transport = transport;
    this.windowId = random.string(8);

    var iframeUrl = urlUtils.addPath(baseUrl, '/iframe.html') + '#' + this.windowId;

    this.iframeObj = iframeUtils.createIframe(iframeUrl, function(r) {
      self.emit('close', 1006, 'Unable to load an iframe (' + r + ')');
      self.close();
    });

    this.onmessageCallback = this._message.bind(this);
    eventUtils.attachEvent('message', this.onmessageCallback);
  }

  inherits(IframeTransport, EventEmitter);

  IframeTransport.prototype.close = function() {
    this.removeAllListeners();
    if (this.iframeObj) {
      eventUtils.detachEvent('message', this.onmessageCallback);
      try {
        // When the iframe is not loaded, IE raises an exception
        // on 'contentWindow'.
        this.postMessage('c');
      } catch (x) {
        // intentionally empty
      }
      this.iframeObj.cleanup();
      this.iframeObj = null;
      this.onmessageCallback = this.iframeObj = null;
    }
  };

  IframeTransport.prototype._message = function(e) {
    if (!urlUtils.isOriginEqual(e.origin, this.origin)) {
      return;
    }

    var iframeMessage;
    try {
      iframeMessage = JSON.parse(e.data);
    } catch (ignored) {
      return;
    }

    if (iframeMessage.windowId !== this.windowId) {
      return;
    }

    switch (iframeMessage.type) {
    case 's':
      this.iframeObj.loaded();
      // window global dependency
      this.postMessage('s', JSON.stringify([
        version
      , this.transport
      , this.transUrl
      , this.baseUrl
      ]));
      break;
    case 't':
      this.emit('message', iframeMessage.data);
      break;
    case 'c':
      var cdata;
      try {
        cdata = JSON.parse(iframeMessage.data);
      } catch (ignored) {
        return;
      }
      this.emit('close', cdata[0], cdata[1]);
      this.close();
      break;
    }
  };

  IframeTransport.prototype.postMessage = function(type, data) {
    this.iframeObj.post(JSON.stringify({
      windowId: this.windowId
    , type: type
    , data: data || ''
    }), this.origin);
  };

  IframeTransport.prototype.send = function(message) {
    this.postMessage('m', message);
  };

  IframeTransport.enabled = function() {
    return iframeUtils.iframeEnabled;
  };

  IframeTransport.transportName = 'iframe';
  IframeTransport.roundTrips = 2;

  module.exports = IframeTransport;

  }).call(this);}).call(this,{ env: {} });

  },{"../utils/event":46,"../utils/iframe":47,"../utils/random":50,"../utils/url":52,"../version":53,"debug":55,"events":3,"inherits":57}],23:[function(require,module,exports){
  (function (global){(function (){

  // The simplest and most robust transport, using the well-know cross
  // domain hack - JSONP. This transport is quite inefficient - one
  // message could use up to one http request. But at least it works almost
  // everywhere.
  // Known limitations:
  //   o you will get a spinning cursor
  //   o for Konqueror a dumb timer is needed to detect errors

  var inherits = require('inherits')
    , SenderReceiver = require('./lib/sender-receiver')
    , JsonpReceiver = require('./receiver/jsonp')
    , jsonpSender = require('./sender/jsonp')
    ;

  function JsonPTransport(transUrl) {
    if (!JsonPTransport.enabled()) {
      throw new Error('Transport created when disabled');
    }
    SenderReceiver.call(this, transUrl, '/jsonp', jsonpSender, JsonpReceiver);
  }

  inherits(JsonPTransport, SenderReceiver);

  JsonPTransport.enabled = function() {
    return !!global.document;
  };

  JsonPTransport.transportName = 'jsonp-polling';
  JsonPTransport.roundTrips = 1;
  JsonPTransport.needBody = true;

  module.exports = JsonPTransport;

  }).call(this);}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});

  },{"./lib/sender-receiver":28,"./receiver/jsonp":31,"./sender/jsonp":33,"inherits":57}],24:[function(require,module,exports){
  (function (process){(function (){

  var inherits = require('inherits')
    , urlUtils = require('../../utils/url')
    , SenderReceiver = require('./sender-receiver')
    ;

  function createAjaxSender(AjaxObject) {
    return function(url, payload, callback) {
      var opt = {};
      if (typeof payload === 'string') {
        opt.headers = {'Content-type': 'text/plain'};
      }
      var ajaxUrl = urlUtils.addPath(url, '/xhr_send');
      var xo = new AjaxObject('POST', ajaxUrl, payload, opt);
      xo.once('finish', function(status) {
        xo = null;

        if (status !== 200 && status !== 204) {
          return callback(new Error('http status ' + status));
        }
        callback();
      });
      return function() {
        xo.close();
        xo = null;

        var err = new Error('Aborted');
        err.code = 1000;
        callback(err);
      };
    };
  }

  function AjaxBasedTransport(transUrl, urlSuffix, Receiver, AjaxObject) {
    SenderReceiver.call(this, transUrl, urlSuffix, createAjaxSender(AjaxObject), Receiver, AjaxObject);
  }

  inherits(AjaxBasedTransport, SenderReceiver);

  module.exports = AjaxBasedTransport;

  }).call(this);}).call(this,{ env: {} });

  },{"../../utils/url":52,"./sender-receiver":28,"debug":55,"inherits":57}],25:[function(require,module,exports){
  (function (process){(function (){

  var inherits = require('inherits')
    , EventEmitter = require('events').EventEmitter
    ;

  function BufferedSender(url, sender) {
    EventEmitter.call(this);
    this.sendBuffer = [];
    this.sender = sender;
    this.url = url;
  }

  inherits(BufferedSender, EventEmitter);

  BufferedSender.prototype.send = function(message) {
    this.sendBuffer.push(message);
    if (!this.sendStop) {
      this.sendSchedule();
    }
  };

  // For polling transports in a situation when in the message callback,
  // new message is being send. If the sending connection was started
  // before receiving one, it is possible to saturate the network and
  // timeout due to the lack of receiving socket. To avoid that we delay
  // sending messages by some small time, in order to let receiving
  // connection be started beforehand. This is only a halfmeasure and
  // does not fix the big problem, but it does make the tests go more
  // stable on slow networks.
  BufferedSender.prototype.sendScheduleWait = function() {
    var self = this;
    var tref;
    this.sendStop = function() {
      self.sendStop = null;
      clearTimeout(tref);
    };
    tref = setTimeout(function() {
      self.sendStop = null;
      self.sendSchedule();
    }, 25);
  };

  BufferedSender.prototype.sendSchedule = function() {
    var self = this;
    if (this.sendBuffer.length > 0) {
      var payload = '[' + this.sendBuffer.join(',') + ']';
      this.sendStop = this.sender(this.url, payload, function(err) {
        self.sendStop = null;
        if (err) {
          self.emit('close', err.code || 1006, 'Sending error: ' + err);
          self.close();
        } else {
          self.sendScheduleWait();
        }
      });
      this.sendBuffer = [];
    }
  };

  BufferedSender.prototype._cleanup = function() {
    this.removeAllListeners();
  };

  BufferedSender.prototype.close = function() {
    this._cleanup();
    if (this.sendStop) {
      this.sendStop();
      this.sendStop = null;
    }
  };

  module.exports = BufferedSender;

  }).call(this);}).call(this,{ env: {} });

  },{"debug":55,"events":3,"inherits":57}],26:[function(require,module,exports){
  (function (global){(function (){

  var inherits = require('inherits')
    , IframeTransport = require('../iframe')
    , objectUtils = require('../../utils/object')
    ;

  module.exports = function(transport) {

    function IframeWrapTransport(transUrl, baseUrl) {
      IframeTransport.call(this, transport.transportName, transUrl, baseUrl);
    }

    inherits(IframeWrapTransport, IframeTransport);

    IframeWrapTransport.enabled = function(url, info) {
      if (!global.document) {
        return false;
      }

      var iframeInfo = objectUtils.extend({}, info);
      iframeInfo.sameOrigin = true;
      return transport.enabled(iframeInfo) && IframeTransport.enabled();
    };

    IframeWrapTransport.transportName = 'iframe-' + transport.transportName;
    IframeWrapTransport.needBody = true;
    IframeWrapTransport.roundTrips = IframeTransport.roundTrips + transport.roundTrips - 1; // html, javascript (2) + transport - no CORS (1)

    IframeWrapTransport.facadeTransport = transport;

    return IframeWrapTransport;
  };

  }).call(this);}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});

  },{"../../utils/object":49,"../iframe":22,"inherits":57}],27:[function(require,module,exports){
  (function (process){(function (){

  var inherits = require('inherits')
    , EventEmitter = require('events').EventEmitter
    ;

  function Polling(Receiver, receiveUrl, AjaxObject) {
    EventEmitter.call(this);
    this.Receiver = Receiver;
    this.receiveUrl = receiveUrl;
    this.AjaxObject = AjaxObject;
    this._scheduleReceiver();
  }

  inherits(Polling, EventEmitter);

  Polling.prototype._scheduleReceiver = function() {
    var self = this;
    var poll = this.poll = new this.Receiver(this.receiveUrl, this.AjaxObject);

    poll.on('message', function(msg) {
      self.emit('message', msg);
    });

    poll.once('close', function(code, reason) {
      self.poll = poll = null;

      if (!self.pollIsClosing) {
        if (reason === 'network') {
          self._scheduleReceiver();
        } else {
          self.emit('close', code || 1006, reason);
          self.removeAllListeners();
        }
      }
    });
  };

  Polling.prototype.abort = function() {
    this.removeAllListeners();
    this.pollIsClosing = true;
    if (this.poll) {
      this.poll.abort();
    }
  };

  module.exports = Polling;

  }).call(this);}).call(this,{ env: {} });

  },{"debug":55,"events":3,"inherits":57}],28:[function(require,module,exports){
  (function (process){(function (){

  var inherits = require('inherits')
    , urlUtils = require('../../utils/url')
    , BufferedSender = require('./buffered-sender')
    , Polling = require('./polling')
    ;

  function SenderReceiver(transUrl, urlSuffix, senderFunc, Receiver, AjaxObject) {
    var pollUrl = urlUtils.addPath(transUrl, urlSuffix);
    var self = this;
    BufferedSender.call(this, transUrl, senderFunc);

    this.poll = new Polling(Receiver, pollUrl, AjaxObject);
    this.poll.on('message', function(msg) {
      self.emit('message', msg);
    });
    this.poll.once('close', function(code, reason) {
      self.poll = null;
      self.emit('close', code, reason);
      self.close();
    });
  }

  inherits(SenderReceiver, BufferedSender);

  SenderReceiver.prototype.close = function() {
    BufferedSender.prototype.close.call(this);
    this.removeAllListeners();
    if (this.poll) {
      this.poll.abort();
      this.poll = null;
    }
  };

  module.exports = SenderReceiver;

  }).call(this);}).call(this,{ env: {} });

  },{"../../utils/url":52,"./buffered-sender":25,"./polling":27,"debug":55,"inherits":57}],29:[function(require,module,exports){
  (function (process){(function (){

  var inherits = require('inherits')
    , EventEmitter = require('events').EventEmitter
    , EventSourceDriver = require('eventsource')
    ;

  function EventSourceReceiver(url) {
    EventEmitter.call(this);

    var self = this;
    var es = this.es = new EventSourceDriver(url);
    es.onmessage = function(e) {
      self.emit('message', decodeURI(e.data));
    };
    es.onerror = function(e) {
      // ES on reconnection has readyState = 0 or 1.
      // on network error it's CLOSED = 2
      var reason = (es.readyState !== 2 ? 'network' : 'permanent');
      self._cleanup();
      self._close(reason);
    };
  }

  inherits(EventSourceReceiver, EventEmitter);

  EventSourceReceiver.prototype.abort = function() {
    this._cleanup();
    this._close('user');
  };

  EventSourceReceiver.prototype._cleanup = function() {
    var es = this.es;
    if (es) {
      es.onmessage = es.onerror = null;
      es.close();
      this.es = null;
    }
  };

  EventSourceReceiver.prototype._close = function(reason) {
    var self = this;
    // Safari and chrome < 15 crash if we close window before
    // waiting for ES cleanup. See:
    // https://code.google.com/p/chromium/issues/detail?id=89155
    setTimeout(function() {
      self.emit('close', null, reason);
      self.removeAllListeners();
    }, 200);
  };

  module.exports = EventSourceReceiver;

  }).call(this);}).call(this,{ env: {} });

  },{"debug":55,"events":3,"eventsource":18,"inherits":57}],30:[function(require,module,exports){
  (function (process,global){(function (){

  var inherits = require('inherits')
    , iframeUtils = require('../../utils/iframe')
    , urlUtils = require('../../utils/url')
    , EventEmitter = require('events').EventEmitter
    , random = require('../../utils/random')
    ;

  function HtmlfileReceiver(url) {
    EventEmitter.call(this);
    var self = this;
    iframeUtils.polluteGlobalNamespace();

    this.id = 'a' + random.string(6);
    url = urlUtils.addQuery(url, 'c=' + decodeURIComponent(iframeUtils.WPrefix + '.' + this.id));
    var constructFunc = HtmlfileReceiver.htmlfileEnabled ?
        iframeUtils.createHtmlfile : iframeUtils.createIframe;

    global[iframeUtils.WPrefix][this.id] = {
      start: function() {
        self.iframeObj.loaded();
      }
    , message: function(data) {
        self.emit('message', data);
      }
    , stop: function() {
        self._cleanup();
        self._close('network');
      }
    };
    this.iframeObj = constructFunc(url, function() {
      self._cleanup();
      self._close('permanent');
    });
  }

  inherits(HtmlfileReceiver, EventEmitter);

  HtmlfileReceiver.prototype.abort = function() {
    this._cleanup();
    this._close('user');
  };

  HtmlfileReceiver.prototype._cleanup = function() {
    if (this.iframeObj) {
      this.iframeObj.cleanup();
      this.iframeObj = null;
    }
    delete global[iframeUtils.WPrefix][this.id];
  };

  HtmlfileReceiver.prototype._close = function(reason) {
    this.emit('close', null, reason);
    this.removeAllListeners();
  };

  HtmlfileReceiver.htmlfileEnabled = false;

  // obfuscate to avoid firewalls
  var axo = ['Active'].concat('Object').join('X');
  if (axo in global) {
    try {
      HtmlfileReceiver.htmlfileEnabled = !!new global[axo]('htmlfile');
    } catch (x) {
      // intentionally empty
    }
  }

  HtmlfileReceiver.enabled = HtmlfileReceiver.htmlfileEnabled || iframeUtils.iframeEnabled;

  module.exports = HtmlfileReceiver;

  }).call(this);}).call(this,{ env: {} },typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});

  },{"../../utils/iframe":47,"../../utils/random":50,"../../utils/url":52,"debug":55,"events":3,"inherits":57}],31:[function(require,module,exports){
  (function (process,global){(function (){

  var utils = require('../../utils/iframe')
    , random = require('../../utils/random')
    , browser = require('../../utils/browser')
    , urlUtils = require('../../utils/url')
    , inherits = require('inherits')
    , EventEmitter = require('events').EventEmitter
    ;

  function JsonpReceiver(url) {
    var self = this;
    EventEmitter.call(this);

    utils.polluteGlobalNamespace();

    this.id = 'a' + random.string(6);
    var urlWithId = urlUtils.addQuery(url, 'c=' + encodeURIComponent(utils.WPrefix + '.' + this.id));

    global[utils.WPrefix][this.id] = this._callback.bind(this);
    this._createScript(urlWithId);

    // Fallback mostly for Konqueror - stupid timer, 35 seconds shall be plenty.
    this.timeoutId = setTimeout(function() {
      self._abort(new Error('JSONP script loaded abnormally (timeout)'));
    }, JsonpReceiver.timeout);
  }

  inherits(JsonpReceiver, EventEmitter);

  JsonpReceiver.prototype.abort = function() {
    if (global[utils.WPrefix][this.id]) {
      var err = new Error('JSONP user aborted read');
      err.code = 1000;
      this._abort(err);
    }
  };

  JsonpReceiver.timeout = 35000;
  JsonpReceiver.scriptErrorTimeout = 1000;

  JsonpReceiver.prototype._callback = function(data) {
    this._cleanup();

    if (this.aborting) {
      return;
    }

    if (data) {
      this.emit('message', data);
    }
    this.emit('close', null, 'network');
    this.removeAllListeners();
  };

  JsonpReceiver.prototype._abort = function(err) {
    this._cleanup();
    this.aborting = true;
    this.emit('close', err.code, err.message);
    this.removeAllListeners();
  };

  JsonpReceiver.prototype._cleanup = function() {
    clearTimeout(this.timeoutId);
    if (this.script2) {
      this.script2.parentNode.removeChild(this.script2);
      this.script2 = null;
    }
    if (this.script) {
      var script = this.script;
      // Unfortunately, you can't really abort script loading of
      // the script.
      script.parentNode.removeChild(script);
      script.onreadystatechange = script.onerror =
          script.onload = script.onclick = null;
      this.script = null;
    }
    delete global[utils.WPrefix][this.id];
  };

  JsonpReceiver.prototype._scriptError = function() {
    var self = this;
    if (this.errorTimer) {
      return;
    }

    this.errorTimer = setTimeout(function() {
      if (!self.loadedOkay) {
        self._abort(new Error('JSONP script loaded abnormally (onerror)'));
      }
    }, JsonpReceiver.scriptErrorTimeout);
  };

  JsonpReceiver.prototype._createScript = function(url) {
    var self = this;
    var script = this.script = global.document.createElement('script');
    var script2;  // Opera synchronous load trick.

    script.id = 'a' + random.string(8);
    script.src = url;
    script.type = 'text/javascript';
    script.charset = 'UTF-8';
    script.onerror = this._scriptError.bind(this);
    script.onload = function() {
      self._abort(new Error('JSONP script loaded abnormally (onload)'));
    };

    // IE9 fires 'error' event after onreadystatechange or before, in random order.
    // Use loadedOkay to determine if actually errored
    script.onreadystatechange = function() {
      if (/loaded|closed/.test(script.readyState)) {
        if (script && script.htmlFor && script.onclick) {
          self.loadedOkay = true;
          try {
            // In IE, actually execute the script.
            script.onclick();
          } catch (x) {
            // intentionally empty
          }
        }
        if (script) {
          self._abort(new Error('JSONP script loaded abnormally (onreadystatechange)'));
        }
      }
    };
    // IE: event/htmlFor/onclick trick.
    // One can't rely on proper order for onreadystatechange. In order to
    // make sure, set a 'htmlFor' and 'event' properties, so that
    // script code will be installed as 'onclick' handler for the
    // script object. Later, onreadystatechange, manually execute this
    // code. FF and Chrome doesn't work with 'event' and 'htmlFor'
    // set. For reference see:
    //   http://jaubourg.net/2010/07/loading-script-as-onclick-handler-of.html
    // Also, read on that about script ordering:
    //   http://wiki.whatwg.org/wiki/Dynamic_Script_Execution_Order
    if (typeof script.async === 'undefined' && global.document.attachEvent) {
      // According to mozilla docs, in recent browsers script.async defaults
      // to 'true', so we may use it to detect a good browser:
      // https://developer.mozilla.org/en/HTML/Element/script
      if (!browser.isOpera()) {
        // Naively assume we're in IE
        try {
          script.htmlFor = script.id;
          script.event = 'onclick';
        } catch (x) {
          // intentionally empty
        }
        script.async = true;
      } else {
        // Opera, second sync script hack
        script2 = this.script2 = global.document.createElement('script');
        script2.text = "try{var a = document.getElementById('" + script.id + "'); if(a)a.onerror();}catch(x){};";
        script.async = script2.async = false;
      }
    }
    if (typeof script.async !== 'undefined') {
      script.async = true;
    }

    var head = global.document.getElementsByTagName('head')[0];
    head.insertBefore(script, head.firstChild);
    if (script2) {
      head.insertBefore(script2, head.firstChild);
    }
  };

  module.exports = JsonpReceiver;

  }).call(this);}).call(this,{ env: {} },typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});

  },{"../../utils/browser":44,"../../utils/iframe":47,"../../utils/random":50,"../../utils/url":52,"debug":55,"events":3,"inherits":57}],32:[function(require,module,exports){
  (function (process){(function (){

  var inherits = require('inherits')
    , EventEmitter = require('events').EventEmitter
    ;

  function XhrReceiver(url, AjaxObject) {
    EventEmitter.call(this);
    var self = this;

    this.bufferPosition = 0;

    this.xo = new AjaxObject('POST', url, null);
    this.xo.on('chunk', this._chunkHandler.bind(this));
    this.xo.once('finish', function(status, text) {
      self._chunkHandler(status, text);
      self.xo = null;
      var reason = status === 200 ? 'network' : 'permanent';
      self.emit('close', null, reason);
      self._cleanup();
    });
  }

  inherits(XhrReceiver, EventEmitter);

  XhrReceiver.prototype._chunkHandler = function(status, text) {
    if (status !== 200 || !text) {
      return;
    }

    for (var idx = -1; ; this.bufferPosition += idx + 1) {
      var buf = text.slice(this.bufferPosition);
      idx = buf.indexOf('\n');
      if (idx === -1) {
        break;
      }
      var msg = buf.slice(0, idx);
      if (msg) {
        this.emit('message', msg);
      }
    }
  };

  XhrReceiver.prototype._cleanup = function() {
    this.removeAllListeners();
  };

  XhrReceiver.prototype.abort = function() {
    if (this.xo) {
      this.xo.close();
      this.emit('close', null, 'user');
      this.xo = null;
    }
    this._cleanup();
  };

  module.exports = XhrReceiver;

  }).call(this);}).call(this,{ env: {} });

  },{"debug":55,"events":3,"inherits":57}],33:[function(require,module,exports){
  (function (process,global){(function (){

  var random = require('../../utils/random')
    , urlUtils = require('../../utils/url')
    ;

  var form, area;

  function createIframe(id) {
    try {
      // ie6 dynamic iframes with target="" support (thanks Chris Lambacher)
      return global.document.createElement('<iframe name="' + id + '">');
    } catch (x) {
      var iframe = global.document.createElement('iframe');
      iframe.name = id;
      return iframe;
    }
  }

  function createForm() {
    form = global.document.createElement('form');
    form.style.display = 'none';
    form.style.position = 'absolute';
    form.method = 'POST';
    form.enctype = 'application/x-www-form-urlencoded';
    form.acceptCharset = 'UTF-8';

    area = global.document.createElement('textarea');
    area.name = 'd';
    form.appendChild(area);

    global.document.body.appendChild(form);
  }

  module.exports = function(url, payload, callback) {
    if (!form) {
      createForm();
    }
    var id = 'a' + random.string(8);
    form.target = id;
    form.action = urlUtils.addQuery(urlUtils.addPath(url, '/jsonp_send'), 'i=' + id);

    var iframe = createIframe(id);
    iframe.id = id;
    iframe.style.display = 'none';
    form.appendChild(iframe);

    try {
      area.value = payload;
    } catch (e) {
      // seriously broken browsers get here
    }
    form.submit();

    var completed = function(err) {
      if (!iframe.onerror) {
        return;
      }
      iframe.onreadystatechange = iframe.onerror = iframe.onload = null;
      // Opera mini doesn't like if we GC iframe
      // immediately, thus this timeout.
      setTimeout(function() {
        iframe.parentNode.removeChild(iframe);
        iframe = null;
      }, 500);
      area.value = '';
      // It is not possible to detect if the iframe succeeded or
      // failed to submit our form.
      callback(err);
    };
    iframe.onerror = function() {
      completed();
    };
    iframe.onload = function() {
      completed();
    };
    iframe.onreadystatechange = function(e) {
      if (iframe.readyState === 'complete') {
        completed();
      }
    };
    return function() {
      completed(new Error('Aborted'));
    };
  };

  }).call(this);}).call(this,{ env: {} },typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});

  },{"../../utils/random":50,"../../utils/url":52,"debug":55}],34:[function(require,module,exports){
  (function (process,global){(function (){

  var EventEmitter = require('events').EventEmitter
    , inherits = require('inherits')
    , eventUtils = require('../../utils/event')
    , browser = require('../../utils/browser')
    , urlUtils = require('../../utils/url')
    ;

  // References:
  //   http://ajaxian.com/archives/100-line-ajax-wrapper
  //   http://msdn.microsoft.com/en-us/library/cc288060(v=VS.85).aspx

  function XDRObject(method, url, payload) {
    var self = this;
    EventEmitter.call(this);

    setTimeout(function() {
      self._start(method, url, payload);
    }, 0);
  }

  inherits(XDRObject, EventEmitter);

  XDRObject.prototype._start = function(method, url, payload) {
    var self = this;
    var xdr = new global.XDomainRequest();
    // IE caches even POSTs
    url = urlUtils.addQuery(url, 't=' + (+new Date()));

    xdr.onerror = function() {
      self._error();
    };
    xdr.ontimeout = function() {
      self._error();
    };
    xdr.onprogress = function() {
      self.emit('chunk', 200, xdr.responseText);
    };
    xdr.onload = function() {
      self.emit('finish', 200, xdr.responseText);
      self._cleanup(false);
    };
    this.xdr = xdr;
    this.unloadRef = eventUtils.unloadAdd(function() {
      self._cleanup(true);
    });
    try {
      // Fails with AccessDenied if port number is bogus
      this.xdr.open(method, url);
      if (this.timeout) {
        this.xdr.timeout = this.timeout;
      }
      this.xdr.send(payload);
    } catch (x) {
      this._error();
    }
  };

  XDRObject.prototype._error = function() {
    this.emit('finish', 0, '');
    this._cleanup(false);
  };

  XDRObject.prototype._cleanup = function(abort) {
    if (!this.xdr) {
      return;
    }
    this.removeAllListeners();
    eventUtils.unloadDel(this.unloadRef);

    this.xdr.ontimeout = this.xdr.onerror = this.xdr.onprogress = this.xdr.onload = null;
    if (abort) {
      try {
        this.xdr.abort();
      } catch (x) {
        // intentionally empty
      }
    }
    this.unloadRef = this.xdr = null;
  };

  XDRObject.prototype.close = function() {
    this._cleanup(true);
  };

  // IE 8/9 if the request target uses the same scheme - #79
  XDRObject.enabled = !!(global.XDomainRequest && browser.hasDomain());

  module.exports = XDRObject;

  }).call(this);}).call(this,{ env: {} },typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});

  },{"../../utils/browser":44,"../../utils/event":46,"../../utils/url":52,"debug":55,"events":3,"inherits":57}],35:[function(require,module,exports){

  var inherits = require('inherits')
    , XhrDriver = require('../driver/xhr')
    ;

  function XHRCorsObject(method, url, payload, opts) {
    XhrDriver.call(this, method, url, payload, opts);
  }

  inherits(XHRCorsObject, XhrDriver);

  XHRCorsObject.enabled = XhrDriver.enabled && XhrDriver.supportsCORS;

  module.exports = XHRCorsObject;

  },{"../driver/xhr":17,"inherits":57}],36:[function(require,module,exports){

  var EventEmitter = require('events').EventEmitter
    , inherits = require('inherits')
    ;

  function XHRFake(/* method, url, payload, opts */) {
    var self = this;
    EventEmitter.call(this);

    this.to = setTimeout(function() {
      self.emit('finish', 200, '{}');
    }, XHRFake.timeout);
  }

  inherits(XHRFake, EventEmitter);

  XHRFake.prototype.close = function() {
    clearTimeout(this.to);
  };

  XHRFake.timeout = 2000;

  module.exports = XHRFake;

  },{"events":3,"inherits":57}],37:[function(require,module,exports){

  var inherits = require('inherits')
    , XhrDriver = require('../driver/xhr')
    ;

  function XHRLocalObject(method, url, payload /*, opts */) {
    XhrDriver.call(this, method, url, payload, {
      noCredentials: true
    });
  }

  inherits(XHRLocalObject, XhrDriver);

  XHRLocalObject.enabled = XhrDriver.enabled;

  module.exports = XHRLocalObject;

  },{"../driver/xhr":17,"inherits":57}],38:[function(require,module,exports){
  (function (process){(function (){

  var utils = require('../utils/event')
    , urlUtils = require('../utils/url')
    , inherits = require('inherits')
    , EventEmitter = require('events').EventEmitter
    , WebsocketDriver = require('./driver/websocket')
    ;

  function WebSocketTransport(transUrl, ignore, options) {
    if (!WebSocketTransport.enabled()) {
      throw new Error('Transport created when disabled');
    }

    EventEmitter.call(this);

    var self = this;
    var url = urlUtils.addPath(transUrl, '/websocket');
    if (url.slice(0, 5) === 'https') {
      url = 'wss' + url.slice(5);
    } else {
      url = 'ws' + url.slice(4);
    }
    this.url = url;

    this.ws = new WebsocketDriver(this.url, [], options);
    this.ws.onmessage = function(e) {
      self.emit('message', e.data);
    };
    // Firefox has an interesting bug. If a websocket connection is
    // created after onunload, it stays alive even when user
    // navigates away from the page. In such situation let's lie -
    // let's not open the ws connection at all. See:
    // https://github.com/sockjs/sockjs-client/issues/28
    // https://bugzilla.mozilla.org/show_bug.cgi?id=696085
    this.unloadRef = utils.unloadAdd(function() {
      self.ws.close();
    });
    this.ws.onclose = function(e) {
      self.emit('close', e.code, e.reason);
      self._cleanup();
    };
    this.ws.onerror = function(e) {
      self.emit('close', 1006, 'WebSocket connection broken');
      self._cleanup();
    };
  }

  inherits(WebSocketTransport, EventEmitter);

  WebSocketTransport.prototype.send = function(data) {
    var msg = '[' + data + ']';
    this.ws.send(msg);
  };

  WebSocketTransport.prototype.close = function() {
    var ws = this.ws;
    this._cleanup();
    if (ws) {
      ws.close();
    }
  };

  WebSocketTransport.prototype._cleanup = function() {
    var ws = this.ws;
    if (ws) {
      ws.onmessage = ws.onclose = ws.onerror = null;
    }
    utils.unloadDel(this.unloadRef);
    this.unloadRef = this.ws = null;
    this.removeAllListeners();
  };

  WebSocketTransport.enabled = function() {
    return !!WebsocketDriver;
  };
  WebSocketTransport.transportName = 'websocket';

  // In theory, ws should require 1 round trip. But in chrome, this is
  // not very stable over SSL. Most likely a ws connection requires a
  // separate SSL connection, in which case 2 round trips are an
  // absolute minumum.
  WebSocketTransport.roundTrips = 2;

  module.exports = WebSocketTransport;

  }).call(this);}).call(this,{ env: {} });

  },{"../utils/event":46,"../utils/url":52,"./driver/websocket":19,"debug":55,"events":3,"inherits":57}],39:[function(require,module,exports){

  var inherits = require('inherits')
    , AjaxBasedTransport = require('./lib/ajax-based')
    , XdrStreamingTransport = require('./xdr-streaming')
    , XhrReceiver = require('./receiver/xhr')
    , XDRObject = require('./sender/xdr')
    ;

  function XdrPollingTransport(transUrl) {
    if (!XDRObject.enabled) {
      throw new Error('Transport created when disabled');
    }
    AjaxBasedTransport.call(this, transUrl, '/xhr', XhrReceiver, XDRObject);
  }

  inherits(XdrPollingTransport, AjaxBasedTransport);

  XdrPollingTransport.enabled = XdrStreamingTransport.enabled;
  XdrPollingTransport.transportName = 'xdr-polling';
  XdrPollingTransport.roundTrips = 2; // preflight, ajax

  module.exports = XdrPollingTransport;

  },{"./lib/ajax-based":24,"./receiver/xhr":32,"./sender/xdr":34,"./xdr-streaming":40,"inherits":57}],40:[function(require,module,exports){

  var inherits = require('inherits')
    , AjaxBasedTransport = require('./lib/ajax-based')
    , XhrReceiver = require('./receiver/xhr')
    , XDRObject = require('./sender/xdr')
    ;

  // According to:
  //   http://stackoverflow.com/questions/1641507/detect-browser-support-for-cross-domain-xmlhttprequests
  //   http://hacks.mozilla.org/2009/07/cross-site-xmlhttprequest-with-cors/

  function XdrStreamingTransport(transUrl) {
    if (!XDRObject.enabled) {
      throw new Error('Transport created when disabled');
    }
    AjaxBasedTransport.call(this, transUrl, '/xhr_streaming', XhrReceiver, XDRObject);
  }

  inherits(XdrStreamingTransport, AjaxBasedTransport);

  XdrStreamingTransport.enabled = function(info) {
    if (info.cookie_needed || info.nullOrigin) {
      return false;
    }
    return XDRObject.enabled && info.sameScheme;
  };

  XdrStreamingTransport.transportName = 'xdr-streaming';
  XdrStreamingTransport.roundTrips = 2; // preflight, ajax

  module.exports = XdrStreamingTransport;

  },{"./lib/ajax-based":24,"./receiver/xhr":32,"./sender/xdr":34,"inherits":57}],41:[function(require,module,exports){

  var inherits = require('inherits')
    , AjaxBasedTransport = require('./lib/ajax-based')
    , XhrReceiver = require('./receiver/xhr')
    , XHRCorsObject = require('./sender/xhr-cors')
    , XHRLocalObject = require('./sender/xhr-local')
    ;

  function XhrPollingTransport(transUrl) {
    if (!XHRLocalObject.enabled && !XHRCorsObject.enabled) {
      throw new Error('Transport created when disabled');
    }
    AjaxBasedTransport.call(this, transUrl, '/xhr', XhrReceiver, XHRCorsObject);
  }

  inherits(XhrPollingTransport, AjaxBasedTransport);

  XhrPollingTransport.enabled = function(info) {
    if (info.nullOrigin) {
      return false;
    }

    if (XHRLocalObject.enabled && info.sameOrigin) {
      return true;
    }
    return XHRCorsObject.enabled;
  };

  XhrPollingTransport.transportName = 'xhr-polling';
  XhrPollingTransport.roundTrips = 2; // preflight, ajax

  module.exports = XhrPollingTransport;

  },{"./lib/ajax-based":24,"./receiver/xhr":32,"./sender/xhr-cors":35,"./sender/xhr-local":37,"inherits":57}],42:[function(require,module,exports){
  (function (global){(function (){

  var inherits = require('inherits')
    , AjaxBasedTransport = require('./lib/ajax-based')
    , XhrReceiver = require('./receiver/xhr')
    , XHRCorsObject = require('./sender/xhr-cors')
    , XHRLocalObject = require('./sender/xhr-local')
    , browser = require('../utils/browser')
    ;

  function XhrStreamingTransport(transUrl) {
    if (!XHRLocalObject.enabled && !XHRCorsObject.enabled) {
      throw new Error('Transport created when disabled');
    }
    AjaxBasedTransport.call(this, transUrl, '/xhr_streaming', XhrReceiver, XHRCorsObject);
  }

  inherits(XhrStreamingTransport, AjaxBasedTransport);

  XhrStreamingTransport.enabled = function(info) {
    if (info.nullOrigin) {
      return false;
    }
    // Opera doesn't support xhr-streaming #60
    // But it might be able to #92
    if (browser.isOpera()) {
      return false;
    }

    return XHRCorsObject.enabled;
  };

  XhrStreamingTransport.transportName = 'xhr-streaming';
  XhrStreamingTransport.roundTrips = 2; // preflight, ajax

  // Safari gets confused when a streaming ajax request is started
  // before onload. This causes the load indicator to spin indefinetely.
  // Only require body when used in a browser
  XhrStreamingTransport.needBody = !!global.document;

  module.exports = XhrStreamingTransport;

  }).call(this);}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});

  },{"../utils/browser":44,"./lib/ajax-based":24,"./receiver/xhr":32,"./sender/xhr-cors":35,"./sender/xhr-local":37,"inherits":57}],43:[function(require,module,exports){
  (function (global){(function (){

  if (global.crypto && global.crypto.getRandomValues) {
    module.exports.randomBytes = function(length) {
      var bytes = new Uint8Array(length);
      global.crypto.getRandomValues(bytes);
      return bytes;
    };
  } else {
    module.exports.randomBytes = function(length) {
      var bytes = new Array(length);
      for (var i = 0; i < length; i++) {
        bytes[i] = Math.floor(Math.random() * 256);
      }
      return bytes;
    };
  }

  }).call(this);}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});

  },{}],44:[function(require,module,exports){
  (function (global){(function (){

  module.exports = {
    isOpera: function() {
      return global.navigator &&
        /opera/i.test(global.navigator.userAgent);
    }

  , isKonqueror: function() {
      return global.navigator &&
        /konqueror/i.test(global.navigator.userAgent);
    }

    // #187 wrap document.domain in try/catch because of WP8 from file:///
  , hasDomain: function () {
      // non-browser client always has a domain
      if (!global.document) {
        return true;
      }

      try {
        return !!global.document.domain;
      } catch (e) {
        return false;
      }
    }
  };

  }).call(this);}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});

  },{}],45:[function(require,module,exports){

  // Some extra characters that Chrome gets wrong, and substitutes with
  // something else on the wire.
  // eslint-disable-next-line no-control-regex, no-misleading-character-class
  var extraEscapable = /[\x00-\x1f\ud800-\udfff\ufffe\uffff\u0300-\u0333\u033d-\u0346\u034a-\u034c\u0350-\u0352\u0357-\u0358\u035c-\u0362\u0374\u037e\u0387\u0591-\u05af\u05c4\u0610-\u0617\u0653-\u0654\u0657-\u065b\u065d-\u065e\u06df-\u06e2\u06eb-\u06ec\u0730\u0732-\u0733\u0735-\u0736\u073a\u073d\u073f-\u0741\u0743\u0745\u0747\u07eb-\u07f1\u0951\u0958-\u095f\u09dc-\u09dd\u09df\u0a33\u0a36\u0a59-\u0a5b\u0a5e\u0b5c-\u0b5d\u0e38-\u0e39\u0f43\u0f4d\u0f52\u0f57\u0f5c\u0f69\u0f72-\u0f76\u0f78\u0f80-\u0f83\u0f93\u0f9d\u0fa2\u0fa7\u0fac\u0fb9\u1939-\u193a\u1a17\u1b6b\u1cda-\u1cdb\u1dc0-\u1dcf\u1dfc\u1dfe\u1f71\u1f73\u1f75\u1f77\u1f79\u1f7b\u1f7d\u1fbb\u1fbe\u1fc9\u1fcb\u1fd3\u1fdb\u1fe3\u1feb\u1fee-\u1fef\u1ff9\u1ffb\u1ffd\u2000-\u2001\u20d0-\u20d1\u20d4-\u20d7\u20e7-\u20e9\u2126\u212a-\u212b\u2329-\u232a\u2adc\u302b-\u302c\uaab2-\uaab3\uf900-\ufa0d\ufa10\ufa12\ufa15-\ufa1e\ufa20\ufa22\ufa25-\ufa26\ufa2a-\ufa2d\ufa30-\ufa6d\ufa70-\ufad9\ufb1d\ufb1f\ufb2a-\ufb36\ufb38-\ufb3c\ufb3e\ufb40-\ufb41\ufb43-\ufb44\ufb46-\ufb4e\ufff0-\uffff]/g
    , extraLookup;

  // This may be quite slow, so let's delay until user actually uses bad
  // characters.
  var unrollLookup = function(escapable) {
    var i;
    var unrolled = {};
    var c = [];
    for (i = 0; i < 65536; i++) {
      c.push( String.fromCharCode(i) );
    }
    escapable.lastIndex = 0;
    c.join('').replace(escapable, function(a) {
      unrolled[ a ] = '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
      return '';
    });
    escapable.lastIndex = 0;
    return unrolled;
  };

  // Quote string, also taking care of unicode characters that browsers
  // often break. Especially, take care of unicode surrogates:
  // http://en.wikipedia.org/wiki/Mapping_of_Unicode_characters#Surrogates
  module.exports = {
    quote: function(string) {
      var quoted = JSON.stringify(string);

      // In most cases this should be very fast and good enough.
      extraEscapable.lastIndex = 0;
      if (!extraEscapable.test(quoted)) {
        return quoted;
      }

      if (!extraLookup) {
        extraLookup = unrollLookup(extraEscapable);
      }

      return quoted.replace(extraEscapable, function(a) {
        return extraLookup[a];
      });
    }
  };

  },{}],46:[function(require,module,exports){
  (function (global){(function (){

  var random = require('./random');

  var onUnload = {}
    , afterUnload = false
      // detect google chrome packaged apps because they don't allow the 'unload' event
    , isChromePackagedApp = global.chrome && global.chrome.app && global.chrome.app.runtime
    ;

  module.exports = {
    attachEvent: function(event, listener) {
      if (typeof global.addEventListener !== 'undefined') {
        global.addEventListener(event, listener, false);
      } else if (global.document && global.attachEvent) {
        // IE quirks.
        // According to: http://stevesouders.com/misc/test-postmessage.php
        // the message gets delivered only to 'document', not 'window'.
        global.document.attachEvent('on' + event, listener);
        // I get 'window' for ie8.
        global.attachEvent('on' + event, listener);
      }
    }

  , detachEvent: function(event, listener) {
      if (typeof global.addEventListener !== 'undefined') {
        global.removeEventListener(event, listener, false);
      } else if (global.document && global.detachEvent) {
        global.document.detachEvent('on' + event, listener);
        global.detachEvent('on' + event, listener);
      }
    }

  , unloadAdd: function(listener) {
      if (isChromePackagedApp) {
        return null;
      }

      var ref = random.string(8);
      onUnload[ref] = listener;
      if (afterUnload) {
        setTimeout(this.triggerUnloadCallbacks, 0);
      }
      return ref;
    }

  , unloadDel: function(ref) {
      if (ref in onUnload) {
        delete onUnload[ref];
      }
    }

  , triggerUnloadCallbacks: function() {
      for (var ref in onUnload) {
        onUnload[ref]();
        delete onUnload[ref];
      }
    }
  };

  var unloadTriggered = function() {
    if (afterUnload) {
      return;
    }
    afterUnload = true;
    module.exports.triggerUnloadCallbacks();
  };

  // 'unload' alone is not reliable in opera within an iframe, but we
  // can't use `beforeunload` as IE fires it on javascript: links.
  if (!isChromePackagedApp) {
    module.exports.attachEvent('unload', unloadTriggered);
  }

  }).call(this);}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});

  },{"./random":50}],47:[function(require,module,exports){
  (function (process,global){(function (){

  var eventUtils = require('./event')
    , browser = require('./browser')
    ;

  module.exports = {
    WPrefix: '_jp'
  , currentWindowId: null

  , polluteGlobalNamespace: function() {
      if (!(module.exports.WPrefix in global)) {
        global[module.exports.WPrefix] = {};
      }
    }

  , postMessage: function(type, data) {
      if (global.parent !== global) {
        global.parent.postMessage(JSON.stringify({
          windowId: module.exports.currentWindowId
        , type: type
        , data: data || ''
        }), '*');
      }
    }

  , createIframe: function(iframeUrl, errorCallback) {
      var iframe = global.document.createElement('iframe');
      var tref, unloadRef;
      var unattach = function() {
        clearTimeout(tref);
        // Explorer had problems with that.
        try {
          iframe.onload = null;
        } catch (x) {
          // intentionally empty
        }
        iframe.onerror = null;
      };
      var cleanup = function() {
        if (iframe) {
          unattach();
          // This timeout makes chrome fire onbeforeunload event
          // within iframe. Without the timeout it goes straight to
          // onunload.
          setTimeout(function() {
            if (iframe) {
              iframe.parentNode.removeChild(iframe);
            }
            iframe = null;
          }, 0);
          eventUtils.unloadDel(unloadRef);
        }
      };
      var onerror = function(err) {
        if (iframe) {
          cleanup();
          errorCallback(err);
        }
      };
      var post = function(msg, origin) {
        setTimeout(function() {
          try {
            // When the iframe is not loaded, IE raises an exception
            // on 'contentWindow'.
            if (iframe && iframe.contentWindow) {
              iframe.contentWindow.postMessage(msg, origin);
            }
          } catch (x) {
            // intentionally empty
          }
        }, 0);
      };

      iframe.src = iframeUrl;
      iframe.style.display = 'none';
      iframe.style.position = 'absolute';
      iframe.onerror = function() {
        onerror('onerror');
      };
      iframe.onload = function() {
        // `onload` is triggered before scripts on the iframe are
        // executed. Give it few seconds to actually load stuff.
        clearTimeout(tref);
        tref = setTimeout(function() {
          onerror('onload timeout');
        }, 2000);
      };
      global.document.body.appendChild(iframe);
      tref = setTimeout(function() {
        onerror('timeout');
      }, 15000);
      unloadRef = eventUtils.unloadAdd(cleanup);
      return {
        post: post
      , cleanup: cleanup
      , loaded: unattach
      };
    }

  /* eslint no-undef: "off", new-cap: "off" */
  , createHtmlfile: function(iframeUrl, errorCallback) {
      var axo = ['Active'].concat('Object').join('X');
      var doc = new global[axo]('htmlfile');
      var tref, unloadRef;
      var iframe;
      var unattach = function() {
        clearTimeout(tref);
        iframe.onerror = null;
      };
      var cleanup = function() {
        if (doc) {
          unattach();
          eventUtils.unloadDel(unloadRef);
          iframe.parentNode.removeChild(iframe);
          iframe = doc = null;
          CollectGarbage();
        }
      };
      var onerror = function(r) {
        if (doc) {
          cleanup();
          errorCallback(r);
        }
      };
      var post = function(msg, origin) {
        try {
          // When the iframe is not loaded, IE raises an exception
          // on 'contentWindow'.
          setTimeout(function() {
            if (iframe && iframe.contentWindow) {
                iframe.contentWindow.postMessage(msg, origin);
            }
          }, 0);
        } catch (x) {
          // intentionally empty
        }
      };

      doc.open();
      doc.write('<html><s' + 'cript>' +
                'document.domain="' + global.document.domain + '";' +
                '</s' + 'cript></html>');
      doc.close();
      doc.parentWindow[module.exports.WPrefix] = global[module.exports.WPrefix];
      var c = doc.createElement('div');
      doc.body.appendChild(c);
      iframe = doc.createElement('iframe');
      c.appendChild(iframe);
      iframe.src = iframeUrl;
      iframe.onerror = function() {
        onerror('onerror');
      };
      tref = setTimeout(function() {
        onerror('timeout');
      }, 15000);
      unloadRef = eventUtils.unloadAdd(cleanup);
      return {
        post: post
      , cleanup: cleanup
      , loaded: unattach
      };
    }
  };

  module.exports.iframeEnabled = false;
  if (global.document) {
    // postMessage misbehaves in konqueror 4.6.5 - the messages are delivered with
    // huge delay, or not at all.
    module.exports.iframeEnabled = (typeof global.postMessage === 'function' ||
      typeof global.postMessage === 'object') && (!browser.isKonqueror());
  }

  }).call(this);}).call(this,{ env: {} },typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});

  },{"./browser":44,"./event":46,"debug":55}],48:[function(require,module,exports){
  (function (global){(function (){

  var logObject = {};
  ['log', 'debug', 'warn'].forEach(function (level) {
    var levelExists;

    try {
      levelExists = global.console && global.console[level] && global.console[level].apply;
    } catch(e) {
      // do nothing
    }

    logObject[level] = levelExists ? function () {
      return global.console[level].apply(global.console, arguments);
    } : (level === 'log' ? function () {} : logObject.log);
  });

  module.exports = logObject;

  }).call(this);}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});

  },{}],49:[function(require,module,exports){

  module.exports = {
    isObject: function(obj) {
      var type = typeof obj;
      return type === 'function' || type === 'object' && !!obj;
    }

  , extend: function(obj) {
      if (!this.isObject(obj)) {
        return obj;
      }
      var source, prop;
      for (var i = 1, length = arguments.length; i < length; i++) {
        source = arguments[i];
        for (prop in source) {
          if (Object.prototype.hasOwnProperty.call(source, prop)) {
            obj[prop] = source[prop];
          }
        }
      }
      return obj;
    }
  };

  },{}],50:[function(require,module,exports){

  var crypto = require('crypto');

  // This string has length 32, a power of 2, so the modulus doesn't introduce a
  // bias.
  var _randomStringChars = 'abcdefghijklmnopqrstuvwxyz012345';
  module.exports = {
    string: function(length) {
      var max = _randomStringChars.length;
      var bytes = crypto.randomBytes(length);
      var ret = [];
      for (var i = 0; i < length; i++) {
        ret.push(_randomStringChars.substr(bytes[i] % max, 1));
      }
      return ret.join('');
    }

  , number: function(max) {
      return Math.floor(Math.random() * max);
    }

  , numberString: function(max) {
      var t = ('' + (max - 1)).length;
      var p = new Array(t + 1).join('0');
      return (p + this.number(max)).slice(-t);
    }
  };

  },{"crypto":43}],51:[function(require,module,exports){
  (function (process){(function (){

  module.exports = function(availableTransports) {
    return {
      filterToEnabled: function(transportsWhitelist, info) {
        var transports = {
          main: []
        , facade: []
        };
        if (!transportsWhitelist) {
          transportsWhitelist = [];
        } else if (typeof transportsWhitelist === 'string') {
          transportsWhitelist = [transportsWhitelist];
        }

        availableTransports.forEach(function(trans) {
          if (!trans) {
            return;
          }

          if (trans.transportName === 'websocket' && info.websocket === false) {
            return;
          }

          if (transportsWhitelist.length &&
              transportsWhitelist.indexOf(trans.transportName) === -1) {
            return;
          }

          if (trans.enabled(info)) {
            transports.main.push(trans);
            if (trans.facadeTransport) {
              transports.facade.push(trans.facadeTransport);
            }
          }
        });
        return transports;
      }
    };
  };

  }).call(this);}).call(this,{ env: {} });

  },{"debug":55}],52:[function(require,module,exports){
  (function (process){(function (){

  var URL = require('url-parse');

  module.exports = {
    getOrigin: function(url) {
      if (!url) {
        return null;
      }

      var p = new URL(url);
      if (p.protocol === 'file:') {
        return null;
      }

      var port = p.port;
      if (!port) {
        port = (p.protocol === 'https:') ? '443' : '80';
      }

      return p.protocol + '//' + p.hostname + ':' + port;
    }

  , isOriginEqual: function(a, b) {
      var res = this.getOrigin(a) === this.getOrigin(b);
      return res;
    }

  , isSchemeEqual: function(a, b) {
      return (a.split(':')[0] === b.split(':')[0]);
    }

  , addPath: function (url, path) {
      var qs = url.split('?');
      return qs[0] + path + (qs[1] ? '?' + qs[1] : '');
    }

  , addQuery: function (url, q) {
      return url + (url.indexOf('?') === -1 ? ('?' + q) : ('&' + q));
    }

  , isLoopbackAddr: function (addr) {
      return /^127\.([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})$/i.test(addr) || /^\[::1\]$/.test(addr);
    }
  };

  }).call(this);}).call(this,{ env: {} });

  },{"debug":55,"url-parse":60}],53:[function(require,module,exports){
  module.exports = '1.6.1';

  },{}],54:[function(require,module,exports){
  /**
   * Helpers.
   */

  var s = 1000;
  var m = s * 60;
  var h = m * 60;
  var d = h * 24;
  var w = d * 7;
  var y = d * 365.25;

  /**
   * Parse or format the given `val`.
   *
   * Options:
   *
   *  - `long` verbose formatting [false]
   *
   * @param {String|Number} val
   * @param {Object} [options]
   * @throws {Error} throw an error if val is not a non-empty string or a number
   * @return {String|Number}
   * @api public
   */

  module.exports = function(val, options) {
    options = options || {};
    var type = typeof val;
    if (type === 'string' && val.length > 0) {
      return parse(val);
    } else if (type === 'number' && isFinite(val)) {
      return options.long ? fmtLong(val) : fmtShort(val);
    }
    throw new Error(
      'val is not a non-empty string or a valid number. val=' +
        JSON.stringify(val)
    );
  };

  /**
   * Parse the given `str` and return milliseconds.
   *
   * @param {String} str
   * @return {Number}
   * @api private
   */

  function parse(str) {
    str = String(str);
    if (str.length > 100) {
      return;
    }
    var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
      str
    );
    if (!match) {
      return;
    }
    var n = parseFloat(match[1]);
    var type = (match[2] || 'ms').toLowerCase();
    switch (type) {
      case 'years':
      case 'year':
      case 'yrs':
      case 'yr':
      case 'y':
        return n * y;
      case 'weeks':
      case 'week':
      case 'w':
        return n * w;
      case 'days':
      case 'day':
      case 'd':
        return n * d;
      case 'hours':
      case 'hour':
      case 'hrs':
      case 'hr':
      case 'h':
        return n * h;
      case 'minutes':
      case 'minute':
      case 'mins':
      case 'min':
      case 'm':
        return n * m;
      case 'seconds':
      case 'second':
      case 'secs':
      case 'sec':
      case 's':
        return n * s;
      case 'milliseconds':
      case 'millisecond':
      case 'msecs':
      case 'msec':
      case 'ms':
        return n;
      default:
        return undefined;
    }
  }

  /**
   * Short format for `ms`.
   *
   * @param {Number} ms
   * @return {String}
   * @api private
   */

  function fmtShort(ms) {
    var msAbs = Math.abs(ms);
    if (msAbs >= d) {
      return Math.round(ms / d) + 'd';
    }
    if (msAbs >= h) {
      return Math.round(ms / h) + 'h';
    }
    if (msAbs >= m) {
      return Math.round(ms / m) + 'm';
    }
    if (msAbs >= s) {
      return Math.round(ms / s) + 's';
    }
    return ms + 'ms';
  }

  /**
   * Long format for `ms`.
   *
   * @param {Number} ms
   * @return {String}
   * @api private
   */

  function fmtLong(ms) {
    var msAbs = Math.abs(ms);
    if (msAbs >= d) {
      return plural(ms, msAbs, d, 'day');
    }
    if (msAbs >= h) {
      return plural(ms, msAbs, h, 'hour');
    }
    if (msAbs >= m) {
      return plural(ms, msAbs, m, 'minute');
    }
    if (msAbs >= s) {
      return plural(ms, msAbs, s, 'second');
    }
    return ms + ' ms';
  }

  /**
   * Pluralization helper.
   */

  function plural(ms, msAbs, n, name) {
    var isPlural = msAbs >= n * 1.5;
    return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '');
  }

  },{}],55:[function(require,module,exports){
  (function (process){(function (){

  function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  /* eslint-env browser */

  /**
   * This is the web browser implementation of `debug()`.
   */
  exports.log = log;
  exports.formatArgs = formatArgs;
  exports.save = save;
  exports.load = load;
  exports.useColors = useColors;
  exports.storage = localstorage();
  /**
   * Colors.
   */

  exports.colors = ['#0000CC', '#0000FF', '#0033CC', '#0033FF', '#0066CC', '#0066FF', '#0099CC', '#0099FF', '#00CC00', '#00CC33', '#00CC66', '#00CC99', '#00CCCC', '#00CCFF', '#3300CC', '#3300FF', '#3333CC', '#3333FF', '#3366CC', '#3366FF', '#3399CC', '#3399FF', '#33CC00', '#33CC33', '#33CC66', '#33CC99', '#33CCCC', '#33CCFF', '#6600CC', '#6600FF', '#6633CC', '#6633FF', '#66CC00', '#66CC33', '#9900CC', '#9900FF', '#9933CC', '#9933FF', '#99CC00', '#99CC33', '#CC0000', '#CC0033', '#CC0066', '#CC0099', '#CC00CC', '#CC00FF', '#CC3300', '#CC3333', '#CC3366', '#CC3399', '#CC33CC', '#CC33FF', '#CC6600', '#CC6633', '#CC9900', '#CC9933', '#CCCC00', '#CCCC33', '#FF0000', '#FF0033', '#FF0066', '#FF0099', '#FF00CC', '#FF00FF', '#FF3300', '#FF3333', '#FF3366', '#FF3399', '#FF33CC', '#FF33FF', '#FF6600', '#FF6633', '#FF9900', '#FF9933', '#FFCC00', '#FFCC33'];
  /**
   * Currently only WebKit-based Web Inspectors, Firefox >= v31,
   * and the Firebug extension (any Firefox version) are known
   * to support "%c" CSS customizations.
   *
   * TODO: add a `localStorage` variable to explicitly enable/disable colors
   */
  // eslint-disable-next-line complexity

  function useColors() {
    // NB: In an Electron preload script, document will be defined but not fully
    // initialized. Since we know we're in Chrome, we'll just detect this case
    // explicitly
    if (typeof window !== 'undefined' && window.process && (window.process.type === 'renderer' || window.process.__nwjs)) {
      return true;
    } // Internet Explorer and Edge do not support colors.


    if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
      return false;
    } // Is webkit? http://stackoverflow.com/a/16459606/376773
    // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632


    return typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
    typeof window !== 'undefined' && window.console && (window.console.firebug || window.console.exception && window.console.table) || // Is firefox >= v31?
    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
    typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
    typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
  }
  /**
   * Colorize log arguments if enabled.
   *
   * @api public
   */


  function formatArgs(args) {
    args[0] = (this.useColors ? '%c' : '') + this.namespace + (this.useColors ? ' %c' : ' ') + args[0] + (this.useColors ? '%c ' : ' ') + '+' + module.exports.humanize(this.diff);

    if (!this.useColors) {
      return;
    }

    var c = 'color: ' + this.color;
    args.splice(1, 0, c, 'color: inherit'); // The final "%c" is somewhat tricky, because there could be other
    // arguments passed either before or after the %c, so we need to
    // figure out the correct index to insert the CSS into

    var index = 0;
    var lastC = 0;
    args[0].replace(/%[a-zA-Z%]/g, function (match) {
      if (match === '%%') {
        return;
      }

      index++;

      if (match === '%c') {
        // We only are interested in the *last* %c
        // (the user may have provided their own)
        lastC = index;
      }
    });
    args.splice(lastC, 0, c);
  }
  /**
   * Invokes `console.log()` when available.
   * No-op when `console.log` is not a "function".
   *
   * @api public
   */


  function log() {
    var _console;

    // This hackery is required for IE8/9, where
    // the `console.log` function doesn't have 'apply'
    return (typeof console === "undefined" ? "undefined" : _typeof(console)) === 'object' && console.log && (_console = console).log.apply(_console, arguments);
  }
  /**
   * Save `namespaces`.
   *
   * @param {String} namespaces
   * @api private
   */


  function save(namespaces) {
    try {
      if (namespaces) {
        exports.storage.setItem('debug', namespaces);
      } else {
        exports.storage.removeItem('debug');
      }
    } catch (error) {// Swallow
      // XXX (@Qix-) should we be logging these?
    }
  }
  /**
   * Load `namespaces`.
   *
   * @return {String} returns the previously persisted debug modes
   * @api private
   */


  function load() {
    var r;

    try {
      r = exports.storage.getItem('debug');
    } catch (error) {} // Swallow
    // XXX (@Qix-) should we be logging these?
    // If debug isn't set in LS, and we're in Electron, try to load $DEBUG


    if (!r && typeof process !== 'undefined' && 'env' in process) {
      r = process.env.DEBUG;
    }

    return r;
  }
  /**
   * Localstorage attempts to return the localstorage.
   *
   * This is necessary because safari throws
   * when a user disables cookies/localstorage
   * and you attempt to access it.
   *
   * @return {LocalStorage}
   * @api private
   */


  function localstorage() {
    try {
      // TVMLKit (Apple TV JS Runtime) does not have a window object, just localStorage in the global context
      // The Browser also has localStorage in the global context.
      return localStorage;
    } catch (error) {// Swallow
      // XXX (@Qix-) should we be logging these?
    }
  }

  module.exports = require('./common')(exports);
  var formatters = module.exports.formatters;
  /**
   * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
   */

  formatters.j = function (v) {
    try {
      return JSON.stringify(v);
    } catch (error) {
      return '[UnexpectedJSONParseError]: ' + error.message;
    }
  };


  }).call(this);}).call(this,{ env: {} });

  },{"./common":56}],56:[function(require,module,exports){

  /**
   * This is the common logic for both the Node.js and web browser
   * implementations of `debug()`.
   */
  function setup(env) {
    createDebug.debug = createDebug;
    createDebug.default = createDebug;
    createDebug.coerce = coerce;
    createDebug.disable = disable;
    createDebug.enable = enable;
    createDebug.enabled = enabled;
    createDebug.humanize = require('ms');
    Object.keys(env).forEach(function (key) {
      createDebug[key] = env[key];
    });
    /**
    * Active `debug` instances.
    */

    createDebug.instances = [];
    /**
    * The currently active debug mode names, and names to skip.
    */

    createDebug.names = [];
    createDebug.skips = [];
    /**
    * Map of special "%n" handling functions, for the debug "format" argument.
    *
    * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
    */

    createDebug.formatters = {};
    /**
    * Selects a color for a debug namespace
    * @param {String} namespace The namespace string for the for the debug instance to be colored
    * @return {Number|String} An ANSI color code for the given namespace
    * @api private
    */

    function selectColor(namespace) {
      var hash = 0;

      for (var i = 0; i < namespace.length; i++) {
        hash = (hash << 5) - hash + namespace.charCodeAt(i);
        hash |= 0; // Convert to 32bit integer
      }

      return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
    }

    createDebug.selectColor = selectColor;
    /**
    * Create a debugger with the given `namespace`.
    *
    * @param {String} namespace
    * @return {Function}
    * @api public
    */

    function createDebug(namespace) {
      var prevTime;

      function debug() {
        // Disabled?
        if (!debug.enabled) {
          return;
        }

        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        var self = debug; // Set `diff` timestamp

        var curr = Number(new Date());
        var ms = curr - (prevTime || curr);
        self.diff = ms;
        self.prev = prevTime;
        self.curr = curr;
        prevTime = curr;
        args[0] = createDebug.coerce(args[0]);

        if (typeof args[0] !== 'string') {
          // Anything else let's inspect with %O
          args.unshift('%O');
        } // Apply any `formatters` transformations


        var index = 0;
        args[0] = args[0].replace(/%([a-zA-Z%])/g, function (match, format) {
          // If we encounter an escaped % then don't increase the array index
          if (match === '%%') {
            return match;
          }

          index++;
          var formatter = createDebug.formatters[format];

          if (typeof formatter === 'function') {
            var val = args[index];
            match = formatter.call(self, val); // Now we need to remove `args[index]` since it's inlined in the `format`

            args.splice(index, 1);
            index--;
          }

          return match;
        }); // Apply env-specific formatting (colors, etc.)

        createDebug.formatArgs.call(self, args);
        var logFn = self.log || createDebug.log;
        logFn.apply(self, args);
      }

      debug.namespace = namespace;
      debug.enabled = createDebug.enabled(namespace);
      debug.useColors = createDebug.useColors();
      debug.color = selectColor(namespace);
      debug.destroy = destroy;
      debug.extend = extend; // Debug.formatArgs = formatArgs;
      // debug.rawLog = rawLog;
      // env-specific initialization logic for debug instances

      if (typeof createDebug.init === 'function') {
        createDebug.init(debug);
      }

      createDebug.instances.push(debug);
      return debug;
    }

    function destroy() {
      var index = createDebug.instances.indexOf(this);

      if (index !== -1) {
        createDebug.instances.splice(index, 1);
        return true;
      }

      return false;
    }

    function extend(namespace, delimiter) {
      return createDebug(this.namespace + (typeof delimiter === 'undefined' ? ':' : delimiter) + namespace);
    }
    /**
    * Enables a debug mode by namespaces. This can include modes
    * separated by a colon and wildcards.
    *
    * @param {String} namespaces
    * @api public
    */


    function enable(namespaces) {
      createDebug.save(namespaces);
      createDebug.names = [];
      createDebug.skips = [];
      var i;
      var split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
      var len = split.length;

      for (i = 0; i < len; i++) {
        if (!split[i]) {
          // ignore empty strings
          continue;
        }

        namespaces = split[i].replace(/\*/g, '.*?');

        if (namespaces[0] === '-') {
          createDebug.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
        } else {
          createDebug.names.push(new RegExp('^' + namespaces + '$'));
        }
      }

      for (i = 0; i < createDebug.instances.length; i++) {
        var instance = createDebug.instances[i];
        instance.enabled = createDebug.enabled(instance.namespace);
      }
    }
    /**
    * Disable debug output.
    *
    * @api public
    */


    function disable() {
      createDebug.enable('');
    }
    /**
    * Returns true if the given mode name is enabled, false otherwise.
    *
    * @param {String} name
    * @return {Boolean}
    * @api public
    */


    function enabled(name) {
      if (name[name.length - 1] === '*') {
        return true;
      }

      var i;
      var len;

      for (i = 0, len = createDebug.skips.length; i < len; i++) {
        if (createDebug.skips[i].test(name)) {
          return false;
        }
      }

      for (i = 0, len = createDebug.names.length; i < len; i++) {
        if (createDebug.names[i].test(name)) {
          return true;
        }
      }

      return false;
    }
    /**
    * Coerce `val`.
    *
    * @param {Mixed} val
    * @return {Mixed}
    * @api private
    */


    function coerce(val) {
      if (val instanceof Error) {
        return val.stack || val.message;
      }

      return val;
    }

    createDebug.enable(createDebug.load());
    return createDebug;
  }

  module.exports = setup;


  },{"ms":54}],57:[function(require,module,exports){
  if (typeof Object.create === 'function') {
    // implementation from standard node.js 'util' module
    module.exports = function inherits(ctor, superCtor) {
      if (superCtor) {
        ctor.super_ = superCtor;
        ctor.prototype = Object.create(superCtor.prototype, {
          constructor: {
            value: ctor,
            enumerable: false,
            writable: true,
            configurable: true
          }
        });
      }
    };
  } else {
    // old school shim for old browsers
    module.exports = function inherits(ctor, superCtor) {
      if (superCtor) {
        ctor.super_ = superCtor;
        var TempCtor = function () {};
        TempCtor.prototype = superCtor.prototype;
        ctor.prototype = new TempCtor();
        ctor.prototype.constructor = ctor;
      }
    };
  }

  },{}],58:[function(require,module,exports){

  var has = Object.prototype.hasOwnProperty
    , undef;

  /**
   * Decode a URI encoded string.
   *
   * @param {String} input The URI encoded string.
   * @returns {String|Null} The decoded string.
   * @api private
   */
  function decode(input) {
    try {
      return decodeURIComponent(input.replace(/\+/g, ' '));
    } catch (e) {
      return null;
    }
  }

  /**
   * Simple query string parser.
   *
   * @param {String} query The query string that needs to be parsed.
   * @returns {Object}
   * @api public
   */
  function querystring(query) {
    var parser = /([^=?&]+)=?([^&]*)/g
      , result = {}
      , part;

    while (part = parser.exec(query)) {
      var key = decode(part[1])
        , value = decode(part[2]);

      //
      // Prevent overriding of existing properties. This ensures that build-in
      // methods like `toString` or __proto__ are not overriden by malicious
      // querystrings.
      //
      // In the case if failed decoding, we want to omit the key/value pairs
      // from the result.
      //
      if (key === null || value === null || key in result) continue;
      result[key] = value;
    }

    return result;
  }

  /**
   * Transform a query string to an object.
   *
   * @param {Object} obj Object that should be transformed.
   * @param {String} prefix Optional prefix.
   * @returns {String}
   * @api public
   */
  function querystringify(obj, prefix) {
    prefix = prefix || '';

    var pairs = []
      , value
      , key;

    //
    // Optionally prefix with a '?' if needed
    //
    if ('string' !== typeof prefix) prefix = '?';

    for (key in obj) {
      if (has.call(obj, key)) {
        value = obj[key];

        //
        // Edge cases where we actually want to encode the value to an empty
        // string instead of the stringified value.
        //
        if (!value && (value === null || value === undef || isNaN(value))) {
          value = '';
        }

        key = encodeURIComponent(key);
        value = encodeURIComponent(value);

        //
        // If we failed to encode the strings, we should bail out as we don't
        // want to add invalid strings to the query.
        //
        if (key === null || value === null) continue;
        pairs.push(key +'='+ value);
      }
    }

    return pairs.length ? prefix + pairs.join('&') : '';
  }

  //
  // Expose the module.
  //
  exports.stringify = querystringify;
  exports.parse = querystring;

  },{}],59:[function(require,module,exports){

  /**
   * Check if we're required to add a port number.
   *
   * @see https://url.spec.whatwg.org/#default-port
   * @param {Number|String} port Port number we need to check
   * @param {String} protocol Protocol we need to check against.
   * @returns {Boolean} Is it a default port for the given protocol
   * @api private
   */
  module.exports = function required(port, protocol) {
    protocol = protocol.split(':')[0];
    port = +port;

    if (!port) return false;

    switch (protocol) {
      case 'http':
      case 'ws':
      return port !== 80;

      case 'https':
      case 'wss':
      return port !== 443;

      case 'ftp':
      return port !== 21;

      case 'gopher':
      return port !== 70;

      case 'file':
      return false;
    }

    return port !== 0;
  };

  },{}],60:[function(require,module,exports){
  (function (global){(function (){

  var required = require('requires-port')
    , qs = require('querystringify')
    , controlOrWhitespace = /^[\x00-\x20\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]+/
    , CRHTLF = /[\n\r\t]/g
    , slashes = /^[A-Za-z][A-Za-z0-9+-.]*:\/\//
    , port = /:\d+$/
    , protocolre = /^([a-z][a-z0-9.+-]*:)?(\/\/)?([\\/]+)?([\S\s]*)/i
    , windowsDriveLetter = /^[a-zA-Z]:/;

  /**
   * Remove control characters and whitespace from the beginning of a string.
   *
   * @param {Object|String} str String to trim.
   * @returns {String} A new string representing `str` stripped of control
   *     characters and whitespace from its beginning.
   * @public
   */
  function trimLeft(str) {
    return (str ? str : '').toString().replace(controlOrWhitespace, '');
  }

  /**
   * These are the parse rules for the URL parser, it informs the parser
   * about:
   *
   * 0. The char it Needs to parse, if it's a string it should be done using
   *    indexOf, RegExp using exec and NaN means set as current value.
   * 1. The property we should set when parsing this value.
   * 2. Indication if it's backwards or forward parsing, when set as number it's
   *    the value of extra chars that should be split off.
   * 3. Inherit from location if non existing in the parser.
   * 4. `toLowerCase` the resulting value.
   */
  var rules = [
    ['#', 'hash'],                        // Extract from the back.
    ['?', 'query'],                       // Extract from the back.
    function sanitize(address, url) {     // Sanitize what is left of the address
      return isSpecial(url.protocol) ? address.replace(/\\/g, '/') : address;
    },
    ['/', 'pathname'],                    // Extract from the back.
    ['@', 'auth', 1],                     // Extract from the front.
    [NaN, 'host', undefined, 1, 1],       // Set left over value.
    [/:(\d*)$/, 'port', undefined, 1],    // RegExp the back.
    [NaN, 'hostname', undefined, 1, 1]    // Set left over.
  ];

  /**
   * These properties should not be copied or inherited from. This is only needed
   * for all non blob URL's as a blob URL does not include a hash, only the
   * origin.
   *
   * @type {Object}
   * @private
   */
  var ignore = { hash: 1, query: 1 };

  /**
   * The location object differs when your code is loaded through a normal page,
   * Worker or through a worker using a blob. And with the blobble begins the
   * trouble as the location object will contain the URL of the blob, not the
   * location of the page where our code is loaded in. The actual origin is
   * encoded in the `pathname` so we can thankfully generate a good "default"
   * location from it so we can generate proper relative URL's again.
   *
   * @param {Object|String} loc Optional default location object.
   * @returns {Object} lolcation object.
   * @public
   */
  function lolcation(loc) {
    var globalVar;

    if (typeof window !== 'undefined') globalVar = window;
    else if (typeof global !== 'undefined') globalVar = global;
    else if (typeof self !== 'undefined') globalVar = self;
    else globalVar = {};

    var location = globalVar.location || {};
    loc = loc || location;

    var finaldestination = {}
      , type = typeof loc
      , key;

    if ('blob:' === loc.protocol) {
      finaldestination = new Url(unescape(loc.pathname), {});
    } else if ('string' === type) {
      finaldestination = new Url(loc, {});
      for (key in ignore) delete finaldestination[key];
    } else if ('object' === type) {
      for (key in loc) {
        if (key in ignore) continue;
        finaldestination[key] = loc[key];
      }

      if (finaldestination.slashes === undefined) {
        finaldestination.slashes = slashes.test(loc.href);
      }
    }

    return finaldestination;
  }

  /**
   * Check whether a protocol scheme is special.
   *
   * @param {String} The protocol scheme of the URL
   * @return {Boolean} `true` if the protocol scheme is special, else `false`
   * @private
   */
  function isSpecial(scheme) {
    return (
      scheme === 'file:' ||
      scheme === 'ftp:' ||
      scheme === 'http:' ||
      scheme === 'https:' ||
      scheme === 'ws:' ||
      scheme === 'wss:'
    );
  }

  /**
   * @typedef ProtocolExtract
   * @type Object
   * @property {String} protocol Protocol matched in the URL, in lowercase.
   * @property {Boolean} slashes `true` if protocol is followed by "//", else `false`.
   * @property {String} rest Rest of the URL that is not part of the protocol.
   */

  /**
   * Extract protocol information from a URL with/without double slash ("//").
   *
   * @param {String} address URL we want to extract from.
   * @param {Object} location
   * @return {ProtocolExtract} Extracted information.
   * @private
   */
  function extractProtocol(address, location) {
    address = trimLeft(address);
    address = address.replace(CRHTLF, '');
    location = location || {};

    var match = protocolre.exec(address);
    var protocol = match[1] ? match[1].toLowerCase() : '';
    var forwardSlashes = !!match[2];
    var otherSlashes = !!match[3];
    var slashesCount = 0;
    var rest;

    if (forwardSlashes) {
      if (otherSlashes) {
        rest = match[2] + match[3] + match[4];
        slashesCount = match[2].length + match[3].length;
      } else {
        rest = match[2] + match[4];
        slashesCount = match[2].length;
      }
    } else {
      if (otherSlashes) {
        rest = match[3] + match[4];
        slashesCount = match[3].length;
      } else {
        rest = match[4];
      }
    }

    if (protocol === 'file:') {
      if (slashesCount >= 2) {
        rest = rest.slice(2);
      }
    } else if (isSpecial(protocol)) {
      rest = match[4];
    } else if (protocol) {
      if (forwardSlashes) {
        rest = rest.slice(2);
      }
    } else if (slashesCount >= 2 && isSpecial(location.protocol)) {
      rest = match[4];
    }

    return {
      protocol: protocol,
      slashes: forwardSlashes || isSpecial(protocol),
      slashesCount: slashesCount,
      rest: rest
    };
  }

  /**
   * Resolve a relative URL pathname against a base URL pathname.
   *
   * @param {String} relative Pathname of the relative URL.
   * @param {String} base Pathname of the base URL.
   * @return {String} Resolved pathname.
   * @private
   */
  function resolve(relative, base) {
    if (relative === '') return base;

    var path = (base || '/').split('/').slice(0, -1).concat(relative.split('/'))
      , i = path.length
      , last = path[i - 1]
      , unshift = false
      , up = 0;

    while (i--) {
      if (path[i] === '.') {
        path.splice(i, 1);
      } else if (path[i] === '..') {
        path.splice(i, 1);
        up++;
      } else if (up) {
        if (i === 0) unshift = true;
        path.splice(i, 1);
        up--;
      }
    }

    if (unshift) path.unshift('');
    if (last === '.' || last === '..') path.push('');

    return path.join('/');
  }

  /**
   * The actual URL instance. Instead of returning an object we've opted-in to
   * create an actual constructor as it's much more memory efficient and
   * faster and it pleases my OCD.
   *
   * It is worth noting that we should not use `URL` as class name to prevent
   * clashes with the global URL instance that got introduced in browsers.
   *
   * @constructor
   * @param {String} address URL we want to parse.
   * @param {Object|String} [location] Location defaults for relative paths.
   * @param {Boolean|Function} [parser] Parser for the query string.
   * @private
   */
  function Url(address, location, parser) {
    address = trimLeft(address);
    address = address.replace(CRHTLF, '');

    if (!(this instanceof Url)) {
      return new Url(address, location, parser);
    }

    var relative, extracted, parse, instruction, index, key
      , instructions = rules.slice()
      , type = typeof location
      , url = this
      , i = 0;

    //
    // The following if statements allows this module two have compatibility with
    // 2 different API:
    //
    // 1. Node.js's `url.parse` api which accepts a URL, boolean as arguments
    //    where the boolean indicates that the query string should also be parsed.
    //
    // 2. The `URL` interface of the browser which accepts a URL, object as
    //    arguments. The supplied object will be used as default values / fall-back
    //    for relative paths.
    //
    if ('object' !== type && 'string' !== type) {
      parser = location;
      location = null;
    }

    if (parser && 'function' !== typeof parser) parser = qs.parse;

    location = lolcation(location);

    //
    // Extract protocol information before running the instructions.
    //
    extracted = extractProtocol(address || '', location);
    relative = !extracted.protocol && !extracted.slashes;
    url.slashes = extracted.slashes || relative && location.slashes;
    url.protocol = extracted.protocol || location.protocol || '';
    address = extracted.rest;

    //
    // When the authority component is absent the URL starts with a path
    // component.
    //
    if (
      extracted.protocol === 'file:' && (
        extracted.slashesCount !== 2 || windowsDriveLetter.test(address)) ||
      (!extracted.slashes &&
        (extracted.protocol ||
          extracted.slashesCount < 2 ||
          !isSpecial(url.protocol)))
    ) {
      instructions[3] = [/(.*)/, 'pathname'];
    }

    for (; i < instructions.length; i++) {
      instruction = instructions[i];

      if (typeof instruction === 'function') {
        address = instruction(address, url);
        continue;
      }

      parse = instruction[0];
      key = instruction[1];

      if (parse !== parse) {
        url[key] = address;
      } else if ('string' === typeof parse) {
        index = parse === '@'
          ? address.lastIndexOf(parse)
          : address.indexOf(parse);

        if (~index) {
          if ('number' === typeof instruction[2]) {
            url[key] = address.slice(0, index);
            address = address.slice(index + instruction[2]);
          } else {
            url[key] = address.slice(index);
            address = address.slice(0, index);
          }
        }
      } else if ((index = parse.exec(address))) {
        url[key] = index[1];
        address = address.slice(0, index.index);
      }

      url[key] = url[key] || (
        relative && instruction[3] ? location[key] || '' : ''
      );

      //
      // Hostname, host and protocol should be lowercased so they can be used to
      // create a proper `origin`.
      //
      if (instruction[4]) url[key] = url[key].toLowerCase();
    }

    //
    // Also parse the supplied query string in to an object. If we're supplied
    // with a custom parser as function use that instead of the default build-in
    // parser.
    //
    if (parser) url.query = parser(url.query);

    //
    // If the URL is relative, resolve the pathname against the base URL.
    //
    if (
        relative
      && location.slashes
      && url.pathname.charAt(0) !== '/'
      && (url.pathname !== '' || location.pathname !== '')
    ) {
      url.pathname = resolve(url.pathname, location.pathname);
    }

    //
    // Default to a / for pathname if none exists. This normalizes the URL
    // to always have a /
    //
    if (url.pathname.charAt(0) !== '/' && isSpecial(url.protocol)) {
      url.pathname = '/' + url.pathname;
    }

    //
    // We should not add port numbers if they are already the default port number
    // for a given protocol. As the host also contains the port number we're going
    // override it with the hostname which contains no port number.
    //
    if (!required(url.port, url.protocol)) {
      url.host = url.hostname;
      url.port = '';
    }

    //
    // Parse down the `auth` for the username and password.
    //
    url.username = url.password = '';

    if (url.auth) {
      index = url.auth.indexOf(':');

      if (~index) {
        url.username = url.auth.slice(0, index);
        url.username = encodeURIComponent(decodeURIComponent(url.username));

        url.password = url.auth.slice(index + 1);
        url.password = encodeURIComponent(decodeURIComponent(url.password));
      } else {
        url.username = encodeURIComponent(decodeURIComponent(url.auth));
      }

      url.auth = url.password ? url.username +':'+ url.password : url.username;
    }

    url.origin = url.protocol !== 'file:' && isSpecial(url.protocol) && url.host
      ? url.protocol +'//'+ url.host
      : 'null';

    //
    // The href is just the compiled result.
    //
    url.href = url.toString();
  }

  /**
   * This is convenience method for changing properties in the URL instance to
   * insure that they all propagate correctly.
   *
   * @param {String} part          Property we need to adjust.
   * @param {Mixed} value          The newly assigned value.
   * @param {Boolean|Function} fn  When setting the query, it will be the function
   *                               used to parse the query.
   *                               When setting the protocol, double slash will be
   *                               removed from the final url if it is true.
   * @returns {URL} URL instance for chaining.
   * @public
   */
  function set(part, value, fn) {
    var url = this;

    switch (part) {
      case 'query':
        if ('string' === typeof value && value.length) {
          value = (fn || qs.parse)(value);
        }

        url[part] = value;
        break;

      case 'port':
        url[part] = value;

        if (!required(value, url.protocol)) {
          url.host = url.hostname;
          url[part] = '';
        } else if (value) {
          url.host = url.hostname +':'+ value;
        }

        break;

      case 'hostname':
        url[part] = value;

        if (url.port) value += ':'+ url.port;
        url.host = value;
        break;

      case 'host':
        url[part] = value;

        if (port.test(value)) {
          value = value.split(':');
          url.port = value.pop();
          url.hostname = value.join(':');
        } else {
          url.hostname = value;
          url.port = '';
        }

        break;

      case 'protocol':
        url.protocol = value.toLowerCase();
        url.slashes = !fn;
        break;

      case 'pathname':
      case 'hash':
        if (value) {
          var char = part === 'pathname' ? '/' : '#';
          url[part] = value.charAt(0) !== char ? char + value : value;
        } else {
          url[part] = value;
        }
        break;

      case 'username':
      case 'password':
        url[part] = encodeURIComponent(value);
        break;

      case 'auth':
        var index = value.indexOf(':');

        if (~index) {
          url.username = value.slice(0, index);
          url.username = encodeURIComponent(decodeURIComponent(url.username));

          url.password = value.slice(index + 1);
          url.password = encodeURIComponent(decodeURIComponent(url.password));
        } else {
          url.username = encodeURIComponent(decodeURIComponent(value));
        }
    }

    for (var i = 0; i < rules.length; i++) {
      var ins = rules[i];

      if (ins[4]) url[ins[1]] = url[ins[1]].toLowerCase();
    }

    url.auth = url.password ? url.username +':'+ url.password : url.username;

    url.origin = url.protocol !== 'file:' && isSpecial(url.protocol) && url.host
      ? url.protocol +'//'+ url.host
      : 'null';

    url.href = url.toString();

    return url;
  }

  /**
   * Transform the properties back in to a valid and full URL string.
   *
   * @param {Function} stringify Optional query stringify function.
   * @returns {String} Compiled version of the URL.
   * @public
   */
  function toString(stringify) {
    if (!stringify || 'function' !== typeof stringify) stringify = qs.stringify;

    var query
      , url = this
      , host = url.host
      , protocol = url.protocol;

    if (protocol && protocol.charAt(protocol.length - 1) !== ':') protocol += ':';

    var result =
      protocol +
      ((url.protocol && url.slashes) || isSpecial(url.protocol) ? '//' : '');

    if (url.username) {
      result += url.username;
      if (url.password) result += ':'+ url.password;
      result += '@';
    } else if (url.password) {
      result += ':'+ url.password;
      result += '@';
    } else if (
      url.protocol !== 'file:' &&
      isSpecial(url.protocol) &&
      !host &&
      url.pathname !== '/'
    ) {
      //
      // Add back the empty userinfo, otherwise the original invalid URL
      // might be transformed into a valid one with `url.pathname` as host.
      //
      result += '@';
    }

    //
    // Trailing colon is removed from `url.host` when it is parsed. If it still
    // ends with a colon, then add back the trailing colon that was removed. This
    // prevents an invalid URL from being transformed into a valid one.
    //
    if (host[host.length - 1] === ':' || (port.test(url.hostname) && !url.port)) {
      host += ':';
    }

    result += host + url.pathname;

    query = 'object' === typeof url.query ? stringify(url.query) : url.query;
    if (query) result += '?' !== query.charAt(0) ? '?'+ query : query;

    if (url.hash) result += url.hash;

    return result;
  }

  Url.prototype = { set: set, toString: toString };

  //
  // Expose the URL parser and some additional properties that might be useful for
  // others or testing.
  //
  Url.extractProtocol = extractProtocol;
  Url.location = lolcation;
  Url.trimLeft = trimLeft;
  Url.qs = qs;

  module.exports = Url;

  }).call(this);}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});

  },{"querystringify":58,"requires-port":59}]},{},[1])(1)
  });

(function(global) {
  /**
   * Polyfill URLSearchParams
   *
   * Inspired from : https://github.com/WebReflection/url-search-params/blob/master/src/url-search-params.js
   */

  var checkIfIteratorIsSupported = function() {
    try {
      return !!Symbol.iterator;
    } catch (error) {
      return false;
    }
  };


  var iteratorSupported = checkIfIteratorIsSupported();

  var createIterator = function(items) {
    var iterator = {
      next: function() {
        var value = items.shift();
        return { done: value === void 0, value: value };
      }
    };

    if (iteratorSupported) {
      iterator[Symbol.iterator] = function() {
        return iterator;
      };
    }

    return iterator;
  };

  /**
   * Search param name and values should be encoded according to https://url.spec.whatwg.org/#urlencoded-serializing
   * encodeURIComponent() produces the same result except encoding spaces as `%20` instead of `+`.
   */
  var serializeParam = function(value) {
    return encodeURIComponent(value).replace(/%20/g, '+');
  };

  var deserializeParam = function(value) {
    return decodeURIComponent(String(value).replace(/\+/g, ' '));
  };

  var polyfillURLSearchParams = function() {

    var URLSearchParams = function(searchString) {
      Object.defineProperty(this, '_entries', { writable: true, value: {} });
      var typeofSearchString = typeof searchString;

      if (typeofSearchString === 'undefined') ; else if (typeofSearchString === 'string') {
        if (searchString !== '') {
          this._fromString(searchString);
        }
      } else if (searchString instanceof URLSearchParams) {
        var _this = this;
        searchString.forEach(function(value, name) {
          _this.append(name, value);
        });
      } else if ((searchString !== null) && (typeofSearchString === 'object')) {
        if (Object.prototype.toString.call(searchString) === '[object Array]') {
          for (var i = 0; i < searchString.length; i++) {
            var entry = searchString[i];
            if ((Object.prototype.toString.call(entry) === '[object Array]') || (entry.length !== 2)) {
              this.append(entry[0], entry[1]);
            } else {
              throw new TypeError('Expected [string, any] as entry at index ' + i + ' of URLSearchParams\'s input');
            }
          }
        } else {
          for (var key in searchString) {
            if (searchString.hasOwnProperty(key)) {
              this.append(key, searchString[key]);
            }
          }
        }
      } else {
        throw new TypeError('Unsupported input\'s type for URLSearchParams');
      }
    };

    var proto = URLSearchParams.prototype;

    proto.append = function(name, value) {
      if (name in this._entries) {
        this._entries[name].push(String(value));
      } else {
        this._entries[name] = [String(value)];
      }
    };

    proto.delete = function(name) {
      delete this._entries[name];
    };

    proto.get = function(name) {
      return (name in this._entries) ? this._entries[name][0] : null;
    };

    proto.getAll = function(name) {
      return (name in this._entries) ? this._entries[name].slice(0) : [];
    };

    proto.has = function(name) {
      return (name in this._entries);
    };

    proto.set = function(name, value) {
      this._entries[name] = [String(value)];
    };

    proto.forEach = function(callback, thisArg) {
      var entries;
      for (var name in this._entries) {
        if (this._entries.hasOwnProperty(name)) {
          entries = this._entries[name];
          for (var i = 0; i < entries.length; i++) {
            callback.call(thisArg, entries[i], name, this);
          }
        }
      }
    };

    proto.keys = function() {
      var items = [];
      this.forEach(function(value, name) {
        items.push(name);
      });
      return createIterator(items);
    };

    proto.values = function() {
      var items = [];
      this.forEach(function(value) {
        items.push(value);
      });
      return createIterator(items);
    };

    proto.entries = function() {
      var items = [];
      this.forEach(function(value, name) {
        items.push([name, value]);
      });
      return createIterator(items);
    };

    if (iteratorSupported) {
      proto[Symbol.iterator] = proto.entries;
    }

    proto.toString = function() {
      var searchArray = [];
      this.forEach(function(value, name) {
        searchArray.push(serializeParam(name) + '=' + serializeParam(value));
      });
      return searchArray.join('&');
    };


    global.URLSearchParams = URLSearchParams;
  };

  var checkIfURLSearchParamsSupported = function() {
    try {
      var URLSearchParams = global.URLSearchParams;

      return (
        (new URLSearchParams('?a=1').toString() === 'a=1') &&
        (typeof URLSearchParams.prototype.set === 'function') &&
        (typeof URLSearchParams.prototype.entries === 'function')
      );
    } catch (e) {
      return false;
    }
  };

  if (!checkIfURLSearchParamsSupported()) {
    polyfillURLSearchParams();
  }

  var proto = global.URLSearchParams.prototype;

  if (typeof proto.sort !== 'function') {
    proto.sort = function() {
      var _this = this;
      var items = [];
      this.forEach(function(value, name) {
        items.push([name, value]);
        if (!_this._entries) {
          _this.delete(name);
        }
      });
      items.sort(function(a, b) {
        if (a[0] < b[0]) {
          return -1;
        } else if (a[0] > b[0]) {
          return +1;
        } else {
          return 0;
        }
      });
      if (_this._entries) { // force reset because IE keeps keys index
        _this._entries = {};
      }
      for (var i = 0; i < items.length; i++) {
        this.append(items[i][0], items[i][1]);
      }
    };
  }

  if (typeof proto._fromString !== 'function') {
    Object.defineProperty(proto, '_fromString', {
      enumerable: false,
      configurable: false,
      writable: false,
      value: function(searchString) {
        if (this._entries) {
          this._entries = {};
        } else {
          var keys = [];
          this.forEach(function(value, name) {
            keys.push(name);
          });
          for (var i = 0; i < keys.length; i++) {
            this.delete(keys[i]);
          }
        }

        searchString = searchString.replace(/^\?/, '');
        var attributes = searchString.split('&');
        var attribute;
        for (var i = 0; i < attributes.length; i++) {
          attribute = attributes[i].split('=');
          this.append(
            deserializeParam(attribute[0]),
            (attribute.length > 1) ? deserializeParam(attribute[1]) : ''
          );
        }
      }
    });
  }

  // HTMLAnchorElement

})(
  (typeof _commonjsHelpers.commonjsGlobal !== 'undefined') ? _commonjsHelpers.commonjsGlobal
    : ((typeof window !== 'undefined') ? window
    : ((typeof self !== 'undefined') ? self : _commonjsHelpers.commonjsGlobal))
);

(function(global) {
  /**
   * Polyfill URL
   *
   * Inspired from : https://github.com/arv/DOM-URL-Polyfill/blob/master/src/url.js
   */

  var checkIfURLIsSupported = function() {
    try {
      var u = new global.URL('b', 'http://a');
      u.pathname = 'c d';
      return (u.href === 'http://a/c%20d') && u.searchParams;
    } catch (e) {
      return false;
    }
  };


  var polyfillURL = function() {
    var _URL = global.URL;

    var URL = function(url, base) {
      if (typeof url !== 'string') url = String(url);
      if (base && typeof base !== 'string') base = String(base);

      // Only create another document if the base is different from current location.
      var doc = document, baseElement;
      if (base && (global.location === void 0 || base !== global.location.href)) {
        base = base.toLowerCase();
        doc = document.implementation.createHTMLDocument('');
        baseElement = doc.createElement('base');
        baseElement.href = base;
        doc.head.appendChild(baseElement);
        try {
          if (baseElement.href.indexOf(base) !== 0) throw new Error(baseElement.href);
        } catch (err) {
          throw new Error('URL unable to set base ' + base + ' due to ' + err);
        }
      }

      var anchorElement = doc.createElement('a');
      anchorElement.href = url;
      if (baseElement) {
        doc.body.appendChild(anchorElement);
        anchorElement.href = anchorElement.href; // force href to refresh
      }

      var inputElement = doc.createElement('input');
      inputElement.type = 'url';
      inputElement.value = url;

      if (anchorElement.protocol === ':' || !/:/.test(anchorElement.href) || (!inputElement.checkValidity() && !base)) {
        throw new TypeError('Invalid URL');
      }

      Object.defineProperty(this, '_anchorElement', {
        value: anchorElement
      });


      // create a linked searchParams which reflect its changes on URL
      var searchParams = new global.URLSearchParams(this.search);
      var enableSearchUpdate = true;
      var enableSearchParamsUpdate = true;
      var _this = this;
      ['append', 'delete', 'set'].forEach(function(methodName) {
        var method = searchParams[methodName];
        searchParams[methodName] = function() {
          method.apply(searchParams, arguments);
          if (enableSearchUpdate) {
            enableSearchParamsUpdate = false;
            _this.search = searchParams.toString();
            enableSearchParamsUpdate = true;
          }
        };
      });

      Object.defineProperty(this, 'searchParams', {
        value: searchParams,
        enumerable: true
      });

      var search = void 0;
      Object.defineProperty(this, '_updateSearchParams', {
        enumerable: false,
        configurable: false,
        writable: false,
        value: function() {
          if (this.search !== search) {
            search = this.search;
            if (enableSearchParamsUpdate) {
              enableSearchUpdate = false;
              this.searchParams._fromString(this.search);
              enableSearchUpdate = true;
            }
          }
        }
      });
    };

    var proto = URL.prototype;

    var linkURLWithAnchorAttribute = function(attributeName) {
      Object.defineProperty(proto, attributeName, {
        get: function() {
          return this._anchorElement[attributeName];
        },
        set: function(value) {
          this._anchorElement[attributeName] = value;
        },
        enumerable: true
      });
    };

    ['hash', 'host', 'hostname', 'port', 'protocol']
      .forEach(function(attributeName) {
        linkURLWithAnchorAttribute(attributeName);
      });

    Object.defineProperty(proto, 'search', {
      get: function() {
        return this._anchorElement['search'];
      },
      set: function(value) {
        this._anchorElement['search'] = value;
        this._updateSearchParams();
      },
      enumerable: true
    });

    Object.defineProperties(proto, {

      'toString': {
        get: function() {
          var _this = this;
          return function() {
            return _this.href;
          };
        }
      },

      'href': {
        get: function() {
          return this._anchorElement.href.replace(/\?$/, '');
        },
        set: function(value) {
          this._anchorElement.href = value;
          this._updateSearchParams();
        },
        enumerable: true
      },

      'pathname': {
        get: function() {
          return this._anchorElement.pathname.replace(/(^\/?)/, '/');
        },
        set: function(value) {
          this._anchorElement.pathname = value;
        },
        enumerable: true
      },

      'origin': {
        get: function() {
          // get expected port from protocol
          var expectedPort = { 'http:': 80, 'https:': 443, 'ftp:': 21 }[this._anchorElement.protocol];
          // add port to origin if, expected port is different than actual port
          // and it is not empty f.e http://foo:8080
          // 8080 != 80 && 8080 != ''
          var addPortToOrigin = this._anchorElement.port != expectedPort &&
            this._anchorElement.port !== '';

          return this._anchorElement.protocol +
            '//' +
            this._anchorElement.hostname +
            (addPortToOrigin ? (':' + this._anchorElement.port) : '');
        },
        enumerable: true
      },

      'password': { // TODO
        get: function() {
          return '';
        },
        set: function(value) {
        },
        enumerable: true
      },

      'username': { // TODO
        get: function() {
          return '';
        },
        set: function(value) {
        },
        enumerable: true
      },
    });

    URL.createObjectURL = function(blob) {
      return _URL.createObjectURL.apply(_URL, arguments);
    };

    URL.revokeObjectURL = function(url) {
      return _URL.revokeObjectURL.apply(_URL, arguments);
    };

    global.URL = URL;

  };

  if (!checkIfURLIsSupported()) {
    polyfillURL();
  }

  if ((global.location !== void 0) && !('origin' in global.location)) {
    var getOrigin = function() {
      return global.location.protocol + '//' + global.location.hostname + (global.location.port ? (':' + global.location.port) : '');
    };

    try {
      Object.defineProperty(global.location, 'origin', {
        get: getOrigin,
        enumerable: true
      });
    } catch (e) {
      setInterval(function() {
        global.location.origin = getOrigin();
      }, 100);
    }
  }

})(
  (typeof _commonjsHelpers.commonjsGlobal !== 'undefined') ? _commonjsHelpers.commonjsGlobal
    : ((typeof window !== 'undefined') ? window
    : ((typeof self !== 'undefined') ? self : _commonjsHelpers.commonjsGlobal))
);

var jquery_slim = _commonjsHelpers.createCommonjsModule(function (module) {
/*!
 * jQuery JavaScript Library v3.6.3 -ajax,-ajax/jsonp,-ajax/load,-ajax/script,-ajax/var/location,-ajax/var/nonce,-ajax/var/rquery,-ajax/xhr,-manipulation/_evalUrl,-deprecated/ajax-event-alias,-effects,-effects/Tween,-effects/animatedSelector
 * https://jquery.com/
 *
 * Includes Sizzle.js
 * https://sizzlejs.com/
 *
 * Copyright OpenJS Foundation and other contributors
 * Released under the MIT license
 * https://jquery.org/license
 *
 * Date: 2022-12-20T21:28Z
 */
( function( global, factory ) {

	{

		// For CommonJS and CommonJS-like environments where a proper `window`
		// is present, execute the factory and get jQuery.
		// For environments that do not have a `window` with a `document`
		// (such as Node.js), expose a factory as module.exports.
		// This accentuates the need for the creation of a real `window`.
		// e.g. var jQuery = require("jquery")(window);
		// See ticket trac-14549 for more info.
		module.exports = global.document ?
			factory( global, true ) :
			function( w ) {
				if ( !w.document ) {
					throw new Error( "jQuery requires a window with a document" );
				}
				return factory( w );
			};
	}

// Pass this if window is not defined yet
} )( typeof window !== "undefined" ? window : _commonjsHelpers.commonjsGlobal, function( window, noGlobal ) {

var arr = [];

var getProto = Object.getPrototypeOf;

var slice = arr.slice;

var flat = arr.flat ? function( array ) {
	return arr.flat.call( array );
} : function( array ) {
	return arr.concat.apply( [], array );
};


var push = arr.push;

var indexOf = arr.indexOf;

var class2type = {};

var toString = class2type.toString;

var hasOwn = class2type.hasOwnProperty;

var fnToString = hasOwn.toString;

var ObjectFunctionString = fnToString.call( Object );

var support = {};

var isFunction = function isFunction( obj ) {

		// Support: Chrome <=57, Firefox <=52
		// In some browsers, typeof returns "function" for HTML <object> elements
		// (i.e., `typeof document.createElement( "object" ) === "function"`).
		// We don't want to classify *any* DOM node as a function.
		// Support: QtWeb <=3.8.5, WebKit <=534.34, wkhtmltopdf tool <=0.12.5
		// Plus for old WebKit, typeof returns "function" for HTML collections
		// (e.g., `typeof document.getElementsByTagName("div") === "function"`). (gh-4756)
		return typeof obj === "function" && typeof obj.nodeType !== "number" &&
			typeof obj.item !== "function";
	};


var isWindow = function isWindow( obj ) {
		return obj != null && obj === obj.window;
	};


var document = window.document;



	var preservedScriptAttributes = {
		type: true,
		src: true,
		nonce: true,
		noModule: true
	};

	function DOMEval( code, node, doc ) {
		doc = doc || document;

		var i, val,
			script = doc.createElement( "script" );

		script.text = code;
		if ( node ) {
			for ( i in preservedScriptAttributes ) {

				// Support: Firefox 64+, Edge 18+
				// Some browsers don't support the "nonce" property on scripts.
				// On the other hand, just using `getAttribute` is not enough as
				// the `nonce` attribute is reset to an empty string whenever it
				// becomes browsing-context connected.
				// See https://github.com/whatwg/html/issues/2369
				// See https://html.spec.whatwg.org/#nonce-attributes
				// The `node.getAttribute` check was added for the sake of
				// `jQuery.globalEval` so that it can fake a nonce-containing node
				// via an object.
				val = node[ i ] || node.getAttribute && node.getAttribute( i );
				if ( val ) {
					script.setAttribute( i, val );
				}
			}
		}
		doc.head.appendChild( script ).parentNode.removeChild( script );
	}


function toType( obj ) {
	if ( obj == null ) {
		return obj + "";
	}

	// Support: Android <=2.3 only (functionish RegExp)
	return typeof obj === "object" || typeof obj === "function" ?
		class2type[ toString.call( obj ) ] || "object" :
		typeof obj;
}
/* global Symbol */
// Defining this global in .eslintrc.json would create a danger of using the global
// unguarded in another place, it seems safer to define global only for this module



var
	version = "3.6.3 -ajax,-ajax/jsonp,-ajax/load,-ajax/script,-ajax/var/location,-ajax/var/nonce,-ajax/var/rquery,-ajax/xhr,-manipulation/_evalUrl,-deprecated/ajax-event-alias,-effects,-effects/Tween,-effects/animatedSelector",

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {

		// The jQuery object is actually just the init constructor 'enhanced'
		// Need init if jQuery is called (just allow error to be thrown if not included)
		return new jQuery.fn.init( selector, context );
	};

jQuery.fn = jQuery.prototype = {

	// The current version of jQuery being used
	jquery: version,

	constructor: jQuery,

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {

		// Return all the elements in a clean array
		if ( num == null ) {
			return slice.call( this );
		}

		// Return just the one element from the set
		return num < 0 ? this[ num + this.length ] : this[ num ];
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	each: function( callback ) {
		return jQuery.each( this, callback );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map( this, function( elem, i ) {
			return callback.call( elem, i, elem );
		} ) );
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	even: function() {
		return this.pushStack( jQuery.grep( this, function( _elem, i ) {
			return ( i + 1 ) % 2;
		} ) );
	},

	odd: function() {
		return this.pushStack( jQuery.grep( this, function( _elem, i ) {
			return i % 2;
		} ) );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[ j ] ] : [] );
	},

	end: function() {
		return this.prevObject || this.constructor();
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: arr.sort,
	splice: arr.splice
};

jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[ 0 ] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;

		// Skip the boolean and the target
		target = arguments[ i ] || {};
		i++;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !isFunction( target ) ) {
		target = {};
	}

	// Extend jQuery itself if only one argument is passed
	if ( i === length ) {
		target = this;
		i--;
	}

	for ( ; i < length; i++ ) {

		// Only deal with non-null/undefined values
		if ( ( options = arguments[ i ] ) != null ) {

			// Extend the base object
			for ( name in options ) {
				copy = options[ name ];

				// Prevent Object.prototype pollution
				// Prevent never-ending loop
				if ( name === "__proto__" || target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject( copy ) ||
					( copyIsArray = Array.isArray( copy ) ) ) ) {
					src = target[ name ];

					// Ensure proper type for the source value
					if ( copyIsArray && !Array.isArray( src ) ) {
						clone = [];
					} else if ( !copyIsArray && !jQuery.isPlainObject( src ) ) {
						clone = {};
					} else {
						clone = src;
					}
					copyIsArray = false;

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend( {

	// Unique for each copy of jQuery on the page
	expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),

	// Assume jQuery is ready without the ready module
	isReady: true,

	error: function( msg ) {
		throw new Error( msg );
	},

	noop: function() {},

	isPlainObject: function( obj ) {
		var proto, Ctor;

		// Detect obvious negatives
		// Use toString instead of jQuery.type to catch host objects
		if ( !obj || toString.call( obj ) !== "[object Object]" ) {
			return false;
		}

		proto = getProto( obj );

		// Objects with no prototype (e.g., `Object.create( null )`) are plain
		if ( !proto ) {
			return true;
		}

		// Objects with prototype are plain iff they were constructed by a global Object function
		Ctor = hasOwn.call( proto, "constructor" ) && proto.constructor;
		return typeof Ctor === "function" && fnToString.call( Ctor ) === ObjectFunctionString;
	},

	isEmptyObject: function( obj ) {
		var name;

		for ( name in obj ) {
			return false;
		}
		return true;
	},

	// Evaluates a script in a provided context; falls back to the global one
	// if not specified.
	globalEval: function( code, options, doc ) {
		DOMEval( code, { nonce: options && options.nonce }, doc );
	},

	each: function( obj, callback ) {
		var length, i = 0;

		if ( isArrayLike( obj ) ) {
			length = obj.length;
			for ( ; i < length; i++ ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		} else {
			for ( i in obj ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		}

		return obj;
	},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArrayLike( Object( arr ) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
						[ arr ] : arr
				);
			} else {
				push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		return arr == null ? -1 : indexOf.call( arr, elem, i );
	},

	// Support: Android <=4.0 only, PhantomJS 1 only
	// push.apply(_, arraylike) throws on ancient WebKit
	merge: function( first, second ) {
		var len = +second.length,
			j = 0,
			i = first.length;

		for ( ; j < len; j++ ) {
			first[ i++ ] = second[ j ];
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, invert ) {
		var callbackInverse,
			matches = [],
			i = 0,
			length = elems.length,
			callbackExpect = !invert;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			callbackInverse = !callback( elems[ i ], i );
			if ( callbackInverse !== callbackExpect ) {
				matches.push( elems[ i ] );
			}
		}

		return matches;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var length, value,
			i = 0,
			ret = [];

		// Go through the array, translating each of the items to their new values
		if ( isArrayLike( elems ) ) {
			length = elems.length;
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}
		}

		// Flatten any nested arrays
		return flat( ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// jQuery.support is not used in Core but other projects attach their
	// properties to it so it needs to exist.
	support: support
} );

if ( typeof Symbol === "function" ) {
	jQuery.fn[ Symbol.iterator ] = arr[ Symbol.iterator ];
}

// Populate the class2type map
jQuery.each( "Boolean Number String Function Array Date RegExp Object Error Symbol".split( " " ),
	function( _i, name ) {
		class2type[ "[object " + name + "]" ] = name.toLowerCase();
	} );

function isArrayLike( obj ) {

	// Support: real iOS 8.2 only (not reproducible in simulator)
	// `in` check used to prevent JIT error (gh-2145)
	// hasOwn isn't used here due to false negatives
	// regarding Nodelist length in IE
	var length = !!obj && "length" in obj && obj.length,
		type = toType( obj );

	if ( isFunction( obj ) || isWindow( obj ) ) {
		return false;
	}

	return type === "array" || length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj;
}
var Sizzle =
/*!
 * Sizzle CSS Selector Engine v2.3.9
 * https://sizzlejs.com/
 *
 * Copyright JS Foundation and other contributors
 * Released under the MIT license
 * https://js.foundation/
 *
 * Date: 2022-12-19
 */
( function( window ) {
var i,
	support,
	Expr,
	getText,
	isXML,
	tokenize,
	compile,
	select,
	outermostContext,
	sortInput,
	hasDuplicate,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + 1 * new Date(),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	nonnativeSelectorCache = createCache(),
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
		}
		return 0;
	},

	// Instance methods
	hasOwn = ( {} ).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	pushNative = arr.push,
	push = arr.push,
	slice = arr.slice,

	// Use a stripped-down indexOf as it's faster than native
	// https://jsperf.com/thor-indexof-vs-for/5
	indexOf = function( list, elem ) {
		var i = 0,
			len = list.length;
		for ( ; i < len; i++ ) {
			if ( list[ i ] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|" +
		"ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",

	// https://www.w3.org/TR/css-syntax-3/#ident-token-diagram
	identifier = "(?:\\\\[\\da-fA-F]{1,6}" + whitespace +
		"?|\\\\[^\\r\\n\\f]|[\\w-]|[^\0-\\x7f])+",

	// Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace +

		// Operator (capture 2)
		"*([*^$|!~]?=)" + whitespace +

		// "Attribute values must be CSS identifiers [capture 5]
		// or strings [capture 3 or capture 4]"
		"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" +
		whitespace + "*\\]",

	pseudos = ":(" + identifier + ")(?:\\((" +

		// To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
		// 1. quoted (capture 3; capture 4 or capture 5)
		"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +

		// 2. simple (capture 6)
		"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +

		// 3. anything else (capture 2)
		".*" +
		")\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rwhitespace = new RegExp( whitespace + "+", "g" ),
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" +
		whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace +
		"*" ),
	rdescend = new RegExp( whitespace + "|>" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + identifier + ")" ),
		"CLASS": new RegExp( "^\\.(" + identifier + ")" ),
		"TAG": new RegExp( "^(" + identifier + "|[*])" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" +
			whitespace + "*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" +
			whitespace + "*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),

		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace +
			"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + whitespace +
			"*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rhtml = /HTML$/i,
	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rsibling = /[+~]/,

	// CSS escapes
	// http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\[\\da-fA-F]{1,6}" + whitespace + "?|\\\\([^\\r\\n\\f])", "g" ),
	funescape = function( escape, nonHex ) {
		var high = "0x" + escape.slice( 1 ) - 0x10000;

		return nonHex ?

			// Strip the backslash prefix from a non-hex escape sequence
			nonHex :

			// Replace a hexadecimal escape sequence with the encoded Unicode code point
			// Support: IE <=11+
			// For values outside the Basic Multilingual Plane (BMP), manually construct a
			// surrogate pair
			high < 0 ?
				String.fromCharCode( high + 0x10000 ) :
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	},

	// CSS string/identifier serialization
	// https://drafts.csswg.org/cssom/#common-serializing-idioms
	rcssescape = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,
	fcssescape = function( ch, asCodePoint ) {
		if ( asCodePoint ) {

			// U+0000 NULL becomes U+FFFD REPLACEMENT CHARACTER
			if ( ch === "\0" ) {
				return "\uFFFD";
			}

			// Control characters and (dependent upon position) numbers get escaped as code points
			return ch.slice( 0, -1 ) + "\\" +
				ch.charCodeAt( ch.length - 1 ).toString( 16 ) + " ";
		}

		// Other potentially-special ASCII characters get backslash-escaped
		return "\\" + ch;
	},

	// Used for iframes
	// See setDocument()
	// Removing the function wrapper causes a "Permission Denied"
	// error in IE
	unloadHandler = function() {
		setDocument();
	},

	inDisabledFieldset = addCombinator(
		function( elem ) {
			return elem.disabled === true && elem.nodeName.toLowerCase() === "fieldset";
		},
		{ dir: "parentNode", next: "legend" }
	);

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		( arr = slice.call( preferredDoc.childNodes ) ),
		preferredDoc.childNodes
	);
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			pushNative.apply( target, slice.call( els ) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;

			// Can't trust NodeList.length
			while ( ( target[ j++ ] = els[ i++ ] ) ) {}
			target.length = j - 1;
		}
	};
}

function Sizzle( selector, context, results, seed ) {
	var m, i, elem, nid, match, groups, newSelector,
		newContext = context && context.ownerDocument,

		// nodeType defaults to 9, since context defaults to document
		nodeType = context ? context.nodeType : 9;

	results = results || [];

	// Return early from calls with invalid selector or context
	if ( typeof selector !== "string" || !selector ||
		nodeType !== 1 && nodeType !== 9 && nodeType !== 11 ) {

		return results;
	}

	// Try to shortcut find operations (as opposed to filters) in HTML documents
	if ( !seed ) {
		setDocument( context );
		context = context || document;

		if ( documentIsHTML ) {

			// If the selector is sufficiently simple, try using a "get*By*" DOM method
			// (excepting DocumentFragment context, where the methods don't exist)
			if ( nodeType !== 11 && ( match = rquickExpr.exec( selector ) ) ) {

				// ID selector
				if ( ( m = match[ 1 ] ) ) {

					// Document context
					if ( nodeType === 9 ) {
						if ( ( elem = context.getElementById( m ) ) ) {

							// Support: IE, Opera, Webkit
							// TODO: identify versions
							// getElementById can match elements by name instead of ID
							if ( elem.id === m ) {
								results.push( elem );
								return results;
							}
						} else {
							return results;
						}

					// Element context
					} else {

						// Support: IE, Opera, Webkit
						// TODO: identify versions
						// getElementById can match elements by name instead of ID
						if ( newContext && ( elem = newContext.getElementById( m ) ) &&
							contains( context, elem ) &&
							elem.id === m ) {

							results.push( elem );
							return results;
						}
					}

				// Type selector
				} else if ( match[ 2 ] ) {
					push.apply( results, context.getElementsByTagName( selector ) );
					return results;

				// Class selector
				} else if ( ( m = match[ 3 ] ) && support.getElementsByClassName &&
					context.getElementsByClassName ) {

					push.apply( results, context.getElementsByClassName( m ) );
					return results;
				}
			}

			// Take advantage of querySelectorAll
			if ( support.qsa &&
				!nonnativeSelectorCache[ selector + " " ] &&
				( !rbuggyQSA || !rbuggyQSA.test( selector ) ) &&

				// Support: IE 8 only
				// Exclude object elements
				( nodeType !== 1 || context.nodeName.toLowerCase() !== "object" ) ) {

				newSelector = selector;
				newContext = context;

				// qSA considers elements outside a scoping root when evaluating child or
				// descendant combinators, which is not what we want.
				// In such cases, we work around the behavior by prefixing every selector in the
				// list with an ID selector referencing the scope context.
				// The technique has to be used as well when a leading combinator is used
				// as such selectors are not recognized by querySelectorAll.
				// Thanks to Andrew Dupont for this technique.
				if ( nodeType === 1 &&
					( rdescend.test( selector ) || rcombinators.test( selector ) ) ) {

					// Expand context for sibling selectors
					newContext = rsibling.test( selector ) && testContext( context.parentNode ) ||
						context;

					// We can use :scope instead of the ID hack if the browser
					// supports it & if we're not changing the context.
					if ( newContext !== context || !support.scope ) {

						// Capture the context ID, setting it first if necessary
						if ( ( nid = context.getAttribute( "id" ) ) ) {
							nid = nid.replace( rcssescape, fcssescape );
						} else {
							context.setAttribute( "id", ( nid = expando ) );
						}
					}

					// Prefix every selector in the list
					groups = tokenize( selector );
					i = groups.length;
					while ( i-- ) {
						groups[ i ] = ( nid ? "#" + nid : ":scope" ) + " " +
							toSelector( groups[ i ] );
					}
					newSelector = groups.join( "," );
				}

				try {

					// `qSA` may not throw for unrecognized parts using forgiving parsing:
					// https://drafts.csswg.org/selectors/#forgiving-selector
					// like the `:has()` pseudo-class:
					// https://drafts.csswg.org/selectors/#relational
					// `CSS.supports` is still expected to return `false` then:
					// https://drafts.csswg.org/css-conditional-4/#typedef-supports-selector-fn
					// https://drafts.csswg.org/css-conditional-4/#dfn-support-selector
					if ( support.cssSupportsSelector &&

						// eslint-disable-next-line no-undef
						!CSS.supports( "selector(:is(" + newSelector + "))" ) ) {

						// Support: IE 11+
						// Throw to get to the same code path as an error directly in qSA.
						// Note: once we only support browser supporting
						// `CSS.supports('selector(...)')`, we can most likely drop
						// the `try-catch`. IE doesn't implement the API.
						throw new Error();
					}

					push.apply( results,
						newContext.querySelectorAll( newSelector )
					);
					return results;
				} catch ( qsaError ) {
					nonnativeSelectorCache( selector, true );
				} finally {
					if ( nid === expando ) {
						context.removeAttribute( "id" );
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {function(string, object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {

		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key + " " ) > Expr.cacheLength ) {

			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return ( cache[ key + " " ] = value );
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created element and returns a boolean result
 */
function assert( fn ) {
	var el = document.createElement( "fieldset" );

	try {
		return !!fn( el );
	} catch ( e ) {
		return false;
	} finally {

		// Remove from its parent by default
		if ( el.parentNode ) {
			el.parentNode.removeChild( el );
		}

		// release memory in IE
		el = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split( "|" ),
		i = arr.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[ i ] ] = handler;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			a.sourceIndex - b.sourceIndex;

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( ( cur = cur.nextSibling ) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return ( name === "input" || name === "button" ) && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for :enabled/:disabled
 * @param {Boolean} disabled true for :disabled; false for :enabled
 */
function createDisabledPseudo( disabled ) {

	// Known :disabled false positives: fieldset[disabled] > legend:nth-of-type(n+2) :can-disable
	return function( elem ) {

		// Only certain elements can match :enabled or :disabled
		// https://html.spec.whatwg.org/multipage/scripting.html#selector-enabled
		// https://html.spec.whatwg.org/multipage/scripting.html#selector-disabled
		if ( "form" in elem ) {

			// Check for inherited disabledness on relevant non-disabled elements:
			// * listed form-associated elements in a disabled fieldset
			//   https://html.spec.whatwg.org/multipage/forms.html#category-listed
			//   https://html.spec.whatwg.org/multipage/forms.html#concept-fe-disabled
			// * option elements in a disabled optgroup
			//   https://html.spec.whatwg.org/multipage/forms.html#concept-option-disabled
			// All such elements have a "form" property.
			if ( elem.parentNode && elem.disabled === false ) {

				// Option elements defer to a parent optgroup if present
				if ( "label" in elem ) {
					if ( "label" in elem.parentNode ) {
						return elem.parentNode.disabled === disabled;
					} else {
						return elem.disabled === disabled;
					}
				}

				// Support: IE 6 - 11
				// Use the isDisabled shortcut property to check for disabled fieldset ancestors
				return elem.isDisabled === disabled ||

					// Where there is no isDisabled, check manually
					/* jshint -W018 */
					elem.isDisabled !== !disabled &&
					inDisabledFieldset( elem ) === disabled;
			}

			return elem.disabled === disabled;

		// Try to winnow out elements that can't be disabled before trusting the disabled property.
		// Some victims get caught in our net (label, legend, menu, track), but it shouldn't
		// even exist on them, let alone have a boolean value.
		} else if ( "label" in elem ) {
			return elem.disabled === disabled;
		}

		// Remaining elements are neither :enabled nor :disabled
		return false;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction( function( argument ) {
		argument = +argument;
		return markFunction( function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ ( j = matchIndexes[ i ] ) ] ) {
					seed[ j ] = !( matches[ j ] = seed[ j ] );
				}
			}
		} );
	} );
}

/**
 * Checks a node for validity as a Sizzle context
 * @param {Element|Object=} context
 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
 */
function testContext( context ) {
	return context && typeof context.getElementsByTagName !== "undefined" && context;
}

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Detects XML nodes
 * @param {Element|Object} elem An element or a document
 * @returns {Boolean} True iff elem is a non-HTML XML node
 */
isXML = Sizzle.isXML = function( elem ) {
	var namespace = elem && elem.namespaceURI,
		docElem = elem && ( elem.ownerDocument || elem ).documentElement;

	// Support: IE <=8
	// Assume HTML when documentElement doesn't yet exist, such as inside loading iframes
	// https://bugs.jquery.com/ticket/4833
	return !rhtml.test( namespace || docElem && docElem.nodeName || "HTML" );
};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var hasCompare, subWindow,
		doc = node ? node.ownerDocument || node : preferredDoc;

	// Return early if doc is invalid or already selected
	// Support: IE 11+, Edge 17 - 18+
	// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
	// two documents; shallow comparisons work.
	// eslint-disable-next-line eqeqeq
	if ( doc == document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Update global variables
	document = doc;
	docElem = document.documentElement;
	documentIsHTML = !isXML( document );

	// Support: IE 9 - 11+, Edge 12 - 18+
	// Accessing iframe documents after unload throws "permission denied" errors (jQuery #13936)
	// Support: IE 11+, Edge 17 - 18+
	// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
	// two documents; shallow comparisons work.
	// eslint-disable-next-line eqeqeq
	if ( preferredDoc != document &&
		( subWindow = document.defaultView ) && subWindow.top !== subWindow ) {

		// Support: IE 11, Edge
		if ( subWindow.addEventListener ) {
			subWindow.addEventListener( "unload", unloadHandler, false );

		// Support: IE 9 - 10 only
		} else if ( subWindow.attachEvent ) {
			subWindow.attachEvent( "onunload", unloadHandler );
		}
	}

	// Support: IE 8 - 11+, Edge 12 - 18+, Chrome <=16 - 25 only, Firefox <=3.6 - 31 only,
	// Safari 4 - 5 only, Opera <=11.6 - 12.x only
	// IE/Edge & older browsers don't support the :scope pseudo-class.
	// Support: Safari 6.0 only
	// Safari 6.0 supports :scope but it's an alias of :root there.
	support.scope = assert( function( el ) {
		docElem.appendChild( el ).appendChild( document.createElement( "div" ) );
		return typeof el.querySelectorAll !== "undefined" &&
			!el.querySelectorAll( ":scope fieldset div" ).length;
	} );

	// Support: Chrome 105+, Firefox 104+, Safari 15.4+
	// Make sure forgiving mode is not used in `CSS.supports( "selector(...)" )`.
	//
	// `:is()` uses a forgiving selector list as an argument and is widely
	// implemented, so it's a good one to test against.
	support.cssSupportsSelector = assert( function() {
		/* eslint-disable no-undef */

		return CSS.supports( "selector(*)" ) &&

			// Support: Firefox 78-81 only
			// In old Firefox, `:is()` didn't use forgiving parsing. In that case,
			// fail this test as there's no selector to test against that.
			// `CSS.supports` uses unforgiving parsing
			document.querySelectorAll( ":is(:jqfake)" ) &&

			// `*` is needed as Safari & newer Chrome implemented something in between
			// for `:has()` - it throws in `qSA` if it only contains an unsupported
			// argument but multiple ones, one of which is supported, are fine.
			// We want to play safe in case `:is()` gets the same treatment.
			!CSS.supports( "selector(:is(*,:jqfake))" );

		/* eslint-enable */
	} );

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties
	// (excepting IE8 booleans)
	support.attributes = assert( function( el ) {
		el.className = "i";
		return !el.getAttribute( "className" );
	} );

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert( function( el ) {
		el.appendChild( document.createComment( "" ) );
		return !el.getElementsByTagName( "*" ).length;
	} );

	// Support: IE<9
	support.getElementsByClassName = rnative.test( document.getElementsByClassName );

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programmatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert( function( el ) {
		docElem.appendChild( el ).id = expando;
		return !document.getElementsByName || !document.getElementsByName( expando ).length;
	} );

	// ID filter and find
	if ( support.getById ) {
		Expr.filter[ "ID" ] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute( "id" ) === attrId;
			};
		};
		Expr.find[ "ID" ] = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var elem = context.getElementById( id );
				return elem ? [ elem ] : [];
			}
		};
	} else {
		Expr.filter[ "ID" ] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== "undefined" &&
					elem.getAttributeNode( "id" );
				return node && node.value === attrId;
			};
		};

		// Support: IE 6 - 7 only
		// getElementById is not reliable as a find shortcut
		Expr.find[ "ID" ] = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var node, i, elems,
					elem = context.getElementById( id );

				if ( elem ) {

					// Verify the id attribute
					node = elem.getAttributeNode( "id" );
					if ( node && node.value === id ) {
						return [ elem ];
					}

					// Fall back on getElementsByName
					elems = context.getElementsByName( id );
					i = 0;
					while ( ( elem = elems[ i++ ] ) ) {
						node = elem.getAttributeNode( "id" );
						if ( node && node.value === id ) {
							return [ elem ];
						}
					}
				}

				return [];
			}
		};
	}

	// Tag
	Expr.find[ "TAG" ] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== "undefined" ) {
				return context.getElementsByTagName( tag );

			// DocumentFragment nodes don't have gEBTN
			} else if ( support.qsa ) {
				return context.querySelectorAll( tag );
			}
		} :

		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,

				// By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( ( elem = results[ i++ ] ) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find[ "CLASS" ] = support.getElementsByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== "undefined" && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See https://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( ( support.qsa = rnative.test( document.querySelectorAll ) ) ) {

		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert( function( el ) {

			var input;

			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// https://bugs.jquery.com/ticket/12359
			docElem.appendChild( el ).innerHTML = "<a id='" + expando + "'></a>" +
				"<select id='" + expando + "-\r\\' msallowcapture=''>" +
				"<option selected=''></option></select>";

			// Support: IE8, Opera 11-12.16
			// Nothing should be selected when empty strings follow ^= or $= or *=
			// The test attribute must be unknown in Opera but "safe" for WinRT
			// https://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
			if ( el.querySelectorAll( "[msallowcapture^='']" ).length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !el.querySelectorAll( "[selected]" ).length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Support: Chrome<29, Android<4.4, Safari<7.0+, iOS<7.0+, PhantomJS<1.9.8+
			if ( !el.querySelectorAll( "[id~=" + expando + "-]" ).length ) {
				rbuggyQSA.push( "~=" );
			}

			// Support: IE 11+, Edge 15 - 18+
			// IE 11/Edge don't find elements on a `[name='']` query in some cases.
			// Adding a temporary attribute to the document before the selection works
			// around the issue.
			// Interestingly, IE 10 & older don't seem to have the issue.
			input = document.createElement( "input" );
			input.setAttribute( "name", "" );
			el.appendChild( input );
			if ( !el.querySelectorAll( "[name='']" ).length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*name" + whitespace + "*=" +
					whitespace + "*(?:''|\"\")" );
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !el.querySelectorAll( ":checked" ).length ) {
				rbuggyQSA.push( ":checked" );
			}

			// Support: Safari 8+, iOS 8+
			// https://bugs.webkit.org/show_bug.cgi?id=136851
			// In-page `selector#id sibling-combinator selector` fails
			if ( !el.querySelectorAll( "a#" + expando + "+*" ).length ) {
				rbuggyQSA.push( ".#.+[+~]" );
			}

			// Support: Firefox <=3.6 - 5 only
			// Old Firefox doesn't throw on a badly-escaped identifier.
			el.querySelectorAll( "\\\f" );
			rbuggyQSA.push( "[\\r\\n\\f]" );
		} );

		assert( function( el ) {
			el.innerHTML = "<a href='' disabled='disabled'></a>" +
				"<select disabled='disabled'><option/></select>";

			// Support: Windows 8 Native Apps
			// The type and name attributes are restricted during .innerHTML assignment
			var input = document.createElement( "input" );
			input.setAttribute( "type", "hidden" );
			el.appendChild( input ).setAttribute( "name", "D" );

			// Support: IE8
			// Enforce case-sensitivity of name attribute
			if ( el.querySelectorAll( "[name=d]" ).length ) {
				rbuggyQSA.push( "name" + whitespace + "*[*^$|!~]?=" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( el.querySelectorAll( ":enabled" ).length !== 2 ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Support: IE9-11+
			// IE's :disabled selector does not pick up the children of disabled fieldsets
			docElem.appendChild( el ).disabled = true;
			if ( el.querySelectorAll( ":disabled" ).length !== 2 ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Support: Opera 10 - 11 only
			// Opera 10-11 does not throw on post-comma invalid pseudos
			el.querySelectorAll( "*,:x" );
			rbuggyQSA.push( ",.*:" );
		} );
	}

	if ( ( support.matchesSelector = rnative.test( ( matches = docElem.matches ||
		docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector ) ) ) ) {

		assert( function( el ) {

			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( el, "*" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( el, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		} );
	}

	if ( !support.cssSupportsSelector ) {

		// Support: Chrome 105+, Safari 15.4+
		// `:has()` uses a forgiving selector list as an argument so our regular
		// `try-catch` mechanism fails to catch `:has()` with arguments not supported
		// natively like `:has(:contains("Foo"))`. Where supported & spec-compliant,
		// we now use `CSS.supports("selector(:is(SELECTOR_TO_BE_TESTED))")`, but
		// outside that we mark `:has` as buggy.
		rbuggyQSA.push( ":has" );
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join( "|" ) );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join( "|" ) );

	/* Contains
	---------------------------------------------------------------------- */
	hasCompare = rnative.test( docElem.compareDocumentPosition );

	// Element contains another
	// Purposefully self-exclusive
	// As in, an element does not contain itself
	contains = hasCompare || rnative.test( docElem.contains ) ?
		function( a, b ) {

			// Support: IE <9 only
			// IE doesn't have `contains` on `document` so we need to check for
			// `documentElement` presence.
			// We need to fall back to `a` when `documentElement` is missing
			// as `ownerDocument` of elements within `<template/>` may have
			// a null one - a default behavior of all modern browsers.
			var adown = a.nodeType === 9 && a.documentElement || a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			) );
		} :
		function( a, b ) {
			if ( b ) {
				while ( ( b = b.parentNode ) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = hasCompare ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		// Sort on method existence if only one input has compareDocumentPosition
		var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
		if ( compare ) {
			return compare;
		}

		// Calculate position if both inputs belong to the same document
		// Support: IE 11+, Edge 17 - 18+
		// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
		// two documents; shallow comparisons work.
		// eslint-disable-next-line eqeqeq
		compare = ( a.ownerDocument || a ) == ( b.ownerDocument || b ) ?
			a.compareDocumentPosition( b ) :

			// Otherwise we know they are disconnected
			1;

		// Disconnected nodes
		if ( compare & 1 ||
			( !support.sortDetached && b.compareDocumentPosition( a ) === compare ) ) {

			// Choose the first element that is related to our preferred document
			// Support: IE 11+, Edge 17 - 18+
			// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
			// two documents; shallow comparisons work.
			// eslint-disable-next-line eqeqeq
			if ( a == document || a.ownerDocument == preferredDoc &&
				contains( preferredDoc, a ) ) {
				return -1;
			}

			// Support: IE 11+, Edge 17 - 18+
			// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
			// two documents; shallow comparisons work.
			// eslint-disable-next-line eqeqeq
			if ( b == document || b.ownerDocument == preferredDoc &&
				contains( preferredDoc, b ) ) {
				return 1;
			}

			// Maintain original order
			return sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;
		}

		return compare & 4 ? -1 : 1;
	} :
	function( a, b ) {

		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Parentless nodes are either documents or disconnected
		if ( !aup || !bup ) {

			// Support: IE 11+, Edge 17 - 18+
			// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
			// two documents; shallow comparisons work.
			/* eslint-disable eqeqeq */
			return a == document ? -1 :
				b == document ? 1 :
				/* eslint-enable eqeqeq */
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( ( cur = cur.parentNode ) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( ( cur = cur.parentNode ) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[ i ] === bp[ i ] ) {
			i++;
		}

		return i ?

			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[ i ], bp[ i ] ) :

			// Otherwise nodes in our document sort first
			// Support: IE 11+, Edge 17 - 18+
			// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
			// two documents; shallow comparisons work.
			/* eslint-disable eqeqeq */
			ap[ i ] == preferredDoc ? -1 :
			bp[ i ] == preferredDoc ? 1 :
			/* eslint-enable eqeqeq */
			0;
	};

	return document;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	setDocument( elem );

	if ( support.matchesSelector && documentIsHTML &&
		!nonnativeSelectorCache[ expr + " " ] &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||

				// As well, disconnected nodes are said to be in a document
				// fragment in IE 9
				elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch ( e ) {
			nonnativeSelectorCache( expr, true );
		}
	}

	return Sizzle( expr, document, null, [ elem ] ).length > 0;
};

Sizzle.contains = function( context, elem ) {

	// Set document vars if needed
	// Support: IE 11+, Edge 17 - 18+
	// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
	// two documents; shallow comparisons work.
	// eslint-disable-next-line eqeqeq
	if ( ( context.ownerDocument || context ) != document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {

	// Set document vars if needed
	// Support: IE 11+, Edge 17 - 18+
	// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
	// two documents; shallow comparisons work.
	// eslint-disable-next-line eqeqeq
	if ( ( elem.ownerDocument || elem ) != document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],

		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val !== undefined ?
		val :
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			( val = elem.getAttributeNode( name ) ) && val.specified ?
				val.value :
				null;
};

Sizzle.escape = function( sel ) {
	return ( sel + "" ).replace( rcssescape, fcssescape );
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( ( elem = results[ i++ ] ) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	// Clear input after sorting to release objects
	// See https://github.com/jquery/sizzle/pull/225
	sortInput = null;

	return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {

		// If no nodeType, this is expected to be an array
		while ( ( node = elem[ i++ ] ) ) {

			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {

		// Use textContent for elements
		// innerText usage removed for consistency of new lines (jQuery #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {

			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}

	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[ 1 ] = match[ 1 ].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[ 3 ] = ( match[ 3 ] || match[ 4 ] ||
				match[ 5 ] || "" ).replace( runescape, funescape );

			if ( match[ 2 ] === "~=" ) {
				match[ 3 ] = " " + match[ 3 ] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {

			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[ 1 ] = match[ 1 ].toLowerCase();

			if ( match[ 1 ].slice( 0, 3 ) === "nth" ) {

				// nth-* requires argument
				if ( !match[ 3 ] ) {
					Sizzle.error( match[ 0 ] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[ 4 ] = +( match[ 4 ] ?
					match[ 5 ] + ( match[ 6 ] || 1 ) :
					2 * ( match[ 3 ] === "even" || match[ 3 ] === "odd" ) );
				match[ 5 ] = +( ( match[ 7 ] + match[ 8 ] ) || match[ 3 ] === "odd" );

				// other types prohibit arguments
			} else if ( match[ 3 ] ) {
				Sizzle.error( match[ 0 ] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[ 6 ] && match[ 2 ];

			if ( matchExpr[ "CHILD" ].test( match[ 0 ] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[ 3 ] ) {
				match[ 2 ] = match[ 4 ] || match[ 5 ] || "";

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&

				// Get excess from tokenize (recursively)
				( excess = tokenize( unquoted, true ) ) &&

				// advance to the next closing parenthesis
				( excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length ) ) {

				// excess is a negative index
				match[ 0 ] = match[ 0 ].slice( 0, excess );
				match[ 2 ] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() {
					return true;
				} :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				( pattern = new RegExp( "(^|" + whitespace +
					")" + className + "(" + whitespace + "|$)" ) ) && classCache(
						className, function( elem ) {
							return pattern.test(
								typeof elem.className === "string" && elem.className ||
								typeof elem.getAttribute !== "undefined" &&
									elem.getAttribute( "class" ) ||
								""
							);
				} );
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				/* eslint-disable max-len */

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result.replace( rwhitespace, " " ) + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
				/* eslint-enable max-len */

			};
		},

		"CHILD": function( type, what, _argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, _context, xml ) {
					var cache, uniqueCache, outerCache, node, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType,
						diff = false;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( ( node = node[ dir ] ) ) {
									if ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) {

										return false;
									}
								}

								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {

							// Seek `elem` from a previously-cached index

							// ...in a gzip-friendly way
							node = parent;
							outerCache = node[ expando ] || ( node[ expando ] = {} );

							// Support: IE <9 only
							// Defend against cloned attroperties (jQuery gh-1709)
							uniqueCache = outerCache[ node.uniqueID ] ||
								( outerCache[ node.uniqueID ] = {} );

							cache = uniqueCache[ type ] || [];
							nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
							diff = nodeIndex && cache[ 2 ];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( ( node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								( diff = nodeIndex = 0 ) || start.pop() ) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									uniqueCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						} else {

							// Use previously-cached element index if available
							if ( useCache ) {

								// ...in a gzip-friendly way
								node = elem;
								outerCache = node[ expando ] || ( node[ expando ] = {} );

								// Support: IE <9 only
								// Defend against cloned attroperties (jQuery gh-1709)
								uniqueCache = outerCache[ node.uniqueID ] ||
									( outerCache[ node.uniqueID ] = {} );

								cache = uniqueCache[ type ] || [];
								nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
								diff = nodeIndex;
							}

							// xml :nth-child(...)
							// or :nth-last-child(...) or :nth(-last)?-of-type(...)
							if ( diff === false ) {

								// Use the same loop as above to seek `elem` from the start
								while ( ( node = ++nodeIndex && node && node[ dir ] ||
									( diff = nodeIndex = 0 ) || start.pop() ) ) {

									if ( ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) &&
										++diff ) {

										// Cache the index of each encountered element
										if ( useCache ) {
											outerCache = node[ expando ] ||
												( node[ expando ] = {} );

											// Support: IE <9 only
											// Defend against cloned attroperties (jQuery gh-1709)
											uniqueCache = outerCache[ node.uniqueID ] ||
												( outerCache[ node.uniqueID ] = {} );

											uniqueCache[ type ] = [ dirruns, diff ];
										}

										if ( node === elem ) {
											break;
										}
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {

			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction( function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf( seed, matched[ i ] );
							seed[ idx ] = !( matches[ idx ] = matched[ i ] );
						}
					} ) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {

		// Potentially complex pseudos
		"not": markFunction( function( selector ) {

			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction( function( seed, matches, _context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( ( elem = unmatched[ i ] ) ) {
							seed[ i ] = !( matches[ i ] = elem );
						}
					}
				} ) :
				function( elem, _context, xml ) {
					input[ 0 ] = elem;
					matcher( input, null, xml, results );

					// Don't keep the element (issue #299)
					input[ 0 ] = null;
					return !results.pop();
				};
		} ),

		"has": markFunction( function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		} ),

		"contains": markFunction( function( text ) {
			text = text.replace( runescape, funescape );
			return function( elem ) {
				return ( elem.textContent || getText( elem ) ).indexOf( text ) > -1;
			};
		} ),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {

			// lang value must be a valid identifier
			if ( !ridentifier.test( lang || "" ) ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( ( elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute( "xml:lang" ) || elem.getAttribute( "lang" ) ) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( ( elem = elem.parentNode ) && elem.nodeType === 1 );
				return false;
			};
		} ),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement &&
				( !document.hasFocus || document.hasFocus() ) &&
				!!( elem.type || elem.href || ~elem.tabIndex );
		},

		// Boolean properties
		"enabled": createDisabledPseudo( false ),
		"disabled": createDisabledPseudo( true ),

		"checked": function( elem ) {

			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return ( nodeName === "input" && !!elem.checked ) ||
				( nodeName === "option" && !!elem.selected );
		},

		"selected": function( elem ) {

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {

			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
			//   but not by others (comment: 8; processing instruction: 7; etc.)
			// nodeType < 6 works because attributes (2) do not appear as children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeType < 6 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos[ "empty" ]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&

				// Support: IE <10 only
				// New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
				( ( attr = elem.getAttribute( "type" ) ) == null ||
					attr.toLowerCase() === "text" );
		},

		// Position-in-collection
		"first": createPositionalPseudo( function() {
			return [ 0 ];
		} ),

		"last": createPositionalPseudo( function( _matchIndexes, length ) {
			return [ length - 1 ];
		} ),

		"eq": createPositionalPseudo( function( _matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		} ),

		"even": createPositionalPseudo( function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		} ),

		"odd": createPositionalPseudo( function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		} ),

		"lt": createPositionalPseudo( function( matchIndexes, length, argument ) {
			var i = argument < 0 ?
				argument + length :
				argument > length ?
					length :
					argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		} ),

		"gt": createPositionalPseudo( function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		} )
	}
};

Expr.pseudos[ "nth" ] = Expr.pseudos[ "eq" ];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

tokenize = Sizzle.tokenize = function( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || ( match = rcomma.exec( soFar ) ) ) {
			if ( match ) {

				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[ 0 ].length ) || soFar;
			}
			groups.push( ( tokens = [] ) );
		}

		matched = false;

		// Combinators
		if ( ( match = rcombinators.exec( soFar ) ) ) {
			matched = match.shift();
			tokens.push( {
				value: matched,

				// Cast descendant combinators to space
				type: match[ 0 ].replace( rtrim, " " )
			} );
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( ( match = matchExpr[ type ].exec( soFar ) ) && ( !preFilters[ type ] ||
				( match = preFilters[ type ]( match ) ) ) ) {
				matched = match.shift();
				tokens.push( {
					value: matched,
					type: type,
					matches: match
				} );
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :

			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
};

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[ i ].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		skip = combinator.next,
		key = skip || dir,
		checkNonElements = base && key === "parentNode",
		doneName = done++;

	return combinator.first ?

		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( ( elem = elem[ dir ] ) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
			return false;
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var oldCache, uniqueCache, outerCache,
				newCache = [ dirruns, doneName ];

			// We can't set arbitrary data on XML nodes, so they don't benefit from combinator caching
			if ( xml ) {
				while ( ( elem = elem[ dir ] ) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( ( elem = elem[ dir ] ) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || ( elem[ expando ] = {} );

						// Support: IE <9 only
						// Defend against cloned attroperties (jQuery gh-1709)
						uniqueCache = outerCache[ elem.uniqueID ] ||
							( outerCache[ elem.uniqueID ] = {} );

						if ( skip && skip === elem.nodeName.toLowerCase() ) {
							elem = elem[ dir ] || elem;
						} else if ( ( oldCache = uniqueCache[ key ] ) &&
							oldCache[ 0 ] === dirruns && oldCache[ 1 ] === doneName ) {

							// Assign to newCache so results back-propagate to previous elements
							return ( newCache[ 2 ] = oldCache[ 2 ] );
						} else {

							// Reuse newcache so results back-propagate to previous elements
							uniqueCache[ key ] = newCache;

							// A match means we're done; a fail means we have to keep checking
							if ( ( newCache[ 2 ] = matcher( elem, context, xml ) ) ) {
								return true;
							}
						}
					}
				}
			}
			return false;
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[ i ]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[ 0 ];
}

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[ i ], results );
	}
	return results;
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( ( elem = unmatched[ i ] ) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction( function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts(
				selector || "*",
				context.nodeType ? [ context ] : context,
				[]
			),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?

				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( ( elem = temp[ i ] ) ) {
					matcherOut[ postMap[ i ] ] = !( matcherIn[ postMap[ i ] ] = elem );
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {

					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( ( elem = matcherOut[ i ] ) ) {

							// Restore matcherIn since elem is not yet a final match
							temp.push( ( matcherIn[ i ] = elem ) );
						}
					}
					postFinder( null, ( matcherOut = [] ), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( ( elem = matcherOut[ i ] ) &&
						( temp = postFinder ? indexOf( seed, elem ) : preMap[ i ] ) > -1 ) {

						seed[ temp ] = !( results[ temp ] = elem );
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	} );
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[ 0 ].type ],
		implicitRelative = leadingRelative || Expr.relative[ " " ],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			var ret = ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				( checkContext = context ).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );

			// Avoid hanging onto element (issue #299)
			checkContext = null;
			return ret;
		} ];

	for ( ; i < len; i++ ) {
		if ( ( matcher = Expr.relative[ tokens[ i ].type ] ) ) {
			matchers = [ addCombinator( elementMatcher( matchers ), matcher ) ];
		} else {
			matcher = Expr.filter[ tokens[ i ].type ].apply( null, tokens[ i ].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {

				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[ j ].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(

					// If the preceding token was a descendant combinator, insert an implicit any-element `*`
					tokens
						.slice( 0, i - 1 )
						.concat( { value: tokens[ i - 2 ].type === " " ? "*" : "" } )
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( ( tokens = tokens.slice( j ) ) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	var bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, outermost ) {
			var elem, j, matcher,
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				setMatched = [],
				contextBackup = outermostContext,

				// We must always have either seed elements or outermost context
				elems = seed || byElement && Expr.find[ "TAG" ]( "*", outermost ),

				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = ( dirruns += contextBackup == null ? 1 : Math.random() || 0.1 ),
				len = elems.length;

			if ( outermost ) {

				// Support: IE 11+, Edge 17 - 18+
				// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
				// two documents; shallow comparisons work.
				// eslint-disable-next-line eqeqeq
				outermostContext = context == document || context || outermost;
			}

			// Add elements passing elementMatchers directly to results
			// Support: IE<9, Safari
			// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
			for ( ; i !== len && ( elem = elems[ i ] ) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;

					// Support: IE 11+, Edge 17 - 18+
					// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
					// two documents; shallow comparisons work.
					// eslint-disable-next-line eqeqeq
					if ( !context && elem.ownerDocument != document ) {
						setDocument( elem );
						xml = !documentIsHTML;
					}
					while ( ( matcher = elementMatchers[ j++ ] ) ) {
						if ( matcher( elem, context || document, xml ) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {

					// They will have gone through all possible matchers
					if ( ( elem = !matcher && elem ) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// `i` is now the count of elements visited above, and adding it to `matchedCount`
			// makes the latter nonnegative.
			matchedCount += i;

			// Apply set filters to unmatched elements
			// NOTE: This can be skipped if there are no unmatched elements (i.e., `matchedCount`
			// equals `i`), unless we didn't visit _any_ elements in the above loop because we have
			// no element matchers and no seed.
			// Incrementing an initially-string "0" `i` allows `i` to remain a string only in that
			// case, which will result in a "00" `matchedCount` that differs from `i` but is also
			// numerically zero.
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( ( matcher = setMatchers[ j++ ] ) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {

					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !( unmatched[ i ] || setMatched[ i ] ) ) {
								setMatched[ i ] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, match /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {

		// Generate a function of recursive functions that can be used to check each element
		if ( !match ) {
			match = tokenize( selector );
		}
		i = match.length;
		while ( i-- ) {
			cached = matcherFromTokens( match[ i ] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache(
			selector,
			matcherFromGroupMatchers( elementMatchers, setMatchers )
		);

		// Save selector and tokenization
		cached.selector = selector;
	}
	return cached;
};

/**
 * A low-level selection function that works with Sizzle's compiled
 *  selector functions
 * @param {String|Function} selector A selector or a pre-compiled
 *  selector function built with Sizzle.compile
 * @param {Element} context
 * @param {Array} [results]
 * @param {Array} [seed] A set of elements to match against
 */
select = Sizzle.select = function( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		compiled = typeof selector === "function" && selector,
		match = !seed && tokenize( ( selector = compiled.selector || selector ) );

	results = results || [];

	// Try to minimize operations if there is only one selector in the list and no seed
	// (the latter of which guarantees us context)
	if ( match.length === 1 ) {

		// Reduce context if the leading compound selector is an ID
		tokens = match[ 0 ] = match[ 0 ].slice( 0 );
		if ( tokens.length > 2 && ( token = tokens[ 0 ] ).type === "ID" &&
			context.nodeType === 9 && documentIsHTML && Expr.relative[ tokens[ 1 ].type ] ) {

			context = ( Expr.find[ "ID" ]( token.matches[ 0 ]
				.replace( runescape, funescape ), context ) || [] )[ 0 ];
			if ( !context ) {
				return results;

			// Precompiled matchers will still verify ancestry, so step up a level
			} else if ( compiled ) {
				context = context.parentNode;
			}

			selector = selector.slice( tokens.shift().value.length );
		}

		// Fetch a seed set for right-to-left matching
		i = matchExpr[ "needsContext" ].test( selector ) ? 0 : tokens.length;
		while ( i-- ) {
			token = tokens[ i ];

			// Abort if we hit a combinator
			if ( Expr.relative[ ( type = token.type ) ] ) {
				break;
			}
			if ( ( find = Expr.find[ type ] ) ) {

				// Search, expanding context for leading sibling combinators
				if ( ( seed = find(
					token.matches[ 0 ].replace( runescape, funescape ),
					rsibling.test( tokens[ 0 ].type ) && testContext( context.parentNode ) ||
						context
				) ) ) {

					// If seed is empty or no tokens remain, we can return early
					tokens.splice( i, 1 );
					selector = seed.length && toSelector( tokens );
					if ( !selector ) {
						push.apply( results, seed );
						return results;
					}

					break;
				}
			}
		}
	}

	// Compile and execute a filtering function if one is not provided
	// Provide `match` to avoid retokenization if we modified the selector above
	( compiled || compile( selector, match ) )(
		seed,
		context,
		!documentIsHTML,
		results,
		!context || rsibling.test( selector ) && testContext( context.parentNode ) || context
	);
	return results;
};

// One-time assignments

// Sort stability
support.sortStable = expando.split( "" ).sort( sortOrder ).join( "" ) === expando;

// Support: Chrome 14-35+
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = !!hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert( function( el ) {

	// Should return 1, but returns 4 (following)
	return el.compareDocumentPosition( document.createElement( "fieldset" ) ) & 1;
} );

// Support: IE<8
// Prevent attribute/property "interpolation"
// https://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert( function( el ) {
	el.innerHTML = "<a href='#'></a>";
	return el.firstChild.getAttribute( "href" ) === "#";
} ) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	} );
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert( function( el ) {
	el.innerHTML = "<input/>";
	el.firstChild.setAttribute( "value", "" );
	return el.firstChild.getAttribute( "value" ) === "";
} ) ) {
	addHandle( "value", function( elem, _name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	} );
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert( function( el ) {
	return el.getAttribute( "disabled" ) == null;
} ) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return elem[ name ] === true ? name.toLowerCase() :
				( val = elem.getAttributeNode( name ) ) && val.specified ?
					val.value :
					null;
		}
	} );
}

return Sizzle;

} )( window );



jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;

// Deprecated
jQuery.expr[ ":" ] = jQuery.expr.pseudos;
jQuery.uniqueSort = jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;
jQuery.escapeSelector = Sizzle.escape;




var dir = function( elem, dir, until ) {
	var matched = [],
		truncate = until !== undefined;

	while ( ( elem = elem[ dir ] ) && elem.nodeType !== 9 ) {
		if ( elem.nodeType === 1 ) {
			if ( truncate && jQuery( elem ).is( until ) ) {
				break;
			}
			matched.push( elem );
		}
	}
	return matched;
};


var siblings = function( n, elem ) {
	var matched = [];

	for ( ; n; n = n.nextSibling ) {
		if ( n.nodeType === 1 && n !== elem ) {
			matched.push( n );
		}
	}

	return matched;
};


var rneedsContext = jQuery.expr.match.needsContext;



function nodeName( elem, name ) {

	return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();

}
var rsingleTag = ( /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i );



// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			return !!qualifier.call( elem, i, elem ) !== not;
		} );
	}

	// Single element
	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		} );
	}

	// Arraylike of elements (jQuery, arguments, Array)
	if ( typeof qualifier !== "string" ) {
		return jQuery.grep( elements, function( elem ) {
			return ( indexOf.call( qualifier, elem ) > -1 ) !== not;
		} );
	}

	// Filtered directly for both simple and complex selectors
	return jQuery.filter( qualifier, elements, not );
}

jQuery.filter = function( expr, elems, not ) {
	var elem = elems[ 0 ];

	if ( not ) {
		expr = ":not(" + expr + ")";
	}

	if ( elems.length === 1 && elem.nodeType === 1 ) {
		return jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [];
	}

	return jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
		return elem.nodeType === 1;
	} ) );
};

jQuery.fn.extend( {
	find: function( selector ) {
		var i, ret,
			len = this.length,
			self = this;

		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter( function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			} ) );
		}

		ret = this.pushStack( [] );

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		return len > 1 ? jQuery.uniqueSort( ret ) : ret;
	},
	filter: function( selector ) {
		return this.pushStack( winnow( this, selector || [], false ) );
	},
	not: function( selector ) {
		return this.pushStack( winnow( this, selector || [], true ) );
	},
	is: function( selector ) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	}
} );


// Initialize a jQuery object


// A central reference to the root jQuery(document)
var rootjQuery,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (trac-9521)
	// Strict HTML recognition (trac-11290: must start with <)
	// Shortcut simple #id case for speed
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/,

	init = jQuery.fn.init = function( selector, context, root ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Method init() accepts an alternate rootjQuery
		// so migrate can support jQuery.sub (gh-2101)
		root = root || rootjQuery;

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector[ 0 ] === "<" &&
				selector[ selector.length - 1 ] === ">" &&
				selector.length >= 3 ) {

				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && ( match[ 1 ] || !context ) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[ 1 ] ) {
					context = context instanceof jQuery ? context[ 0 ] : context;

					// Option to run scripts is true for back-compat
					// Intentionally let the error be thrown if parseHTML is not present
					jQuery.merge( this, jQuery.parseHTML(
						match[ 1 ],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[ 1 ] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {

							// Properties of context are called as methods if possible
							if ( isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[ 2 ] );

					if ( elem ) {

						// Inject the element directly into the jQuery object
						this[ 0 ] = elem;
						this.length = 1;
					}
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || root ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this[ 0 ] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( isFunction( selector ) ) {
			return root.ready !== undefined ?
				root.ready( selector ) :

				// Execute immediately if ready is not present
				selector( jQuery );
		}

		return jQuery.makeArray( selector, this );
	};

// Give the init function the jQuery prototype for later instantiation
init.prototype = jQuery.fn;

// Initialize central reference
rootjQuery = jQuery( document );


var rparentsprev = /^(?:parents|prev(?:Until|All))/,

	// Methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend( {
	has: function( target ) {
		var targets = jQuery( target, this ),
			l = targets.length;

		return this.filter( function() {
			var i = 0;
			for ( ; i < l; i++ ) {
				if ( jQuery.contains( this, targets[ i ] ) ) {
					return true;
				}
			}
		} );
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			matched = [],
			targets = typeof selectors !== "string" && jQuery( selectors );

		// Positional selectors never match, since there's no _selection_ context
		if ( !rneedsContext.test( selectors ) ) {
			for ( ; i < l; i++ ) {
				for ( cur = this[ i ]; cur && cur !== context; cur = cur.parentNode ) {

					// Always skip document fragments
					if ( cur.nodeType < 11 && ( targets ?
						targets.index( cur ) > -1 :

						// Don't pass non-elements to Sizzle
						cur.nodeType === 1 &&
							jQuery.find.matchesSelector( cur, selectors ) ) ) {

						matched.push( cur );
						break;
					}
				}
			}
		}

		return this.pushStack( matched.length > 1 ? jQuery.uniqueSort( matched ) : matched );
	},

	// Determine the position of an element within the set
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[ 0 ] && this[ 0 ].parentNode ) ? this.first().prevAll().length : -1;
		}

		// Index in selector
		if ( typeof elem === "string" ) {
			return indexOf.call( jQuery( elem ), this[ 0 ] );
		}

		// Locate the position of the desired element
		return indexOf.call( this,

			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[ 0 ] : elem
		);
	},

	add: function( selector, context ) {
		return this.pushStack(
			jQuery.uniqueSort(
				jQuery.merge( this.get(), jQuery( selector, context ) )
			)
		);
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter( selector )
		);
	}
} );

function sibling( cur, dir ) {
	while ( ( cur = cur[ dir ] ) && cur.nodeType !== 1 ) {}
	return cur;
}

jQuery.each( {
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, _i, until ) {
		return dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, _i, until ) {
		return dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, _i, until ) {
		return dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return siblings( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return siblings( elem.firstChild );
	},
	contents: function( elem ) {
		if ( elem.contentDocument != null &&

			// Support: IE 11+
			// <object> elements with no `data` attribute has an object
			// `contentDocument` with a `null` prototype.
			getProto( elem.contentDocument ) ) {

			return elem.contentDocument;
		}

		// Support: IE 9 - 11 only, iOS 7 only, Android Browser <=4.3 only
		// Treat the template element as a regular one in browsers that
		// don't support it.
		if ( nodeName( elem, "template" ) ) {
			elem = elem.content || elem;
		}

		return jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var matched = jQuery.map( this, fn, until );

		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			matched = jQuery.filter( selector, matched );
		}

		if ( this.length > 1 ) {

			// Remove duplicates
			if ( !guaranteedUnique[ name ] ) {
				jQuery.uniqueSort( matched );
			}

			// Reverse order for parents* and prev-derivatives
			if ( rparentsprev.test( name ) ) {
				matched.reverse();
			}
		}

		return this.pushStack( matched );
	};
} );
var rnothtmlwhite = ( /[^\x20\t\r\n\f]+/g );



// Convert String-formatted options into Object-formatted ones
function createOptions( options ) {
	var object = {};
	jQuery.each( options.match( rnothtmlwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	} );
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		createOptions( options ) :
		jQuery.extend( {}, options );

	var // Flag to know if list is currently firing
		firing,

		// Last fire value for non-forgettable lists
		memory,

		// Flag to know if list was already fired
		fired,

		// Flag to prevent firing
		locked,

		// Actual callback list
		list = [],

		// Queue of execution data for repeatable lists
		queue = [],

		// Index of currently firing callback (modified by add/remove as needed)
		firingIndex = -1,

		// Fire callbacks
		fire = function() {

			// Enforce single-firing
			locked = locked || options.once;

			// Execute callbacks for all pending executions,
			// respecting firingIndex overrides and runtime changes
			fired = firing = true;
			for ( ; queue.length; firingIndex = -1 ) {
				memory = queue.shift();
				while ( ++firingIndex < list.length ) {

					// Run callback and check for early termination
					if ( list[ firingIndex ].apply( memory[ 0 ], memory[ 1 ] ) === false &&
						options.stopOnFalse ) {

						// Jump to end and forget the data so .add doesn't re-fire
						firingIndex = list.length;
						memory = false;
					}
				}
			}

			// Forget the data if we're done with it
			if ( !options.memory ) {
				memory = false;
			}

			firing = false;

			// Clean up if we're done firing for good
			if ( locked ) {

				// Keep an empty list if we have data for future add calls
				if ( memory ) {
					list = [];

				// Otherwise, this object is spent
				} else {
					list = "";
				}
			}
		},

		// Actual Callbacks object
		self = {

			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {

					// If we have memory from a past run, we should fire after adding
					if ( memory && !firing ) {
						firingIndex = list.length - 1;
						queue.push( memory );
					}

					( function add( args ) {
						jQuery.each( args, function( _, arg ) {
							if ( isFunction( arg ) ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && toType( arg ) !== "string" ) {

								// Inspect recursively
								add( arg );
							}
						} );
					} )( arguments );

					if ( memory && !firing ) {
						fire();
					}
				}
				return this;
			},

			// Remove a callback from the list
			remove: function() {
				jQuery.each( arguments, function( _, arg ) {
					var index;
					while ( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
						list.splice( index, 1 );

						// Handle firing indexes
						if ( index <= firingIndex ) {
							firingIndex--;
						}
					}
				} );
				return this;
			},

			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ?
					jQuery.inArray( fn, list ) > -1 :
					list.length > 0;
			},

			// Remove all callbacks from the list
			empty: function() {
				if ( list ) {
					list = [];
				}
				return this;
			},

			// Disable .fire and .add
			// Abort any current/pending executions
			// Clear all callbacks and values
			disable: function() {
				locked = queue = [];
				list = memory = "";
				return this;
			},
			disabled: function() {
				return !list;
			},

			// Disable .fire
			// Also disable .add unless we have memory (since it would have no effect)
			// Abort any pending executions
			lock: function() {
				locked = queue = [];
				if ( !memory && !firing ) {
					list = memory = "";
				}
				return this;
			},
			locked: function() {
				return !!locked;
			},

			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( !locked ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					queue.push( args );
					if ( !firing ) {
						fire();
					}
				}
				return this;
			},

			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},

			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};


function Identity( v ) {
	return v;
}
function Thrower( ex ) {
	throw ex;
}

function adoptValue( value, resolve, reject, noValue ) {
	var method;

	try {

		// Check for promise aspect first to privilege synchronous behavior
		if ( value && isFunction( ( method = value.promise ) ) ) {
			method.call( value ).done( resolve ).fail( reject );

		// Other thenables
		} else if ( value && isFunction( ( method = value.then ) ) ) {
			method.call( value, resolve, reject );

		// Other non-thenables
		} else {

			// Control `resolve` arguments by letting Array#slice cast boolean `noValue` to integer:
			// * false: [ value ].slice( 0 ) => resolve( value )
			// * true: [ value ].slice( 1 ) => resolve()
			resolve.apply( undefined, [ value ].slice( noValue ) );
		}

	// For Promises/A+, convert exceptions into rejections
	// Since jQuery.when doesn't unwrap thenables, we can skip the extra checks appearing in
	// Deferred#then to conditionally suppress rejection.
	} catch ( value ) {

		// Support: Android 4.0 only
		// Strict mode functions invoked without .call/.apply get global-object context
		reject.apply( undefined, [ value ] );
	}
}

jQuery.extend( {

	Deferred: function( func ) {
		var tuples = [

				// action, add listener, callbacks,
				// ... .then handlers, argument index, [final state]
				[ "notify", "progress", jQuery.Callbacks( "memory" ),
					jQuery.Callbacks( "memory" ), 2 ],
				[ "resolve", "done", jQuery.Callbacks( "once memory" ),
					jQuery.Callbacks( "once memory" ), 0, "resolved" ],
				[ "reject", "fail", jQuery.Callbacks( "once memory" ),
					jQuery.Callbacks( "once memory" ), 1, "rejected" ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				"catch": function( fn ) {
					return promise.then( null, fn );
				},

				// Keep pipe for back-compat
				pipe: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;

					return jQuery.Deferred( function( newDefer ) {
						jQuery.each( tuples, function( _i, tuple ) {

							// Map tuples (progress, done, fail) to arguments (done, fail, progress)
							var fn = isFunction( fns[ tuple[ 4 ] ] ) && fns[ tuple[ 4 ] ];

							// deferred.progress(function() { bind to newDefer or newDefer.notify })
							// deferred.done(function() { bind to newDefer or newDefer.resolve })
							// deferred.fail(function() { bind to newDefer or newDefer.reject })
							deferred[ tuple[ 1 ] ]( function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && isFunction( returned.promise ) ) {
									returned.promise()
										.progress( newDefer.notify )
										.done( newDefer.resolve )
										.fail( newDefer.reject );
								} else {
									newDefer[ tuple[ 0 ] + "With" ](
										this,
										fn ? [ returned ] : arguments
									);
								}
							} );
						} );
						fns = null;
					} ).promise();
				},
				then: function( onFulfilled, onRejected, onProgress ) {
					var maxDepth = 0;
					function resolve( depth, deferred, handler, special ) {
						return function() {
							var that = this,
								args = arguments,
								mightThrow = function() {
									var returned, then;

									// Support: Promises/A+ section 2.3.3.3.3
									// https://promisesaplus.com/#point-59
									// Ignore double-resolution attempts
									if ( depth < maxDepth ) {
										return;
									}

									returned = handler.apply( that, args );

									// Support: Promises/A+ section 2.3.1
									// https://promisesaplus.com/#point-48
									if ( returned === deferred.promise() ) {
										throw new TypeError( "Thenable self-resolution" );
									}

									// Support: Promises/A+ sections 2.3.3.1, 3.5
									// https://promisesaplus.com/#point-54
									// https://promisesaplus.com/#point-75
									// Retrieve `then` only once
									then = returned &&

										// Support: Promises/A+ section 2.3.4
										// https://promisesaplus.com/#point-64
										// Only check objects and functions for thenability
										( typeof returned === "object" ||
											typeof returned === "function" ) &&
										returned.then;

									// Handle a returned thenable
									if ( isFunction( then ) ) {

										// Special processors (notify) just wait for resolution
										if ( special ) {
											then.call(
												returned,
												resolve( maxDepth, deferred, Identity, special ),
												resolve( maxDepth, deferred, Thrower, special )
											);

										// Normal processors (resolve) also hook into progress
										} else {

											// ...and disregard older resolution values
											maxDepth++;

											then.call(
												returned,
												resolve( maxDepth, deferred, Identity, special ),
												resolve( maxDepth, deferred, Thrower, special ),
												resolve( maxDepth, deferred, Identity,
													deferred.notifyWith )
											);
										}

									// Handle all other returned values
									} else {

										// Only substitute handlers pass on context
										// and multiple values (non-spec behavior)
										if ( handler !== Identity ) {
											that = undefined;
											args = [ returned ];
										}

										// Process the value(s)
										// Default process is resolve
										( special || deferred.resolveWith )( that, args );
									}
								},

								// Only normal processors (resolve) catch and reject exceptions
								process = special ?
									mightThrow :
									function() {
										try {
											mightThrow();
										} catch ( e ) {

											if ( jQuery.Deferred.exceptionHook ) {
												jQuery.Deferred.exceptionHook( e,
													process.stackTrace );
											}

											// Support: Promises/A+ section 2.3.3.3.4.1
											// https://promisesaplus.com/#point-61
											// Ignore post-resolution exceptions
											if ( depth + 1 >= maxDepth ) {

												// Only substitute handlers pass on context
												// and multiple values (non-spec behavior)
												if ( handler !== Thrower ) {
													that = undefined;
													args = [ e ];
												}

												deferred.rejectWith( that, args );
											}
										}
									};

							// Support: Promises/A+ section 2.3.3.3.1
							// https://promisesaplus.com/#point-57
							// Re-resolve promises immediately to dodge false rejection from
							// subsequent errors
							if ( depth ) {
								process();
							} else {

								// Call an optional hook to record the stack, in case of exception
								// since it's otherwise lost when execution goes async
								if ( jQuery.Deferred.getStackHook ) {
									process.stackTrace = jQuery.Deferred.getStackHook();
								}
								window.setTimeout( process );
							}
						};
					}

					return jQuery.Deferred( function( newDefer ) {

						// progress_handlers.add( ... )
						tuples[ 0 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								isFunction( onProgress ) ?
									onProgress :
									Identity,
								newDefer.notifyWith
							)
						);

						// fulfilled_handlers.add( ... )
						tuples[ 1 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								isFunction( onFulfilled ) ?
									onFulfilled :
									Identity
							)
						);

						// rejected_handlers.add( ... )
						tuples[ 2 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								isFunction( onRejected ) ?
									onRejected :
									Thrower
							)
						);
					} ).promise();
				},

				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 5 ];

			// promise.progress = list.add
			// promise.done = list.add
			// promise.fail = list.add
			promise[ tuple[ 1 ] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(
					function() {

						// state = "resolved" (i.e., fulfilled)
						// state = "rejected"
						state = stateString;
					},

					// rejected_callbacks.disable
					// fulfilled_callbacks.disable
					tuples[ 3 - i ][ 2 ].disable,

					// rejected_handlers.disable
					// fulfilled_handlers.disable
					tuples[ 3 - i ][ 3 ].disable,

					// progress_callbacks.lock
					tuples[ 0 ][ 2 ].lock,

					// progress_handlers.lock
					tuples[ 0 ][ 3 ].lock
				);
			}

			// progress_handlers.fire
			// fulfilled_handlers.fire
			// rejected_handlers.fire
			list.add( tuple[ 3 ].fire );

			// deferred.notify = function() { deferred.notifyWith(...) }
			// deferred.resolve = function() { deferred.resolveWith(...) }
			// deferred.reject = function() { deferred.rejectWith(...) }
			deferred[ tuple[ 0 ] ] = function() {
				deferred[ tuple[ 0 ] + "With" ]( this === deferred ? undefined : this, arguments );
				return this;
			};

			// deferred.notifyWith = list.fireWith
			// deferred.resolveWith = list.fireWith
			// deferred.rejectWith = list.fireWith
			deferred[ tuple[ 0 ] + "With" ] = list.fireWith;
		} );

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( singleValue ) {
		var

			// count of uncompleted subordinates
			remaining = arguments.length,

			// count of unprocessed arguments
			i = remaining,

			// subordinate fulfillment data
			resolveContexts = Array( i ),
			resolveValues = slice.call( arguments ),

			// the primary Deferred
			primary = jQuery.Deferred(),

			// subordinate callback factory
			updateFunc = function( i ) {
				return function( value ) {
					resolveContexts[ i ] = this;
					resolveValues[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
					if ( !( --remaining ) ) {
						primary.resolveWith( resolveContexts, resolveValues );
					}
				};
			};

		// Single- and empty arguments are adopted like Promise.resolve
		if ( remaining <= 1 ) {
			adoptValue( singleValue, primary.done( updateFunc( i ) ).resolve, primary.reject,
				!remaining );

			// Use .then() to unwrap secondary thenables (cf. gh-3000)
			if ( primary.state() === "pending" ||
				isFunction( resolveValues[ i ] && resolveValues[ i ].then ) ) {

				return primary.then();
			}
		}

		// Multiple arguments are aggregated like Promise.all array elements
		while ( i-- ) {
			adoptValue( resolveValues[ i ], updateFunc( i ), primary.reject );
		}

		return primary.promise();
	}
} );


// These usually indicate a programmer mistake during development,
// warn about them ASAP rather than swallowing them by default.
var rerrorNames = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;

jQuery.Deferred.exceptionHook = function( error, stack ) {

	// Support: IE 8 - 9 only
	// Console exists when dev tools are open, which can happen at any time
	if ( window.console && window.console.warn && error && rerrorNames.test( error.name ) ) {
		window.console.warn( "jQuery.Deferred exception: " + error.message, error.stack, stack );
	}
};




jQuery.readyException = function( error ) {
	window.setTimeout( function() {
		throw error;
	} );
};




// The deferred used on DOM ready
var readyList = jQuery.Deferred();

jQuery.fn.ready = function( fn ) {

	readyList
		.then( fn )

		// Wrap jQuery.readyException in a function so that the lookup
		// happens at the time of error handling instead of callback
		// registration.
		.catch( function( error ) {
			jQuery.readyException( error );
		} );

	return this;
};

jQuery.extend( {

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See trac-6781
	readyWait: 1,

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );
	}
} );

jQuery.ready.then = readyList.then;

// The ready event handler and self cleanup method
function completed() {
	document.removeEventListener( "DOMContentLoaded", completed );
	window.removeEventListener( "load", completed );
	jQuery.ready();
}

// Catch cases where $(document).ready() is called
// after the browser event has already occurred.
// Support: IE <=9 - 10 only
// Older IE sometimes signals "interactive" too soon
if ( document.readyState === "complete" ||
	( document.readyState !== "loading" && !document.documentElement.doScroll ) ) {

	// Handle it asynchronously to allow scripts the opportunity to delay ready
	window.setTimeout( jQuery.ready );

} else {

	// Use the handy event callback
	document.addEventListener( "DOMContentLoaded", completed );

	// A fallback to window.onload, that will always work
	window.addEventListener( "load", completed );
}




// Multifunctional method to get and set values of a collection
// The value/s can optionally be executed if it's a function
var access = function( elems, fn, key, value, chainable, emptyGet, raw ) {
	var i = 0,
		len = elems.length,
		bulk = key == null;

	// Sets many values
	if ( toType( key ) === "object" ) {
		chainable = true;
		for ( i in key ) {
			access( elems, fn, i, key[ i ], true, emptyGet, raw );
		}

	// Sets one value
	} else if ( value !== undefined ) {
		chainable = true;

		if ( !isFunction( value ) ) {
			raw = true;
		}

		if ( bulk ) {

			// Bulk operations run against the entire set
			if ( raw ) {
				fn.call( elems, value );
				fn = null;

			// ...except when executing function values
			} else {
				bulk = fn;
				fn = function( elem, _key, value ) {
					return bulk.call( jQuery( elem ), value );
				};
			}
		}

		if ( fn ) {
			for ( ; i < len; i++ ) {
				fn(
					elems[ i ], key, raw ?
						value :
						value.call( elems[ i ], i, fn( elems[ i ], key ) )
				);
			}
		}
	}

	if ( chainable ) {
		return elems;
	}

	// Gets
	if ( bulk ) {
		return fn.call( elems );
	}

	return len ? fn( elems[ 0 ], key ) : emptyGet;
};


// Matches dashed string for camelizing
var rmsPrefix = /^-ms-/,
	rdashAlpha = /-([a-z])/g;

// Used by camelCase as callback to replace()
function fcamelCase( _all, letter ) {
	return letter.toUpperCase();
}

// Convert dashed to camelCase; used by the css and data modules
// Support: IE <=9 - 11, Edge 12 - 15
// Microsoft forgot to hump their vendor prefix (trac-9572)
function camelCase( string ) {
	return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
}
var acceptData = function( owner ) {

	// Accepts only:
	//  - Node
	//    - Node.ELEMENT_NODE
	//    - Node.DOCUMENT_NODE
	//  - Object
	//    - Any
	return owner.nodeType === 1 || owner.nodeType === 9 || !( +owner.nodeType );
};




function Data() {
	this.expando = jQuery.expando + Data.uid++;
}

Data.uid = 1;

Data.prototype = {

	cache: function( owner ) {

		// Check if the owner object already has a cache
		var value = owner[ this.expando ];

		// If not, create one
		if ( !value ) {
			value = {};

			// We can accept data for non-element nodes in modern browsers,
			// but we should not, see trac-8335.
			// Always return an empty object.
			if ( acceptData( owner ) ) {

				// If it is a node unlikely to be stringify-ed or looped over
				// use plain assignment
				if ( owner.nodeType ) {
					owner[ this.expando ] = value;

				// Otherwise secure it in a non-enumerable property
				// configurable must be true to allow the property to be
				// deleted when data is removed
				} else {
					Object.defineProperty( owner, this.expando, {
						value: value,
						configurable: true
					} );
				}
			}
		}

		return value;
	},
	set: function( owner, data, value ) {
		var prop,
			cache = this.cache( owner );

		// Handle: [ owner, key, value ] args
		// Always use camelCase key (gh-2257)
		if ( typeof data === "string" ) {
			cache[ camelCase( data ) ] = value;

		// Handle: [ owner, { properties } ] args
		} else {

			// Copy the properties one-by-one to the cache object
			for ( prop in data ) {
				cache[ camelCase( prop ) ] = data[ prop ];
			}
		}
		return cache;
	},
	get: function( owner, key ) {
		return key === undefined ?
			this.cache( owner ) :

			// Always use camelCase key (gh-2257)
			owner[ this.expando ] && owner[ this.expando ][ camelCase( key ) ];
	},
	access: function( owner, key, value ) {

		// In cases where either:
		//
		//   1. No key was specified
		//   2. A string key was specified, but no value provided
		//
		// Take the "read" path and allow the get method to determine
		// which value to return, respectively either:
		//
		//   1. The entire cache object
		//   2. The data stored at the key
		//
		if ( key === undefined ||
				( ( key && typeof key === "string" ) && value === undefined ) ) {

			return this.get( owner, key );
		}

		// When the key is not a string, or both a key and value
		// are specified, set or extend (existing objects) with either:
		//
		//   1. An object of properties
		//   2. A key and value
		//
		this.set( owner, key, value );

		// Since the "set" path can have two possible entry points
		// return the expected data based on which path was taken[*]
		return value !== undefined ? value : key;
	},
	remove: function( owner, key ) {
		var i,
			cache = owner[ this.expando ];

		if ( cache === undefined ) {
			return;
		}

		if ( key !== undefined ) {

			// Support array or space separated string of keys
			if ( Array.isArray( key ) ) {

				// If key is an array of keys...
				// We always set camelCase keys, so remove that.
				key = key.map( camelCase );
			} else {
				key = camelCase( key );

				// If a key with the spaces exists, use it.
				// Otherwise, create an array by matching non-whitespace
				key = key in cache ?
					[ key ] :
					( key.match( rnothtmlwhite ) || [] );
			}

			i = key.length;

			while ( i-- ) {
				delete cache[ key[ i ] ];
			}
		}

		// Remove the expando if there's no more data
		if ( key === undefined || jQuery.isEmptyObject( cache ) ) {

			// Support: Chrome <=35 - 45
			// Webkit & Blink performance suffers when deleting properties
			// from DOM nodes, so set to undefined instead
			// https://bugs.chromium.org/p/chromium/issues/detail?id=378607 (bug restricted)
			if ( owner.nodeType ) {
				owner[ this.expando ] = undefined;
			} else {
				delete owner[ this.expando ];
			}
		}
	},
	hasData: function( owner ) {
		var cache = owner[ this.expando ];
		return cache !== undefined && !jQuery.isEmptyObject( cache );
	}
};
var dataPriv = new Data();

var dataUser = new Data();



//	Implementation Summary
//
//	1. Enforce API surface and semantic compatibility with 1.9.x branch
//	2. Improve the module's maintainability by reducing the storage
//		paths to a single mechanism.
//	3. Use the same single mechanism to support "private" and "user" data.
//	4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
//	5. Avoid exposing implementation details on user objects (eg. expando properties)
//	6. Provide a clear path for implementation upgrade to WeakMap in 2014

var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
	rmultiDash = /[A-Z]/g;

function getData( data ) {
	if ( data === "true" ) {
		return true;
	}

	if ( data === "false" ) {
		return false;
	}

	if ( data === "null" ) {
		return null;
	}

	// Only convert to a number if it doesn't change the string
	if ( data === +data + "" ) {
		return +data;
	}

	if ( rbrace.test( data ) ) {
		return JSON.parse( data );
	}

	return data;
}

function dataAttr( elem, key, data ) {
	var name;

	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {
		name = "data-" + key.replace( rmultiDash, "-$&" ).toLowerCase();
		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = getData( data );
			} catch ( e ) {}

			// Make sure we set the data so it isn't changed later
			dataUser.set( elem, key, data );
		} else {
			data = undefined;
		}
	}
	return data;
}

jQuery.extend( {
	hasData: function( elem ) {
		return dataUser.hasData( elem ) || dataPriv.hasData( elem );
	},

	data: function( elem, name, data ) {
		return dataUser.access( elem, name, data );
	},

	removeData: function( elem, name ) {
		dataUser.remove( elem, name );
	},

	// TODO: Now that all calls to _data and _removeData have been replaced
	// with direct calls to dataPriv methods, these can be deprecated.
	_data: function( elem, name, data ) {
		return dataPriv.access( elem, name, data );
	},

	_removeData: function( elem, name ) {
		dataPriv.remove( elem, name );
	}
} );

jQuery.fn.extend( {
	data: function( key, value ) {
		var i, name, data,
			elem = this[ 0 ],
			attrs = elem && elem.attributes;

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = dataUser.get( elem );

				if ( elem.nodeType === 1 && !dataPriv.get( elem, "hasDataAttrs" ) ) {
					i = attrs.length;
					while ( i-- ) {

						// Support: IE 11 only
						// The attrs elements can be null (trac-14894)
						if ( attrs[ i ] ) {
							name = attrs[ i ].name;
							if ( name.indexOf( "data-" ) === 0 ) {
								name = camelCase( name.slice( 5 ) );
								dataAttr( elem, name, data[ name ] );
							}
						}
					}
					dataPriv.set( elem, "hasDataAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each( function() {
				dataUser.set( this, key );
			} );
		}

		return access( this, function( value ) {
			var data;

			// The calling jQuery object (element matches) is not empty
			// (and therefore has an element appears at this[ 0 ]) and the
			// `value` parameter was not undefined. An empty jQuery object
			// will result in `undefined` for elem = this[ 0 ] which will
			// throw an exception if an attempt to read a data cache is made.
			if ( elem && value === undefined ) {

				// Attempt to get data from the cache
				// The key will always be camelCased in Data
				data = dataUser.get( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// Attempt to "discover" the data in
				// HTML5 custom data-* attrs
				data = dataAttr( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// We tried really hard, but the data doesn't exist.
				return;
			}

			// Set the data...
			this.each( function() {

				// We always store the camelCased key
				dataUser.set( this, key, value );
			} );
		}, null, value, arguments.length > 1, null, true );
	},

	removeData: function( key ) {
		return this.each( function() {
			dataUser.remove( this, key );
		} );
	}
} );


jQuery.extend( {
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = dataPriv.get( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || Array.isArray( data ) ) {
					queue = dataPriv.access( elem, type, jQuery.makeArray( data ) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// Clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// Not public - generate a queueHooks object, or return the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return dataPriv.get( elem, key ) || dataPriv.access( elem, key, {
			empty: jQuery.Callbacks( "once memory" ).add( function() {
				dataPriv.remove( elem, [ type + "queue", key ] );
			} )
		} );
	}
} );

jQuery.fn.extend( {
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[ 0 ], type );
		}

		return data === undefined ?
			this :
			this.each( function() {
				var queue = jQuery.queue( this, type, data );

				// Ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[ 0 ] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			} );
	},
	dequeue: function( type ) {
		return this.each( function() {
			jQuery.dequeue( this, type );
		} );
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},

	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while ( i-- ) {
			tmp = dataPriv.get( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
} );
var pnum = ( /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/ ).source;

var rcssNum = new RegExp( "^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i" );


var cssExpand = [ "Top", "Right", "Bottom", "Left" ];

var documentElement = document.documentElement;



	var isAttached = function( elem ) {
			return jQuery.contains( elem.ownerDocument, elem );
		},
		composed = { composed: true };

	// Support: IE 9 - 11+, Edge 12 - 18+, iOS 10.0 - 10.2 only
	// Check attachment across shadow DOM boundaries when possible (gh-3504)
	// Support: iOS 10.0-10.2 only
	// Early iOS 10 versions support `attachShadow` but not `getRootNode`,
	// leading to errors. We need to check for `getRootNode`.
	if ( documentElement.getRootNode ) {
		isAttached = function( elem ) {
			return jQuery.contains( elem.ownerDocument, elem ) ||
				elem.getRootNode( composed ) === elem.ownerDocument;
		};
	}
var isHiddenWithinTree = function( elem, el ) {

		// isHiddenWithinTree might be called from jQuery#filter function;
		// in that case, element will be second argument
		elem = el || elem;

		// Inline style trumps all
		return elem.style.display === "none" ||
			elem.style.display === "" &&

			// Otherwise, check computed style
			// Support: Firefox <=43 - 45
			// Disconnected elements can have computed display: none, so first confirm that elem is
			// in the document.
			isAttached( elem ) &&

			jQuery.css( elem, "display" ) === "none";
	};



function adjustCSS( elem, prop, valueParts, tween ) {
	var adjusted, scale,
		maxIterations = 20,
		currentValue = tween ?
			function() {
				return tween.cur();
			} :
			function() {
				return jQuery.css( elem, prop, "" );
			},
		initial = currentValue(),
		unit = valueParts && valueParts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

		// Starting value computation is required for potential unit mismatches
		initialInUnit = elem.nodeType &&
			( jQuery.cssNumber[ prop ] || unit !== "px" && +initial ) &&
			rcssNum.exec( jQuery.css( elem, prop ) );

	if ( initialInUnit && initialInUnit[ 3 ] !== unit ) {

		// Support: Firefox <=54
		// Halve the iteration target value to prevent interference from CSS upper bounds (gh-2144)
		initial = initial / 2;

		// Trust units reported by jQuery.css
		unit = unit || initialInUnit[ 3 ];

		// Iteratively approximate from a nonzero starting point
		initialInUnit = +initial || 1;

		while ( maxIterations-- ) {

			// Evaluate and update our best guess (doubling guesses that zero out).
			// Finish if the scale equals or crosses 1 (making the old*new product non-positive).
			jQuery.style( elem, prop, initialInUnit + unit );
			if ( ( 1 - scale ) * ( 1 - ( scale = currentValue() / initial || 0.5 ) ) <= 0 ) {
				maxIterations = 0;
			}
			initialInUnit = initialInUnit / scale;

		}

		initialInUnit = initialInUnit * 2;
		jQuery.style( elem, prop, initialInUnit + unit );

		// Make sure we update the tween properties later on
		valueParts = valueParts || [];
	}

	if ( valueParts ) {
		initialInUnit = +initialInUnit || +initial || 0;

		// Apply relative offset (+=/-=) if specified
		adjusted = valueParts[ 1 ] ?
			initialInUnit + ( valueParts[ 1 ] + 1 ) * valueParts[ 2 ] :
			+valueParts[ 2 ];
		if ( tween ) {
			tween.unit = unit;
			tween.start = initialInUnit;
			tween.end = adjusted;
		}
	}
	return adjusted;
}


var defaultDisplayMap = {};

function getDefaultDisplay( elem ) {
	var temp,
		doc = elem.ownerDocument,
		nodeName = elem.nodeName,
		display = defaultDisplayMap[ nodeName ];

	if ( display ) {
		return display;
	}

	temp = doc.body.appendChild( doc.createElement( nodeName ) );
	display = jQuery.css( temp, "display" );

	temp.parentNode.removeChild( temp );

	if ( display === "none" ) {
		display = "block";
	}
	defaultDisplayMap[ nodeName ] = display;

	return display;
}

function showHide( elements, show ) {
	var display, elem,
		values = [],
		index = 0,
		length = elements.length;

	// Determine new display value for elements that need to change
	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		display = elem.style.display;
		if ( show ) {

			// Since we force visibility upon cascade-hidden elements, an immediate (and slow)
			// check is required in this first loop unless we have a nonempty display value (either
			// inline or about-to-be-restored)
			if ( display === "none" ) {
				values[ index ] = dataPriv.get( elem, "display" ) || null;
				if ( !values[ index ] ) {
					elem.style.display = "";
				}
			}
			if ( elem.style.display === "" && isHiddenWithinTree( elem ) ) {
				values[ index ] = getDefaultDisplay( elem );
			}
		} else {
			if ( display !== "none" ) {
				values[ index ] = "none";

				// Remember what we're overwriting
				dataPriv.set( elem, "display", display );
			}
		}
	}

	// Set the display of the elements in a second loop to avoid constant reflow
	for ( index = 0; index < length; index++ ) {
		if ( values[ index ] != null ) {
			elements[ index ].style.display = values[ index ];
		}
	}

	return elements;
}

jQuery.fn.extend( {
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each( function() {
			if ( isHiddenWithinTree( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		} );
	}
} );
var rcheckableType = ( /^(?:checkbox|radio)$/i );

var rtagName = ( /<([a-z][^\/\0>\x20\t\r\n\f]*)/i );

var rscriptType = ( /^$|^module$|\/(?:java|ecma)script/i );



( function() {
	var fragment = document.createDocumentFragment(),
		div = fragment.appendChild( document.createElement( "div" ) ),
		input = document.createElement( "input" );

	// Support: Android 4.0 - 4.3 only
	// Check state lost if the name is set (trac-11217)
	// Support: Windows Web Apps (WWA)
	// `name` and `type` must use .setAttribute for WWA (trac-14901)
	input.setAttribute( "type", "radio" );
	input.setAttribute( "checked", "checked" );
	input.setAttribute( "name", "t" );

	div.appendChild( input );

	// Support: Android <=4.1 only
	// Older WebKit doesn't clone checked state correctly in fragments
	support.checkClone = div.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE <=11 only
	// Make sure textarea (and checkbox) defaultValue is properly cloned
	div.innerHTML = "<textarea>x</textarea>";
	support.noCloneChecked = !!div.cloneNode( true ).lastChild.defaultValue;

	// Support: IE <=9 only
	// IE <=9 replaces <option> tags with their contents when inserted outside of
	// the select element.
	div.innerHTML = "<option></option>";
	support.option = !!div.lastChild;
} )();


// We have to close these tags to support XHTML (trac-13200)
var wrapMap = {

	// XHTML parsers do not magically insert elements in the
	// same way that tag soup parsers do. So we cannot shorten
	// this by omitting <tbody> or other required elements.
	thead: [ 1, "<table>", "</table>" ],
	col: [ 2, "<table><colgroup>", "</colgroup></table>" ],
	tr: [ 2, "<table><tbody>", "</tbody></table>" ],
	td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

	_default: [ 0, "", "" ]
};

wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

// Support: IE <=9 only
if ( !support.option ) {
	wrapMap.optgroup = wrapMap.option = [ 1, "<select multiple='multiple'>", "</select>" ];
}


function getAll( context, tag ) {

	// Support: IE <=9 - 11 only
	// Use typeof to avoid zero-argument method invocation on host objects (trac-15151)
	var ret;

	if ( typeof context.getElementsByTagName !== "undefined" ) {
		ret = context.getElementsByTagName( tag || "*" );

	} else if ( typeof context.querySelectorAll !== "undefined" ) {
		ret = context.querySelectorAll( tag || "*" );

	} else {
		ret = [];
	}

	if ( tag === undefined || tag && nodeName( context, tag ) ) {
		return jQuery.merge( [ context ], ret );
	}

	return ret;
}


// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		dataPriv.set(
			elems[ i ],
			"globalEval",
			!refElements || dataPriv.get( refElements[ i ], "globalEval" )
		);
	}
}


var rhtml = /<|&#?\w+;/;

function buildFragment( elems, context, scripts, selection, ignored ) {
	var elem, tmp, tag, wrap, attached, j,
		fragment = context.createDocumentFragment(),
		nodes = [],
		i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		elem = elems[ i ];

		if ( elem || elem === 0 ) {

			// Add nodes directly
			if ( toType( elem ) === "object" ) {

				// Support: Android <=4.0 only, PhantomJS 1 only
				// push.apply(_, arraylike) throws on ancient WebKit
				jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

			// Convert non-html into a text node
			} else if ( !rhtml.test( elem ) ) {
				nodes.push( context.createTextNode( elem ) );

			// Convert html into DOM nodes
			} else {
				tmp = tmp || fragment.appendChild( context.createElement( "div" ) );

				// Deserialize a standard representation
				tag = ( rtagName.exec( elem ) || [ "", "" ] )[ 1 ].toLowerCase();
				wrap = wrapMap[ tag ] || wrapMap._default;
				tmp.innerHTML = wrap[ 1 ] + jQuery.htmlPrefilter( elem ) + wrap[ 2 ];

				// Descend through wrappers to the right content
				j = wrap[ 0 ];
				while ( j-- ) {
					tmp = tmp.lastChild;
				}

				// Support: Android <=4.0 only, PhantomJS 1 only
				// push.apply(_, arraylike) throws on ancient WebKit
				jQuery.merge( nodes, tmp.childNodes );

				// Remember the top-level container
				tmp = fragment.firstChild;

				// Ensure the created nodes are orphaned (trac-12392)
				tmp.textContent = "";
			}
		}
	}

	// Remove wrapper from fragment
	fragment.textContent = "";

	i = 0;
	while ( ( elem = nodes[ i++ ] ) ) {

		// Skip elements already in the context collection (trac-4087)
		if ( selection && jQuery.inArray( elem, selection ) > -1 ) {
			if ( ignored ) {
				ignored.push( elem );
			}
			continue;
		}

		attached = isAttached( elem );

		// Append to fragment
		tmp = getAll( fragment.appendChild( elem ), "script" );

		// Preserve script evaluation history
		if ( attached ) {
			setGlobalEval( tmp );
		}

		// Capture executables
		if ( scripts ) {
			j = 0;
			while ( ( elem = tmp[ j++ ] ) ) {
				if ( rscriptType.test( elem.type || "" ) ) {
					scripts.push( elem );
				}
			}
		}
	}

	return fragment;
}


var rtypenamespace = /^([^.]*)(?:\.(.+)|)/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

// Support: IE <=9 - 11+
// focus() and blur() are asynchronous, except when they are no-op.
// So expect focus to be synchronous when the element is already active,
// and blur to be synchronous when the element is not already active.
// (focus and blur are always synchronous in other supported browsers,
// this just defines when we can count on it).
function expectSync( elem, type ) {
	return ( elem === safeActiveElement() ) === ( type === "focus" );
}

// Support: IE <=9 only
// Accessing document.activeElement can throw unexpectedly
// https://bugs.jquery.com/ticket/13393
function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

function on( elem, types, selector, data, fn, one ) {
	var origFn, type;

	// Types can be a map of types/handlers
	if ( typeof types === "object" ) {

		// ( types-Object, selector, data )
		if ( typeof selector !== "string" ) {

			// ( types-Object, data )
			data = data || selector;
			selector = undefined;
		}
		for ( type in types ) {
			on( elem, type, selector, data, types[ type ], one );
		}
		return elem;
	}

	if ( data == null && fn == null ) {

		// ( types, fn )
		fn = selector;
		data = selector = undefined;
	} else if ( fn == null ) {
		if ( typeof selector === "string" ) {

			// ( types, selector, fn )
			fn = data;
			data = undefined;
		} else {

			// ( types, data, fn )
			fn = data;
			data = selector;
			selector = undefined;
		}
	}
	if ( fn === false ) {
		fn = returnFalse;
	} else if ( !fn ) {
		return elem;
	}

	if ( one === 1 ) {
		origFn = fn;
		fn = function( event ) {

			// Can use an empty set, since event contains the info
			jQuery().off( event );
			return origFn.apply( this, arguments );
		};

		// Use same guid so caller can remove using origFn
		fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
	}
	return elem.each( function() {
		jQuery.event.add( this, types, fn, data, selector );
	} );
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {

		var handleObjIn, eventHandle, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = dataPriv.get( elem );

		// Only attach events to objects that accept data
		if ( !acceptData( elem ) ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Ensure that invalid selectors throw exceptions at attach time
		// Evaluate against documentElement in case elem is a non-element node (e.g., document)
		if ( selector ) {
			jQuery.find.matchesSelector( documentElement, selector );
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !( events = elemData.events ) ) {
			events = elemData.events = Object.create( null );
		}
		if ( !( eventHandle = elemData.handle ) ) {
			eventHandle = elemData.handle = function( e ) {

				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== "undefined" && jQuery.event.triggered !== e.type ?
					jQuery.event.dispatch.apply( elem, arguments ) : undefined;
			};
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend( {
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join( "." )
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !( handlers = events[ type ] ) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener if the special events handler returns false
				if ( !special.setup ||
					special.setup.call( elem, data, namespaces, eventHandle ) === false ) {

					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {

		var j, origCount, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = dataPriv.hasData( elem ) && dataPriv.get( elem );

		if ( !elemData || !( events = elemData.events ) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[ 2 ] &&
				new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector ||
						selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown ||
					special.teardown.call( elem, namespaces, elemData.handle ) === false ) {

					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove data and the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			dataPriv.remove( elem, "handle events" );
		}
	},

	dispatch: function( nativeEvent ) {

		var i, j, ret, matched, handleObj, handlerQueue,
			args = new Array( arguments.length ),

			// Make a writable jQuery.Event from the native event object
			event = jQuery.event.fix( nativeEvent ),

			handlers = (
				dataPriv.get( this, "events" ) || Object.create( null )
			)[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[ 0 ] = event;

		for ( i = 1; i < arguments.length; i++ ) {
			args[ i ] = arguments[ i ];
		}

		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( ( matched = handlerQueue[ i++ ] ) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( ( handleObj = matched.handlers[ j++ ] ) &&
				!event.isImmediatePropagationStopped() ) {

				// If the event is namespaced, then each handler is only invoked if it is
				// specially universal or its namespaces are a superset of the event's.
				if ( !event.rnamespace || handleObj.namespace === false ||
					event.rnamespace.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( ( jQuery.event.special[ handleObj.origType ] || {} ).handle ||
						handleObj.handler ).apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( ( event.result = ret ) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var i, handleObj, sel, matchedHandlers, matchedSelectors,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Find delegate handlers
		if ( delegateCount &&

			// Support: IE <=9
			// Black-hole SVG <use> instance trees (trac-13180)
			cur.nodeType &&

			// Support: Firefox <=42
			// Suppress spec-violating clicks indicating a non-primary pointer button (trac-3861)
			// https://www.w3.org/TR/DOM-Level-3-Events/#event-type-click
			// Support: IE 11 only
			// ...but not arrow key "clicks" of radio inputs, which can have `button` -1 (gh-2343)
			!( event.type === "click" && event.button >= 1 ) ) {

			for ( ; cur !== this; cur = cur.parentNode || this ) {

				// Don't check non-elements (trac-13208)
				// Don't process clicks on disabled elements (trac-6911, trac-8165, trac-11382, trac-11764)
				if ( cur.nodeType === 1 && !( event.type === "click" && cur.disabled === true ) ) {
					matchedHandlers = [];
					matchedSelectors = {};
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (trac-13203)
						sel = handleObj.selector + " ";

						if ( matchedSelectors[ sel ] === undefined ) {
							matchedSelectors[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) > -1 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matchedSelectors[ sel ] ) {
							matchedHandlers.push( handleObj );
						}
					}
					if ( matchedHandlers.length ) {
						handlerQueue.push( { elem: cur, handlers: matchedHandlers } );
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		cur = this;
		if ( delegateCount < handlers.length ) {
			handlerQueue.push( { elem: cur, handlers: handlers.slice( delegateCount ) } );
		}

		return handlerQueue;
	},

	addProp: function( name, hook ) {
		Object.defineProperty( jQuery.Event.prototype, name, {
			enumerable: true,
			configurable: true,

			get: isFunction( hook ) ?
				function() {
					if ( this.originalEvent ) {
						return hook( this.originalEvent );
					}
				} :
				function() {
					if ( this.originalEvent ) {
						return this.originalEvent[ name ];
					}
				},

			set: function( value ) {
				Object.defineProperty( this, name, {
					enumerable: true,
					configurable: true,
					writable: true,
					value: value
				} );
			}
		} );
	},

	fix: function( originalEvent ) {
		return originalEvent[ jQuery.expando ] ?
			originalEvent :
			new jQuery.Event( originalEvent );
	},

	special: {
		load: {

			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		click: {

			// Utilize native event to ensure correct state for checkable inputs
			setup: function( data ) {

				// For mutual compressibility with _default, replace `this` access with a local var.
				// `|| data` is dead code meant only to preserve the variable through minification.
				var el = this || data;

				// Claim the first handler
				if ( rcheckableType.test( el.type ) &&
					el.click && nodeName( el, "input" ) ) {

					// dataPriv.set( el, "click", ... )
					leverageNative( el, "click", returnTrue );
				}

				// Return false to allow normal processing in the caller
				return false;
			},
			trigger: function( data ) {

				// For mutual compressibility with _default, replace `this` access with a local var.
				// `|| data` is dead code meant only to preserve the variable through minification.
				var el = this || data;

				// Force setup before triggering a click
				if ( rcheckableType.test( el.type ) &&
					el.click && nodeName( el, "input" ) ) {

					leverageNative( el, "click" );
				}

				// Return non-false to allow normal event-path propagation
				return true;
			},

			// For cross-browser consistency, suppress native .click() on links
			// Also prevent it if we're currently inside a leveraged native-event stack
			_default: function( event ) {
				var target = event.target;
				return rcheckableType.test( target.type ) &&
					target.click && nodeName( target, "input" ) &&
					dataPriv.get( target, "click" ) ||
					nodeName( target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Support: Firefox 20+
				// Firefox doesn't alert if the returnValue field is not set.
				if ( event.result !== undefined && event.originalEvent ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	}
};

// Ensure the presence of an event listener that handles manually-triggered
// synthetic events by interrupting progress until reinvoked in response to
// *native* events that it fires directly, ensuring that state changes have
// already occurred before other listeners are invoked.
function leverageNative( el, type, expectSync ) {

	// Missing expectSync indicates a trigger call, which must force setup through jQuery.event.add
	if ( !expectSync ) {
		if ( dataPriv.get( el, type ) === undefined ) {
			jQuery.event.add( el, type, returnTrue );
		}
		return;
	}

	// Register the controller as a special universal handler for all event namespaces
	dataPriv.set( el, type, false );
	jQuery.event.add( el, type, {
		namespace: false,
		handler: function( event ) {
			var notAsync, result,
				saved = dataPriv.get( this, type );

			if ( ( event.isTrigger & 1 ) && this[ type ] ) {

				// Interrupt processing of the outer synthetic .trigger()ed event
				// Saved data should be false in such cases, but might be a leftover capture object
				// from an async native handler (gh-4350)
				if ( !saved.length ) {

					// Store arguments for use when handling the inner native event
					// There will always be at least one argument (an event object), so this array
					// will not be confused with a leftover capture object.
					saved = slice.call( arguments );
					dataPriv.set( this, type, saved );

					// Trigger the native event and capture its result
					// Support: IE <=9 - 11+
					// focus() and blur() are asynchronous
					notAsync = expectSync( this, type );
					this[ type ]();
					result = dataPriv.get( this, type );
					if ( saved !== result || notAsync ) {
						dataPriv.set( this, type, false );
					} else {
						result = {};
					}
					if ( saved !== result ) {

						// Cancel the outer synthetic event
						event.stopImmediatePropagation();
						event.preventDefault();

						// Support: Chrome 86+
						// In Chrome, if an element having a focusout handler is blurred by
						// clicking outside of it, it invokes the handler synchronously. If
						// that handler calls `.remove()` on the element, the data is cleared,
						// leaving `result` undefined. We need to guard against this.
						return result && result.value;
					}

				// If this is an inner synthetic event for an event with a bubbling surrogate
				// (focus or blur), assume that the surrogate already propagated from triggering the
				// native event and prevent that from happening again here.
				// This technically gets the ordering wrong w.r.t. to `.trigger()` (in which the
				// bubbling surrogate propagates *after* the non-bubbling base), but that seems
				// less bad than duplication.
				} else if ( ( jQuery.event.special[ type ] || {} ).delegateType ) {
					event.stopPropagation();
				}

			// If this is a native event triggered above, everything is now in order
			// Fire an inner synthetic event with the original arguments
			} else if ( saved.length ) {

				// ...and capture the result
				dataPriv.set( this, type, {
					value: jQuery.event.trigger(

						// Support: IE <=9 - 11+
						// Extend with the prototype to reset the above stopImmediatePropagation()
						jQuery.extend( saved[ 0 ], jQuery.Event.prototype ),
						saved.slice( 1 ),
						this
					)
				} );

				// Abort handling of the native event
				event.stopImmediatePropagation();
			}
		}
	} );
}

jQuery.removeEvent = function( elem, type, handle ) {

	// This "if" is needed for plain objects
	if ( elem.removeEventListener ) {
		elem.removeEventListener( type, handle );
	}
};

jQuery.Event = function( src, props ) {

	// Allow instantiation without the 'new' keyword
	if ( !( this instanceof jQuery.Event ) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = src.defaultPrevented ||
				src.defaultPrevented === undefined &&

				// Support: Android <=2.3 only
				src.returnValue === false ?
			returnTrue :
			returnFalse;

		// Create target properties
		// Support: Safari <=6 - 7 only
		// Target should not be a text node (trac-504, trac-13143)
		this.target = ( src.target && src.target.nodeType === 3 ) ?
			src.target.parentNode :
			src.target;

		this.currentTarget = src.currentTarget;
		this.relatedTarget = src.relatedTarget;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || Date.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// https://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	constructor: jQuery.Event,
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,
	isSimulated: false,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;

		if ( e && !this.isSimulated ) {
			e.preventDefault();
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;

		if ( e && !this.isSimulated ) {
			e.stopPropagation();
		}
	},
	stopImmediatePropagation: function() {
		var e = this.originalEvent;

		this.isImmediatePropagationStopped = returnTrue;

		if ( e && !this.isSimulated ) {
			e.stopImmediatePropagation();
		}

		this.stopPropagation();
	}
};

// Includes all common event props including KeyEvent and MouseEvent specific props
jQuery.each( {
	altKey: true,
	bubbles: true,
	cancelable: true,
	changedTouches: true,
	ctrlKey: true,
	detail: true,
	eventPhase: true,
	metaKey: true,
	pageX: true,
	pageY: true,
	shiftKey: true,
	view: true,
	"char": true,
	code: true,
	charCode: true,
	key: true,
	keyCode: true,
	button: true,
	buttons: true,
	clientX: true,
	clientY: true,
	offsetX: true,
	offsetY: true,
	pointerId: true,
	pointerType: true,
	screenX: true,
	screenY: true,
	targetTouches: true,
	toElement: true,
	touches: true,
	which: true
}, jQuery.event.addProp );

jQuery.each( { focus: "focusin", blur: "focusout" }, function( type, delegateType ) {
	jQuery.event.special[ type ] = {

		// Utilize native event if possible so blur/focus sequence is correct
		setup: function() {

			// Claim the first handler
			// dataPriv.set( this, "focus", ... )
			// dataPriv.set( this, "blur", ... )
			leverageNative( this, type, expectSync );

			// Return false to allow normal processing in the caller
			return false;
		},
		trigger: function() {

			// Force setup before trigger
			leverageNative( this, type );

			// Return non-false to allow normal event-path propagation
			return true;
		},

		// Suppress native focus or blur if we're currently inside
		// a leveraged native-event stack
		_default: function( event ) {
			return dataPriv.get( event.target, type );
		},

		delegateType: delegateType
	};
} );

// Create mouseenter/leave events using mouseover/out and event-time checks
// so that event delegation works in jQuery.
// Do the same for pointerenter/pointerleave and pointerover/pointerout
//
// Support: Safari 7 only
// Safari sends mouseenter too often; see:
// https://bugs.chromium.org/p/chromium/issues/detail?id=470258
// for the description of the bug (it existed in older Chrome versions as well).
jQuery.each( {
	mouseenter: "mouseover",
	mouseleave: "mouseout",
	pointerenter: "pointerover",
	pointerleave: "pointerout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mouseenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || ( related !== target && !jQuery.contains( target, related ) ) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
} );

jQuery.fn.extend( {

	on: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn );
	},
	one: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {

			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ?
					handleObj.origType + "." + handleObj.namespace :
					handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {

			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {

			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each( function() {
			jQuery.event.remove( this, types, fn, selector );
		} );
	}
} );


var

	// Support: IE <=10 - 11, Edge 12 - 13 only
	// In IE/Edge using regex groups here causes severe slowdowns.
	// See https://connect.microsoft.com/IE/feedback/details/1736512/
	rnoInnerhtml = /<script|<style|<link/i,

	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,

	rcleanScript = /^\s*<!\[CDATA\[|\]\]>\s*$/g;

// Prefer a tbody over its parent table for containing new rows
function manipulationTarget( elem, content ) {
	if ( nodeName( elem, "table" ) &&
		nodeName( content.nodeType !== 11 ? content : content.firstChild, "tr" ) ) {

		return jQuery( elem ).children( "tbody" )[ 0 ] || elem;
	}

	return elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = ( elem.getAttribute( "type" ) !== null ) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	if ( ( elem.type || "" ).slice( 0, 5 ) === "true/" ) {
		elem.type = elem.type.slice( 5 );
	} else {
		elem.removeAttribute( "type" );
	}

	return elem;
}

function cloneCopyEvent( src, dest ) {
	var i, l, type, pdataOld, udataOld, udataCur, events;

	if ( dest.nodeType !== 1 ) {
		return;
	}

	// 1. Copy private data: events, handlers, etc.
	if ( dataPriv.hasData( src ) ) {
		pdataOld = dataPriv.get( src );
		events = pdataOld.events;

		if ( events ) {
			dataPriv.remove( dest, "handle events" );

			for ( type in events ) {
				for ( i = 0, l = events[ type ].length; i < l; i++ ) {
					jQuery.event.add( dest, type, events[ type ][ i ] );
				}
			}
		}
	}

	// 2. Copy user data
	if ( dataUser.hasData( src ) ) {
		udataOld = dataUser.access( src );
		udataCur = jQuery.extend( {}, udataOld );

		dataUser.set( dest, udataCur );
	}
}

// Fix IE bugs, see support tests
function fixInput( src, dest ) {
	var nodeName = dest.nodeName.toLowerCase();

	// Fails to persist the checked state of a cloned checkbox or radio button.
	if ( nodeName === "input" && rcheckableType.test( src.type ) ) {
		dest.checked = src.checked;

	// Fails to return the selected option to the default selected state when cloning options
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

function domManip( collection, args, callback, ignored ) {

	// Flatten any nested arrays
	args = flat( args );

	var fragment, first, scripts, hasScripts, node, doc,
		i = 0,
		l = collection.length,
		iNoClone = l - 1,
		value = args[ 0 ],
		valueIsFunction = isFunction( value );

	// We can't cloneNode fragments that contain checked, in WebKit
	if ( valueIsFunction ||
			( l > 1 && typeof value === "string" &&
				!support.checkClone && rchecked.test( value ) ) ) {
		return collection.each( function( index ) {
			var self = collection.eq( index );
			if ( valueIsFunction ) {
				args[ 0 ] = value.call( this, index, self.html() );
			}
			domManip( self, args, callback, ignored );
		} );
	}

	if ( l ) {
		fragment = buildFragment( args, collection[ 0 ].ownerDocument, false, collection, ignored );
		first = fragment.firstChild;

		if ( fragment.childNodes.length === 1 ) {
			fragment = first;
		}

		// Require either new content or an interest in ignored elements to invoke the callback
		if ( first || ignored ) {
			scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
			hasScripts = scripts.length;

			// Use the original fragment for the last item
			// instead of the first because it can end up
			// being emptied incorrectly in certain situations (trac-8070).
			for ( ; i < l; i++ ) {
				node = fragment;

				if ( i !== iNoClone ) {
					node = jQuery.clone( node, true, true );

					// Keep references to cloned scripts for later restoration
					if ( hasScripts ) {

						// Support: Android <=4.0 only, PhantomJS 1 only
						// push.apply(_, arraylike) throws on ancient WebKit
						jQuery.merge( scripts, getAll( node, "script" ) );
					}
				}

				callback.call( collection[ i ], node, i );
			}

			if ( hasScripts ) {
				doc = scripts[ scripts.length - 1 ].ownerDocument;

				// Reenable scripts
				jQuery.map( scripts, restoreScript );

				// Evaluate executable scripts on first document insertion
				for ( i = 0; i < hasScripts; i++ ) {
					node = scripts[ i ];
					if ( rscriptType.test( node.type || "" ) &&
						!dataPriv.access( node, "globalEval" ) &&
						jQuery.contains( doc, node ) ) {

						if ( node.src && ( node.type || "" ).toLowerCase()  !== "module" ) {

							// Optional AJAX dependency, but won't run scripts if not present
							if ( jQuery._evalUrl && !node.noModule ) {
								jQuery._evalUrl( node.src, {
									nonce: node.nonce || node.getAttribute( "nonce" )
								}, doc );
							}
						} else {

							// Unwrap a CDATA section containing script contents. This shouldn't be
							// needed as in XML documents they're already not visible when
							// inspecting element contents and in HTML documents they have no
							// meaning but we're preserving that logic for backwards compatibility.
							// This will be removed completely in 4.0. See gh-4904.
							DOMEval( node.textContent.replace( rcleanScript, "" ), node, doc );
						}
					}
				}
			}
		}
	}

	return collection;
}

function remove( elem, selector, keepData ) {
	var node,
		nodes = selector ? jQuery.filter( selector, elem ) : elem,
		i = 0;

	for ( ; ( node = nodes[ i ] ) != null; i++ ) {
		if ( !keepData && node.nodeType === 1 ) {
			jQuery.cleanData( getAll( node ) );
		}

		if ( node.parentNode ) {
			if ( keepData && isAttached( node ) ) {
				setGlobalEval( getAll( node, "script" ) );
			}
			node.parentNode.removeChild( node );
		}
	}

	return elem;
}

jQuery.extend( {
	htmlPrefilter: function( html ) {
		return html;
	},

	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var i, l, srcElements, destElements,
			clone = elem.cloneNode( true ),
			inPage = isAttached( elem );

		// Fix IE cloning issues
		if ( !support.noCloneChecked && ( elem.nodeType === 1 || elem.nodeType === 11 ) &&
				!jQuery.isXMLDoc( elem ) ) {

			// We eschew Sizzle here for performance reasons: https://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			for ( i = 0, l = srcElements.length; i < l; i++ ) {
				fixInput( srcElements[ i ], destElements[ i ] );
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0, l = srcElements.length; i < l; i++ ) {
					cloneCopyEvent( srcElements[ i ], destElements[ i ] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		// Return the cloned set
		return clone;
	},

	cleanData: function( elems ) {
		var data, elem, type,
			special = jQuery.event.special,
			i = 0;

		for ( ; ( elem = elems[ i ] ) !== undefined; i++ ) {
			if ( acceptData( elem ) ) {
				if ( ( data = elem[ dataPriv.expando ] ) ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Support: Chrome <=35 - 45+
					// Assign undefined instead of using delete, see Data#remove
					elem[ dataPriv.expando ] = undefined;
				}
				if ( elem[ dataUser.expando ] ) {

					// Support: Chrome <=35 - 45+
					// Assign undefined instead of using delete, see Data#remove
					elem[ dataUser.expando ] = undefined;
				}
			}
		}
	}
} );

jQuery.fn.extend( {
	detach: function( selector ) {
		return remove( this, selector, true );
	},

	remove: function( selector ) {
		return remove( this, selector );
	},

	text: function( value ) {
		return access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().each( function() {
					if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
						this.textContent = value;
					}
				} );
		}, null, value, arguments.length );
	},

	append: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		} );
	},

	prepend: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		} );
	},

	before: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		} );
	},

	after: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		} );
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; ( elem = this[ i ] ) != null; i++ ) {
			if ( elem.nodeType === 1 ) {

				// Prevent memory leaks
				jQuery.cleanData( getAll( elem, false ) );

				// Remove any remaining nodes
				elem.textContent = "";
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function() {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		} );
	},

	html: function( value ) {
		return access( this, function( value ) {
			var elem = this[ 0 ] || {},
				i = 0,
				l = this.length;

			if ( value === undefined && elem.nodeType === 1 ) {
				return elem.innerHTML;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				!wrapMap[ ( rtagName.exec( value ) || [ "", "" ] )[ 1 ].toLowerCase() ] ) {

				value = jQuery.htmlPrefilter( value );

				try {
					for ( ; i < l; i++ ) {
						elem = this[ i ] || {};

						// Remove element nodes and prevent memory leaks
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch ( e ) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var ignored = [];

		// Make the changes, replacing each non-ignored context element with the new content
		return domManip( this, arguments, function( elem ) {
			var parent = this.parentNode;

			if ( jQuery.inArray( this, ignored ) < 0 ) {
				jQuery.cleanData( getAll( this ) );
				if ( parent ) {
					parent.replaceChild( elem, this );
				}
			}

		// Force callback invocation
		}, ignored );
	}
} );

jQuery.each( {
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1,
			i = 0;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone( true );
			jQuery( insert[ i ] )[ original ]( elems );

			// Support: Android <=4.0 only, PhantomJS 1 only
			// .get() because push.apply(_, arraylike) throws on ancient WebKit
			push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
} );
var rnumnonpx = new RegExp( "^(" + pnum + ")(?!px)[a-z%]+$", "i" );

var rcustomProp = /^--/;


var getStyles = function( elem ) {

		// Support: IE <=11 only, Firefox <=30 (trac-15098, trac-14150)
		// IE throws on elements created in popups
		// FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
		var view = elem.ownerDocument.defaultView;

		if ( !view || !view.opener ) {
			view = window;
		}

		return view.getComputedStyle( elem );
	};

var swap = function( elem, options, callback ) {
	var ret, name,
		old = {};

	// Remember the old values, and insert the new ones
	for ( name in options ) {
		old[ name ] = elem.style[ name ];
		elem.style[ name ] = options[ name ];
	}

	ret = callback.call( elem );

	// Revert the old values
	for ( name in options ) {
		elem.style[ name ] = old[ name ];
	}

	return ret;
};


var rboxStyle = new RegExp( cssExpand.join( "|" ), "i" );

var whitespace = "[\\x20\\t\\r\\n\\f]";


var rtrimCSS = new RegExp(
	"^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$",
	"g"
);




( function() {

	// Executing both pixelPosition & boxSizingReliable tests require only one layout
	// so they're executed at the same time to save the second computation.
	function computeStyleTests() {

		// This is a singleton, we need to execute it only once
		if ( !div ) {
			return;
		}

		container.style.cssText = "position:absolute;left:-11111px;width:60px;" +
			"margin-top:1px;padding:0;border:0";
		div.style.cssText =
			"position:relative;display:block;box-sizing:border-box;overflow:scroll;" +
			"margin:auto;border:1px;padding:1px;" +
			"width:60%;top:1%";
		documentElement.appendChild( container ).appendChild( div );

		var divStyle = window.getComputedStyle( div );
		pixelPositionVal = divStyle.top !== "1%";

		// Support: Android 4.0 - 4.3 only, Firefox <=3 - 44
		reliableMarginLeftVal = roundPixelMeasures( divStyle.marginLeft ) === 12;

		// Support: Android 4.0 - 4.3 only, Safari <=9.1 - 10.1, iOS <=7.0 - 9.3
		// Some styles come back with percentage values, even though they shouldn't
		div.style.right = "60%";
		pixelBoxStylesVal = roundPixelMeasures( divStyle.right ) === 36;

		// Support: IE 9 - 11 only
		// Detect misreporting of content dimensions for box-sizing:border-box elements
		boxSizingReliableVal = roundPixelMeasures( divStyle.width ) === 36;

		// Support: IE 9 only
		// Detect overflow:scroll screwiness (gh-3699)
		// Support: Chrome <=64
		// Don't get tricked when zoom affects offsetWidth (gh-4029)
		div.style.position = "absolute";
		scrollboxSizeVal = roundPixelMeasures( div.offsetWidth / 3 ) === 12;

		documentElement.removeChild( container );

		// Nullify the div so it wouldn't be stored in the memory and
		// it will also be a sign that checks already performed
		div = null;
	}

	function roundPixelMeasures( measure ) {
		return Math.round( parseFloat( measure ) );
	}

	var pixelPositionVal, boxSizingReliableVal, scrollboxSizeVal, pixelBoxStylesVal,
		reliableTrDimensionsVal, reliableMarginLeftVal,
		container = document.createElement( "div" ),
		div = document.createElement( "div" );

	// Finish early in limited (non-browser) environments
	if ( !div.style ) {
		return;
	}

	// Support: IE <=9 - 11 only
	// Style of cloned element affects source element cloned (trac-8908)
	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	jQuery.extend( support, {
		boxSizingReliable: function() {
			computeStyleTests();
			return boxSizingReliableVal;
		},
		pixelBoxStyles: function() {
			computeStyleTests();
			return pixelBoxStylesVal;
		},
		pixelPosition: function() {
			computeStyleTests();
			return pixelPositionVal;
		},
		reliableMarginLeft: function() {
			computeStyleTests();
			return reliableMarginLeftVal;
		},
		scrollboxSize: function() {
			computeStyleTests();
			return scrollboxSizeVal;
		},

		// Support: IE 9 - 11+, Edge 15 - 18+
		// IE/Edge misreport `getComputedStyle` of table rows with width/height
		// set in CSS while `offset*` properties report correct values.
		// Behavior in IE 9 is more subtle than in newer versions & it passes
		// some versions of this test; make sure not to make it pass there!
		//
		// Support: Firefox 70+
		// Only Firefox includes border widths
		// in computed dimensions. (gh-4529)
		reliableTrDimensions: function() {
			var table, tr, trChild, trStyle;
			if ( reliableTrDimensionsVal == null ) {
				table = document.createElement( "table" );
				tr = document.createElement( "tr" );
				trChild = document.createElement( "div" );

				table.style.cssText = "position:absolute;left:-11111px;border-collapse:separate";
				tr.style.cssText = "border:1px solid";

				// Support: Chrome 86+
				// Height set through cssText does not get applied.
				// Computed height then comes back as 0.
				tr.style.height = "1px";
				trChild.style.height = "9px";

				// Support: Android 8 Chrome 86+
				// In our bodyBackground.html iframe,
				// display for all div elements is set to "inline",
				// which causes a problem only in Android 8 Chrome 86.
				// Ensuring the div is display: block
				// gets around this issue.
				trChild.style.display = "block";

				documentElement
					.appendChild( table )
					.appendChild( tr )
					.appendChild( trChild );

				trStyle = window.getComputedStyle( tr );
				reliableTrDimensionsVal = ( parseInt( trStyle.height, 10 ) +
					parseInt( trStyle.borderTopWidth, 10 ) +
					parseInt( trStyle.borderBottomWidth, 10 ) ) === tr.offsetHeight;

				documentElement.removeChild( table );
			}
			return reliableTrDimensionsVal;
		}
	} );
} )();


function curCSS( elem, name, computed ) {
	var width, minWidth, maxWidth, ret,
		isCustomProp = rcustomProp.test( name ),

		// Support: Firefox 51+
		// Retrieving style before computed somehow
		// fixes an issue with getting wrong values
		// on detached elements
		style = elem.style;

	computed = computed || getStyles( elem );

	// getPropertyValue is needed for:
	//   .css('filter') (IE 9 only, trac-12537)
	//   .css('--customProperty) (gh-3144)
	if ( computed ) {

		// Support: IE <=9 - 11+
		// IE only supports `"float"` in `getPropertyValue`; in computed styles
		// it's only available as `"cssFloat"`. We no longer modify properties
		// sent to `.css()` apart from camelCasing, so we need to check both.
		// Normally, this would create difference in behavior: if
		// `getPropertyValue` returns an empty string, the value returned
		// by `.css()` would be `undefined`. This is usually the case for
		// disconnected elements. However, in IE even disconnected elements
		// with no styles return `"none"` for `getPropertyValue( "float" )`
		ret = computed.getPropertyValue( name ) || computed[ name ];

		if ( isCustomProp && ret ) {

			// Support: Firefox 105+, Chrome <=105+
			// Spec requires trimming whitespace for custom properties (gh-4926).
			// Firefox only trims leading whitespace. Chrome just collapses
			// both leading & trailing whitespace to a single space.
			//
			// Fall back to `undefined` if empty string returned.
			// This collapses a missing definition with property defined
			// and set to an empty string but there's no standard API
			// allowing us to differentiate them without a performance penalty
			// and returning `undefined` aligns with older jQuery.
			//
			// rtrimCSS treats U+000D CARRIAGE RETURN and U+000C FORM FEED
			// as whitespace while CSS does not, but this is not a problem
			// because CSS preprocessing replaces them with U+000A LINE FEED
			// (which *is* CSS whitespace)
			// https://www.w3.org/TR/css-syntax-3/#input-preprocessing
			ret = ret.replace( rtrimCSS, "$1" ) || undefined;
		}

		if ( ret === "" && !isAttached( elem ) ) {
			ret = jQuery.style( elem, name );
		}

		// A tribute to the "awesome hack by Dean Edwards"
		// Android Browser returns percentage for some values,
		// but width seems to be reliably pixels.
		// This is against the CSSOM draft spec:
		// https://drafts.csswg.org/cssom/#resolved-values
		if ( !support.pixelBoxStyles() && rnumnonpx.test( ret ) && rboxStyle.test( name ) ) {

			// Remember the original values
			width = style.width;
			minWidth = style.minWidth;
			maxWidth = style.maxWidth;

			// Put in the new values to get a computed value out
			style.minWidth = style.maxWidth = style.width = ret;
			ret = computed.width;

			// Revert the changed values
			style.width = width;
			style.minWidth = minWidth;
			style.maxWidth = maxWidth;
		}
	}

	return ret !== undefined ?

		// Support: IE <=9 - 11 only
		// IE returns zIndex value as an integer.
		ret + "" :
		ret;
}


function addGetHookIf( conditionFn, hookFn ) {

	// Define the hook, we'll check on the first run if it's really needed.
	return {
		get: function() {
			if ( conditionFn() ) {

				// Hook not needed (or it's not possible to use it due
				// to missing dependency), remove it.
				delete this.get;
				return;
			}

			// Hook needed; redefine it so that the support test is not executed again.
			return ( this.get = hookFn ).apply( this, arguments );
		}
	};
}


var cssPrefixes = [ "Webkit", "Moz", "ms" ],
	emptyStyle = document.createElement( "div" ).style,
	vendorProps = {};

// Return a vendor-prefixed property or undefined
function vendorPropName( name ) {

	// Check for vendor prefixed names
	var capName = name[ 0 ].toUpperCase() + name.slice( 1 ),
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in emptyStyle ) {
			return name;
		}
	}
}

// Return a potentially-mapped jQuery.cssProps or vendor prefixed property
function finalPropName( name ) {
	var final = jQuery.cssProps[ name ] || vendorProps[ name ];

	if ( final ) {
		return final;
	}
	if ( name in emptyStyle ) {
		return name;
	}
	return vendorProps[ name ] = vendorPropName( name ) || name;
}


var

	// Swappable if display is none or starts with table
	// except "table", "table-cell", or "table-caption"
	// See here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: "0",
		fontWeight: "400"
	};

function setPositiveNumber( _elem, value, subtract ) {

	// Any relative (+/-) values have already been
	// normalized at this point
	var matches = rcssNum.exec( value );
	return matches ?

		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 2 ] - ( subtract || 0 ) ) + ( matches[ 3 ] || "px" ) :
		value;
}

function boxModelAdjustment( elem, dimension, box, isBorderBox, styles, computedVal ) {
	var i = dimension === "width" ? 1 : 0,
		extra = 0,
		delta = 0;

	// Adjustment may not be necessary
	if ( box === ( isBorderBox ? "border" : "content" ) ) {
		return 0;
	}

	for ( ; i < 4; i += 2 ) {

		// Both box models exclude margin
		if ( box === "margin" ) {
			delta += jQuery.css( elem, box + cssExpand[ i ], true, styles );
		}

		// If we get here with a content-box, we're seeking "padding" or "border" or "margin"
		if ( !isBorderBox ) {

			// Add padding
			delta += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// For "border" or "margin", add border
			if ( box !== "padding" ) {
				delta += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );

			// But still keep track of it otherwise
			} else {
				extra += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}

		// If we get here with a border-box (content + padding + border), we're seeking "content" or
		// "padding" or "margin"
		} else {

			// For "content", subtract padding
			if ( box === "content" ) {
				delta -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// For "content" or "padding", subtract border
			if ( box !== "margin" ) {
				delta -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	// Account for positive content-box scroll gutter when requested by providing computedVal
	if ( !isBorderBox && computedVal >= 0 ) {

		// offsetWidth/offsetHeight is a rounded sum of content, padding, scroll gutter, and border
		// Assuming integer scroll gutter, subtract the rest and round down
		delta += Math.max( 0, Math.ceil(
			elem[ "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 ) ] -
			computedVal -
			delta -
			extra -
			0.5

		// If offsetWidth/offsetHeight is unknown, then we can't determine content-box scroll gutter
		// Use an explicit zero to avoid NaN (gh-3964)
		) ) || 0;
	}

	return delta;
}

function getWidthOrHeight( elem, dimension, extra ) {

	// Start with computed style
	var styles = getStyles( elem ),

		// To avoid forcing a reflow, only fetch boxSizing if we need it (gh-4322).
		// Fake content-box until we know it's needed to know the true value.
		boxSizingNeeded = !support.boxSizingReliable() || extra,
		isBorderBox = boxSizingNeeded &&
			jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
		valueIsBorderBox = isBorderBox,

		val = curCSS( elem, dimension, styles ),
		offsetProp = "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 );

	// Support: Firefox <=54
	// Return a confounding non-pixel value or feign ignorance, as appropriate.
	if ( rnumnonpx.test( val ) ) {
		if ( !extra ) {
			return val;
		}
		val = "auto";
	}


	// Support: IE 9 - 11 only
	// Use offsetWidth/offsetHeight for when box sizing is unreliable.
	// In those cases, the computed value can be trusted to be border-box.
	if ( ( !support.boxSizingReliable() && isBorderBox ||

		// Support: IE 10 - 11+, Edge 15 - 18+
		// IE/Edge misreport `getComputedStyle` of table rows with width/height
		// set in CSS while `offset*` properties report correct values.
		// Interestingly, in some cases IE 9 doesn't suffer from this issue.
		!support.reliableTrDimensions() && nodeName( elem, "tr" ) ||

		// Fall back to offsetWidth/offsetHeight when value is "auto"
		// This happens for inline elements with no explicit setting (gh-3571)
		val === "auto" ||

		// Support: Android <=4.1 - 4.3 only
		// Also use offsetWidth/offsetHeight for misreported inline dimensions (gh-3602)
		!parseFloat( val ) && jQuery.css( elem, "display", false, styles ) === "inline" ) &&

		// Make sure the element is visible & connected
		elem.getClientRects().length ) {

		isBorderBox = jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

		// Where available, offsetWidth/offsetHeight approximate border box dimensions.
		// Where not available (e.g., SVG), assume unreliable box-sizing and interpret the
		// retrieved value as a content box dimension.
		valueIsBorderBox = offsetProp in elem;
		if ( valueIsBorderBox ) {
			val = elem[ offsetProp ];
		}
	}

	// Normalize "" and auto
	val = parseFloat( val ) || 0;

	// Adjust for the element's box model
	return ( val +
		boxModelAdjustment(
			elem,
			dimension,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles,

			// Provide the current computed size to request scroll gutter calculation (gh-3589)
			val
		)
	) + "px";
}

jQuery.extend( {

	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {

					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	cssNumber: {
		"animationIterationCount": true,
		"columnCount": true,
		"fillOpacity": true,
		"flexGrow": true,
		"flexShrink": true,
		"fontWeight": true,
		"gridArea": true,
		"gridColumn": true,
		"gridColumnEnd": true,
		"gridColumnStart": true,
		"gridRow": true,
		"gridRowEnd": true,
		"gridRowStart": true,
		"lineHeight": true,
		"opacity": true,
		"order": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {

		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = camelCase( name ),
			isCustomProp = rcustomProp.test( name ),
			style = elem.style;

		// Make sure that we're working with the right name. We don't
		// want to query the value if it is a CSS custom property
		// since they are user-defined.
		if ( !isCustomProp ) {
			name = finalPropName( origName );
		}

		// Gets hook for the prefixed version, then unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// Convert "+=" or "-=" to relative numbers (trac-7345)
			if ( type === "string" && ( ret = rcssNum.exec( value ) ) && ret[ 1 ] ) {
				value = adjustCSS( elem, name, ret );

				// Fixes bug trac-9237
				type = "number";
			}

			// Make sure that null and NaN values aren't set (trac-7116)
			if ( value == null || value !== value ) {
				return;
			}

			// If a number was passed in, add the unit (except for certain CSS properties)
			// The isCustomProp check can be removed in jQuery 4.0 when we only auto-append
			// "px" to a few hardcoded values.
			if ( type === "number" && !isCustomProp ) {
				value += ret && ret[ 3 ] || ( jQuery.cssNumber[ origName ] ? "" : "px" );
			}

			// background-* props affect original clone's values
			if ( !support.clearCloneStyle && value === "" && name.indexOf( "background" ) === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !( "set" in hooks ) ||
				( value = hooks.set( elem, value, extra ) ) !== undefined ) {

				if ( isCustomProp ) {
					style.setProperty( name, value );
				} else {
					style[ name ] = value;
				}
			}

		} else {

			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks &&
				( ret = hooks.get( elem, false, extra ) ) !== undefined ) {

				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var val, num, hooks,
			origName = camelCase( name ),
			isCustomProp = rcustomProp.test( name );

		// Make sure that we're working with the right name. We don't
		// want to modify the value if it is a CSS custom property
		// since they are user-defined.
		if ( !isCustomProp ) {
			name = finalPropName( origName );
		}

		// Try prefixed name followed by the unprefixed name
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		// Convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Make numeric if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || isFinite( num ) ? num || 0 : val;
		}

		return val;
	}
} );

jQuery.each( [ "height", "width" ], function( _i, dimension ) {
	jQuery.cssHooks[ dimension ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {

				// Certain elements can have dimension info if we invisibly show them
				// but it must have a current display style that would benefit
				return rdisplayswap.test( jQuery.css( elem, "display" ) ) &&

					// Support: Safari 8+
					// Table columns in Safari have non-zero offsetWidth & zero
					// getBoundingClientRect().width unless display is changed.
					// Support: IE <=11 only
					// Running getBoundingClientRect on a disconnected node
					// in IE throws an error.
					( !elem.getClientRects().length || !elem.getBoundingClientRect().width ) ?
					swap( elem, cssShow, function() {
						return getWidthOrHeight( elem, dimension, extra );
					} ) :
					getWidthOrHeight( elem, dimension, extra );
			}
		},

		set: function( elem, value, extra ) {
			var matches,
				styles = getStyles( elem ),

				// Only read styles.position if the test has a chance to fail
				// to avoid forcing a reflow.
				scrollboxSizeBuggy = !support.scrollboxSize() &&
					styles.position === "absolute",

				// To avoid forcing a reflow, only fetch boxSizing if we need it (gh-3991)
				boxSizingNeeded = scrollboxSizeBuggy || extra,
				isBorderBox = boxSizingNeeded &&
					jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
				subtract = extra ?
					boxModelAdjustment(
						elem,
						dimension,
						extra,
						isBorderBox,
						styles
					) :
					0;

			// Account for unreliable border-box dimensions by comparing offset* to computed and
			// faking a content-box to get border and padding (gh-3699)
			if ( isBorderBox && scrollboxSizeBuggy ) {
				subtract -= Math.ceil(
					elem[ "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 ) ] -
					parseFloat( styles[ dimension ] ) -
					boxModelAdjustment( elem, dimension, "border", false, styles ) -
					0.5
				);
			}

			// Convert to pixels if value adjustment is needed
			if ( subtract && ( matches = rcssNum.exec( value ) ) &&
				( matches[ 3 ] || "px" ) !== "px" ) {

				elem.style[ dimension ] = value;
				value = jQuery.css( elem, dimension );
			}

			return setPositiveNumber( elem, value, subtract );
		}
	};
} );

jQuery.cssHooks.marginLeft = addGetHookIf( support.reliableMarginLeft,
	function( elem, computed ) {
		if ( computed ) {
			return ( parseFloat( curCSS( elem, "marginLeft" ) ) ||
				elem.getBoundingClientRect().left -
					swap( elem, { marginLeft: 0 }, function() {
						return elem.getBoundingClientRect().left;
					} )
			) + "px";
		}
	}
);

// These hooks are used by animate to expand properties
jQuery.each( {
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// Assumes a single number if not a string
				parts = typeof value === "string" ? value.split( " " ) : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( prefix !== "margin" ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
} );

jQuery.fn.extend( {
	css: function( name, value ) {
		return access( this, function( elem, name, value ) {
			var styles, len,
				map = {},
				i = 0;

			if ( Array.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	}
} );


// Based off of the plugin by Clint Helfers, with permission.
jQuery.fn.delay = function( time, type ) {
	time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
	type = type || "fx";

	return this.queue( type, function( next, hooks ) {
		var timeout = window.setTimeout( next, time );
		hooks.stop = function() {
			window.clearTimeout( timeout );
		};
	} );
};


( function() {
	var input = document.createElement( "input" ),
		select = document.createElement( "select" ),
		opt = select.appendChild( document.createElement( "option" ) );

	input.type = "checkbox";

	// Support: Android <=4.3 only
	// Default value for a checkbox should be "on"
	support.checkOn = input.value !== "";

	// Support: IE <=11 only
	// Must access selectedIndex to make default options select
	support.optSelected = opt.selected;

	// Support: IE <=11 only
	// An input loses its value after becoming a radio
	input = document.createElement( "input" );
	input.value = "t";
	input.type = "radio";
	support.radioValue = input.value === "t";
} )();


var boolHook,
	attrHandle = jQuery.expr.attrHandle;

jQuery.fn.extend( {
	attr: function( name, value ) {
		return access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each( function() {
			jQuery.removeAttr( this, name );
		} );
	}
} );

jQuery.extend( {
	attr: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set attributes on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === "undefined" ) {
			return jQuery.prop( elem, name, value );
		}

		// Attribute hooks are determined by the lowercase version
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			hooks = jQuery.attrHooks[ name.toLowerCase() ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : undefined );
		}

		if ( value !== undefined ) {
			if ( value === null ) {
				jQuery.removeAttr( elem, name );
				return;
			}

			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			elem.setAttribute( name, value + "" );
			return value;
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		ret = jQuery.find.attr( elem, name );

		// Non-existent attributes return null, we normalize to undefined
		return ret == null ? undefined : ret;
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !support.radioValue && value === "radio" &&
					nodeName( elem, "input" ) ) {
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	removeAttr: function( elem, value ) {
		var name,
			i = 0,

			// Attribute names can contain non-HTML whitespace characters
			// https://html.spec.whatwg.org/multipage/syntax.html#attributes-2
			attrNames = value && value.match( rnothtmlwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( ( name = attrNames[ i++ ] ) ) {
				elem.removeAttribute( name );
			}
		}
	}
} );

// Hooks for boolean attributes
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {

			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else {
			elem.setAttribute( name, name );
		}
		return name;
	}
};

jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( _i, name ) {
	var getter = attrHandle[ name ] || jQuery.find.attr;

	attrHandle[ name ] = function( elem, name, isXML ) {
		var ret, handle,
			lowercaseName = name.toLowerCase();

		if ( !isXML ) {

			// Avoid an infinite loop by temporarily removing this function from the getter
			handle = attrHandle[ lowercaseName ];
			attrHandle[ lowercaseName ] = ret;
			ret = getter( elem, name, isXML ) != null ?
				lowercaseName :
				null;
			attrHandle[ lowercaseName ] = handle;
		}
		return ret;
	};
} );




var rfocusable = /^(?:input|select|textarea|button)$/i,
	rclickable = /^(?:a|area)$/i;

jQuery.fn.extend( {
	prop: function( name, value ) {
		return access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		return this.each( function() {
			delete this[ jQuery.propFix[ name ] || name ];
		} );
	}
} );

jQuery.extend( {
	prop: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set properties on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {

			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			return ( elem[ name ] = value );
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		return elem[ name ];
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {

				// Support: IE <=9 - 11 only
				// elem.tabIndex doesn't always return the
				// correct value when it hasn't been explicitly set
				// Use proper attribute retrieval (trac-12072)
				var tabindex = jQuery.find.attr( elem, "tabindex" );

				if ( tabindex ) {
					return parseInt( tabindex, 10 );
				}

				if (
					rfocusable.test( elem.nodeName ) ||
					rclickable.test( elem.nodeName ) &&
					elem.href
				) {
					return 0;
				}

				return -1;
			}
		}
	},

	propFix: {
		"for": "htmlFor",
		"class": "className"
	}
} );

// Support: IE <=11 only
// Accessing the selectedIndex property
// forces the browser to respect setting selected
// on the option
// The getter ensures a default option is selected
// when in an optgroup
// eslint rule "no-unused-expressions" is disabled for this code
// since it considers such accessions noop
if ( !support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {
			return null;
		},
		set: function( elem ) {
		}
	};
}

jQuery.each( [
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
} );




	// Strip and collapse whitespace according to HTML spec
	// https://infra.spec.whatwg.org/#strip-and-collapse-ascii-whitespace
	function stripAndCollapse( value ) {
		var tokens = value.match( rnothtmlwhite ) || [];
		return tokens.join( " " );
	}


function getClass( elem ) {
	return elem.getAttribute && elem.getAttribute( "class" ) || "";
}

function classesToArray( value ) {
	if ( Array.isArray( value ) ) {
		return value;
	}
	if ( typeof value === "string" ) {
		return value.match( rnothtmlwhite ) || [];
	}
	return [];
}

jQuery.fn.extend( {
	addClass: function( value ) {
		var classNames, cur, curValue, className, i, finalValue;

		if ( isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).addClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		classNames = classesToArray( value );

		if ( classNames.length ) {
			return this.each( function() {
				curValue = getClass( this );
				cur = this.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );

				if ( cur ) {
					for ( i = 0; i < classNames.length; i++ ) {
						className = classNames[ i ];
						if ( cur.indexOf( " " + className + " " ) < 0 ) {
							cur += className + " ";
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = stripAndCollapse( cur );
					if ( curValue !== finalValue ) {
						this.setAttribute( "class", finalValue );
					}
				}
			} );
		}

		return this;
	},

	removeClass: function( value ) {
		var classNames, cur, curValue, className, i, finalValue;

		if ( isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).removeClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		if ( !arguments.length ) {
			return this.attr( "class", "" );
		}

		classNames = classesToArray( value );

		if ( classNames.length ) {
			return this.each( function() {
				curValue = getClass( this );

				// This expression is here for better compressibility (see addClass)
				cur = this.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );

				if ( cur ) {
					for ( i = 0; i < classNames.length; i++ ) {
						className = classNames[ i ];

						// Remove *all* instances
						while ( cur.indexOf( " " + className + " " ) > -1 ) {
							cur = cur.replace( " " + className + " ", " " );
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = stripAndCollapse( cur );
					if ( curValue !== finalValue ) {
						this.setAttribute( "class", finalValue );
					}
				}
			} );
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var classNames, className, i, self,
			type = typeof value,
			isValidValue = type === "string" || Array.isArray( value );

		if ( isFunction( value ) ) {
			return this.each( function( i ) {
				jQuery( this ).toggleClass(
					value.call( this, i, getClass( this ), stateVal ),
					stateVal
				);
			} );
		}

		if ( typeof stateVal === "boolean" && isValidValue ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		classNames = classesToArray( value );

		return this.each( function() {
			if ( isValidValue ) {

				// Toggle individual class names
				self = jQuery( this );

				for ( i = 0; i < classNames.length; i++ ) {
					className = classNames[ i ];

					// Check each className given, space separated list
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
			} else if ( value === undefined || type === "boolean" ) {
				className = getClass( this );
				if ( className ) {

					// Store className if set
					dataPriv.set( this, "__className__", className );
				}

				// If the element has a class name or if we're passed `false`,
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				if ( this.setAttribute ) {
					this.setAttribute( "class",
						className || value === false ?
							"" :
							dataPriv.get( this, "__className__" ) || ""
					);
				}
			}
		} );
	},

	hasClass: function( selector ) {
		var className, elem,
			i = 0;

		className = " " + selector + " ";
		while ( ( elem = this[ i++ ] ) ) {
			if ( elem.nodeType === 1 &&
				( " " + stripAndCollapse( getClass( elem ) ) + " " ).indexOf( className ) > -1 ) {
				return true;
			}
		}

		return false;
	}
} );




var rreturn = /\r/g;

jQuery.fn.extend( {
	val: function( value ) {
		var hooks, ret, valueIsFunction,
			elem = this[ 0 ];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] ||
					jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks &&
					"get" in hooks &&
					( ret = hooks.get( elem, "value" ) ) !== undefined
				) {
					return ret;
				}

				ret = elem.value;

				// Handle most common string cases
				if ( typeof ret === "string" ) {
					return ret.replace( rreturn, "" );
				}

				// Handle cases where value is null/undef or number
				return ret == null ? "" : ret;
			}

			return;
		}

		valueIsFunction = isFunction( value );

		return this.each( function( i ) {
			var val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( valueIsFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";

			} else if ( typeof val === "number" ) {
				val += "";

			} else if ( Array.isArray( val ) ) {
				val = jQuery.map( val, function( value ) {
					return value == null ? "" : value + "";
				} );
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !( "set" in hooks ) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		} );
	}
} );

jQuery.extend( {
	valHooks: {
		option: {
			get: function( elem ) {

				var val = jQuery.find.attr( elem, "value" );
				return val != null ?
					val :

					// Support: IE <=10 - 11 only
					// option.text throws exceptions (trac-14686, trac-14858)
					// Strip and collapse whitespace
					// https://html.spec.whatwg.org/#strip-and-collapse-whitespace
					stripAndCollapse( jQuery.text( elem ) );
			}
		},
		select: {
			get: function( elem ) {
				var value, option, i,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one",
					values = one ? null : [],
					max = one ? index + 1 : options.length;

				if ( index < 0 ) {
					i = max;

				} else {
					i = one ? index : 0;
				}

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// Support: IE <=9 only
					// IE8-9 doesn't update selected after form reset (trac-2551)
					if ( ( option.selected || i === index ) &&

							// Don't return options that are disabled or in a disabled optgroup
							!option.disabled &&
							( !option.parentNode.disabled ||
								!nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];

					/* eslint-disable no-cond-assign */

					if ( option.selected =
						jQuery.inArray( jQuery.valHooks.option.get( option ), values ) > -1
					) {
						optionSet = true;
					}

					/* eslint-enable no-cond-assign */
				}

				// Force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	}
} );

// Radios and checkboxes getter/setter
jQuery.each( [ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			if ( Array.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery( elem ).val(), value ) > -1 );
			}
		}
	};
	if ( !support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			return elem.getAttribute( "value" ) === null ? "on" : elem.value;
		};
	}
} );




// Return jQuery for attributes-only inclusion


support.focusin = "onfocusin" in window;


var rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	stopPropagationCallback = function( e ) {
		e.stopPropagation();
	};

jQuery.extend( jQuery.event, {

	trigger: function( event, data, elem, onlyHandlers ) {

		var i, cur, tmp, bubbleType, ontype, handle, special, lastElement,
			eventPath = [ elem || document ],
			type = hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = hasOwn.call( event, "namespace" ) ? event.namespace.split( "." ) : [];

		cur = lastElement = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf( "." ) > -1 ) {

			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split( "." );
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf( ":" ) < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join( "." );
		event.rnamespace = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (trac-9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (trac-9724)
		if ( !onlyHandlers && !special.noBubble && !isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === ( elem.ownerDocument || document ) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( ( cur = eventPath[ i++ ] ) && !event.isPropagationStopped() ) {
			lastElement = cur;
			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( dataPriv.get( cur, "events" ) || Object.create( null ) )[ event.type ] &&
				dataPriv.get( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && handle.apply && acceptData( cur ) ) {
				event.result = handle.apply( cur, data );
				if ( event.result === false ) {
					event.preventDefault();
				}
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( ( !special._default ||
				special._default.apply( eventPath.pop(), data ) === false ) &&
				acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name as the event.
				// Don't do default actions on window, that's where global variables be (trac-6170)
				if ( ontype && isFunction( elem[ type ] ) && !isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;

					if ( event.isPropagationStopped() ) {
						lastElement.addEventListener( type, stopPropagationCallback );
					}

					elem[ type ]();

					if ( event.isPropagationStopped() ) {
						lastElement.removeEventListener( type, stopPropagationCallback );
					}

					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	// Piggyback on a donor event to simulate a different one
	// Used only for `focus(in | out)` events
	simulate: function( type, elem, event ) {
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true
			}
		);

		jQuery.event.trigger( e, null, elem );
	}

} );

jQuery.fn.extend( {

	trigger: function( type, data ) {
		return this.each( function() {
			jQuery.event.trigger( type, data, this );
		} );
	},
	triggerHandler: function( type, data ) {
		var elem = this[ 0 ];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
} );


// Support: Firefox <=44
// Firefox doesn't have focus(in | out) events
// Related ticket - https://bugzilla.mozilla.org/show_bug.cgi?id=687787
//
// Support: Chrome <=48 - 49, Safari <=9.0 - 9.1
// focus(in | out) events fire after focus & blur events,
// which is spec violation - http://www.w3.org/TR/DOM-Level-3-Events/#events-focusevent-event-order
// Related ticket - https://bugs.chromium.org/p/chromium/issues/detail?id=449857
if ( !support.focusin ) {
	jQuery.each( { focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler on the document while someone wants focusin/focusout
		var handler = function( event ) {
			jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ) );
		};

		jQuery.event.special[ fix ] = {
			setup: function() {

				// Handle: regular nodes (via `this.ownerDocument`), window
				// (via `this.document`) & document (via `this`).
				var doc = this.ownerDocument || this.document || this,
					attaches = dataPriv.access( doc, fix );

				if ( !attaches ) {
					doc.addEventListener( orig, handler, true );
				}
				dataPriv.access( doc, fix, ( attaches || 0 ) + 1 );
			},
			teardown: function() {
				var doc = this.ownerDocument || this.document || this,
					attaches = dataPriv.access( doc, fix ) - 1;

				if ( !attaches ) {
					doc.removeEventListener( orig, handler, true );
					dataPriv.remove( doc, fix );

				} else {
					dataPriv.access( doc, fix, attaches );
				}
			}
		};
	} );
}


// Cross-browser xml parsing
jQuery.parseXML = function( data ) {
	var xml, parserErrorElem;
	if ( !data || typeof data !== "string" ) {
		return null;
	}

	// Support: IE 9 - 11 only
	// IE throws on parseFromString with invalid input.
	try {
		xml = ( new window.DOMParser() ).parseFromString( data, "text/xml" );
	} catch ( e ) {}

	parserErrorElem = xml && xml.getElementsByTagName( "parsererror" )[ 0 ];
	if ( !xml || parserErrorElem ) {
		jQuery.error( "Invalid XML: " + (
			parserErrorElem ?
				jQuery.map( parserErrorElem.childNodes, function( el ) {
					return el.textContent;
				} ).join( "\n" ) :
				data
		) );
	}
	return xml;
};


var
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( Array.isArray( obj ) ) {

		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {

				// Treat each array item as a scalar.
				add( prefix, v );

			} else {

				// Item is non-scalar (array or object), encode its numeric index.
				buildParams(
					prefix + "[" + ( typeof v === "object" && v != null ? i : "" ) + "]",
					v,
					traditional,
					add
				);
			}
		} );

	} else if ( !traditional && toType( obj ) === "object" ) {

		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {

		// Serialize scalar item.
		add( prefix, obj );
	}
}

// Serialize an array of form elements or a set of
// key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, valueOrFunction ) {

			// If value is a function, invoke it and use its return value
			var value = isFunction( valueOrFunction ) ?
				valueOrFunction() :
				valueOrFunction;

			s[ s.length ] = encodeURIComponent( key ) + "=" +
				encodeURIComponent( value == null ? "" : value );
		};

	if ( a == null ) {
		return "";
	}

	// If an array was passed in, assume that it is an array of form elements.
	if ( Array.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {

		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		} );

	} else {

		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" );
};

jQuery.fn.extend( {
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map( function() {

			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		} ).filter( function() {
			var type = this.type;

			// Use .is( ":disabled" ) so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !rcheckableType.test( type ) );
		} ).map( function( _i, elem ) {
			var val = jQuery( this ).val();

			if ( val == null ) {
				return null;
			}

			if ( Array.isArray( val ) ) {
				return jQuery.map( val, function( val ) {
					return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
				} );
			}

			return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		} ).get();
	}
} );


jQuery.fn.extend( {
	wrapAll: function( html ) {
		var wrap;

		if ( this[ 0 ] ) {
			if ( isFunction( html ) ) {
				html = html.call( this[ 0 ] );
			}

			// The elements to wrap the target around
			wrap = jQuery( html, this[ 0 ].ownerDocument ).eq( 0 ).clone( true );

			if ( this[ 0 ].parentNode ) {
				wrap.insertBefore( this[ 0 ] );
			}

			wrap.map( function() {
				var elem = this;

				while ( elem.firstElementChild ) {
					elem = elem.firstElementChild;
				}

				return elem;
			} ).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( isFunction( html ) ) {
			return this.each( function( i ) {
				jQuery( this ).wrapInner( html.call( this, i ) );
			} );
		}

		return this.each( function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		} );
	},

	wrap: function( html ) {
		var htmlIsFunction = isFunction( html );

		return this.each( function( i ) {
			jQuery( this ).wrapAll( htmlIsFunction ? html.call( this, i ) : html );
		} );
	},

	unwrap: function( selector ) {
		this.parent( selector ).not( "body" ).each( function() {
			jQuery( this ).replaceWith( this.childNodes );
		} );
		return this;
	}
} );


jQuery.expr.pseudos.hidden = function( elem ) {
	return !jQuery.expr.pseudos.visible( elem );
};
jQuery.expr.pseudos.visible = function( elem ) {
	return !!( elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length );
};




// Support: Safari 8 only
// In Safari 8 documents created via document.implementation.createHTMLDocument
// collapse sibling forms: the second one becomes a child of the first one.
// Because of that, this security measure has to be disabled in Safari 8.
// https://bugs.webkit.org/show_bug.cgi?id=137337
support.createHTMLDocument = ( function() {
	var body = document.implementation.createHTMLDocument( "" ).body;
	body.innerHTML = "<form></form><form></form>";
	return body.childNodes.length === 2;
} )();


// Argument "data" should be string of html
// context (optional): If specified, the fragment will be created in this context,
// defaults to document
// keepScripts (optional): If true, will include scripts passed in the html string
jQuery.parseHTML = function( data, context, keepScripts ) {
	if ( typeof data !== "string" ) {
		return [];
	}
	if ( typeof context === "boolean" ) {
		keepScripts = context;
		context = false;
	}

	var base, parsed, scripts;

	if ( !context ) {

		// Stop scripts or inline event handlers from being executed immediately
		// by using document.implementation
		if ( support.createHTMLDocument ) {
			context = document.implementation.createHTMLDocument( "" );

			// Set the base href for the created document
			// so any parsed elements with URLs
			// are based on the document's URL (gh-2965)
			base = context.createElement( "base" );
			base.href = document.location.href;
			context.head.appendChild( base );
		} else {
			context = document;
		}
	}

	parsed = rsingleTag.exec( data );
	scripts = !keepScripts && [];

	// Single tag
	if ( parsed ) {
		return [ context.createElement( parsed[ 1 ] ) ];
	}

	parsed = buildFragment( [ data ], context, scripts );

	if ( scripts && scripts.length ) {
		jQuery( scripts ).remove();
	}

	return jQuery.merge( [], parsed.childNodes );
};


jQuery.offset = {
	setOffset: function( elem, options, i ) {
		var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
			position = jQuery.css( elem, "position" ),
			curElem = jQuery( elem ),
			props = {};

		// Set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		curOffset = curElem.offset();
		curCSSTop = jQuery.css( elem, "top" );
		curCSSLeft = jQuery.css( elem, "left" );
		calculatePosition = ( position === "absolute" || position === "fixed" ) &&
			( curCSSTop + curCSSLeft ).indexOf( "auto" ) > -1;

		// Need to be able to calculate position if either
		// top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;

		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( isFunction( options ) ) {

			// Use jQuery.extend here to allow modification of coordinates argument (gh-1848)
			options = options.call( elem, i, jQuery.extend( {}, curOffset ) );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );

		} else {
			curElem.css( props );
		}
	}
};

jQuery.fn.extend( {

	// offset() relates an element's border box to the document origin
	offset: function( options ) {

		// Preserve chaining for setter
		if ( arguments.length ) {
			return options === undefined ?
				this :
				this.each( function( i ) {
					jQuery.offset.setOffset( this, options, i );
				} );
		}

		var rect, win,
			elem = this[ 0 ];

		if ( !elem ) {
			return;
		}

		// Return zeros for disconnected and hidden (display: none) elements (gh-2310)
		// Support: IE <=11 only
		// Running getBoundingClientRect on a
		// disconnected node in IE throws an error
		if ( !elem.getClientRects().length ) {
			return { top: 0, left: 0 };
		}

		// Get document-relative position by adding viewport scroll to viewport-relative gBCR
		rect = elem.getBoundingClientRect();
		win = elem.ownerDocument.defaultView;
		return {
			top: rect.top + win.pageYOffset,
			left: rect.left + win.pageXOffset
		};
	},

	// position() relates an element's margin box to its offset parent's padding box
	// This corresponds to the behavior of CSS absolute positioning
	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset, doc,
			elem = this[ 0 ],
			parentOffset = { top: 0, left: 0 };

		// position:fixed elements are offset from the viewport, which itself always has zero offset
		if ( jQuery.css( elem, "position" ) === "fixed" ) {

			// Assume position:fixed implies availability of getBoundingClientRect
			offset = elem.getBoundingClientRect();

		} else {
			offset = this.offset();

			// Account for the *real* offset parent, which can be the document or its root element
			// when a statically positioned element is identified
			doc = elem.ownerDocument;
			offsetParent = elem.offsetParent || doc.documentElement;
			while ( offsetParent &&
				( offsetParent === doc.body || offsetParent === doc.documentElement ) &&
				jQuery.css( offsetParent, "position" ) === "static" ) {

				offsetParent = offsetParent.parentNode;
			}
			if ( offsetParent && offsetParent !== elem && offsetParent.nodeType === 1 ) {

				// Incorporate borders into its offset, since they are outside its content origin
				parentOffset = jQuery( offsetParent ).offset();
				parentOffset.top += jQuery.css( offsetParent, "borderTopWidth", true );
				parentOffset.left += jQuery.css( offsetParent, "borderLeftWidth", true );
			}
		}

		// Subtract parent offsets and element margins
		return {
			top: offset.top - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true )
		};
	},

	// This method will return documentElement in the following cases:
	// 1) For the element inside the iframe without offsetParent, this method will return
	//    documentElement of the parent window
	// 2) For the hidden or detached element
	// 3) For body or html element, i.e. in case of the html node - it will return itself
	//
	// but those exceptions were never presented as a real life use-cases
	// and might be considered as more preferable results.
	//
	// This logic, however, is not guaranteed and can change at any point in the future
	offsetParent: function() {
		return this.map( function() {
			var offsetParent = this.offsetParent;

			while ( offsetParent && jQuery.css( offsetParent, "position" ) === "static" ) {
				offsetParent = offsetParent.offsetParent;
			}

			return offsetParent || documentElement;
		} );
	}
} );

// Create scrollLeft and scrollTop methods
jQuery.each( { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function( method, prop ) {
	var top = "pageYOffset" === prop;

	jQuery.fn[ method ] = function( val ) {
		return access( this, function( elem, method, val ) {

			// Coalesce documents and windows
			var win;
			if ( isWindow( elem ) ) {
				win = elem;
			} else if ( elem.nodeType === 9 ) {
				win = elem.defaultView;
			}

			if ( val === undefined ) {
				return win ? win[ prop ] : elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : win.pageXOffset,
					top ? val : win.pageYOffset
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length );
	};
} );

// Support: Safari <=7 - 9.1, Chrome <=37 - 49
// Add the top/left cssHooks using jQuery.fn.position
// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
// Blink bug: https://bugs.chromium.org/p/chromium/issues/detail?id=589347
// getComputedStyle returns percent when specified for top/left/bottom/right;
// rather than make the css module depend on the offset module, just check for it here
jQuery.each( [ "top", "left" ], function( _i, prop ) {
	jQuery.cssHooks[ prop ] = addGetHookIf( support.pixelPosition,
		function( elem, computed ) {
			if ( computed ) {
				computed = curCSS( elem, prop );

				// If curCSS returns percentage, fallback to offset
				return rnumnonpx.test( computed ) ?
					jQuery( elem ).position()[ prop ] + "px" :
					computed;
			}
		}
	);
} );


// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( {
		padding: "inner" + name,
		content: type,
		"": "outer" + name
	}, function( defaultExtra, funcName ) {

		// Margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return access( this, function( elem, type, value ) {
				var doc;

				if ( isWindow( elem ) ) {

					// $( window ).outerWidth/Height return w/h including scrollbars (gh-1729)
					return funcName.indexOf( "outer" ) === 0 ?
						elem[ "inner" + name ] :
						elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
					// whichever is greatest
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?

					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable );
		};
	} );
} );


jQuery.fn.extend( {

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {

		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ?
			this.off( selector, "**" ) :
			this.off( types, selector || "**", fn );
	},

	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	}
} );

jQuery.each(
	( "blur focus focusin focusout resize scroll click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup contextmenu" ).split( " " ),
	function( _i, name ) {

		// Handle event binding
		jQuery.fn[ name ] = function( data, fn ) {
			return arguments.length > 0 ?
				this.on( name, null, data, fn ) :
				this.trigger( name );
		};
	}
);




// Support: Android <=4.0 only
// Make sure we trim BOM and NBSP
// Require that the "whitespace run" starts from a non-whitespace
// to avoid O(N^2) behavior when the engine would try matching "\s+$" at each space position.
var rtrim = /^[\s\uFEFF\xA0]+|([^\s\uFEFF\xA0])[\s\uFEFF\xA0]+$/g;

// Bind a function to a context, optionally partially applying any
// arguments.
// jQuery.proxy is deprecated to promote standards (specifically Function#bind)
// However, it is not slated for removal any time soon
jQuery.proxy = function( fn, context ) {
	var tmp, args, proxy;

	if ( typeof context === "string" ) {
		tmp = fn[ context ];
		context = fn;
		fn = tmp;
	}

	// Quick check to determine if target is callable, in the spec
	// this throws a TypeError, but we will just return undefined.
	if ( !isFunction( fn ) ) {
		return undefined;
	}

	// Simulated bind
	args = slice.call( arguments, 2 );
	proxy = function() {
		return fn.apply( context || this, args.concat( slice.call( arguments ) ) );
	};

	// Set the guid of unique handler to the same of original handler, so it can be removed
	proxy.guid = fn.guid = fn.guid || jQuery.guid++;

	return proxy;
};

jQuery.holdReady = function( hold ) {
	if ( hold ) {
		jQuery.readyWait++;
	} else {
		jQuery.ready( true );
	}
};
jQuery.isArray = Array.isArray;
jQuery.parseJSON = JSON.parse;
jQuery.nodeName = nodeName;
jQuery.isFunction = isFunction;
jQuery.isWindow = isWindow;
jQuery.camelCase = camelCase;
jQuery.type = toType;

jQuery.now = Date.now;

jQuery.isNumeric = function( obj ) {

	// As of jQuery 3.0, isNumeric is limited to
	// strings and numbers (primitives or objects)
	// that can be coerced to finite numbers (gh-2662)
	var type = jQuery.type( obj );
	return ( type === "number" || type === "string" ) &&

		// parseFloat NaNs numeric-cast false positives ("")
		// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
		// subtraction forces infinities to NaN
		!isNaN( obj - parseFloat( obj ) );
};

jQuery.trim = function( text ) {
	return text == null ?
		"" :
		( text + "" ).replace( rtrim, "$1" );
};




var

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$;

jQuery.noConflict = function( deep ) {
	if ( window.$ === jQuery ) {
		window.$ = _$;
	}

	if ( deep && window.jQuery === jQuery ) {
		window.jQuery = _jQuery;
	}

	return jQuery;
};

// Expose jQuery and $ identifiers, even in AMD
// (trac-7102#comment:10, https://github.com/jquery/jquery/pull/557)
// and CommonJS for browser emulators (trac-13566)
if ( typeof noGlobal === "undefined" ) {
	window.jQuery = window.$ = jQuery;
}




return jQuery;
} );
});

/*
 * ------------------------------------------------------------------------------------------------
 * Copyright 2014 by Swiss Post, Information Technology Services
 * ------------------------------------------------------------------------------------------------
 * $Id$
 * ------------------------------------------------------------------------------------------------
 */

const vertx = window.vertx || {};
!(function (factory) {
  factory(SockJS);
})(function (SockJS) {
  vertx.EventBus = function (url, options) {
    const that = this;
    const sockJSConn = new SockJS(url, undefined, options);
    const handlerMap = {};
    const replyHandlers = {};
    let state = vertx.EventBus.CONNECTING;
    let pingTimerID = null;
    let pingInterval = null;
    if (options) {
      pingInterval = options.vertxbus_ping_interval;
    }
    if (!pingInterval) {
      pingInterval = 5000;
    }
    that.onopen = null;
    that.onclose = null;
    that.login = function (username, password, replyHandler) {
      sendOrPub(
        'send',
        'vertx.basicauthmanager.login',
        {
          username: username,
          password: password,
        },
        function (reply) {
          if (reply.status === 'ok') {
            that.sessionID = reply.sessionID;
          }
          if (replyHandler) {
            delete reply.sessionID;
            replyHandler(reply);
          }
        },
      );
    };
    that.send = function (address, message, replyHandler) {
      sendOrPub('send', address, message, replyHandler);
    };
    that.publish = function (address, message) {
      sendOrPub('publish', address, message, null);
    };
    that.registerHandler = function (address, handler) {
      checkSpecified('address', 'string', address);
      checkSpecified('handler', 'function', handler);
      checkOpen();
      let handlers = handlerMap[address];
      if (!handlers) {
        handlers = [handler];
        handlerMap[address] = handlers;
        const msg = {
          type: 'register',
          address: address,
        };
        sockJSConn.send(JSON.stringify(msg));
      } else {
        handlers[handlers.length] = handler;
      }
    };
    that.unregisterHandler = function (address, handler) {
      checkSpecified('address', 'string', address);
      checkSpecified('handler', 'function', handler);
      checkOpen();
      const handlers = handlerMap[address];
      if (handlers) {
        const idx = handlers.indexOf(handler);
        if (idx !== -1) handlers.splice(idx, 1);
        if (handlers.length === 0) {
          const msg = {
            type: 'unregister',
            address: address,
          };
          sockJSConn.send(JSON.stringify(msg));
          delete handlerMap[address];
        }
      }
    };
    that.close = function () {
      checkOpen();
      state = vertx.EventBus.CLOSING;
      sockJSConn.close();
    };
    that.readyState = function () {
      return state;
    };
    sockJSConn.onopen = function () {
      sendPing();
      pingTimerID = setInterval(sendPing, pingInterval);
      state = vertx.EventBus.OPEN;
      if (that.onopen) {
        that.onopen();
      }
    };
    sockJSConn.onclose = function () {
      state = vertx.EventBus.CLOSED;
      if (pingTimerID) clearInterval(pingTimerID);
      if (that.onclose) {
        that.onclose();
      }
    };
    sockJSConn.onmessage = function (e) {
      const msg = e.data;
      const json = JSON.parse(msg);
      const body = json.body;
      const replyAddress = json.replyAddress;
      const address = json.address;
      let replyHandler;
      if (replyAddress) {
        replyHandler = function (reply, replyHandler) {
          that.send(replyAddress, reply, replyHandler);
        };
      }
      const handlers = handlerMap[address];
      if (handlers) {
        const copy = handlers.slice(0);
        for (const element of copy) {
          element(body, replyHandler);
        }
      } else {
        const handler = replyHandlers[address];
        if (handler) {
          delete replyHandlers[address];
          handler(body, replyHandler);
        }
      }
    };

    function sendPing() {
      const msg = {
        type: 'ping',
      };
      sockJSConn.send(JSON.stringify(msg));
    }

    function sendOrPub(sendOrPub, address, message, replyHandler) {
      checkSpecified('address', 'string', address);
      checkSpecified('replyHandler', 'function', replyHandler, true);
      checkOpen();
      const envelope = {
        type: sendOrPub,
        address: address,
        body: message,
      };
      if (that.sessionID) {
        envelope.sessionID = that.sessionID;
      }
      if (replyHandler) {
        const replyAddress = makeUUID();
        envelope.replyAddress = replyAddress;
        replyHandlers[replyAddress] = replyHandler;
      }
      const str = JSON.stringify(envelope);
      sockJSConn.send(str);
    }

    function checkOpen() {
      if (state !== vertx.EventBus.OPEN) {
        throw new Error('INVALID_STATE_ERR');
      }
    }

    function checkSpecified(paramName, paramType, param, optional) {
      if (!optional && !param) {
        throw new Error('Parameter ' + paramName + ' must be specified');
      }
      if (param && typeof param !== paramType) {
        throw new Error('Parameter ' + paramName + ' must be of type ' + paramType);
      }
    }

    function makeUUID() {
      return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16),
      );
    }
  };
  vertx.EventBus.CONNECTING = 0;
  vertx.EventBus.OPEN = 1;
  vertx.EventBus.CLOSING = 2;
  vertx.EventBus.CLOSED = 3;
  return vertx.EventBus;
});
(function ($) {
  window.klpWidgetDev = function (
    id,
    app,
    service,
    appLoginURL,
    _menuLinks,
    lang,
    platform,
    options,
    environment,
  ) {
    const headerNode = document.getElementsByTagName('header')[0];
    const config = { attributes: true, childList: false, subtree: false };
    const callback = function (mutationsList, observer) {
      for (let mutation of mutationsList) {
        if (mutation.attributeName === 'class') {
          if ($('header').hasClass('h-fixed-position') && !$('header').hasClass('h-visible')) {
            selectFromShadowDom().find('.klp-widget-authenticated-menu').css('display', 'none');
            selectFromShadowDom()
              .find('#' + id)
              .removeClass('bubble');
          }
        }
      }
    };
    const observer = new MutationObserver(callback);
    if (headerNode) {
      observer.observe(headerNode, config);
    }

    let keepAliveID = 'klp-widget-keepalive',
      persistedStateKey = 'klp.widget.state',
      persistedDocumentPrefix = 'klp.widget.document.',
      controlCookieName = 'NCTRL',
      controlCookieDomain = 'post.ch',
      controlCookieDomainRegEx = new RegExp(controlCookieDomain + '$'),
      controlCookieRegEx = new RegExp(controlCookieName + '=([^;]+)'),
      eventBus = undefined,
      address = undefined,
      retrySubscribeOnFail = false,
      sessionData = undefined,
      loginCallback = undefined,
      keepAliveCallback = undefined,
      logoutCallback = undefined,
      documentCallbacks = {},
      documentUnreadNotifications = 'UNREAD_NOTIFICATIONS',
      isUserActive = true,
      keepAliveTimer = undefined,
      currentLang = 'de',
      originUrl = '',
      startingTime = new Date().getTime(),
      version = '16.01.00.01',
      unreadNotifications = 0,
      texts = {
        de: {
          'sign-in': 'Login',
          'sign-out': 'Logout',
          'change-company': 'Firma w\u00E4hlen',
          'change-company-confirm-dialog':
            'M\u00F6chten Sie die aktuelle Firma wechseln? </p></div></div><div class="modal-button-container row"><div class="col-6"></div><div class="col-6 item-centered"><button id="klp-widget-authenticated-dochangecompany" class="ppm-button btn btn-primary col-11">Firma w\u00E4hlen</button>',
          'change-company-support-dialog':
            'Im Kunden-Supportlogin steht die Funktion "Firma wechseln" nicht zur Verf\u00FCgung. F\u00FChren Sie stattdessen ein Logout durch und starten Sie das Kunden-Supportlogin auf einem neuen Benutzer oder einer neuen Firma. </p></div></div><div class="modal-button-container row"><div class="col-6"></div><div class="col-6 item-centered"><button id="klp-widget-authenticated-dochangecompany" class="ppm-button btn btn-primary col-11">Logout</button>',
          'change-account': 'Benutzerkonto wechseln',
          'change-account-confirm-dialog':
            'M\u00F6chten Sie in ein anderes Benutzerkonto wechseln? </p></div></div><div class="modal-button-container row"><div class="item-centered d-flex justify-content-center col-lg-12 col-12 pe-0 me-0"><div class="col-lg-4 col-12 me-0 pe-0"><button id="klp-widget-authenticated-dochangecompany" class="ppm-button btn btn-primary w-100">Weiter</button>',
          'change-account-support-dialog':
            'Im Kunden-Supportlogin steht die Funktion "Benutzerkonto wechseln" nicht zur Verf\u00FCgung. F\u00FChren Sie stattdessen ein Logout durch und starten Sie das Kunden-Supportlogin auf einem neuen Benutzer oder einer neuen Firma. </p></div></div><div class="modal-button-container row"><div class="col-6"></div><div class="col-6 item-centered"><button id="klp-widget-authenticated-dochangecompany" class="ppm-button btn btn-primary col-11">Logout</button>',
          'links': 'Meine Onlinedienste',
          'notifications': 'Meldungen',
          'toggle-menu': 'toggle-menu',
          'no-links': 'Keine Favoriten bei Onlinedienste',
          'no-notifications': 'Keine ungelesenen Meldungen',
          'more-notifications': 'Alle Meldungen',
          'title-text-menu': 'Meine \u00DCbersicht',
          'title-text-links': 'Meine Onlinedienste',
          'title-text-notifications': 'Nachrichten',
          'userProfile': 'Mein Profil',
          'settings': 'Einstellungen',
        },
        fr: {
          'sign-in': 'Login',
          'sign-out': 'Logout',
          'change-company': 'Changer entreprise',
          'change-company-confirm-dialog':
            'Voulez-vous quitter l\'entreprise actuelle? </p></div></div><div class="modal-button-container row"><div class="col-6"></div><div class="col-6 item-centered"><button id="klp-widget-authenticated-dochangecompany" class="ppm-button btn btn-primary col-11">Changer enterprise</button>.',
          'change-company-support-dialog':
            'Dans le Login-Support, la fonction changer entreprise n\'est pas disponible. Il faut quitter la session et puis d\u00E9marrer un nouveau Login-Support avec un autre compte ou une soci\u00E9t\u00E9 diff\u00E9rente. </p></div></div><div class="modal-button-container row"><div class="col-6"></div><div class="col-6 item-centered"><button id="klp-widget-authenticated-dochangecompany" class="ppm-button btn btn-primary col-11">D\u00E9connexion</button>',
          'change-account': 'Changer de compte',
          'change-account-confirm-dialog':
            'Vous souhaitez changer de compte utilisateur? </p></div></div><div class="modal-button-container row"><div class="item-centered d-flex justify-content-center col-lg-12 col-12 pe-0 me-0"><div class="col-lg-4 col-12 me-0 pe-0"><button id="klp-widget-authenticated-dochangecompany" class="ppm-button btn btn-primary w-100">Continuer</button>',
          'change-account-support-dialog':
            'La fonction "Changer de compte" n\'est pas disponible dans le login de support client. D\u00E9connectez-vous et d\u00E9marrez le login de support client sur un autre compte utilisateur ou d\'entreprise. </p></div></div><div class="modal-button-container row"><div class="col-6"></div><div class="col-6 item-centered"><button id="klp-widget-authenticated-dochangecompany" class="ppm-button btn btn-primary col-11">D\u00E9connexion</button>',
          'links': 'Mes services en ligne',
          'notifications': 'notifications',
          'toggle-menu': 'toggle-menu',
          'no-links': 'Pas de favoris',
          'no-notifications': 'Pas de notifications non lues',
          'more-notifications': 'Toutes les notifications',
          'title-text-menu': 'Mon compte',
          'title-text-links': 'Mes services en ligne',
          'title-text-notifications': 'Messages',
          'userProfile': 'Mon profil',
          'settings': 'Paramètres',
        },
        it: {
          'sign-in': 'Login',
          'sign-out': 'Logout',
          'change-company': 'Cambia la ditta',
          'change-company-confirm-dialog':
            '\u00C8 sicuro di voler uscire dall\'attuale ditta? </p></div></div><div class="modal-button-container row"><div class="col-6"></div><div class="col-6 item-centered"><button id="klp-widget-authenticated-dochangecompany" class="ppm-button btn btn-primary col-11">Cambia la ditta</button>',
          'change-company-support-dialog':
            'Nell\'Assistenza clienti, il cambiamento di ditta non \u00E8 disponibile. Bisogna prima eseguire un Logout, quindi avviare nuovamente l\'Assistenza clienti selezionando un utente o una ditta differente. </p></div></div><div class="modal-button-container row"><div class="col-6"></div><div class="col-6 item-centered"><button id="klp-widget-authenticated-dochangecompany" class="ppm-button btn btn-primary col-11">Logout</button>',
          'change-account': 'Cambia account utente',
          'change-account-confirm-dialog':
            'Desidera accedere con un altro account utente? </p></div></div><div class="modal-button-container row"><div class="item-centered d-flex justify-content-center col-lg-12 col-12 pe-0 me-0"><div class="col-lg-4 col-12 me-0 pe-0"><button id="klp-widget-authenticated-dochangecompany" class="ppm-button btn btn-primary w-100">Avanti</button>',
          'change-account-support-dialog':
            'Nel login assistenza clienti non \u00E8 disponibile la funzione "Modifica account utente". Si consiglia di effettuare il logout, quindi di riaccedere al login assistenza clienti tramite un nuovo account utente o una nuova ditta. </p></div></div><div class="modal-button-container row"><div class="col-6"></div><div class="col-6 item-centered"><button id="klp-widget-authenticated-dochangecompany" class="ppm-button btn btn-primary col-11">Logout</button>',
          'links': 'I miei servizi online',
          'notifications': 'notifiche',
          'toggle-menu': 'toggle-menu',
          'no-links': 'Nessun preferito',
          'no-notifications': 'Nessuna notifica non letta',
          'more-notifications': 'Tutte le notifiche',
          'title-text-menu': 'Il mio riepilogo',
          'title-text-links': 'I miei servizi online',
          'title-text-notifications': 'Messaggi',
          'userProfile': 'Il mio profilo',
          'settings': 'Impostazioni',
        },
        en: {
          'sign-in': 'Login',
          'sign-out': 'Logout',
          'change-company': 'Change company',
          'change-company-confirm-dialog':
            'Would you like to sign-out from the current company? </p></div></div><div class="modal-button-container row"><div class="col-6"></div><div class="col-6 item-centered"><button id="klp-widget-authenticated-dochangecompany" class="ppm-button btn btn-primary col-11">Next</button>.',
          'change-company-support-dialog':
            'On Kunden-Supportlogin, the function Change company is not available. You have to SignOut and then start again a new Kunden-Supportlogin selecting a different account or company. </p></div></div><div class="modal-button-container row"><div class="col-6"></div><div class="col-6 item-centered"><button id="klp-widget-authenticated-dochangecompany" class="ppm-button btn btn-primary col-11">Logout</button>',
          'change-account': 'Change user account',
          'change-account-confirm-dialog':
            'Do you want to change to another user account? </p></div></div><div class="modal-button-container row"><div class="item-centered d-flex justify-content-center col-lg-12 col-12 pe-0 me-0"><div class="col-lg-4 col-12 me-0 pe-0"><button id="klp-widget-authenticated-dochangecompany" class="ppm-button btn btn-primary w-100">Next</button>',
          'change-account-support-dialog':
            'The "Change user account" function is not available in the customer support login. Instead, log out and start the customer support login using a new user or new company. </p></div></div><div class="modal-button-container row"><div class="col-6"></div><div class="col-6 item-centered"><button id="klp-widget-authenticated-dochangecompany" class="ppm-button btn btn-primary col-11">Logout</button>',
          'links': 'My online services',
          'notifications': 'notifications',
          'toggle-menu': 'toggle-menu',
          'no-links': 'No favorites',
          'no-notifications': 'No unread notifications',
          'more-notifications': 'All notifications',
          'title-text-menu': 'My overview',
          'title-text-links': 'My online services',
          'title-text-notifications': 'Inbox',
          'userProfile': 'My Profile',
          'settings': 'Settings',
        },
      },
      keys = {
        'sign-in': {
          'access-key': 'i',
          'tab-index': 0,
        },
        'sign-out': {
          'access-key': 'o',
          'tab-index': 3,
        },
        'toggle-menu': {
          'access-key': 'm',
          'tab-index': 0,
        },
        'change-company': {
          'access-key': 'c',
          'tab-index': 2,
        },
        'change-account': {
          'access-key': 'c',
          'tab-index': 2,
        },
        'notifications': {
          'access-key': 'n',
          'tab-index': 1,
        },
        'links': {
          'access-key': 'l',
          'tab-index': 4,
        },
      },
      platformEndPoints = {
        audit: platform.endPoint + '/v1/audit',
        keepalive: platform.endPoint + '/v1/session/keepalive',
        subscribe: platform.endPoint + '/v1/session/subscribe',
        eventbus: platform.endPoint + '/eventbus',
      },
      conf = {
        logoutTargetURL: '',
        keepAlive: true,
        keepAliveListeningEvents: 'click touchstart keydown',
        keepAliveOnInit: true,
        keepAliveInterval: 9,
        showLinks: true,
        tabIndex: -1,
        accessKeys: false,
        notificationsNrToLoad: 5,
        debug: false,
      };
    if (lang !== undefined) {
      currentLang = lang.toLowerCase();
    }
    const getLocation = function (url) {
      return new URL(url);
    };
    const url = getLocation(logoutURL());
    originUrl = url.origin;
    const menuLinks = [
      {
        description: texts[currentLang].userProfile,
        url: originUrl + '/selfadmin/?lang=' + currentLang,
        iconclass: 'widget_icon_profile',
      },
    ];

    const messagesUrl = originUrl + '/selfadmin/messages/?lang=' + currentLang;

    if (options !== undefined) {
      conf = Object.assign({}, conf, options);
    }

    function isHTML5StorageSupported() {
      try {
        return 'sessionStorage' in window && window.sessionStorage !== null;
      } catch (e) {
        log('No local storage available');
        return false;
      }
    }

    function now() {
      const n = new Date();
      return (
        n.getFullYear() +
        '-' +
        n.getMonth() +
        1 +
        '-' +
        n.getDate() +
        ' ' +
        n.getHours() +
        ':' +
        n.getMinutes() +
        ':' +
        n.getSeconds() +
        ',' +
        n.getMilliseconds()
      );
    }

    function log(message) {
      if (conf.debug && window.console && window.console.log) {
        console.log('[' + now() + '] - KLP.WIDGET - ' + message);
      }
    }

    function audit(message) {
      const auditingEvent = JSON.stringify({
        adr: address,
        evt: message,
      });
      if (message.adt) {
        log('Sending auditing event: ' + auditingEvent);
        fetch(platformEndPoints.audit, {
          method: 'POST',
          credentials: 'include',
          mode: 'cors',
          body: auditingEvent,
        });
      } else {
        log('Auditing disabled: ' + auditingEvent);
      }
    }

    function logPerformanceMetric(methodName, executionTime) {
      if (conf.debug && window.console && window.console.log) {
        log('Method ' + methodName + ' executed on ' + executionTime + ' ms');
      }
    }

    function random() {
      return Math.floor(Math.random() * 999999999 + 1);
    }

    function text(key) {
      return texts[currentLang][key];
    }

    function accessKey(key) {
      if (conf.accessKeys === false || keys[key]['access-key'] == null) {
        return '';
      }
      return 'accesskey="' + keys[key]['access-key'] + '"';
    }

    function tabIndex(key) {
      if (conf.tabIndex < 0) {
        return 0;
      }
      return keys[key]['tab-index'] + conf.tabIndex;
    }

    function join(base, query) {
      if (query === undefined) {
        return base;
      }
      if (base.indexOf('?') === -1) {
        return base + '?' + query;
      } else {
        return base + '&' + query;
      }
    }

    function loginURL() {
      return join(appLoginURL, buildLoginParameters());
    }

    function buildLoginParameters() {
      let parameters = '';
      $.each(
        {
          app: app,
          service: service,
          lang: currentLang,
        },
        function (key, value) {
          if (appLoginURL.toLowerCase().indexOf(key.toLowerCase()) === -1) {
            if (parameters.length > 0) {
              parameters += '&';
            }
            parameters += key + '=' + value;
          }
        },
      );
      return parameters.length > 0 ? parameters : undefined;
    }

    function logoutURL() {
      const serviceForLogout = 'klp';
      const inIframe = false;
      return join(
        platform.logoutURL,
        'app=' +
          app +
          '&lang=' +
          currentLang +
          '&service=' +
          serviceForLogout +
          '&inIframe=' +
          inIframe +
          '&logoutTargetURL=' +
          conf.logoutTargetURL,
      );
    }

    function doLogout(logoutUrl) {
      log('Clearing cache and sessionData before starting the logout process');
      sessionData = undefined;
      removePersistedState();
      log('Proceeding to logoutUrl with following path ' + logoutUrl);
      window.location.href = logoutUrl;
    }

    function setChangeAccountDialog() {
      selectFromShadowDom()
        .find('#' + id + ' #klp-widget-authenticated-menu-changecompany')
        .on('click touch', function (e) {
          e.preventDefault();
          selectFromShadowDom()
            .find('#' + id + ' #klp-widget-authenticated-menu-changecompany')
            .focus();
          changeAccountDialog();
          return false;
        });
    }

    function changeAccountDialog() {
      let body;
      let logoutUrl;
      if (sessionData !== undefined && sessionData.support) {
        if (isChangeUserAndProfile()) {
          body = text('change-account-support-dialog');
        } else {
          body = text('change-company-support-dialog');
        }
        logoutUrl = logoutURL();
      } else {
        if (isChangeUserAndProfile()) {
          body = text('change-account-confirm-dialog');
        } else {
          body = text('change-company-confirm-dialog');
        }
        logoutUrl = changeCompanyURL();
      }
      if (
        selectFromShadowDom().find('#' + id + ' #klp-widget-authenticated-changecompanydialog')
          .length === 0
      ) {
        const changecompanyDialog =
          '<div id="changeAccountModal" class="modal"><div class="modal-content"><div class="modal-text-container row"><div class="col-12 text-align-center"><i class="pi pi-2086"></i></div><span class="close">&times;</span><div class="col-1"></div><div class="col-10 text-align-center"><p class="modal-text">' +
          body +
          '</div></div></div>';
        selectFromShadowDom()
          .find('#' + id + ' .klp-widget-authenticated')
          .append(changecompanyDialog);

        // Get the modal
        let modal = selectFromShadowDom().find('#changeAccountModal');
        if (modal.length && modal.length >= 1) {
          modal = modal[0];
        }
        modal.style.display = 'table';
        // Get the <span> element that closes the modal
        const span = selectFromShadowDom().find('#changeAccountModal .close')[0];

        // When the user clicks on <span> (x), close the modal
        span.onclick = function () {
          modal.parentElement.removeChild(modal);
        };

        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function (event) {
          if (event.target === modal) {
            modal.parentElement.removeChild(modal);
          }
        };

        selectFromShadowDom()
          .find('#klp-widget-authenticated-dochangecompany')
          .on('click touch', function (e) {
            e.preventDefault();
            selectFromShadowDom()
              .find('#' + id + ' #klp-widget-authenticated-dochangecompany')
              .focus();
            doLogout(logoutUrl);
            return false;
          });
      }
    }

    function changeCompanyURL() {
      return logoutURL() + '&changecompany=true';
    }

    function setUserActive() {
      isUserActive = true;
    }

    function restoreState() {
      const state = loadPersistedState();
      if (state) {
        address = state.address;
        retrySubscribeOnFail = true;
        sessionData = state.sessionData;
        renderWidget();
        if (isCurrentLocationPostCh()) {
          renderNotificationsWidget(loadDocumentFromCache(documentUnreadNotifications));
        }
      }
    }

    function loadPersistedState() {
      if (isHTML5StorageSupported()) {
        const persistedState = sessionStorage.getItem(persistedStateKey);
        if (persistedState) {
          try {
            const state = JSON.parse(persistedState);
            if (state.ttl > new Date().getTime() && isPersistedStateValid(state.sessionData)) {
              log('Valid persisted state loaded: ' + persistedState);
              return state;
            } else {
              log('Persisted state expired or invalid');
              removePersistedState();
              setControlCookie('all', 'sub');
            }
          } catch (err) {
            log("Persisted state was invalid due to error '" + err + "'");
            removePersistedState();
            setControlCookie('all', 'sub');
          }
        } else {
          log('No persisted state found');
          removePersistedState();
          setControlCookie('all', 'sub');
        }
      } else {
        log('State not loaded because HTML storage not supported');
      }
      return null;
    }

    function persistState(ttl) {
      if (isHTML5StorageSupported()) {
        sessionStorage.setItem(
          persistedStateKey,
          '{"ttl": ' +
            (new Date().getTime() + ttl) +
            ',"sessionData": ' +
            JSON.stringify(sessionData) +
            ', "address":"' +
            address +
            '"}',
        );
        log('State persisted');
        setControlCookie('hash', encodeURIComponent(hash(sessionData)));
      } else {
        log('State not persisted because HTML storage not supported');
      }
    }

    function removePersistedState() {
      if (isHTML5StorageSupported()) {
        sessionStorage.removeItem(persistedStateKey);
        log('Persisted state removed');
        removeControlCookie();
      } else {
        log('Persisted state not removed because HTML storage not supported');
      }
    }

    function isPersistedStateValid(persistedData) {
      const hashPersistedData = hash(persistedData).toString();
      const hashCookie = getControlCookieVal('hash');
      if (hashPersistedData === hashCookie) {
        return true;
      }
      if (hashCookie === undefined && !isCurrentLocationPostCh()) {
        log(
          'Cache validated because on a different host=[' +
            window.location.hostname +
            '] than control cookie domain=[' +
            controlCookieDomain +
            ']',
        );
        return true;
      }
      log(
        'PersistedData are invalid [hashPersistedData=' +
          hashPersistedData +
          ',control cookie=' +
          hashCookie +
          ']',
      );
      return false;
    }

    function isCurrentLocationPostCh() {
      return window.location.hostname.match(controlCookieDomainRegEx);
    }

    function hash(s) {
      s = JSON.stringify(s);
      let hash = 0,
        i,
        chr,
        len;
      if (s.length === 0) return hash;
      for (i = 0, len = s.length; i < len; i++) {
        chr = s.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0;
      }
      return hash;
    }

    function getControlCookieVal(scope) {
      const cookieData = controlCookieRegEx.exec(document.cookie);
      if (cookieData != null) {
        const values = decodeURIComponent(cookieData[1]).split(':');
        switch (scope) {
          case 'hash':
            if (values[0] != null) return values[0];
            break;
          case 'keepalive':
            if (values[1] != null) return values[1];
            break;
          default:
            return decodeURIComponent(cookieData[1]);
        }
        return null;
      } else {
        log('Control cookie not found');
        return null;
      }
    }

    function setControlCookie(scope, val) {
      const sameSiteNoneSecure = '; SameSite=None; Secure';
      switch (scope) {
        case 'hash':
          document.cookie =
            controlCookieName +
            '=' +
            val +
            ':' +
            getControlCookieVal('keepalive') +
            '; Path=/; domain=' +
            controlCookieDomain +
            sameSiteNoneSecure;
          break;
        case 'keepalive':
          document.cookie =
            controlCookieName +
            '=' +
            getControlCookieVal('hash') +
            ':' +
            val +
            '; Path=/; domain=' +
            controlCookieDomain +
            sameSiteNoneSecure;
          break;
        default:
          document.cookie =
            controlCookieName +
            '=' +
            val +
            '; Path=/; domain=' +
            controlCookieDomain +
            sameSiteNoneSecure;
          break;
      }
    }

    function removeControlCookie() {
      if (retrySubscribeOnFail) {
        document.cookie =
          controlCookieName + '=' + 'sub' + '; Path=/; domain=' + controlCookieDomain;
        log('Control cookie set to sub');
      } else {
        document.cookie =
          controlCookieName +
          '=' +
          '' +
          '; Path=/; Expires=Wed, 01 Apr 2014 01:00:00 GMT; domain=' +
          controlCookieDomain;
        log('Control cookie removed');
      }
    }

    function loadDocumentFromCache(documentType) {
      const persistedKey = persistedDocumentPrefix + documentType;
      if (isHTML5StorageSupported()) {
        const persistedDocument = sessionStorage.getItem(persistedKey);
        if (persistedDocument) {
          const document = $.parseJSON(persistedDocument);
          log('Document ' + documentType + ' has been read from cache with value ' + document);
          return document;
        }
      }
      return null;
    }

    function saveDocumentOnCache(document, documentType) {
      const key = persistedDocumentPrefix + documentType;
      if (isHTML5StorageSupported()) {
        sessionStorage.setItem(key, JSON.stringify(document));
        log(
          'Document ' +
            documentType +
            ' has been persisted on cached with value ' +
            JSON.stringify(document),
        );
      }
    }

    function removeAllDocumentFromCache() {
      removeDocumentFromCache(documentUnreadNotifications);
    }

    function removeDocumentFromCache(documentType) {
      const key = persistedDocumentPrefix + documentType;
      if (isHTML5StorageSupported()) {
        sessionStorage.removeItem(key);
        log('Document ' + documentType + ' has been removed from cache');
      }
    }

    function installUserActivityHandler() {
      if (conf.keepAliveListeningEvents.length > 0) {
        $(document).on(conf.keepAliveListeningEvents, setUserActive);
      }
    }

    function uninstallUserActivityHandler() {
      if (conf.keepAliveListeningEvents.length > 0) {
        $(document).off(conf.keepAliveListeningEvents, setUserActive);
      }
    }

    function keepAliveTimerFunction() {
      if (isUserActive) {
        isUserActive = false;
        keepAliveSessions();
      } else {
        log('Keepalive call canceled due to user inactivity');
      }
    }

    function installKeepAliveTimerHandler() {
      if (conf.keepAlive && keepAliveTimer === undefined) {
        installUserActivityHandler();
        keepAliveTimer = window.setInterval(
          keepAliveTimerFunction,
          conf.keepAliveInterval * 60 * 1000,
        );
      }
    }

    function uninstallKeepAliveTimerHandler() {
      if (conf.keepAlive) {
        uninstallUserActivityHandler();
        if (keepAliveTimer) {
          window.clearInterval(keepAliveTimer);
          keepAliveTimer = undefined;
        }
      }
    }

    function keepAliveSessions() {
      if (isUserAuthenticated()) {
        const html =
          "<img src='" +
          platform.keepAliveURL +
          '/?' +
          random() +
          "'><img src='" +
          platformEndPoints.keepalive +
          '?' +
          random() +
          "'>";
        selectFromShadowDom()
          .find('#' + keepAliveID)
          .html(html);
        if (typeof keepAliveCallback == 'function') {
          keepAliveCallback();
        }
        setControlCookie('keepalive', new Date().getTime());
      }
    }

    function keepAliveSessionsOnInit() {
      const now = new Date().getTime();
      const lastKeepAlive = getControlCookieVal('keepalive');
      if (
        isNaN(lastKeepAlive) ||
        now - parseInt(lastKeepAlive) > conf.keepAliveInterval * 60 * 1000
      ) {
        log('Running keepAliveSessionsOnInit');
        keepAliveSessions();
        return;
      }
      log(
        'keepAliveSessionsOnInit not running due to [now=' +
          now +
          ',last=' +
          lastKeepAlive +
          ',interval=' +
          conf.keepAliveInterval * 60 * 1000,
      );
    }

    function initIFrameCommunication() {
      log('Preparing for communication with iframe content');

      function receiveMessage(e) {
        const allowedOrigins = ['post.ch', 'postauto.ch', 'postfinance.ch'];
        const originUrl = new URL(e.origin);
        if (allowedOrigins.includes(originUrl.host) && e.data === 'syncWidget') {
          log('PostMessage syncWidget received');
          subscribe();
        }
      }
      if (window.addEventListener) {
        window.addEventListener('message', receiveMessage);
      } else {
        window.attachEvent('onmessage', receiveMessage);
      }
    }

    function measureWidgetShowsUp() {
      if (startingTime) {
        log('Widget shows up in ' + (new Date().getTime() - startingTime) + ' [msec]');
        startingTime = undefined;
      }
    }

    function renderHiddenContainer(parentContainerSelector, containerId) {
      selectFromShadowDom()
        .find(parentContainerSelector)
        .append('<div id="' + containerId + '" style="display:none;"></div>');
    }

    function selectFromShadowDom() {
      return $(
        document
          .querySelector('swisspost-internet-header')
          .shadowRoot.querySelector('post-klp-login-widget')
          .shadowRoot.querySelector('.widget-wrapper'),
      );
    }

    function renderAnonymousWidget() {
      selectFromShadowDom()
        .find('#' + id)
        .addClass('anonymous');
      selectFromShadowDom()
        .find('#' + id)
        .attr('data-custom-focus-id', 'klp-widget');
      selectFromShadowDom()
        .find('#' + id)
        .html(
          '<div class="klp-widget-anonymous"><div class="klp-widget-anonymous__wrapper">' +
            '<a tabindex="' +
            tabIndex('sign-in') +
            '" ' +
            accessKey('sign-in') +
            ' title="' +
            text('sign-in') +
            '" href="' +
            loginURL() +
            '" data-custom-focus-target="klp-widget" data-custom-focus-direction="parent" role="button"><span class="klp-widget-anonymous__text">' +
            text('sign-in') +
            '</span><svg class="ppm-svg-icon ppm-main-navigation__login-icon" focusable="false"><use xlink:href="#2064_arrow-enter"></use></svg></a>' +
            '</div></div>',
        );
      selectFromShadowDom()
        .find('#' + id)
        .on('click touch', function (e) {
          e.preventDefault();
          document.location.href = loginURL();
          return false;
        });
    }

    function renderAuthenticatedWidget() {
      selectFromShadowDom()
        .find('#' + id)
        .off('click touch');
      let info = '',
        authenticatedSessionTailNameClass = '';
      if (sessionData.userType === 'B2C') {
        authenticatedSessionTailNameClass = 'klp-widget-authenticated-session-name u_var_centered';
      } else {
        info = sessionData.company;
        authenticatedSessionTailNameClass = 'klp-widget-authenticated-session-name';
      }
      let authenticatedSectionClass = 'klp-widget-authenticated';
      if (sessionData.support) {
        authenticatedSectionClass += ' klp-widget-support';
      }
      selectFromShadowDom()
        .find('#' + id)
        .html(
          '<div class="' +
            authenticatedSectionClass +
            '">' +
            '<div class="klp-widget-authenticated-session klp-widget-menu-close">' +
            '<a href="about:blank" role="button" class="klp-widget-authenticated-session-link klp-widget__user" title="' +
            text('title-text-menu') +
            '" tabindex="' +
            tabIndex('toggle-menu') +
            '" ' +
            accessKey('toggle-menu') +
            ' data-dropdown="klp-widget-authenticated-menu" aria-expanded="false" aria-controls="authenticated-menu">' +
            '<div class="' +
            authenticatedSessionTailNameClass +
            '">' +
            sessionData.name +
            '&nbsp;' +
            sessionData.surname +
            '</div>' +
            '<span class="initials-mobile">' +
            sessionData.name.substring(0, 1) +
            sessionData.surname.substring(0, 1) +
            '</span>' +
            '<span class="notification-number"></span>' +
            '</a>' +
            getAuthenticatedMenuLinks(authenticatedSessionTailNameClass, info, sessionData) +
            '</div>' +
            '</div>',
        );
      selectFromShadowDom().find('.notification-number').css('visibility', 'hidden');
      selectFromShadowDom().find('.notification-number-detail').css('visibility', 'hidden');
      renderHiddenContainer('#' + id, keepAliveID);
      selectFromShadowDom()
        .find('#' + id + ' .klp-widget__user')
        .on('click touch', function (e) {
          e.preventDefault();
          selectFromShadowDom()
            .find('#' + id + ' .klp-widget__user')
            .focus();
          toggleMenu();
          toggleNotificationsMenu();
          return false;
        });
      selectFromShadowDom()
        .find('#' + id + ' #klp-widget-authenticated-menu-logout')
        .on('click touch', function (e) {
          e.preventDefault();
          selectFromShadowDom()
            .find('#' + id + ' #klp-widget-authenticated-menu-logout')
            .focus();
          doLogout(logoutURL());
          return false;
        });
      if (isOldChangeCompany() || isChangeUserAndProfile()) {
        setChangeAccountDialog();
      }
      setArrowKeysListeners();
    }

    function isOldChangeCompany() {
      return (
        (sessionData.userType === 'B2B' &&
          sessionData.canChangeCompany &&
          sessionData.changeUserAndProfile == null) ||
        (sessionData.changeUserAndProfile != null && sessionData.changeUserAndProfile === 'profile')
      );
    }

    function isChangeUserAndProfile() {
      return (
        sessionData.changeUserAndProfile != null &&
        sessionData.changeUserAndProfile === 'userAndProfile'
      );
    }

    function getAuthenticatedMenuLinks(authenticatedSessionTailNameClass, info, sessionData) {
      let menuList = '';
      let nameClass = 'name';
      let infoClass = 'info';
      if (menuLinks !== undefined) {
        if (authenticatedSessionTailNameClass.indexOf('centered') !== -1) {
          nameClass = 'nameCentered';
        }
        if (info.length === 0) {
          infoClass = 'infoHidden';
        }
        menuList +=
          '<li class="name-and-surname">' +
          '<div class="initials-circle">' +
          '<div class="initials-container">' +
          '<div>' +
          sessionData.name.substring(0, 1) +
          sessionData.surname.substring(0, 1) +
          '</div>' +
          '</div>' +
          '</div>' +
          '<div class="nameAndInfoWrapper"><span class="' +
          nameClass +
          '">' +
          sessionData.name +
          '&nbsp;' +
          sessionData.surname +
          '</span>' +
          '<span class="' +
          infoClass +
          '">' +
          info +
          '</span></div>' +
          '</li>';

        $.each(menuLinks, function (index, item) {
          menuList +=
            '<li>' +
            '<a class="notification-link" title="' +
            item.description +
            '" href="' +
            item.url +
            '"><div class="' +
            item.iconclass +
            '"></div><div class="linkContainer">' +
            '<span class="klp-widget-notification-link-text">' +
            item.description +
            '</span></div></a>' +
            '</li>';
        });
        menuList +=
          '<li>' +
          '<a class="notification-link" title="' +
          text('title-text-notifications') +
          '" href="' +
          messagesUrl +
          '"><div class="widget_icon_notification" aria-hidden></div><div class="linkContainer">' +
          '<span class="klp-widget-notification-link-text">' +
          text('title-text-notifications') +
          '</span><span class="notification-number-detail"></span></div></a>' +
          '</li>';
      }

      if (sessionData.userType === 'B2C') {
        const settingEnvLinks = {
          int01: 'https://serviceint1.post.ch/kvm/app/ui',
          int02: 'https://serviceint2.post.ch/kvm/app/ui',
          prod: 'https://service.post.ch/kvm/app/ui',
        };
        const settingsLink = `${settingEnvLinks[environment]}/settings`;

        menuList += `
          <li>
            <a class="notification-link" href="${settingsLink}">
              <div class="widget_icon_settings" aria-hidden></div>
              <div class="linkContainer">
                <span class="klp-widget-notification-link-text">${texts[currentLang].settings}</span>
              </div>
            </a>
          </li>
        `;
      }

      let changeCompanyEntry = '';
      if (isOldChangeCompany()) {
        changeCompanyEntry =
          '<li>' +
          '<a id="klp-widget-authenticated-menu-changecompany" class="notification-link" tabindex="' +
          tabIndex('change-company') +
          '" ' +
          accessKey('change-company') +
          ' href="about:blank" role="button" title="' +
          text('change-company') +
          '"><div class="widget_icon_changecompany"></div><div class="linkContainer">' +
          '<span class="klp-widget-notification-link-text">' +
          text('change-company') +
          '</span></div></a>' +
          '</li>';
      } else if (isChangeUserAndProfile()) {
        changeCompanyEntry =
          '<li>' +
          '<a id="klp-widget-authenticated-menu-changecompany" class="notification-link" tabindex="' +
          tabIndex('change-account') +
          '" ' +
          accessKey('change-company') +
          ' href="about:blank" role="button" title="' +
          text('change-account') +
          '"><div class="widget_icon_changecompany"></div><div class="linkContainer">' +
          '<span class="klp-widget-notification-link-text">' +
          text('change-account') +
          '</span></div></a>' +
          '</li>';
      }
      return (
        '<div class="klp-widget-authenticated-menu" id="authenticated-menu" data-dropdown-toggler="klp-widget__user">' +
        '<ul>' +
        menuList +
        changeCompanyEntry +
        '<li>' +
        '<a id="klp-widget-authenticated-menu-logout" class="notification-link" tabindex="' +
        tabIndex('sign-out') +
        '" ' +
        accessKey('sign-out') +
        ' title="' +
        text('sign-out') +
        '" href="about:blank" role="button"><div class="widget_icon_logout"></div><div class="linkContainer">' +
        '<span class="klp-widget-notification-link-text">' +
        text('sign-out') +
        '</span></div></a>' +
        '</li>' +
        '</ul>' +
        '</div>'
      );
    }

    function showDocument(document, documentType) {
      switch (documentType) {
        case documentUnreadNotifications:
          renderNotificationsWidget(document);
          saveDocumentOnCache(document, documentUnreadNotifications);
          break;
        default:
          log('Unknown documentType received: ' + documentType);
      }
      if (typeof documentCallbacks[documentType] == 'function') {
        documentCallbacks[documentType](document);
      }
    }

    function removeDocument(documentType) {
      switch (documentType) {
        case documentUnreadNotifications:
          removeDocumentFromCache(documentUnreadNotifications);
          break;
        default:
          log('Unknown documentType received: ' + documentType);
      }
      if (typeof documentCallbacks[documentType] == 'function') {
        documentCallbacks[documentType](undefined);
      }
    }

    function renderNotificationsWidget(notifications) {
      if (
        notifications != null &&
        $('.notification-number').text() !== notifications.unreadNotifications
      ) {
        unreadNotifications = notifications.unreadNotifications;
        if (unreadNotifications === 0) {
          $('.notification-number').css('visibility', 'hidden');
        } else {
          $('.notification-number').css('visibility', 'visible');
        }
      }
    }

    function toggleMenu() {
      toggleDropdown(selectFromShadowDom().find('#' + id + ' .klp-widget-authenticated-menu'));
    }

    function toggleNotificationsMenu() {
      if (unreadNotifications !== 0) {
        if (unreadNotifications > 99) {
          selectFromShadowDom()
            .find('.notification-number-detail')
            .css('visibility', 'visible')
            .text('99+');
        } else {
          selectFromShadowDom()
            .find('.notification-number-detail')
            .css('visibility', 'visible')
            .text(unreadNotifications);
        }
      } else {
        selectFromShadowDom().find('.notification-number-detail').css('visibility', 'hidden');
      }
    }

    function isUserAuthenticated() {
      return typeof sessionData !== 'undefined';
    }

    function getUserType() {
      if (!isUserAuthenticated()) {
        return 'NONE';
      }
      return sessionData.userType;
    }

    function getCurrentAuthLevel() {
      if (!isUserAuthenticated()) {
        return 'NONE';
      }
      return sessionData.authLevel;
    }

    function changeLoginURL(loginURL) {
      if (loginURL !== undefined) {
        appLoginURL = loginURL;
        renderWidget();
        log('Widget appLoginURL has been replaced with ' + appLoginURL);
      }
    }

    function updateWidget(options) {
      if (options !== undefined) {
        conf = $.extend(conf, options);
        renderWidget();
      }
      log('Widget has been updated');
    }

    function login(data, ttl, callback) {
      sessionData = data;
      renderWidget();
      installKeepAliveTimerHandler();
      persistState(ttl);
      if (callback && typeof loginCallback == 'function') {
        loginCallback();
        log('loginCallback has been called: ' + loginCallback);
      }
    }

    function logout() {
      sessionData = undefined;
      address = undefined;
      removePersistedState();
      removeAllDocumentFromCache();
      renderWidget();
      uninstallKeepAliveTimerHandler();
      if (typeof logoutCallback == 'function') {
        logoutCallback();
      }
    }

    function registerEventsHandler() {
      if (eventBus) {
        eventBus.registerHandler(address, function (message, replyTo) {
          handleMessage(message);
        });
      }
    }

    function handleMessage(message) {
      log('Message received: ' + JSON.stringify(message));
      audit(message);
      retrySubscribeOnFail = false;
      switch (message.typ) {
        case 'ukn':
          if (message.sub) {
            retrySubscribeOnFail = true;
            logout();
            subscribe();
          } else {
            logout();
          }
          break;
        case 'sub':
          address = message.adr;
          login(message.data, message.ttl, false);
          openCommunication();
          break;
        case 'hi':
          login(message.data, message.ttl, true);
          removeDocumentFromCache(documentUnreadNotifications);
          break;
        case 'bye':
          logout();
          break;
        case 'doc':
          showDocument(message.doc, message.doctyp);
          break;
        case 'rem':
          removeDocument(message.doctyp);
          break;
        default:
          log('Unknown event received: ' + message.typ);
          logout();
          break;
      }
    }

    function trySubscription() {
      if (isCurrentLocationPostCh()) {
        return null != getControlCookieVal();
      } else {
        return true;
      }
    }

    function subscribe() {
      if (!address) {
        if (trySubscription()) {
          log('Subscribing to get an address');
          const startTime = new Date().getTime();
          fetch(platformEndPoints.subscribe, {
            method: 'GET',
            credentials: 'include',
            mode: 'cors',
          })
            .then(message => message.json())
            .then(message => handleMessage(message))
            .catch(error => {
              log('Failed to subscribe: ' + error.message);
              logout();
              renderWidget();
            });
          logPerformanceMetric('subscribe()', new Date().getTime() - startTime);
        } else {
          log('Control cookie not found, skipping subscription');
          renderWidget();
        }
      } else {
        log('Address available, skipping subscription');
        openCommunication();
      }
    }

    function openCommunication() {
      if (!eventBus) {
        eventBus = new vertx.EventBus(platformEndPoints.eventbus, {
          debug: conf.debug,
          devel: conf.debug,
        });
        eventBus.onopen = function () {
          log('EventBus opened');
          registerEventsHandler();
          $(window).on('beforeunload', closeCommunication);
        };
        eventBus.onclose = function () {
          log('EventBus closed');
          log(
            'Communication closed with retrySubscribeOnFail=' +
              retrySubscribeOnFail +
              '. Retrying subscribe',
          );
          eventBus = null;
          $(window).off('beforeunload', closeCommunication);
          if (retrySubscribeOnFail) {
            retrySubscribeOnFail = false;
            address = undefined;
            subscribe();
          }
        };
      }
    }

    function closeCommunication() {
      if (eventBus) {
        eventBus.close();
      }
    }

    function renderWidget() {
      if (typeof sessionData !== 'undefined') {
        renderAuthenticatedWidget();
      } else {
        renderAnonymousWidget();
      }
      document.dispatchEvent(new CustomEvent('wepploginwidget_widget_ready'));
      measureWidgetShowsUp();
      selectFromShadowDom().find('.klp-widget-authenticated-session-link').click();
    }

    function init() {
      restoreState();
      subscribe();
      if (conf.keepAliveOnInit && isUserAuthenticated()) {
        keepAliveSessionsOnInit();
      }
      initIFrameCommunication();
    }

    function toggleDropdown(dropdownToToggle) {
      if (dropdownToToggle.is(':visible')) {
        selectFromShadowDom()
          .find('#' + id)
          .removeClass('bubble');
        closeDropdowns();
        return;
      }
      closeDropdowns();
      selectFromShadowDom()
        .find('.' + dropdownToToggle.attr('data-dropdown-toggler'))
        .attr('aria-expanded', true);
      selectFromShadowDom()
        .find('#' + id)
        .addClass('bubble');
      dropdownToToggle.show();
      $(document).on('click', closeDropdowns);
      if (dropdownToToggle.hasClass('klp-widget-authenticated-menu')) {
        dropdownToToggle
          .parent()
          .removeClass('klp-widget-menu-close')
          .addClass('klp-widget-menu-open');
      }
    }

    function closeDropdowns(e) {
      if (e != null) {
        if (
          selectFromShadowDom()
            .find(e.target)
            .parents('#' + id).length > 0
        ) {
          return;
        }
      }
      selectFromShadowDom().find(document).off('click', closeDropdowns);
      selectFromShadowDom()
        .find('#' + id)
        .removeClass('bubble');
      selectFromShadowDom()
        .find('#' + id + ' .klp-widget-authenticated-menu')
        .hide()
        .parent()
        .removeClass('klp-widget-menu-open')
        .addClass('klp-widget-menu-close');
      selectFromShadowDom()
        .find(
          '.' +
            selectFromShadowDom()
              .find('#' + id + ' .klp-widget-authenticated-menu')
              .attr('data-dropdown-toggler'),
        )
        .attr('aria-expanded', false);
    }

    function setArrowKeysListeners() {
      selectFromShadowDom()
        .find('.klp-widget__user')
        .on('keydown', function (event) {
          if (event.which < 37 || event.which > 40) {
            return;
          }
          event.preventDefault();
          const parent = selectFromShadowDom().find(this).parent();
          const dropdown = selectFromShadowDom().find(
            '.' + selectFromShadowDom().find(this).attr('data-dropdown'),
          );
          switch (event.which) {
            case 37:
              if (parent.prev().length) {
                parent.prev().find('a').focus();
              }
              if (dropdown.is(':visible')) {
                selectFromShadowDom().find(this).click();
              }
              break;
            case 38:
              if (dropdown.is(':visible')) {
                selectFromShadowDom().find(this).click();
              }
              break;
            case 39:
              if (parent.next().length) {
                parent.next().find('a').focus();
              }
              if (dropdown.is(':visible')) {
                selectFromShadowDom().find(this).click();
              }
              break;
            case 40:
              if (!dropdown.is(':visible')) {
                selectFromShadowDom().find(this).click();
              }
              dropdown.find('li:first a').focus();
              break;
          }
        });
      selectFromShadowDom()
        .find('.klp-widget-authenticated-menu')
        .on('keydown', 'a', function (event) {
          if (event.which < 37 || event.which > 40) {
            return;
          }
          event.preventDefault();
          const parent = selectFromShadowDom().find(this).parent();
          const dropdownToggler = selectFromShadowDom().find(
            '.' +
              selectFromShadowDom().find(this).parents('div').first().attr('data-dropdown-toggler'),
          );
          switch (event.which) {
            case 37:
            case 38:
              if (parent.prev('li').length > 0) {
                parent.prev('li').find('a').focus();
              } else {
                dropdownToggler.click().focus();
              }
              break;
            case 39:
            case 40:
              if (parent.next('li').length > 0) {
                parent.next('li').find('a').focus();
              }
              break;
          }
        });
      $('body').on('keydown', function (event) {
        if (event.which !== 27) {
          return;
        }
        closeDropdowns();
      });
    }
    init();
    return {
      keepAliveSessions: function () {
        keepAliveSessions();
      },
      isUserAuthenticated: function () {
        return isUserAuthenticated();
      },
      getUserType: function () {
        return getUserType();
      },
      getCurrentAuthLevel: function () {
        return getCurrentAuthLevel();
      },
      changeAppLoginURL: function (appLoginURL) {
        changeLoginURL(appLoginURL);
      },
      updateWidget: function (options) {
        updateWidget(options);
      },
      registerLoginCallback: function (callback) {
        log('Login callback has been registered');
        loginCallback = callback;
      },
      unregisterLoginCallback: function () {
        log('Login callback has been un-registered');
        loginCallback = undefined;
      },
      registerKeepAliveCallback: function (callback) {
        log('KeepAlive callback has been registered');
        keepAliveCallback = callback;
      },
      unregisterKeepAliveCallback: function () {
        log('KeepAlive callback has been un-registered');
        keepAliveCallback = undefined;
      },
      registerLogoutCallback: function (callback) {
        log('Logout callback has been registered');
        logoutCallback = callback;
      },
      unregisterLogoutCallback: function () {
        log('Logout callback has been un-registered');
        logoutCallback = undefined;
      },
      registerDocumentCallback: function (documentType, callback) {
        log('Document callback for documentType ' + documentType + ' has been registered');
        documentCallbacks[documentType] = callback;
      },
      unregisterDocumentCallback: function (documentType) {
        log('Document callback for documentType ' + documentType + ' has been un-registered');
        documentCallbacks[documentType] = undefined;
      },
      version: function () {
        return version;
      },
      setDebug: function (debug) {
        conf.debug = debug;
      },
    };
  };
})(jquery_slim);

const initializeKLPLoginWidget = (containerId, options) => {
  if (!options) {
    return;
  }
  try {
    window.OPPklpWidget = window.klpWidgetDev(containerId, options.applicationId, options.serviceId, options.appLoginUrl, null, // would be menulinks, but they are not provided anymore from Post-Portal
    options.currentLang, options.platform, options.options, options.environment);
  }
  catch (error) {
    console.error(error);
  }
};

exports.initializeKLPLoginWidget = initializeKLPLoginWidget;

//# sourceMappingURL=klp-widget.controller-b90574ce.js.map