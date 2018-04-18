class Scryb {
  constructor(props) {
    const {
      silentMode,
      url,
      whitelist
    } = props;

    if (silentMode !== undefined && typeof silentMode !== 'boolean') {
      throw new Error('Parameter "silentMode" must be of type Boolean, if provided.');
    }

    if (whitelist !== undefined && !Array.isArray(whitelist)) {
      throw new Error('Parameter "whitelist" must be of type Array, if provided.');
    }

    if (url !== undefined) {
      this._url = url;
    } else {
      throw new Error('Missing "url" parameter.');
    }

    const cWhiteList = ['log', 'info', 'warn', 'error', 'debug'];
    const cPropDescs = Object.getOwnPropertyDescriptors(window.console);

    Object.keys(cPropDescs).forEach((key) => {
      this[`_${key}`] = cWhiteList.includes(key) ? cPropDescs[key].value : this._noop;

      if (cWhiteList.includes(key)) {
        this[key] = function () {
          const msg = JSON.stringify({
            logType: key,
            payloads: [...arguments]
          });

          navigator.sendBeacon(this._url, new Blob([msg], { type: 'text/plain' }));

          if (this.silentMode === false) {
            this[`_${key}`](...arguments);
          }
        };
      }
    });

    Object.freeze(this);
    window.console = this;
    Object.freeze(window.console);
  }

  _noop() {
    this._log('Noop');
  }
}

export default Scryb;
