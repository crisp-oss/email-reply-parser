var fs 			         = require("fs");
var _  				       = require("underscore");
var EmailReplyParser = require("../lib/emailreplyparser");

const COMMON_FIRST_FRAGMENT = 'Fusce bibendum, quam hendrerit sagittis tempor, dui turpis tempus erat, pharetra sodales ante sem sit amet metus.\n\
Nulla malesuada, orci non vulputate lobortis, massa felis pharetra ex, convallis consectetur ex libero eget ante.\n\
Nam vel turpis posuere, rhoncus ligula in, venenatis orci. Duis interdum venenatis ex a rutrum.\n\
Duis ut libero eu lectus consequat consequat ut vel lorem. Vestibulum convallis lectus urna,\n\
et mollis ligula rutrum quis. Fusce sed odio id arcu varius aliquet nec nec nibh.';

function get_email(name) {
	var data = fs.readFileSync(__dirname + "/fixtures/" + name + ".txt", "utf-8");

	return new EmailReplyParser().read(data);
}

exports.test_reads_simple_body = function(test){
  reply = get_email("email_1");

  test.equal(2, reply.fragments.length);

	test.deepEqual([false, false], _.map(reply.fragments, function(f) { return f.isQuoted(); }));
	test.deepEqual([false, true], _.map(reply.fragments, function(f) { return f.isHidden(); }));

   test.equal("Hi folks\n\nWhat is the best way to clear a Riak bucket of all key, values after\nrunning a test?\nI am currently using the Java HTTP API.\n\n-Abhishek Kona\n\n", reply.fragments[0].toString());

  test.done();
};

exports.test_reads_top_post = function(test){
	let email = get_email("email_3");

	let fragments = email.getFragments();

	test.equal("Hi folks\n\nWhat is the best way to clear a Riak bucket of all key, values after\nrunning a test?\nI am currently using the Java HTTP API.\n\n-Abhishek Kona\n\n", reply.fragments[0].toString());
	
	test.done();
};

exports.test_reads_bottom_post = function(test){
    let email = get_email("email_2");

    let fragments = email.getFragments();
	test.equal(6, fragments.length);

	test.equal("Hi,", fragments[0]);
	test.equal(true, /^On [^\:]+\:/.test(fragments[1]));
	test.equal(true, /^You can list/.test(fragments[2]));
	test.equal(true, /^>/.test(fragments[3]));
	test.equal(true, /^_/.test(fragments[5]));
	test.done();
};

exports.test_recognizes_data_string_above_quote = function(test){
	let email = get_email("email_4");

	let fragments = email.getFragments();

	test.equal(true, /^Awesome/.test(fragments[0]));
	test.equal(true,/^On/.test(fragments[1]));
	test.equal(true, /Loader/.test(fragments[1]));
	test.done();
};

exports.test_complex_body_with_only_one_fragment = function(test){
	let email = get_email("email_5");

	let fragments = email.getFragments();

	test.equal(1, fragments.length);
	test.done();
};

exports.test_deals_with_multiline_reply_headers = function(test){
	let email = get_email("email_6");

	let fragments = email.getFragments();

	test.equal(true, /^I get/.test(fragments[0]));
	test.equal(true,/^On/.test(fragments[1]));
	test.equal(true, /Was this/.test(fragments[1]));

	test.done();
};

exports.test_email_with_italian = function(test) {
	let email = get_email("email_7");

  let fragments = email.getFragments();

	test.equal(COMMON_FIRST_FRAGMENT, fragments[0].toString().trim());

	test.done();
};

exports.test_email_with_dutch = function(test) {
	let email = get_email("email_8");

  let fragments = email.getFragments();

	test.equal(COMMON_FIRST_FRAGMENT, fragments[0].toString().trim());

	test.done();
};

exports.test_email_with_signature = function(test) {
	let email = get_email("email_9");

  let fragments = email.getFragments();

	test.equal(COMMON_FIRST_FRAGMENT, fragments[0].toString().trim());

	test.done();
};

exports.test_email_with_hotmail = function(test) {
	let email = get_email("email_10");

  let fragments = email.getFragments();

	test.equal(COMMON_FIRST_FRAGMENT, fragments[0].toString().trim());

	test.done();
};

exports.test_email_whitespace_before_header = function(test) {
	let email = get_email("email_11");

  let fragments = email.getFragments();

	test.equal(COMMON_FIRST_FRAGMENT, fragments[0].toString().trim());

	test.done();
};

exports.test_email_square_brackets = function(test) {
	let email = get_email("email_12");

  let fragments = email.getFragments();

	test.equal(COMMON_FIRST_FRAGMENT, fragments[0].toString().trim());

	test.done();
};

exports.test_email_da_into_italian = function(test) {
	let email = get_email("email_13");

  let fragments = email.getFragments();

	test.equal(COMMON_FIRST_FRAGMENT, fragments[0].toString().trim());

	test.done();
};

