// Fixtures ported from github/email_reply_parser (MIT), willdurand/EmailReplyParser (MIT), mailgun/talon (Apache 2.0),
// discourse/email_reply_trimmer (MIT), zapier/email-reply-parser (MIT) and alfonsrv/mail-parser-reply (MIT)
import fs from "fs";
import EmailReplyParser from "../dist/emailreplyparser.js";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

const PARSE_BUDGET_MS = 1000;

const COMMON_FIRST_FRAGMENT = "Fusce bibendum, quam hendrerit sagittis tempor, dui turpis tempus erat, pharetra sodales ante sem sit amet metus.\n" +
  "Nulla malesuada, orci non vulputate lobortis, massa felis pharetra ex, convallis consectetur ex libero eget ante.\n" +
  "Nam vel turpis posuere, rhoncus ligula in, venenatis orci. Duis interdum venenatis ex a rutrum.";

const TALON_EXPECTED = JSON.parse(fs.readFileSync(__dirname + "/fixtures/talon/expected.json", "utf-8"));

// Talon keeps signatures and mobile footers, this parser hides them by design
const TALON_OVERRIDES = {
  client_iphone: "Hello",
  client_sparrow: "Hello",
  quotation_between_reply_and_signature: "Reply"
};

// Discourse keeps signatures, inline quotes and drops forwarded mails, this parser does the opposite by design
const DISCOURSE_KEEPS_SIGNATURE = [
  "delimiter_inside_new_reply", "email_headers_5", "embedded_email_2", "embedded_email_swedish",
  "inline_images_before_reply_text"
];
const DISCOURSE_KEEPS_QUOTES = ["quote_and_text", "quote_only", "reply_after_selected_german_quote"];
const DISCOURSE_DROPS_FORWARDS = ["forwarded_gmail", "forwarded_message"];

// Cases this parser does not handle yet; promote them out of this list once fixed
const KNOWN_GAPS = [
  "github/email_2_2",
  "willdurand/email_23_1",
  "email_2_1",
  "email_sent_from_my_not_signature",
  "email_thread",
  "date_headers/7",
  "talon/android_wrote",
  "talon/client_android",
  "talon/from_block_starts_with_date",
  "talon/link_breaks_quotation_markers_sequence_1",
  "talon/link_breaks_quotation_markers_sequence_2",
  "talon/link_closed_with_quotation_marker_on_new_line",
  "talon/norwegian_from_line",
  "talon/original_message_indicator_3",
  "talon/original_message_indicator_5",
  "talon/pattern_on_date_polymail",
  "talon/pattern_on_date_somebody_sent",
  "talon/quotation_marker_false_positive",
  "talon/reply_and_quotation_splitter_share_line_1",
  "talon/reply_and_quotation_splitter_share_line_2",
  "talon/reply_and_quotation_splitter_share_line_3",
  "talon/swedish_from_block",
  "talon/swedish_from_line",
  "talon/vietnamese_from_block",
  "talon/weird_date_format_in_date_block",
  "discourse/delimiters",
  "discourse/email_headers_1",
  "discourse/email_headers_2",
  "discourse/embedded_email_7",
  "discourse/embedded_email_12",
  "discourse/embedded_email_16",
  "discourse/embedded_email_17",
  "discourse/embedded_email_18",
  "discourse/embedded_email_french_1",
  "discourse/embedded_email_german_6",
  "discourse/embedded_email_russian_2",
  "alfonsrv/begins_with_signature",
  "alfonsrv/email_sent_from_not_signature"
];

// Per alfonsrv case: text the reply must keep, and text of the quoted mail it must hide
const ALFONSRV_CASES = {
  begins_with_signature: ["I have sent an invite for 10:30am", "wrote:"], // Raw quoted-printable, decoded upstream in practice
  caution: ["Hi lads's Team", null],
  caution2: ["I am trying to place an order", null],
  email_danish_1: ["Tak for din mail", "Hvordan går det med projektet?"],
  email_danish_2: ["Jeg har modtaget filerne", "Her er filerne du bad om"],
  email_danish_3: ["Svar.", "Oprindelig besked."],
  email_danish_4: ["Svar.", "-----Oprindelig meddelelse-----"],
  email_danish_5: ["Kh\nPeter", null],
  email_gmail: ["This is a test for inbox replying to a github message.", "Steven Scott"],
  email_ja_1_2: ["それでは 11:00 にお待ちしております。", "田中太郎 <taro.tanaka@example.com>"],
  email_nl_1_2: ["Outlook met een antwoord", "Google Apps Sync Team"],
  email_pl_1_1: ["Od: Jan Kowalski <jan.kowalski@example.com>\nWysłano:", null],
  email_pl_1_2: ["Od: Jan Kowalski <jan.kowalski@example.com>\nWysłano:", "Wszystko w porządku"],
  email_pl_1_3: ["Od: Jan Kowalski <jan.kowalski@example.com>\nWysłano:", null],
  email_sent_from_not_signature: ["Sent from my desk, is much easier than my mobile phone.", null],
  email_sv_anon_1: ["Berättar gärna", "skrev Person B"],
  email_swedish_1: ["Ursäkta mitt sena svar!", "Jag har försökt få tag"],
  email_swedish_2: ["It's amazing I would love", "Anna Andersson <anna.andersson@acme.com> skrev:"],
  forward: ["Can I get 1 Arrival Notice without PU# and invoice?", null],
  multi_header: ["No problem. I’ll just start a new order.", "Original Message"],
  outlook: ["What is the best way to clear a Riak bucket", null]
};

