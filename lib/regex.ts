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

// Whitespace-delimited "skrev" (a line boundary counts as whitespace)
const SKREV = "(?:[^\\S\\n]|^)skrev(?:[^\\S\\n]|$)";

/**************************************************************************
 * HELPERS
 ***************************************************************************/

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
      `.+${HS}${keyword}${LT}|.(?:(?!${HS}${keyword}${HS}).)*${HS}${keyword}${HS})${rest}):$`,
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
 * Native variant of "OPEN ... KEYWORD ...:" headers spanning at most 3 lines (same matches)
 */
function nativeBoundedKeyword(open: string, keyword: string): RegExp {
  return new RegExp(
    `^${HS}*(${open}(?:[^\\n]+\\n(?:(?=[^\\n]*?${keyword})[^\\n]*\\n[^\\n]*|` +
      `(?=(?:(?!${keyword})[^\\n])*${keyword}[^\\n]*:$)[^\\n]*)|` +
      `(?=[^\\n]+?${keyword})[^\\n]*\\n[^\\n]*|` +
      `(?=[^\\n](?:(?!${keyword})[^\\n])*${keyword}[^\\n]*:$)[^\\n]*):)$`,
    "m"
  );
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
  /^[^\S\n\r\u2028\u2029]*((W\sdniu|Dnia)\s[^\n]+(?:\n[^\n]*)?(pisze|napisał(\(a\))?):)$/mu, // W dniu DATE, NAME <EMAIL> pisze|napisał: (at most 2 lines)
  nativeOpenKeywordName("Den", "skrev", 1, ".+"), // Den DATE skrev NAME <EMAIL>:
  nativeOpenKeyword("", "pe", "kirjoitti:", ""), // pe DATE NAME <EMAIL> kirjoitti:
  nativeOpenKeywordName("Am", "schrieb", 2, `(?:.+\\s?[\\[<]\\n.+[\\]>]|.+${LT}[\\[<].+[\\]>]|.+${LT}|.+)`), // Am DATE schrieb NAME <EMAIL>: OR Am DATE um TIME schrieb NAME <EMAIL>: (with optional newline after <)
  new RegExp(`^${HS}*(ср\\,\\s(?:.+\\n\\u202fг\\. в\\s|.+\\u202fг\\. в${LT}|.(?:(?!\\u202fг\\. в${HS}).)*\\u202fг\\. в${HS})(?:.+,${LT}|.(?:(?!,${HS}).)*,${HS}).[^\\[|<\\n\\r\\u2028\\u2029]*[\\[|<].+[\\]|>]:)$`, "m"), // ср, DATE г. в TIME, NAME <EMAIL>:
  /^(在[^\n]+(?:\n[^\n]*)?写道：)$/m, // > 在 DATE, TIME, NAME 写道： (at most 2 lines)
  /^(20[0-9]{2}\..+\s작성:)$/m, // DATE TIME NAME 작성:
  /^(20[0-9]{2}\/.+のメッセージ:)$/m, // DATE TIME、NAME のメッセージ:
  new RegExp(`^((?:.+${LT}|.(?:(?!${HS}<).)*${HS})<.+>\\sschrieb:)$`, "m"), // NAME <EMAIL> schrieb:
  /^(.(?:(?!\son).)*\son(?:(?!at).)*at.*wrote:|.+[\n\r\u2028\u2029]on(?:(?!at).)*at.*wrote:)$/m, // NAME on DATE wrote:
  nativeFieldHeader("From", "\\[|<", "\\]|>"), // "From: NAME <EMAIL>" OR "From : NAME <EMAIL>" OR "From : NAME<EMAIL>"(With support whitespace before start and before <)
  nativeFieldHeader("Von", "\\[|<", "\\]|>"), // "Von: NAME <EMAIL>" OR "Von : NAME <EMAIL>" OR "Von : NAME<EMAIL>"(With support whitespace before start and before <)
  nativeFieldHeader("De", "\\[<", "\\]>"), // "De: NAME <EMAIL>" OR "De : NAME <EMAIL>" OR "De : NAME<EMAIL>"  (With support whitespace before start and before <)
  nativeFieldHeader("Van", "\\[<", "\\]>"), // "Van: NAME <EMAIL>" OR "Van : NAME <EMAIL>" OR "Van : NAME<EMAIL>"  (With support whitespace before start and before <)
  nativeFieldHeader("Da", "\\[<", "\\]>"), // "Da: NAME <EMAIL>" OR "Da : NAME <EMAIL>" OR "Da : NAME<EMAIL>"  (With support whitespace before start and before <)
  /^(20[0-9]{2})-([0-9]{2}).([0-9]{2}).([0-9]{2}):([0-9]{2})\n?(.*)>:$/m, // 20YY-MM-DD HH:II GMT+01:00 NAME <EMAIL>:
  nativeBoundedKeyword("[a-z]{3,4}\\.\\s", SKREV), // DATE skrev NAME <EMAIL>: (at most 3 lines)
  /^([0-9]{2}).[0-9]{2}.20[0-9]{2}(?:(?![0-9]{2}.[0-9]{2}).)*[0-9]{2}.[0-9]{2}(?:(?!" *<).)*" *<.*> *:$/m, // DD.MM.20YY HH:II NAME <EMAIL>
  /^[0-9]{2}:[0-9]{2}((?:(?![0-9]{4}).)*)[0-9]{4}(?:(?!" *<).)*" *<.*> *:$/, // HH:II, DATE, NAME <EMAIL>:
  /^((?:(?![0-9]{4}).)*)[0-9]{4}(?:(?!from).)*from(?:(?!<).)*<.*>:$/, // DATE from NAME <EMAIL>:
  /^-{1,12} ?(O|o)riginal (M|m)essage ?-{1,12}$/i,
  /^-{1,12} ?(O|o)prindelig (B|b)esked ?-{1,12}$/i,
  /^-{1,12} ?(M|m)essage d\'origine ?-{1,12}$/i,
  /^-{1,12} ?(U|u)rsprüngliche (N|n)achricht ?-{0,12}$/i
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
