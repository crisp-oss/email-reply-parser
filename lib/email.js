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

  getAnswerText() {
    return this.filterText((fragment) => {
      return fragment.isAnswer();
    });
  }

  filterText(filter) {
    let filteredFragments = this.fragments.filter(filter);

    return filteredFragments.join("\n").replace(/~*$/, "");
  }
}

module.exports = Email;
