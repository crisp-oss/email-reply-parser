class RegexList {
  constructor() {
    this.quoteHeadersRegex = [
      /^\-*\s*(On(?:(?!^>*\s*On\b|\bwrote(:)?)[\s\S]){0,1000}wrote:?)\s*\-*$/m, // On DATE, NAME <EMAIL> wrote:
      /^\s*(Le(?:(?!^>*\s*Le\b|\bécrit:)[\s\S]){0,1000}écrit :)$/m, // Le DATE, NAME <EMAIL> a écrit :
      /^\s*(El(?:(?!^>*\s*El\b|\bescribió:)[\s\S]){0,1000}escribió:)$/m, // El DATE, NAME <EMAIL> escribió:
      /^\s*(Il(?:(?!^>*\s*Il\b|\bscritto:)[\s\S]){0,1000}scritto:)$/m, // Il DATE, NAME <EMAIL> ha scritto:
      /^\s*(Em(?:(?!^>*\s*Em\b|\bescreveu:)[\s\S]){0,1000}escreveu:)$/m, // Em DATE, NAME <EMAIL>escreveu:
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
      /^(20[0-9]{2})-([0-9]{2}).([0-9]{2}).([0-9]{2}):([0-9]{2})*.(.*)?\n?(.*)>:$/m, // 20YY-MM-DD HH:II GMT+01:00 NAME <EMAIL>:
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
  }
}

module.exports = new RegexList();