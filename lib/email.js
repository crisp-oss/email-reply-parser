class Email {
  constructor(fragments = []) {
    this.fragments = fragments;
  }

  getFragments() {
    return this.fragments;
  }

  getVisibleText() {
    let visibleFragments = this.fragments.filter((fragment) => {
      return fragment.isHidden;
    });

    return visibleFragments.join("\n").replace(/~*$/, "");
  }
}

module.exports = Email;