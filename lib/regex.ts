/*
 * This file is part of email-reply-parser
 *
 * Copyright (c) 2025 Crisp IM SAS
 * All rights belong to Crisp IM SAS
 */

/**************************************************************************
 * CONSTANTS
 ***************************************************************************/

// Patterns must stay linear on backtracking engines: no nested or adjacent unbounded quantifiers

// Line terminators, and whitespace that is not a line terminator
const LT = "[\\n\\r\\u2028\\u2029]";
const HS = "[^\\S\\n\\r\\u2028\\u2029]";

// Sender and sent date field names of Outlook-style header blocks, per language
const FROM_FIELDS = ["From", "Von", "Van", "Från", "Fra", "De", "Da", "Từ", "Od", "От"];
const SENT_FIELDS = [
  "Sent", "Date", "Gesendet", "Datum", "Verzonden", "Skickat", "Sendt", "Dato", "Envoyé le",
  "Envoyé", "Inviato", "Data", "Enviado", "Gửi", "Wysłano", "Отправлено"
];

/**************************************************************************
 * HELPERS
 ***************************************************************************/

/**
 * Any characters up to the first STOP on the line (a single way to split, so no backtracking)
 */
function upTo(stop: string): string {
  return `(?:(?!${stop}).)*`;
}

/**
 * Native variant of "OPEN DATE NAME <EMAIL> KEYWORD" headers (same matches)
 */
function nativeOpenKeyword(
  prefix: string, open: string, keyword: string, suffix: string
): RegExp {
  return new RegExp(
    `^${prefix}${HS}*(${open}\\s(?:.+${LT}|.\\S*${HS}).+\\n?${keyword})${suffix}$`, "m"
  );
}

/**
 * Native variant of "OPEN DATE KEYWORD NAME <EMAIL>:" headers (same matches)
 */
function nativeOpenKeywordName(
  open: string, keyword: string, newlines: number, rest: string
): RegExp {
  const gap = "\\n?".repeat(newlines);

  return new RegExp(
    `^${HS}*(${open}\\s(?:.+${LT}${gap}${keyword}\\s|.+${HS}\\n${gap.slice(3)}${keyword}\\s|` +
      `.+${HS}${keyword}${LT}|.${upTo(`${HS}${keyword}${HS}`)}${HS}${keyword}${HS})${rest}):$`,
    "m"
  );
}

/**
 * Native variant of "KEYWORD: NAME <EMAIL>" headers (same matches)
 */
function nativeFieldHeader(keyword: string, open: string, close: string): RegExp {
  return new RegExp(
    `^${HS}*(${keyword}\\s?:(?:.+${LT}\\s*[${open}]|.[^${open}\\n\\r\\u2028\\u2029]*[${open}])` +
      `.+[${close}])`,
    "m"
  );
}

/**
 * "FROM: SENDER" (may wrap once) then "SENT: DATE", after a blank line (optionally bold)
 */
function fieldBlockHeader(fromFields: string[], sentFields: string[]): RegExp {
  const field = (names: string[]) => {
    return `\\*?(?:${names.join("|")})${HS}?:\\*?`;
  };

  const next = `(?:${HS}|\\n${HS}*)${field(sentFields)}`;
  const sender = `${upTo(next)}(?:\\n${upTo(next)})?`;

  return new RegExp(`^(?<!.\\n)${HS}*(${field(fromFields)}${sender}${next})`, "m");
}

/**
 * Native variant of "OPEN ... KEYWORD ...:" headers spanning at most 3 lines (same matches)
 */
function nativeBoundedKeyword(open: string, word: string, isDelimited = false): RegExp {
  // A delimited word needs whitespace around it, where a line boundary counts as whitespace
  const keyword = isDelimited ? `(?:[^\\S\\n]|^)${word}(?:[^\\S\\n]|$)` : word;

  return new RegExp(
    `^${HS}*(${open}(?:[^\\n]+\\n(?:(?=[^\\n]*?${keyword})[^\\n]*\\n[^\\n]*|` +
      `(?=(?:(?!${keyword})[^\\n])*${keyword}[^\\n]*:$)[^\\n]*)|` +
      `(?=[^\\n]+?${keyword})[^\\n]*\\n[^\\n]*|` +
      `(?=[^\\n](?:(?!${keyword})[^\\n])*${keyword}[^\\n]*:$)[^\\n]*):)$`,
    "m"
  );
}

/**
 * Native variant of "OPEN ... KEYWORD" headers spanning at most 2 lines
 */
