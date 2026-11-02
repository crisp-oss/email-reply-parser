/*
 * This file is part of email-reply-parser
 *
 * Copyright (c) 2025 Crisp IM SAS
 * All rights belong to Crisp IM SAS
 */

/**************************************************************************
 * IMPORTS
 ***************************************************************************/

// PROJECT: LIB
import EmailParser from "./parser/emailparser.js";
import type { ParseOptions } from "./parser/emailparser.js";

/**
 * EmailReplyParser
 */
class EmailReplyParser {
  /**
   * Parse an email
   */
  public read(text: string, options?: ParseOptions) {
    return new EmailParser().parse(text, options);
  }

  /**
   * Parse a reply
   */
  public parseReply(text: string, options?: ParseOptions) {
    return this.read(text, options).getVisibleText();
  }

  /**
   * Parse a replied email
   */
  public parseReplied(text: string, options?: ParseOptions) {
    return this.read(text, options).getQuotedText();
  }
}

export default EmailReplyParser;