exports.test_email_header_polish = function(test) {
	let email = get_email("email_14");

  let fragments = email.getFragments();

	test.equal(COMMON_FIRST_FRAGMENT, fragments[0].toString().trim());

	test.done();
};

exports.test_email_sent_from_my = function(test) {
	let email = get_email("email_15");

  let fragments = email.getFragments();

	test.equal(COMMON_FIRST_FRAGMENT, fragments[0].toString().trim());

	test.done();
};

exports.test_email_header_polish_with_dnia_and_napisala = function(test) {
	let email = get_email("email_16");

  let fragments = email.getFragments();

	test.equal(COMMON_FIRST_FRAGMENT, fragments[0].toString().trim());

	test.done();
};

exports.test_email_header_polish_with_date_in_iso8601 = function(test) {
	let email = get_email("email_17");

  let fragments = email.getFragments();

	test.equal(COMMON_FIRST_FRAGMENT, fragments[0].toString().trim());

	test.done();
};

exports.test_email_outlook_en = function(test) {
	let email = get_email("email_18");

  let fragments = email.getFragments();

	test.equal(COMMON_FIRST_FRAGMENT, fragments[0].toString().trim());

	test.done();
};

exports.test_email_22 = function(test) {
	let email = get_email("email_22");

  let fragments = email.getFragments();

	test.equal(COMMON_FIRST_FRAGMENT, fragments[0].toString().trim());

	test.done();
};

exports.test_email_23 = function(test) {
	let email = get_email("email_23");

  let fragments = email.getFragments();

	test.equal(COMMON_FIRST_FRAGMENT, fragments[0].toString().trim());

	test.done();
};

exports.test_email_25 = function(test) {
	let email = get_email("email_25");

  let fragments = email.getFragments();

	test.equal(COMMON_FIRST_FRAGMENT, fragments[0].toString().trim());

	test.done();
};

exports.test_email_26 = function(test) {
	let email = get_email("email_26");

  let fragments = email.getFragments();

	test.equal(COMMON_FIRST_FRAGMENT, fragments[0].toString().trim());

	test.done();
};

exports.test_email_portuguese = function(test) {
	let email = get_email("email_portuguese");

  let fragments = email.getFragments();

	test.equal(COMMON_FIRST_FRAGMENT, fragments[0].toString().trim());

	test.done();
};

exports.test_email_german = function(test) {
	let email = get_email("email_german");

  let fragments = email.getFragments();

	test.equal(COMMON_FIRST_FRAGMENT, fragments[0].toString().trim());

	test.done();
};

exports.test_email_german_2 = function(test) {
	let email = get_email("email_german_2");

  let fragments = email.getFragments();

	test.equal(COMMON_FIRST_FRAGMENT, fragments[0].toString().trim());

	test.done();
};

exports.test_email_gmail_no = function(test) {
	let email = get_email("email_norwegian_gmail");

  let fragments = email.getFragments();

	test.equal(COMMON_FIRST_FRAGMENT, fragments[0].toString().trim());

	test.done();
};

exports.test_email_finnish = function(test) {
	let email = get_email("email_finnish");

  let fragments = email.getFragments();

	test.equal(COMMON_FIRST_FRAGMENT, fragments[0].toString().trim());

	test.done();
};

exports.test_email_with_correct_signature = function(test) {
	let email = get_email("correct_sig");

  let fragments = email.getFragments();

	test.equal(2, fragments.length);
	test.equal(false, fragments[1].isQuoted());
	test.equal(false, fragments[0].isSignature());
	test.equal(true, fragments[1].isSignature());
	test.equal(false, fragments[0].isHidden());
	test.equal(true, fragments[1].isHidden());

	test.equal(true, /^--\nrick/.test(fragments[1]));

	test.done();
};

exports.test_reads_email_with_signature_with_no_empty_line_above = function(test) {
	let email = get_email("sig_no_empty_line");

  let fragments = email.getFragments();

	test.equal(2, fragments.length);
	test.equal(false, fragments[0].isQuoted());
	test.equal(false, fragments[1].isQuoted());

	test.equal(false, fragments[0].isSignature());
	test.equal(true, fragments[1].isSignature());

	test.equal(false, fragments[0].isHidden());
	test.equal(true, fragments[1].isHidden());

	test.equal(true, /^--\nrick/.test(fragments[1]));

	test.done();
};

exports.test_one_is_not_one = function(test) {
	let email = get_email("email_one_is_not_on");

  let fragments = email.getFragments();

	test.equal(true, /One outstanding question/.test(fragments[0]));
	test.equal(true, /^On Oct 1, 2012/.test(fragments[1]));

	test.done();
};

