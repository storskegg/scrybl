/**
 * Scrybl v2.1.1
 * Apache2 License
 * Copyright (c) William Conrad.
 *
 * Scrybl is a library that overloads the console logging functions with versions that send logs to a target endpoint
 * using the Beacon API. It's very lightweight. Regardless of the allowList, `log` will always appear in the override.
 *
 * @param allowList Array[String] - method names you want to appear in the overloaded object (e.g. log, error, warn).
 *                                  methods not appearing in the allowList are nooped to maintain compatability.
 *                                  Default: ['log', 'info', 'warn', 'error', 'debug']
 * @param disabled Boolean - Allows the library to be instantiated without doing anything at all. Useful as a feature
 *                           flag, in the event a client needs to be released before the consuming API endpoint is ready
 * @param silentMode Boolean - Silences noops for methods not in allowList.
 * @param url String - Endpoint of the consuming API.
 */
class Scrybl {
  constructor(props) {
    const {
      allowList,
      disabled,
      silentMode,
      url
    } = props;

    // If disabled, do nothing.
    if (disabled === true) {
      return;
    }

    // If beacon api isn't available, do nothing.
    if (!navigator || !navigator.sendBeacon) {
      return;
    }

    if (allowList !== undefined && !Array.isArray(allowList)) {
      throw new Error('Parameter "allowlist" must be of type Array, if provided.');
    }

    if (silentMode !== undefined && typeof silentMode !== 'boolean') {
      throw new Error('Parameter "silentMode" must be of type Boolean, if provided.');
    }
    this._silentMode = !!silentMode;

    if (url !== undefined && typeof url !== 'string') {
      this._url = url;
    } else {
      throw new Error('Missing or non-string "url" parameter.');
    }

    const cAllowList = allowList !== undefined ? allowList : ['log', 'info', 'warn', 'error', 'debug'];
    const cPropDescs = Object.getOwnPropertyDescriptors(window.console);

    this['_log'] = cPropDescs['log'].value;

    // TODO: this whole block probably needs some optimization / simplification. Come back to this.
    Object.keys(cPropDescs).forEach((key) => {
      // Dedup
      if (typeof this[`_${key}`] === 'undefined') {
        this[`_${key}`] = cAllowList.includes(key) ? cPropDescs[key].value : this._noop;

        if (this[key] === undefined) {
          if (cAllowList.includes(key)) {
            this[key] = function () {
              const msg = JSON.stringify({
                logType: key,
                payloads: [...arguments]
              });

              navigator.sendBeacon(this._url, new Blob([msg], { type: 'text/plain' }));

              if (this._silentMode === false) {
                this[`_${key}`](...arguments);
              }
            };
          } else {
            this[key] = this[`_${key}`];
          }
        }
      }
    });

    Object.freeze(this);
    window.console = this;
    Object.freeze(window.console);
  }

  // _noop will simply console log "Noop" without using the beacon API. If silentMode is enabled, it won't even do that.
  // console methods get _noop'd to ensure error-free compatibility with other code calling methods not in your
  // allowList.
  _noop() {
    if (this._silentMode !== true) {
      this._log('Noop');
    }
  }
}

export default Scrybl;
