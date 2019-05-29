/* jshint esversion: 6 */
// Copyright (c) 2019 Seán D. Murray
// SEE MIT LICENSE FILE

const path = require('path');

const isit = require('prose_isit');
const string_util = require('prose_string');

const content_mapping = require('./content_mapping');

exports.HTML = content_mapping['.html'];
exports.JAVASCRIPT = content_mapping['.js'];
exports.JSON = content_mapping['.json'];
exports.TEXT = content_mapping['.txt'];
exports.XML = content_mapping['.xml'];

exports.FILE_EXT_SEPERATOR = '.';

exports.fromData = (data, aDefault) => {
    if (isit.anObject(data)) return exports.JSON;
    if (isit.notString(data) || string_util.isBlank(data)) return aDefault;
    if (isit.aFile(data)) return exports.fromFilePath(data, aDefault);
    if (data.match(/^\s*\{/)) return exports.JSON;
    if (data.match(/^\s*<\?xml/i)) return exports.XML;
    if (data.match(/^\s*</)) return exports.HTML;
    return aDefault;
};

exports.fromFilePath = (filePath, aDefault) => {
    if (isit.notString(filePath) || string_util.isBlank(filePath)) return aDefault;
    let ext = path.extname(filePath);
    if (string_util.isBlank(ext)) ext = filePath;
    if (ext.indexOf(exports.FILE_EXT_SEPERATOR) < 0) ext = exports.FILE_EXT_SEPERATOR + ext;
    const mimetype = content_mapping[ext.toLowerCase()];
    if (string_util.notBlank(mimetype)) return mimetype;
    return aDefault;
};
