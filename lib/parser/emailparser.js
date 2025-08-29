var FragmentDTO = require("./fragmentdto");
var Fragment    = require("../fragment");
var Email       = require("../email");
var RegexList   = require("../regex");

const QUOTE_REGEX = /(>+)$/;

class EmailParser {
  constructor() {
    this.fragments = [];
  }

  stringReverse(text) {
    let s = "";
    let i = text.length;
    while (i>0) {
        s += text.substring(i-1,i);
        i--;
    }
    return s;
  }

  stringRTrim(text, mask) {
    for (let i = text.length - 1; i >= 0; i--) {
      if (mask != text.charAt(i)) {
        text = text.substring(0, i + 1);
        break;
      }
    }
    return text;
  }

  stringLTrim(text) {
    return text.replace(/^\s+/,"");
  }

  parse(text) {
    text = text.replace(/\r\n/g, "\n");
    text = this.fixBrokenSignatures(text);

    let fragment = null;

    this.stringReverse(text).split("\n").forEach((line) => {
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
        } else if (line === "" && this.isAnswerHeader(last)) {
          fragment.isAnswer = true;
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

  fixBrokenSignatures(text) {
    let newText = text;

    // For any other quote header lines, if we find one of them,
    //  remove any new lines that happen to match in the first capture group
    RegexList.answerHeadersRegex.forEach((regex) => {
      let matches = newText.match(regex);
      if (matches) {
        const [
          matchingString,
          matchGroup,
        ] = matches;
        newText = newText.replace(matchGroup, matchGroup.replace(/\n/g, " "));
      }
    });

    return newText;
  }

  getAnswerHeadersRegex() {
    return RegexList.answerHeadersRegex;
  }

  setAnswerHeadersRegex(answerHeadersRegex) {
    RegexList.answerHeadersRegex = answerHeadersRegex;

    return this;
  }

  createEmail(fragmentDTOs) {
    let fragments = [];

    fragmentDTOs.reverse().forEach((fragment) => {
      fragments.push(new Fragment(
        this.stringReverse(fragment.lines.join("\n")).replace(/^\n/g, ''),
        fragment.isHidden,
        fragment.isSignature,
        fragment.isQuoted,
        fragment.isAnswer
      ));
    });

    return new Email(fragments);
  }

  isAnswerHeader(line) {
    let hasHeader = false;

    RegexList.answerHeadersRegex.forEach((regex) => {
      if (regex.test(this.stringReverse(line))) {
        hasHeader = true;
      }
    });

    return hasHeader;
  }

  isSignature(line) {
    let text = this.stringReverse(line);

    return RegexList.signatureRegex.some((regex) => {
      return regex.test(text);
    });
  }

  isQuote(line) {
    return QUOTE_REGEX.test(line);
  }

  isEmpty(fragment) {
    return "" === fragment.lines.join("");
  }

  isFragmentLine(fragment, line, isQuoted) {
    return fragment.isQuoted === isQuoted ||
      (fragment.isQuoted && (this.isAnswerHeader(line) || line === ""));
  }

  addFragment(fragment) {
    if ( fragment.isAnswer || this.isEmpty(fragment)) {
      fragment.isHidden = true;
    }

    this.fragments.push(fragment);
  }
}

module.exports = EmailParser;