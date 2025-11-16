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
   * Read
   */
  public read(text: string) {
    return new EmailParser().parse(text);
  }

  /**
   * Parse Reply
   */
  public parseReply(text: string) {
    return this.read(text).getVisibleText();
  }

  /**
   * Parse Replied
   */
  public parseReplied(text: string) {
    return this.read(text).getQuotedText();
  }
}

export default EmailReplyParser;
