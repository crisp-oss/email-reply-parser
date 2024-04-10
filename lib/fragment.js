class Fragment {
  constructor(content, isHidden, isSignature, isQuoted) {
    this.content = content;
    this.isHidden = isHidden;
    this.isSignature = isSignature;
    this.isQuoted = isQuoted;
  }

  isHidden() {
    return this.isHidden;
  }

  isSignature() {
    return this.isSignature;
  }

  isQuoted() {
    return this.isQuoted;
  }

  getContent() {
    return this.content;
  }

  isEmpty() {
    return "" === this.getContent().replace(/\n/g, "");
  }

  toString() {
    return this.getContent();
  }
}

module.exports = Fragment;
