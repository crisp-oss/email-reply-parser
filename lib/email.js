class Email {
  constructor(fragments = []) {
    this.fragments = fragments;
  }

  getFragments() {
    return this.fragments;
  }

  getVisibleText() {
    return this.filterText((fragment) => {
      return !fragment.isHidden();
    });
  }

  getQuotedText() {
    return this.filterText((fragment) => {
      return fragment.isQuoted();
    });
  }

  filterText(filter) {
    let filteredFragments = this.fragments.filter(filter);

    return filteredFragments.join("\n").replace(/~*$/, "");
  }
}

module.exports = Email;
