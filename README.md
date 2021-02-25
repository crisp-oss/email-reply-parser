# Email Reply Parser

[![Build Status](https://travis-ci.org/crisp-dev/email-reply-parser.svg?branch=master)](https://travis-ci.org/crisp-dev/email-reply-parser) [![NPM](https://img.shields.io/npm/v/email-reply-parser.svg)](https://www.npmjs.com/package/email-reply-parser])

**Email Reply Parser is a node library to parse plain-text email replies and extract content**

This library supports most email replies, signatures and locales.

## Who uses it?

<table>
<tr>
<td align="center"><a href="https://crisp.chat/"><img src="https://crisp.chat/favicon-256x256.png" height="64" /></a></td>
</tr>
<tr>
<td align="center">Crisp</td>
</tr>
</table>

_👋 You use this library and you want to be listed there? [Contact us](https://crisp.chat/)._

## Installation

Install the project using NPM:

``` javascript
npm install --save email-reply-parser
```

## Features

This library is used at [Crisp](https://crisp.chat/) everyday with around 1 million inbound emails. Over the years, we improved this library so tt can work with most emails.

- Strip email replies like `On DATE, NAME <EMAIL> wrote:`
- Supports around **10 locales**, including English, French, Spanish, Portuguese, Italian, Japanese, Chinese.
- Removes signatures like `Sent from my iPhone`
- Removes signatures like `Best wishes`

## Usage

``` javascript
var EmailReplyParser = require("email-reply-parser");

var email =  new EmailReplyParser().read(MY_EMAIL_STRING);

console.log(email.getVisibleText());
```

## Contributing

Feel free to fork this project and submit fixes. We may adapt your code to fit the codebase. 

You can run unit tests using:

``` javascript
npm test
```

## Credits

* GitHub
* William Durand <william.durand1@gmail.com>
* Crisp IM

## License

email-reply-parser is released under the MIT License. See the bundled LICENSE
file for details.

