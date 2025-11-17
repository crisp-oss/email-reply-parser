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
   * Get all fragments for an email
   */
  getFragments(): Fragment[] {
    return this.fragments;
  }

  /**
   * Get the visible text for an email
   */
  getVisibleText(): string {
    return this.filterText((fragment) => {
      return !fragment.isHidden();
    });
  }

  /**
   * Get the quoted text for an email
   */
  getQuotedText(): string {
    return this.filterText((fragment) => {
      return fragment.isQuoted();
    });
  }

  /**
   * Apply a filter method to the fragments
   */
  // eslint-disable-next-line no-unused-vars
  private filterText(filter: (fragment: Fragment) => boolean): string {
    let filteredFragments = this.fragments.filter(filter);

    return filteredFragments.join("\n").replace(TILDE_REGEX, "");
  }
}

export default Email;