exports.test_sent_from = function(test) {
	let email = get_email("email_sent_from");

  test.equal(email.getVisibleText(), "Hi it can happen to any texts you type, as long as you type in between words or paragraphs.\n");

	test.done();
};

exports.test_email_emoji = function(test) {
	let email = get_email("email_emoji");

  test.equal(email.getVisibleText(), "🎉\n\n—\nJohn Doe\nCEO at Pandaland\n\n@pandaland");

	test.done();
};

exports.test_email_not_a_signature = function(test) {
	let email = get_email("email_not_a_signature");

  let fragments = email.getFragments();

	test.equal(fragments[0].isSignature(), false);

	test.done();
};

exports.test_email_24 = function(test) {
	let email = get_email("email_24");

  let fragments = email.getFragments();

	test.equal(COMMON_FIRST_FRAGMENT, fragments[0].toString().trim());

	test.done();
};

exports.test_email_outlook = function(test) {
	let email = get_email("email_outlook_split_line_from");

	let fragments = email.getFragments();

	test.equal(COMMON_FIRST_FRAGMENT, fragments[0].toString().trim());
	test.equal(2, fragments.length);

	test.done();
}

exports.test_email_gmail = function(test) {
	let email = get_email("email_gmail_split_line_from");

	let fragments = email.getFragments();

	test.equal(COMMON_FIRST_FRAGMENT, fragments[0].toString().trim());
	test.equal(2, fragments.length);

	test.done();
}

exports.text_email_reply_header = function(test) {
	let email = get_email("email_reply_header");

	let fragments = email.getFragments();

	const firstFragmentRegex = /^On the other hand/m;
	const secondFragmentRegex = /^On Wed, Dec 9/m;

	test.equal(firstFragmentRegex.test(fragments[0].toString().trim()), true)
	test.equal(secondFragmentRegex.test(fragments[1].toString().trim()), true)

	test.done();
}

exports.text_email_ios_outlook_fr = function(test) {
	let email = get_email("email_ios_outlook_fr");

	let fragments = email.getFragments();
	test.equal(COMMON_FIRST_FRAGMENT, fragments[0].toString().trim());
	test.equal(3, fragments.length);

	test.done();
}

exports.text_email_ios_outlook = function(test) {
	let email = get_email("email_ios_outlook");

	let fragments = email.getFragments();

	test.equal(COMMON_FIRST_FRAGMENT, fragments[0].toString().trim());
	test.equal(3, fragments.length);

	test.done();
}

exports.text_email_msn = function(test) {
	let email = get_email("email_msn");

	let fragments = email.getFragments();

	test.equal(COMMON_FIRST_FRAGMENT, fragments[0].toString().trim());
	test.equal(2, fragments.length);

	test.done();
}

exports.text_email_zoho = function(test) {
	let email = get_email("email_zoho");

	let fragments = email.getFragments();

	test.equal("What is the best way to clear a Riak bucket of all key, values after\nrunning a test?\n", fragments[0].toString());

	test.done();
}

exports.text_email_regards = function(test) {
	let email = get_email("email_with_regards");

	let fragments = email.getFragments();

	test.equal("Hi,\n\nI still have the same problem....\n\nCan you help?\n", fragments[0].toString());

	test.done();
}

exports.test_email_fr_multiline = function(test) {
	let email = get_email("email_fr_multiline");

	let fragments = email.getFragments();

	test.equal(COMMON_FIRST_FRAGMENT, fragments[0].toString().trim());
	test.equal(2, fragments.length);

	test.done();
}


exports.test_email_en_multiline_2 = function(test) {
	let email = get_email("email_en_multiline_2");

	let fragments = email.getFragments();

	test.equal(COMMON_FIRST_FRAGMENT, fragments[0].toString().trim());
	test.equal(2, fragments.length);

	test.done();
}

exports.test_email_original_message = function(test) {
	let email = get_email("email_original_message");

	let fragments = email.getFragments();

	test.equal(COMMON_FIRST_FRAGMENT, fragments[0].toString().trim());
	test.equal(2, fragments.length);

	test.done();
}

exports.test_email_original_message_2 = function(test) {
	let email = get_email("email_original_message_2");

	let fragments = email.getFragments();

	test.equal(COMMON_FIRST_FRAGMENT, fragments[0].toString().trim());
	test.equal(2, fragments.length);

	test.done();
}

exports.test_email_original_message_danish_dash = function(test) {
	let email = get_email("email_danish_dash_separator");

	let fragments = email.getFragments();

	test.equal(COMMON_FIRST_FRAGMENT, fragments[0].toString().trim());
	test.equal(2, fragments.length);

	test.done();
}

exports.test_email_original_message_french_dash = function(test) {
	let email = get_email("email_french_dash_separator");

	let fragments = email.getFragments();

	test.equal(COMMON_FIRST_FRAGMENT, fragments[0].toString().trim());
	test.equal(2, fragments.length);

	test.done();
}
