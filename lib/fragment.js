class Fragment {
  constructor(content, isHidden, isSignature, isQuoted, isAnswer) {
    this._content = content;
    this._isHidden = isHidden;
    this._isSignature = isSignature;
    this._isQuoted = isQuoted;
    this._isAnswer = isAnswer;
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

  isAnswer() {
    return this._isAnswer;
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
