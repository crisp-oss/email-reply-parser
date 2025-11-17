/*
 * email-reply-parser
 *
 * Copyright 2025, Mirage AI
 * Author: Baptiste Jamin <baptiste@jam.in>
 */

/**************************************************************************
 * IMPORTS
 ***************************************************************************/

// PROJECT: LIB
import EmailParser from "./parser/emailparser.js";

/**
 * EmailReplyParser
 */
class EmailReplyParser {
  /**
   * Parse an email
   */
  public read(text: string) {
    return new EmailParser().parse(text);
  }

  /**
   * Parse a reply
   */
  public parseReply(text: string) {
    return this.read(text).getVisibleText();
  }

  /**
   * Parse a replied email
   */
  public parseReplied(text: string) {
    return this.read(text).getQuotedText();
  }
}

export default EmailReplyParser;
