/* jshint esversion: 6 */
// Copyright (c) 2019 Seán D. Murray
// SEE MIT LICENSE FILE
const stream = require("stream");

const isit = require("prose_isit");

const DEFAULT_LINE_REGEX = /[\n\r]/

module.exports = class extends stream.Transform {
	/*
  options can be:
	 Local options:
		- lineRegex: defaults to /[\n\r]/. Better know what your doing if you change it.
	 Parent options:
    - decodeStrings: If you want strings to be buffered (Default: true)
    - highWaterMark: Memory for internal buffer of stream (Default: 16kb)
    - objectMode: Streams convert your data into binary, you can opt out of by setting this to true (Default: false)
	*/
  constructor (options){
    super(options);
		this._lineRegex = (isit.notNil(options) && isit.notNil(options.lineRegex)) ? options.lineRegex : DEFAULT_LINE_REGEX;
		this._last = null;
  }
  
  _transform (chunk, encoding, callback){
		const data = chunk.toString();
		if (isit.notNil(this._last)) {
			data = this._last + data;
			this._last = null;
		}
		const lines = data.split(this._lineRegex);
		if (lines.length > 1) {
			this._last = lines.pop();
			for(const line of lines) {
				this.push(line);
			}
		} else {
			this._last = splitIntoJustLastLine(lines);
		}
		callback()
  }

	_flush (callback) {
		if (isit.notNil(this._last)) {
			this.push(this._last);
			this._last = null;
		}
		if (isit.notNil(callback)) {
			callback();
		}
	}
}
