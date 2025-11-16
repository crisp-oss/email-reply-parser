/*
 * email-reply-parser
 *
 * Copyright 2025, Mirage AI
 * Author: Baptiste Jamin <baptiste@jam.in>
 */

const EMPTY_REGEX = /\n/g;

/**
 * Fragment
 */
class Fragment {
  private _content: string;
  private _isHidden: boolean;
  private _isSignature: boolean;
  private _isQuoted: boolean;

  /**
   * Constructor
   */
  constructor(content: string, isHidden: boolean, isSignature: boolean, isQuoted: boolean) {
    this._content = content;
    this._isHidden = isHidden;
    this._isSignature = isSignature;
    this._isQuoted = isQuoted;
  }

  /**
   * isHidden
   */
  public isHidden(): boolean {
    return this._isHidden;
  }

  /**
   * isSignature
   */
  public isSignature(): boolean {
    return this._isSignature;
  }

  /**
   * isQuoted
   */
  public isQuoted(): boolean {
    return this._isQuoted;
  }

  /**
   * getContent
   */
  public getContent(): string {
    return this._content;
  }

  /**
   * isEmpty
   */
  isEmpty() {
    return "" === this.getContent().replace(EMPTY_REGEX, "");
  }

  /**
   * toString
   */
  toString(): string {
    return this.getContent();
  }
}

export default Fragment;
