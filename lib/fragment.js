class Fragment {
  constructor(content, isHidden, isSignature, isQuoted) {
    this._content = content;
    this._isHidden = isHidden;
    this._isSignature = isSignature;
    this._isQuoted = isQuoted;
  }

  isHidden() {
    return this._isHidden;
  }

  isSignature() {
    return this._isSignature;
  }

  isQuoted() {
    return this._isQuoted;
  }

  getContent() {
    return this._content;
  }

  isEmpty() {
    return "" === this.getContent().replace(/\n/g, "");
  }

  toString() {
    return this.getContent();
  }
}

module.exports = Fragment;