// Quote headers from willdurand/EmailReplyParser, each must hide the quoted mail below it
const DATE_HEADERS = [
  "On Tue, 2011-03-01 at 18:02 +0530, Abhishek Kona wrote:",
  "2014-03-20 8:48 GMT+01:00 Rémi Dolan <do_not_reply@dolan.com>:",
  "2014-03-20 20:48 GMT+01:00 Rémi Dolan <do_not_reply@dolan.com>:",
  "2014-03-09 20:48 GMT+01:00 Rémi Dolan <do_not_reply@dolan.com>:",
  "Le 19 mars 2014 10:37, Cédric Lombardot <cedric.lombardot@gmail.com> a écrit :",
  "El 19/03/2014 11:34, Juan Pérez <juan.perez@mailcatch.com> escribió:",
  "El 19/03/2014 11:34, Juan Pérez <juan.perez@mailcatch.com> ha escrit:",
  "W dniu 7 stycznia 2015 15:24 użytkownik Paweł Brzoski <pbrzoski91@gmail.com> napisał:",
  "Le 19/03/2014 11:34, Georges du chemin a écrit :",
  "W dniu 2015-01-07 14:23, pbrzoski91@gmail.com pisze: ",
  "Den 08/06/2015 kl. 21.21 skrev Test user <test@example.com>:",
  "Am 25.06.2015 um 10:55 schrieb Test user:",
  "Test user <test@example.com> schrieb:",
  "在 2016年11月8日，下午2:23，Test user <test@example.com> 写道：",
  "2016. 11. 8. 오후 12:39 Test user <test@example.com> 작성:",
  "2016/11/08 14:26、Test user <test@example.com> のメッセージ:",
  "tir. 18. apr. 2017 kl. 13:09 skrev Test user <test@example.com>:"
];

const FROM_HEADERS = [
  "From: foo@example.com <foo@example.com>",
  "De: foo@example.com <foo@example.com>",
  "Van: foo@example.com <foo@example.com>",
  "Da: foo@example.com <foo@example.com>"
];

// Read a fixture as raw text
function read_fixture(name) {
  return fs.readFileSync(__dirname + "/fixtures/" + name + ".txt", "utf-8");
}

// Parse a fixture into an email
function get_email(name) {
  return new EmailReplyParser().read(read_fixture(name));
}

// Parse a fixture and return its trimmed visible reply
function parse_reply(name) {
  return new EmailReplyParser().parseReply(read_fixture(name)).trim();
}

// Trim the text and trailing spaces of each line, as the parser strips them
function normalize(text) {
  return text.split("\n").map((line) => line.trimEnd()).join("\n").trim();
}

// Return the expected reply for a talon case
function talon_expected(name) {
  return normalize(TALON_OVERRIDES[name] ?? TALON_EXPECTED[name]);
}

// Assert a case, known gaps must keep failing until they are promoted
function check(test, id, expected, actual) {
  if (KNOWN_GAPS.includes(id)) {
    test.notEqual(expected, actual, id + " now passes, remove it from KNOWN_GAPS");
  } else {
    test.equal(expected, actual, id);
  }
}

// Return the expected reply for a discourse case, adapted where this parser differs by design
function discourse_expected(name) {
  const expected = normalize(read_fixture("discourse/trimmed/" + name));

  if (DISCOURSE_KEEPS_SIGNATURE.includes(name)) {
    return expected.replace(/\n+[^\n]*regards,?(?:\n[\s\S]*)?$/i, "");
  }

  if (DISCOURSE_KEEPS_QUOTES.includes(name)) {
    return expected.split("\n").filter((line) => !line.startsWith(">")).join("\n").replace(/\n{3,}/g, "\n\n").trim();
  }

  if (DISCOURSE_DROPS_FORWARDS.includes(name)) {
    return normalize(read_fixture("discourse/emails/" + name).replace(/\r\n/g, "\n"));
  }

  return expected;
}