function nativeTrailingKeyword(
  prefix: string, open: string, keyword: string, flags = "m"
): RegExp {
  return new RegExp(`^${prefix}(${open}[^\\n]+(?:\\n[^\\n]*)?${keyword})$`, flags);
}

/**
 * "-----TITLE-----" separator headers (trailing dashes are optional)
 */
function separatorHeader(title: string): RegExp {
  return new RegExp(`^-{1,12} ?${title} ?-{0,12}$`, "i");
}

/* eslint-disable max-len */
/**************************************************************************
 * CONSTANTS
 ***************************************************************************/

const QUOTE_HEADERS_PATTERNS: RegExp[] = [
  nativeOpenKeyword("-*", "On", "wrote:{0,1}", "\\s{0,1}-*"), // On DATE, NAME <EMAIL> wrote:
  nativeOpenKeyword("-*", "Le", "écrit\\s?:{0,1}", "\\s{0,1}-*"), // Le DATE, NAME <EMAIL> a écrit :
  nativeOpenKeyword("-*", "El", "escribió:{0,1}", "\\s{0,1}-*"), // El DATE, NAME <EMAIL> escribió:
  nativeOpenKeyword("-*", "Il", "scritto:{0,1}", "\\s{0,1}-*"), // Il DATE, NAME <EMAIL> ha scritto:
  nativeOpenKeyword("-*", "Em", "escreveu:{0,1}", "\\s{0,1}-*"), // Em DATE, NAME <EMAIL> ha escreveu:
  nativeBoundedKeyword("Op\\s", "schreef"), // Op DATE, schreef NAME <EMAIL>: (at most 3 lines)
  nativeTrailingKeyword(`${HS}*`, "(W\\sdniu|Dnia)\\s", "(pisze|napisał(\\(a\\))?):", "mu"), // W dniu DATE, NAME <EMAIL> pisze|napisał: (at most 2 lines)
  nativeOpenKeywordName("Den", "skrev", 1, ".+"), // Den DATE skrev NAME <EMAIL>:
  nativeOpenKeyword("", "pe", "kirjoitti:", ""), // pe DATE NAME <EMAIL> kirjoitti:
  nativeOpenKeywordName("Am", "schrieb", 2, `(?:.+\\s?[\\[<]\\n.+[\\]>]|.+${LT}[\\[<].+[\\]>]|.+${LT}|.+)`), // Am DATE schrieb NAME <EMAIL>: OR Am DATE um TIME schrieb NAME <EMAIL>: (with optional newline after <)
  new RegExp(`^${HS}*(ср\\,\\s(?:.+\\n\\u202fг\\. в\\s|.+\\u202fг\\. в${LT}|.${upTo(`\\u202fг\\. в${HS}`)}\\u202fг\\. в${HS})(?:.+,${LT}|.${upTo(`,${HS}`)},${HS}).[^\\[|<\\n\\r\\u2028\\u2029]*[\\[|<].+[\\]|>]:)$`, "m"), // ср, DATE г. в TIME, NAME <EMAIL>:
  nativeTrailingKeyword("", "在", "写道："), // > 在 DATE, TIME, NAME 写道： (at most 2 lines)
  /^(20[0-9]{2}\..+\s작성:)$/m, // DATE TIME NAME 작성:
  /^(20[0-9]{2}\/.+のメッセージ:)$/m, // DATE TIME、NAME のメッセージ:
  new RegExp(`^((?:.+${LT}|.${upTo(`${HS}<`)}${HS})<.+>\\sschrieb:)$`, "m"), // NAME <EMAIL> schrieb:
  new RegExp(`^(.${upTo("\\son")}\\son${upTo("at")}at.*wrote:|.+${LT}on${upTo("at")}at.*wrote:)$`, "m"), // NAME on DATE wrote:
  nativeFieldHeader("From", "\\[|<", "\\]|>"), // "From: NAME <EMAIL>" OR "From : NAME <EMAIL>" OR "From : NAME<EMAIL>"(With support whitespace before start and before <)
  nativeFieldHeader("Von", "\\[|<", "\\]|>"), // "Von: NAME <EMAIL>" OR "Von : NAME <EMAIL>" OR "Von : NAME<EMAIL>"(With support whitespace before start and before <)
  nativeFieldHeader("De", "\\[<", "\\]>"), // "De: NAME <EMAIL>" OR "De : NAME <EMAIL>" OR "De : NAME<EMAIL>"  (With support whitespace before start and before <)
  nativeFieldHeader("Van", "\\[<", "\\]>"), // "Van: NAME <EMAIL>" OR "Van : NAME <EMAIL>" OR "Van : NAME<EMAIL>"  (With support whitespace before start and before <)
  nativeFieldHeader("Da", "\\[<", "\\]>"), // "Da: NAME <EMAIL>" OR "Da : NAME <EMAIL>" OR "Da : NAME<EMAIL>"  (With support whitespace before start and before <)
  fieldBlockHeader(FROM_FIELDS, SENT_FIELDS), // "From: SENDER" + "Sent: DATE" (Outlook header block, without <EMAIL>)
  /^(20[0-9]{2})-([0-9]{2}).([0-9]{2}).([0-9]{2}):([0-9]{2})\n?(.*)>:$/m, // 20YY-MM-DD HH:II GMT+01:00 NAME <EMAIL>:
  nativeBoundedKeyword("[a-z]{3,4}\\.\\s", "skrev", true), // DATE skrev NAME <EMAIL>: (at most 3 lines)
  new RegExp(`^([0-9]{2}).[0-9]{2}.20[0-9]{2}${upTo("[0-9]{2}.[0-9]{2}")}[0-9]{2}.[0-9]{2}${upTo("\" *<")}" *<.*> *:$`, "m"), // DD.MM.20YY HH:II NAME <EMAIL>
  new RegExp(`^[0-9]{2}:[0-9]{2}(${upTo("[0-9]{4}")})[0-9]{4}${upTo("\" *<")}" *<.*> *:$`), // HH:II, DATE, NAME <EMAIL>:
  new RegExp(`^(${upTo("[0-9]{4}")})[0-9]{4}${upTo("from")}from${upTo("<")}<.*>:$`), // DATE from NAME <EMAIL>:
  separatorHeader("Original Message"), // -----Original Message-----
  separatorHeader("Oprindelig Besked"), // -------- Oprindelig besked --------
  separatorHeader("Message d'origine"), // -------- Message d'origine --------
  separatorHeader("Ursprüngliche Nachricht") // -----Ursprüngliche Nachricht-----
];

