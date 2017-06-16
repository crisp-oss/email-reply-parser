# Email Reply Parser

[![Build Status](https://travis-ci.org/crisp-im/email-reply-parser.svg?branch=master)](https://travis-ci.org/crisp-im/email-reply-parser)

Node library for parsing plain text email content. Based on https://github.com/willdurand/EmailReplyParser

willdurand library is based on GitHub's [email_reply_parser](http://github.com/github/email_reply_parser)
library written in Ruby.

## Usage
-----

``` javascript
var EmailReplyParser = require("email-reply-parser");

var email =  new EmailReplyParser().read(MY_EMAIL_STRING);

console.log(email.getVisibleText());
```

## To run the tests

`npm test`