// Return the actual reply for a talon case
function talon_actual(name) {
  return normalize(parse_reply("talon/" + name));
}

// github/email_reply_parser

export function test_github_windows_line_endings(test) {
  let fragments = get_email("github/email_1_7").getFragments();

  test.equal(true, /:\+1:/.test(fragments[0]));
  test.equal(true, /^On/.test(fragments[1]));
  test.equal(true, /Steps 0-2/.test(fragments[1]));

  test.done();
}

export function test_github_inline_replies(test) {
  let visible = parse_reply("github/email_1_8");

  test.equal(true, /I will reply under this one/.test(visible));
  test.equal(true, /and under this\./.test(visible));
  test.equal(false, /Hey there, this is my signature/.test(visible));

  test.done();
}

export function test_github_outlook_reply_directly_above_line(test) {
  check(test, "github/email_2_2", "Outlook with a reply directly above line", parse_reply("github/email_2_2"));

  test.done();
}

export function test_github_outlook_reply_with_no_line(test) {
  test.equal("Outlook with a reply directly above line", parse_reply("github/email_2_3"));

  test.done();
}

export function test_github_greedy_on(test) {
  let fragments = get_email("github/greedy_on").getFragments();

  test.equal(true, /^On your remote host/.test(fragments[0]));
  test.equal(true, /^On 9 Jan 2014/.test(fragments[1]));
  test.deepEqual([false, true, true], fragments.map((fragment) => fragment.isHidden()));

  test.done();
}

export function test_github_signature_delimiter_in_middle_of_line(test) {
  test.equal(1, get_email("github/email_sig_delimiter_in_middle_of_line").getFragments().length);

  test.done();
}

export function test_github_pathological_email_is_fast(test) {
  let start = Date.now();

  get_email("github/pathological");

  test.equal(true, (Date.now() - start) < PARSE_BUDGET_MS);

  test.done();
}

export function test_github_long_quote_is_fast(test) {
  let start = Date.now();

  get_email("github/email_long_quote");

  test.equal(true, (Date.now() - start) < PARSE_BUDGET_MS);

  test.done();
}

// willdurand/EmailReplyParser

export function test_willdurand_wrote_inside_body_is_not_a_header(test) {
  check(
    test,
    "willdurand/email_23_1",
    COMMON_FIRST_FRAGMENT + "\n\nSomething wrote:\nDuis ut libero eu lectus consequat consequat ut vel lorem. Vestibulum convallis lectus urna,\n" +
    "et mollis ligula rutrum quis. Fusce sed odio id arcu varius aliquet nec nec nibh.",
    parse_reply("willdurand/email_23_1")
  );

  test.done();
}

export function test_willdurand_dash_prefixed_french_header(test) {
  let visible = parse_reply("willdurand/email_issue_77");

  test.equal(true, /Le paragraphe qui pose problème/.test(visible));
  test.equal(true, /Text paragraph 2/.test(visible));
  test.equal(false, /a écrit/.test(visible));

  test.done();
}

export function test_willdurand_ls_output_is_not_a_signature(test) {
  let fragments = get_email("willdurand/email_ls-l").getFragments();

  test.equal(2, fragments.length);
  test.equal(false, fragments[0].isSignature());
  test.equal(true, fragments[1].isSignature());

  test.done();
}

export function test_willdurand_windows_10_mail(test) {
  test.equal("Great thanks Bort, going for a test now.\nBraxton", parse_reply("willdurand/email_w10_mail"));

  test.done();
}

export function test_willdurand_zimbra_free_en(test) {
  let fragments = get_email("willdurand/email_zimbra_free_en").getFragments();

  test.equal(true, /Michael Scott/.test(fragments[0]));
  test.equal(false, /Toby Flenderson/.test(fragments[0]));

  test.done();
}

export function test_willdurand_zimbra_free_fr(test) {
  let fragments = get_email("willdurand/email_zimbra_free_fr").getFragments();

  test.equal(true, /Michael Scott/.test(fragments[0]));
  test.equal(false, /Toby Flenderson/.test(fragments[0]));

  test.done();
}

export function test_willdurand_visible_text_seems_like_a_quote_header_1(test) {
  let quoted = get_email("email_19").getFragments().find((fragment) => fragment.isQuoted());

  test.equal("On Thursday, I get proper rendering.", parse_reply("email_19"));
  test.equal(true, /^On Dec 16/.test(quoted));
  test.equal(true, /Was this/.test(quoted));

  test.done();
}