const SIGNATURE_PATTERNS: RegExp[] = [
  /^\s*-{2,4}$/, // Separator
  /^\s*_{2,4}$/, // Separator
  /^-- $/, // Separator
  /^\+{2,4}$/, // Separator
  /^\={2,4}$/, // Separator
  /^________________________________$/, // Separator

  // EN
  /^Sent from (?:\s*.+)$/, // en
  /^Get Outlook for (?:\s*.+).*/m, // en
  /^Cheers,?!?$/mi, // en
  /^Best wishes,?!?$/mi, // en
  /^\w{0,20}\s?(\sand\s)?Regards,?!?！?$/mi, //en

  // DE
  /^Von (?:\s*.+) gesendet$/, // de
  /^Gesendet von (?:\s*.+) für (?:\s*.+)$/, // de

  // DA
  /^Sendt fra (?:\s*.+)$/, // da

  // FR
  /^Envoyé depuis (?:\s*.+)$/, //fr
  /^Envoyé de mon (?:\s*.+)$/, // fr - e.g. Envoyé de mon iPhone
  /^Envoyé à partir de (?:\s*.+)$/, //fr
  /^Télécharger Outlook pour (?:\s*.+).*/m, // fr
  /^Bien . vous,?!?$/mi, // fr
  /^\w{0,20}\s?cordialement,?!?$/mi, // fr
  /^Bonne (journ.e|soir.e)!?$/mi, // fr

  // ES
  /^Enviado desde (?:\s*.+)$/, // es,

  // IT
  nativeOpenKeyword("-*", "In\\sdata", "scritto:{0,1}", "\\s{0,1}-*"), // it,

  // NL
  /^Verzonden vanaf (?:\s*.+)$/, // nl - e.g. Verzonden vanaf (Outlook voor Android<https://aka.ms/12345>|mijn iPad)
  /^Verstuurd vanaf (?:\s*.+)$/  // nl - e.g. Verstuurd vanaf mijn iPad/iPhone
];
/* eslint-enable max-len */

/**************************************************************************
 * CLASS
 ***************************************************************************/

/**
 * RegexList
 */
class RegexList {
  quoteHeadersRegex: RegExp[];
  signatureRegex: RegExp[];

  /**
   * Constructor
   */
  constructor() {
    this.quoteHeadersRegex = QUOTE_HEADERS_PATTERNS;
    this.signatureRegex = SIGNATURE_PATTERNS;
  }
}

export default new RegexList();
