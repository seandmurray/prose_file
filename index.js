/* jshint esversion: 6 */
// Copyright (c) 2019 Seán D. Murray
// SEE MIT LICENSE FILE
const fs = require('fs');
const os = require('os');
const path = require('path');
const uuid = require('uuid');

const os_util = require('prose_os');
const string_util = require('prose_string');

exports.content_type = require('./lib/content_type');

exports.StreamReadLines = require('./lib/StreamReadLines');

exports.FILE_EXT_SEPERATOR = exports.content_type.FILE_EXT_SEPERATOR;
exports.EXT_TMP = exports.FILE_EXT_SEPERATOR + 'tmp';

const tmpFilesToCleanup = [];

// Deletes temp files
const exitHandler = () => {
	for (const tmpfile of tmpFilesToCleanup) {
		try {
			if (fs.existsSync(tmpfile)) {
				fs.unlinkSync(tmpfile);
			}
		}
		catch (e) { /*ignore*/ }
	}
};
// Set above handler to run when program terminates.
os_util.exitHandlers(exitHandler);

exports.exists(filePath) {
	return fs.existsSync(filePath);
}

exports.notExists(filePath) {
	return exports.exists(filePath) ? false : true;
}

// Get a temp file, write an empty string to it to make sure writes work.
exports.temp = (postfix = exports.EXT_TMP, prefix = string_util.BLANK_STRING) => {
	const result = path.join(os.tmpdir(), prefix + uuid() + postfix);
	tmpFilesToCleanup.push(result);
	fs.writeFileSync(result, string_util.BLANK_STRING, (e) => { if (e) throw e; });
	return result;
};
