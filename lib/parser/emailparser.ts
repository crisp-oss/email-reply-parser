/*
 * email-reply-parser
 *
 * Copyright 2025, Mirage AI
 * Author: Baptiste Jamin <baptiste@jam.in>
 */

/**************************************************************************
 * IMPORTS
 ***************************************************************************/

// PROJECT: PARSER
import FragmentDTO from "./fragmentdto.js";

// NPM
import Fragment from "../fragment.js";
import Email from "../email.js";
import RegexList from "../regex.js";

// REGEXES
const QUOTE_REGEX = /(>+)$/;
const LEADING_WHITESPACE_REGEX = /^\s+/;
const LEADING_NEWLINE_REGEX = /^\n/g;
const CRLF_NEWLINE_REGEX = /\r\n/g;
const NEWLINE_REGEX = /\n/g;

/**
 * EmailParser
 */
class EmailParser {
  private fragments: FragmentDTO[];

  /**
   * Constructor
   */
  constructor() {
    this.fragments = [];
  }

  /**
   * stringReverse
   */
  stringReverse(text) {
    let s = "";
    let i = text.length;

    while (i > 0) {
      s += text.substring(i - 1, i);
      i--;
    }

    return s;
  }

  /**
   * stringRTrim
   */
  stringRTrim(text, mask) {
    for (let i = text.length - 1; i >= 0; i--) {
      if (mask !== text.charAt(i)) {
        text = text.substring(0, i + 1);

        break;
      }
    }

    return text;
  }

  /**
   * stringLTrim
   */
  stringLTrim(text: string) {
    return text.replace(LEADING_WHITESPACE_REGEX, "");
  }

  /**
   * parse
   */
  parse(text: string) {
    text = text.replace(CRLF_NEWLINE_REGEX, "\n");
    text = this.fixBrokenSignatures(text);

    let fragment = null;

    const lines = this.stringReverse(text).split("\n");

    lines.forEach((line) => {
      line = this.stringRTrim(line, "\n");

      if (!this.isSignature(line)) {
        line = this.stringLTrim(line);
      }

      if (fragment) {
        let last = fragment.lines[fragment.lines.length - 1];

        if (this.isSignature(last)) {
          fragment.isSignature = true;
          this.addFragment(fragment);
          fragment = null;
        } else if (line === "" && this.isQuoteHeader(last)) {
          fragment.isQuoted = true;
          this.addFragment(fragment);
          fragment = null;
        }
      }

      let isQuoted = this.isQuote(line);

      if (fragment === null || !this.isFragmentLine(fragment, line, isQuoted)) {
        if (fragment !== null) {
          this.addFragment(fragment);
        }

        fragment = new FragmentDTO();
        fragment.isQuoted = isQuoted;
      }

      fragment.lines.push(line);
    });

    if (fragment !== null) {
      this.addFragment(fragment);
    }

    let email = this.createEmail(this.fragments);

    this.fragments = [];

    return email;
  }

  /**
   * fixBrokenSignatures
   */
  fixBrokenSignatures(text: string) {
    let newText = text;

    // For any other quote header lines, if we find one of them,
    //  remove any new lines that happen to match in the first capture group
    RegexList.quoteHeadersRegex.forEach((regex) => {
      let matches = newText.match(regex);

      if (matches) {
        const [
          ,
          matchGroup
        ] = matches;

        newText = newText.replace(matchGroup, matchGroup.replace(NEWLINE_REGEX, " "));
      }
    });

    return newText;
  }

  /**
   * getQuoteHeadersRegex
   */
  getQuoteHeadersRegex() {
    return RegexList.quoteHeadersRegex;
  }

  /**
   * setQuoteHeadersRegex
   */
  setQuoteHeadersRegex(quoteHeadersRegex) {
    RegexList.quoteHeadersRegex = quoteHeadersRegex;

    return this;
  }

  /**
   * createEmail
   */
  createEmail(fragmentDTOs: FragmentDTO[]) {
    let fragments = [];

    fragmentDTOs.reverse().forEach((fragment) => {
      fragments.push(new Fragment(
        this.stringReverse(fragment.lines.join("\n")).replace(LEADING_NEWLINE_REGEX, ""),
        fragment.isHidden,
        fragment.isSignature,
        fragment.isQuoted
      ));
    });

    return new Email(fragments);
  }

  /**
   * isQuoteHeader
   */
  isQuoteHeader(line: string) {
    let hasHeader = false;

    RegexList.quoteHeadersRegex.forEach((regex) => {
      if (regex.test(this.stringReverse(line))) {
        hasHeader = true;
      }
    });

    return hasHeader;
  }

  /**
   * isSignature
   */
  isSignature(line) {
    let text = this.stringReverse(line);

    return RegexList.signatureRegex.some((regex) => {
      return regex.test(text);
    });
  }

  /**
   * isQuote
   */
  isQuote(line: string) {
    return QUOTE_REGEX.test(line);
  }

  /**
   * isEmpty
   */
  isEmpty(fragment: FragmentDTO) {
    return "" === fragment.lines.join("");
  }

  /**
   * isFragmentLine
   */
  isFragmentLine(fragment: FragmentDTO, line: string, isQuoted: boolean) {
    return fragment.isQuoted === isQuoted ||
      (fragment.isQuoted && (this.isQuoteHeader(line) || line === ""));
  }

  /**
   * addFragment
   */
  addFragment(fragment: FragmentDTO) {
    if (fragment.isQuoted || fragment.isSignature || this.isEmpty(fragment)) {
      fragment.isHidden = true;
    }

    this.fragments.push(fragment);
  }
}

export default EmailParser;
