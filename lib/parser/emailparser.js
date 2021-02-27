var FragmentDTO = require("./fragmentdto");
var Fragment    = require("../fragment");
var Email       = require("../email");

const QUOTE_REGEX = /(>+)$/;

class EmailParser {
  constructor() {
    this.quoteHeadersRegex = [
      /^-*\s*(On\s.+\s.+wrote:{0,1})\s{0,1}-*$/m, // On DATE, NAME <EMAIL> wrote:
      /^-*\s*(Le\s.+\s.+écrit:{0,1})\s{0,1}-*$/m, // Le DATE, NAME <EMAIL> a écrit :
      /^-*\s*(El\s.+\s.+escribió:{0,1})\s{0,1}-*$/m, // El DATE, NAME <EMAIL> escribió:
      /^-*\s*(Il\s.+\s.+scritto:{0,1})\s{0,1}-*$/m,  // Il DATE, NAME <EMAIL> ha scritto:
      /^-*\s*(Em\s.+\s.+escreveu:{0,1})\s{0,1}-*$/m,  // Em DATE, NAME <EMAIL> ha escreveu:
      /^\s*(Am\s.+\s)schrieb.+\s?(\[|<).+(\]|>):$/m, // Am DATE schrieb NAME <EMAIL>:
      /^\s*(Op\s[\s\S]+?schreef[\s\S]+:)$/m, // Il DATE, schreef NAME <EMAIL>:
      /^\s*((W\sdniu|Dnia)\s[\s\S]+?(pisze|napisał(\(a\))?):)$/mu, // W dniu DATE, NAME <EMAIL> pisze|napisał:
      /^\s*(Den\s.+\sskrev\s.+:)$/m, // Den DATE skrev NAME <EMAIL>:
      /^\s*(pe\s.+\s.+kirjoitti:)$/m, // pe DATE NAME <EMAIL> kirjoitti: 
      /^\s*(Am\s.+\sum\s.+\sschrieb\s.+:)$/m, // Am DATE um TIME schrieb NAME:
      /^(在[\s\S]+写道：)$/m, // > 在 DATE, TIME, NAME 写道：
      /^(20[0-9]{2}\..+\s작성:)$/m, // DATE TIME NAME 작성:
      /^(20[0-9]{2}\/.+のメッセージ:)$/m, // DATE TIME、NAME のメッセージ:
      /^(.+\s<.+>\sschrieb:)$/m, // NAME <EMAIL> schrieb:
      /^(.+\son.*at.*wrote:)$/m, // NAME on DATE wrote:
      /^\s*(From\s?:.+\s?\n?\s*[\[|<].+[\]|>])/m, // "From: NAME <EMAIL>" OR "From : NAME <EMAIL>" OR "From : NAME<EMAIL>"(With support whitespace before start and before <)
      /^\s*(De\s?:.+\s?\n?\s*(\[|<).+(\]|>))/m, // "De: NAME <EMAIL>" OR "De : NAME <EMAIL>" OR "De : NAME<EMAIL>"  (With support whitespace before start and before <)
      /^\s*(Van\s?:.+\s?\n?\s*(\[|<).+(\]|>))/m, // "Van: NAME <EMAIL>" OR "Van : NAME <EMAIL>" OR "Van : NAME<EMAIL>"  (With support whitespace before start and before <)
      /^\s*(Da\s?:.+\s?\n?\s*(\[|<).+(\]|>))/m, // "Da: NAME <EMAIL>" OR "Da : NAME <EMAIL>" OR "Da : NAME<EMAIL>"  (With support whitespace before start and before <)
      /^(20[0-9]{2})-([0-9]{2}).([0-9]{2}).([0-9]{2}):([0-9]{2})(.*)>:$/m, // 20YY-MM-DD HH:II GMT+01:00 NAME <EMAIL>:
      /^\s*([a-z]{3,4}\.\s[\s\S]+\sskrev\s[\s\S]+:)$/m, // DATE skrev NAME <EMAIL>:
      /^([0-9]{2}).([0-9]{2}).(20[0-9]{2})(.*)(([0-9]{2}).([0-9]{2}))(.*)\"( *)<(.*)>( *):$/m, // DD.MM.20YY HH:II NAME <EMAIL>
    ];

    this.signatureRegex = [
      /^\s*-{2,4}$/,
      /^\s*_{2,4}$/,
      /^-- $/,
      /^-- \s*.+$/,
      /^________________________________$/,
      /^-{1,10}Original message-{1,10}$/,
      /^Sent from (?:\s*.+)$/,
      /^Von (?:\s*.+) gesendet$/,
      /^Envoyé depuis (?:\s*.+)$/,
      /^Enviado desde (?:\s*.+)$/,
      /^\+{2,4}$/,
      /^\={2,4}$/,
      /^Get Outlook for (?:\s*.+).*/m,
      /^Télécharger Outlook pour (?:\s*.+).*/m,
      /^\w{0,20}\s?Regards,?!?$/mi,
      /^Cheers,?!?$/mi,
      /^Best wishes,?!?$/mi,
      /^Bien . vous,?!?$/mi,
      /^\w{0,20}\s?cordialement,?!?$/mi,,
    ];

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

  fixBrokenSignatures(text) {
    let newText = text;

    // For any other quote header lines, if we find one of them,
    //  remove any new lines that happen to match in the first capture group
    this.quoteHeadersRegex.forEach((regex) => {
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

  getQuoteHeadersRegex() {
    return this.quoteHeadersRegex;
  }

  setQuoteHeadersRegex(quoteHeadersRegex) {
    this.quoteHeadersRegex = quoteHeadersRegex;

    return this;
  }

  createEmail(fragmentDTOs) {
    let fragments = [];
    
    fragmentDTOs.reverse().forEach((fragment) => {
      fragments.push(new Fragment(
        this.stringReverse(fragment.lines.join("\n")).replace(/^\n/g, ''),
        fragment.isHidden,
        fragment.isSignature,
        fragment.isQuoted
      ));
    });

    return new Email(fragments);
  }

  isQuoteHeader(line) {
    let hasHeader = false;

    this.quoteHeadersRegex.forEach((regex) => {
      if (regex.test(this.stringReverse(line))) {
        hasHeader = true;
      }
    });

    return hasHeader;
  }

  isSignature(line) {
    let text = this.stringReverse(line);

    return this.signatureRegex.some((regex) => {
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
      (fragment.isQuoted && (this.isQuoteHeader(line) || line === ""));
  }

  addFragment(fragment) {
    if (fragment.isQuoted || fragment.isSignature || this.isEmpty(fragment)) {
      fragment.isHidden = true;
    }

    this.fragments.push(fragment);
  }
}

module.exports = EmailParser;