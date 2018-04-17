class Scryb {
  constructor(props) {
    const {
      blacklist,
      silentMode,
      url,
      whitelist
    } = props;

    const basicErrs = [];

    if (silentMode !== undefined && typeof silentMode !== 'boolean') {
      basicErrs.push('Option "silentMode" must be of type Boolean, if provided.');
    }

    if (whitelist !== undefined && !Array.isArray(whitelist)) {
      basicErrs.push('Option "whitelist" must be of type Array, if provided.');
    }

    if (blacklist !== undefined && !Array.isArray(blacklist)) {
      basicErrs.push('Option "blacklist" must be of type Array, if provided.');
    }

    if (basicErrs.length > 0) {
      throw new Error(basicErrs.join(' '));
    }

    if (url !== undefined) {
      this._url = url;
    } else {
      this._url = false;
    }

    const cWhiteList = ['log', 'warn', 'error'];
    const cPropDescs = Object.getOwnPropertyDescriptors(window.console);

    Object.keys(cPropDescs).forEach((key) => {
      this[`_${key}`] = cWhiteList.includes(key) ? cPropDescs[key].value : this._noop;

      if (cWhiteList.includes(key)) {
        this[key] = function () {
          const msg = JSON.stringify({
            logType: key,
            payloads: [...arguments]
          });

          if (this._url !== false) {
            navigator.sendBeacon(this._url, new Blob([msg], { type: 'text/plain' }));
          }

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
    if (this.silentMode === false) {
      this._log('Noop');
    }
  }
}

export default Scryb;