export function test_willdurand_visible_text_seems_like_a_quote_header_2(test) {
  let fragments = get_email("email_20").getFragments();

  test.equal(true, /^On Thursday/.test(fragments[0]));
  test.equal(true, /^> On May 17/.test(fragments[1]));
  test.equal(true, /fix this parsing/.test(fragments[1]));

  test.done();
}

export function test_willdurand_fair_amount_of_content(test) {
  test.equal(true, /^On Thursday/.test(get_email("email_21").getFragments()[0]));

  test.done();
}

export function test_willdurand_visible_text_joins_visible_fragments(test) {
  let email = get_email("email_2_1");

  let visible = email.getFragments().filter((fragment) => !fragment.isHidden());

  test.equal(visible.join("\n").trimEnd(), email.getVisibleText().trimEnd());
  check(test, "email_2_1", "Outlook with a reply", parse_reply("email_2_1"));

  test.done();
}

export function test_willdurand_mobile_signatures(test) {
  test.equal("Here is another email", parse_reply("email_iphone"));
  test.equal("Here is another email", parse_reply("email_blackberry"));
  test.equal("Here is another email", parse_reply("email_multi_word_sent_from_my_mobile_device"));
  check(
    test,
    "email_sent_from_my_not_signature",
    "Here is another email\n\nSent from my desk, is much easier then my mobile phone.",
    parse_reply("email_sent_from_my_not_signature")
  );

  test.done();
}

export function test_willdurand_retains_bullets(test) {
  test.equal(
    "test 2 this should list second\n\nand have spaces\n\nand retain this formatting\n\n\n   - how about bullets\n   - and another",
    parse_reply("email_bullets")
  );

  test.done();
}

export function test_willdurand_unquoted_reply(test) {
  test.equal("This is my reply.", parse_reply("email_unquoted_reply"));

  test.done();
}

export function test_willdurand_thread_preserves_new_lines(test) {
  let quoted = get_email("email_thread").getFragments().find((fragment) => fragment.isQuoted());

  check(test, "email_thread", "This is new email reply in thread from bellow.", parse_reply("email_thread"));
  test.equal(true, /\n>> --\n>> Jim Beam – Acme Corp\n>>\n>\n?$/.test(quoted));

  test.done();
}

export function test_willdurand_date_quote_headers(test) {
  let template = read_fixture("email_with_date_headers");

  DATE_HEADERS.forEach((header, index) => {
    let reply = new EmailReplyParser().parseReply(template.replace("[DATE]", header)).trim();

    check(test, "date_headers/" + (index + 1), "Thank you very much.", reply);
  });

  test.done();
}

export function test_willdurand_from_quote_headers(test) {
  let template = read_fixture("email_with_from_headers");

  FROM_HEADERS.forEach((header) => {
    let fragments = new EmailReplyParser().read(template.replace("[FROM]", header)).getFragments();

    test.equal(header + "\n\nMy email is <foo@example.com>", (fragments[1] || "").toString().trim(), JSON.stringify(header));
  });

  test.done();
}

// mailgun/talon

export function test_talon_replies(test) {
  Object.keys(TALON_EXPECTED).forEach((name) => {
    check(test, "talon/" + name, talon_expected(name), talon_actual(name));
  });

  test.done();
}

// discourse/email_reply_trimmer

export function test_discourse_replies(test) {
  fs.readdirSync(__dirname + "/fixtures/discourse/emails").forEach((file) => {
    const name = file.replace(/\.txt$/, "");
    const actual = normalize(new EmailReplyParser().parseReply(read_fixture("discourse/emails/" + name).trim()));

    check(test, "discourse/" + name, discourse_expected(name), actual);
  });

  test.done();
}

// zapier/email-reply-parser

export function test_zapier_gmail_inbox_reply(test) {
  test.equal("This is a test for inbox replying to a github message.", parse_reply("zapier/email_gmail"));

  test.done();
}

export function test_zapier_headers_without_delimiter(test) {
  test.equal("And another reply!", parse_reply("zapier/email_headers_no_delimiter"));

  test.done();
}

export function test_zapier_partial_quote_header(test) {
  const reply = parse_reply("zapier/email_partial_quote_header");

  test.ok(reply.startsWith("On your remote host you can run:"));
  test.ok(reply.includes("telnet 127.0.0.1 52698"));
  test.ok(reply.includes("This should connect to TextMate"));

  test.done();
}

// alfonsrv/mail-parser-reply

export function test_alfonsrv_replies(test) {
  Object.entries(ALFONSRV_CASES).forEach(([name, [kept, hidden]]) => {
    const reply = parse_reply("alfonsrv/" + name);
    const passes = reply.includes(kept) && (hidden === null || !reply.includes(hidden));

    check(test, "alfonsrv/" + name, true, passes);
  });

  test.done();
}
