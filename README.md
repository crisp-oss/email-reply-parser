# Email Reply Parser

[![Build Status](https://travis-ci.org/crisp-im/email-reply-parser.svg?branch=master)](https://travis-ci.org/crisp-im/email-reply-parser) [![NPM](https://img.shields.io/npm/v/email-reply-parser.svg)](https://www.npmjs.com/package/email-reply-parser

**Email Reply Parser is a library to parse plain-text email replies and extract content**

This library suppots most email replies, signatures and locales.

## Who uses it?

<table>
<tr>
<td align="center"><a href="https://crisp.chat/"><img src="https://valeriansaliou.github.io/bloom/images/crisp.png" height="64" /></a></td>
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

## Usage


``` javascript
var EmailReplyParser = require("email-reply-parser");

var email =  new EmailReplyParser().read(MY_EMAIL_STRING);

console.log(email.getVisibleText());
```


## Contributing

Feel free to fork this project and submit fixes. We may adapt your code to fit the codebase. 

You can run unit tests using:

`npm test`


## Credits

* GitHub
* William Durand <william.durand1@gmail.com>
* Crisp IM

## License

email-reply-parser is released under the MIT License. See the bundled LICENSE
file for details.

