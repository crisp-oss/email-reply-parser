/*
 * email-reply-parser
 *
 * Copyright 2025, Mirage AI
 * Author: Baptiste Jamin <baptiste@jam.in>
 */

/**************************************************************************
 * IMPORTS
 ***************************************************************************/

// PROJECT: LIB
import Fragment from "./fragment.js";

// REGEXES
const TILDE_REGEX = /~*$/;

/**
 * Email
 */
class Email {
  private fragments: Fragment[];

  /**
   * Constructor
   */
  constructor(fragments: Fragment[] = []) {
    this.fragments = fragments;
  }

  /**
   * getFragments
   */
  getFragments(): Fragment[] {
    return this.fragments;
  }

  /**
   * getVisibleText
   */
  getVisibleText(): string {
    return this.filterText((fragment) => {
      return !fragment.isHidden();
    });
  }

  /**
   * getQuotedText
   */
  getQuotedText(): string {
    return this.filterText((fragment) => {
      return fragment.isQuoted();
    });
  }

  /**
   * filterText
   */
  filterText(filter: (fragment: Fragment) => boolean): string {
    let filteredFragments = this.fragments.filter(filter);

    return filteredFragments.join("\n").replace(TILDE_REGEX, "");
  }
}

export default Email;
