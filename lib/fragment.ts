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
   * Check if the fragment is hidden
   */
  public isHidden(): boolean {
    return this._isHidden;
  }

  /**
   * Check if the fragment is a signature
   */
  public isSignature(): boolean {
    return this._isSignature;
  }

  /**
   * Check if the fragment is quoted
   */
  public isQuoted(): boolean {
    return this._isQuoted;
  }

  /**
   * Get the content of the fragment
   */
  public getContent(): string {
    return this._content;
  }

  /**
   * Check if the fragment is empty
   */
  isEmpty() {
    return "" === this.getContent().replace(EMPTY_REGEX, "");
  }

  /**
   * Get the string representation of the fragment
   */
  toString(): string {
    return this.getContent();
  }
}

export default Fragment;
