const XRegExp = require('xregexp');

class RegexList {
  constructor() {
    this.quoteHeadersRegex = this.buildXRegExp([
      /^-*\s*(On\s.+\s.+\n?wrote:{0,1})\s{0,1}-*$/m, // On DATE, NAME <EMAIL> wrote:
      /^-*\s*(Le\s.+\s.+\n?écrit\s?:{0,1})\s{0,1}-*$/m, // Le DATE, NAME <EMAIL> a écrit :
      /^-*\s*(El\s.+\s.+\n?escribió:{0,1})\s{0,1}-*$/m, // El DATE, NAME <EMAIL> escribió:
      /^-*\s*(Il\s.+\s.+\n?scritto:{0,1})\s{0,1}-*$/m,  // Il DATE, NAME <EMAIL> ha scritto:
      /^-*\s*(Em\s.+\s.+\n?escreveu:{0,1})\s{0,1}-*$/m,  // Em DATE, NAME <EMAIL> ha escreveu:
      /^\s*(Am\s.+\s)\n?\n?schrieb.+\s?(\[|<).+(\]|>):$/m, // Am DATE schrieb NAME <EMAIL>:
      /^\s*(Op\s[\s\S]+?\n?schreef[\s\S]+:)$/m, // Il DATE, schreef NAME <EMAIL>:
      /^\s*((W\sdniu|Dnia)\s[\s\S]+?(pisze|napisał(\(a\))?):)$/mu, // W dniu DATE, NAME <EMAIL> pisze|napisał:
      /^\s*(Den\s.+\s\n?skrev\s.+:)$/m, // Den DATE skrev NAME <EMAIL>:
      /^\s*(pe\s.+\s.+\n?kirjoitti:)$/m, // pe DATE NAME <EMAIL> kirjoitti: 
      /^\s*(Am\s.+\sum\s.+\s\n?schrieb\s.+:)$/m, // Am DATE um TIME schrieb NAME:
      /^(在[\s\S]+写道：)$/m, // > 在 DATE, TIME, NAME 写道：
      /^(20[0-9]{2}\..+\s작성:)$/m, // DATE TIME NAME 작성:
      /^(20[0-9]{2}\/.+のメッセージ:)$/m, // DATE TIME、NAME のメッセージ:
      /^(.+\s<.+>\sschrieb:)$/m, // NAME <EMAIL> schrieb:
      /^(.+\son.*at.*wrote:)$/m, // NAME on DATE wrote:
      /^\s*(From\s?:.+\s?\n?\s*[\[|<].+[\]|>])/m, // "From: NAME <EMAIL>" OR "From : NAME <EMAIL>" OR "From : NAME<EMAIL>"(With support whitespace before start and before <)
      /^\s*(Von\s?:.+\s?\n?\s*[\[|<].+[\]|>])/m, // "Von: NAME <EMAIL>" OR "Von : NAME <EMAIL>" OR "Von : NAME<EMAIL>"(With support whitespace before start and before <)
      /^\s*(De\s?:.+\s?\n?\s*(\[|<).+(\]|>))/m, // "De: NAME <EMAIL>" OR "De : NAME <EMAIL>" OR "De : NAME<EMAIL>"  (With support whitespace before start and before <)
      /^\s*(Van\s?:.+\s?\n?\s*(\[|<).+(\]|>))/m, // "Van: NAME <EMAIL>" OR "Van : NAME <EMAIL>" OR "Van : NAME<EMAIL>"  (With support whitespace before start and before <)
      /^\s*(Da\s?:.+\s?\n?\s*(\[|<).+(\]|>))/m, // "Da: NAME <EMAIL>" OR "Da : NAME <EMAIL>" OR "Da : NAME<EMAIL>"  (With support whitespace before start and before <)
      /^(20[0-9]{2})-([0-9]{2}).([0-9]{2}).([0-9]{2}):([0-9]{2})\n?(.*)>:$/m, // 20YY-MM-DD HH:II GMT+01:00 NAME <EMAIL>:
      /^\s*([a-z]{3,4}\.\s[\s\S]+\sskrev\s[\s\S]+:)$/m, // DATE skrev NAME <EMAIL>:
      /^([0-9]{2}).([0-9]{2}).(20[0-9]{2})(.*)(([0-9]{2}).([0-9]{2}))(.*)\"( *)<(.*)>( *):$/m, // DD.MM.20YY HH:II NAME <EMAIL>
      /^[0-9]{2}:[0-9]{2}(.*)[0-9]{4}(.*)\"( *)<(.*)>( *):$/, // HH:II, DATE, NAME <EMAIL>:
      /^(.*)[0-9]{4}(.*)from(.*)<(.*)>:$/,
      /^-{1,10} ?(O|o)riginal (M|m)essage ?-{1,10}$/i,
      /^-{1,10} ?(O|o)prindelig (B|b)esked ?-{1,10}$/i,
      /^-{1,10} ?(M|m)essage d\'origine ?-{1,10}$/i
    ]);

    this.signatureRegex = this.buildXRegExp([
      /^\s*-{2,4}$/, // Separator
      /^\s*_{2,4}$/, // Separator
      /^-- $/, // Separator
      /^-- \s*.+$/, // Separator
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

      // NL
      /^Verzonden vanaf (?:\s*.+)$/, // nl - e.g. Verzonden vanaf Outlook voor Android<https://aka.ms/12345>
    ]);
  }

  buildXRegExp(regexList) {
    return regexList.map((regex) => {
      return XRegExp(regex);
    });
  }
}

module.exports = new RegexList();
