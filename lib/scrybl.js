(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("scrybl", [], factory);
	else if(typeof exports === 'object')
		exports["scrybl"] = factory();
	else
		root["scrybl"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Scryb = function () {
  function Scryb(props) {
    var _this = this;

    _classCallCheck(this, Scryb);

    var blacklist = props.blacklist,
        silentMode = props.silentMode,
        url = props.url,
        whitelist = props.whitelist;


    if (silentMode !== undefined && typeof silentMode !== 'boolean') {
      throw new Error('Option "silentMode" must be of type Boolean, if provided.');
    }

    if (whitelist !== undefined && !Array.isArray(whitelist)) {
      throw new Error('Option "whitelist" must be of type Array, if provided.');
    }

    if (blacklist !== undefined && !Array.isArray(blacklist)) {
      throw new Error('Option "blacklist" must be of type Array, if provided.');
    }

    if (url !== undefined) {
      this._url = url;
    } else {
      this._url = false;
    }

    var cWhiteList = ['log', 'info', 'warn', 'error', 'debug'];
    var cPropDescs = Object.getOwnPropertyDescriptors(window.console);

    Object.keys(cPropDescs).forEach(function (key) {
      _this['_' + key] = cWhiteList.includes(key) ? cPropDescs[key].value : _this._noop;

      if (cWhiteList.includes(key)) {
        _this[key] = function () {
          var msg = JSON.stringify({
            logType: key,
            payloads: [].concat(Array.prototype.slice.call(arguments))
          });

          if (this._url !== false) {
            navigator.sendBeacon(this._url, new Blob([msg], { type: 'text/plain' }));
          }

          if (this.silentMode === false) {
            this['_' + key].apply(this, arguments);
          }
        };
      }
    });

    window.console = this;
    Object.freeze(window.console);
    Object.freeze(this);
  }

  _createClass(Scryb, [{
    key: '_noop',
    value: function _noop() {
      this._log('Noop');
    }
  }]);

  return Scryb;
}();

exports.default = Scryb;
module.exports = exports['default'];

/***/ })
/******/ ]);
});
//# sourceMappingURL=scrybl.js.map