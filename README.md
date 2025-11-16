# Email Reply Parser

[![Test and Build](https://github.com/crisp-oss/email-reply-parser/workflows/Test%20and%20Build/badge.svg?branch=master)](https://github.com/crisp-oss/email-reply-parser/actions?query=workflow%3A%22Test+and+Build%22) [![Build and Release](https://github.com/crisp-oss/email-reply-parser/workflows/Build%20and%20Release/badge.svg)](https://github.com/crisp-oss/email-reply-parser/actions?query=workflow%3A%22Build+and+Release%22) [![NPM](https://img.shields.io/npm/v/email-reply-parser.svg)](https://www.npmjs.com/package/email-reply-parser) [![Downloads](https://img.shields.io/npm/dt/email-reply-parser.svg)](https://www.npmjs.com/package/email-reply-parser)

**Email Reply Parser is a node library to parse plain-text email replies and extract content**

This library supports most email replies, signatures and locales.

**😘 Maintainer**: [@baptistejamin](https://github.com/baptistejamin)

## Who uses it?

<table>
<tr>
<td align="center"><a href="https://crisp.chat/"><img src="https://crisp.chat/favicons/favicon-256x256.png" height="64" /></a></td>
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

## RE2 Support

This library uses the [RE2](https://github.com/uhop/node-re2) regex engine when available for better performance and [ReDoS](https://en.wikipedia.org/wiki/ReDoS) protection. It automatically falls back to native JavaScript `RegExp` if RE2 is unavailable or fails to load.

RE2 is an optional dependency installed by default. If you encounter native compilation issues or want to exclude it:

```bash
npm uninstall re2
```

After a Node.js upgrade, you may need to rebuild RE2:

```bash
npm rebuild re2
```

## Features

This library is used at [Crisp](https://crisp.chat/) everyday with around 1 million inbound emails. Over the years, we improved this library so it can work with most emails.

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

### Example

``` javascript
var EmailReplyParser = require("email-reply-parser");

var emailContent = `Hi there,

I appreciate your help with this issue.

Best regards,
John

On Dec 16, 2024, at 12:47 PM, Support <support@example.com> wrote:

> How can we help you today?
> 
> Thanks,
> Support Team`;

var email = new EmailReplyParser().read(emailContent);

console.log(email.getVisibleText());
// Output: "Hi there,\n\nI appreciate your help with this issue."
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

email-reply-parser is released under the MIT License. See the bundled LICENSE file for details.

