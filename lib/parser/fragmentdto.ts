/*
 * This file is part of email-reply-parser
 *
 * Copyright (c) 2025 Crisp IM SAS
 * All rights belong to Crisp IM SAS
 */

/**
 * FragmentDTO
 */
class FragmentDTO {
  lines: string[];
  isHidden: boolean;
  isSignature: boolean;
  isQuoted: boolean;

  /**
   * Constructor
   */
  constructor() {
    this.lines = [];
    this.isHidden = false;
    this.isSignature = false;
    this.isQuoted = false;
  }
}

export default FragmentDTO;
