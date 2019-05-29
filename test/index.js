const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const stream = require("stream");

const object_util = require('prose_object');
const os_util = require('prose_os');
const string_util = require('prose_string');

const file_util = require('../index');

const aPrefix = 'aPrefix';
const aPostfix = 'aPostfix';
const pathPrefix = path.join(os.tmpdir(), aPrefix);
const tmpTxtFile = file_util.temp('.hTml');

// content_type.fromData
assert.equal(file_util.content_type.fromData(), undefined, 'Undefined gets undefined');
assert.equal(file_util.content_type.fromData(undefined), undefined, 'Undefined gets undefined');
assert.equal(file_util.content_type.fromData(null), undefined, 'Null gets null');
assert.equal(file_util.content_type.fromData(''), undefined, 'Empty string gets undefined');
assert.equal(file_util.content_type.fromData('', 'default'), 'default', 'Empty string gets default');
assert.equal(file_util.content_type.fromData('		{}'), file_util.content_type.JSON, 'Get the correct type');
assert.equal(file_util.content_type.fromData('<?xml'), file_util.content_type.XML, 'Get the correct type');
assert.equal(file_util.content_type.fromData(' <html>'), file_util.content_type.HTML, 'Get the correct type');
assert.equal(file_util.content_type.fromData(tmpTxtFile), file_util.content_type.HTML, 'Get the correct type');
console.log('contentType fromData testing success');

// content_type.fromFilePath
assert.equal(file_util.content_type.fromFilePath(), undefined, 'Undefined gets undefined');
assert.equal(file_util.content_type.fromFilePath(undefined), undefined, 'Undefined gets undefined');
assert.equal(file_util.content_type.fromFilePath(null), undefined, 'Null gets null');
assert.equal(file_util.content_type.fromFilePath(''), undefined, 'Empty string gets undefined');
assert.equal(file_util.content_type.fromFilePath('', 'default'), 'default', 'Empty string gets default');
assert.equal(file_util.content_type.fromFilePath('test.hTml'), file_util.content_type.HTML, 'Get the correct type');
assert.equal(file_util.content_type.fromFilePath('.htMl'), file_util.content_type.HTML, 'Get the correct type');
assert.equal(file_util.content_type.fromFilePath('htmL'), file_util.content_type.HTML, 'Get the correct type');
assert.equal(file_util.content_type.fromFilePath('test.jS'), file_util.content_type.JAVASCRIPT, 'Get the correct type');
assert.equal(file_util.content_type.fromFilePath('test.jsOn'), file_util.content_type.JSON, 'Get the correct type');
assert.equal(file_util.content_type.fromFilePath('test.txt'), file_util.content_type.TEXT, 'Get the correct type');
assert.equal(file_util.content_type.fromFilePath('test.xml'), file_util.content_type.XML, 'Get the correct type');
console.log('contentType fromFilePath testing success');

// test temp file creation
assert.equal(string_util.notBlank(file_util.temp()), true, 'Not a blank filename');
assert.equal(file_util.temp(aPostfix, aPrefix).startsWith(pathPrefix), true, 'Has a prefix!');
assert.equal(file_util.temp(aPostfix).endsWith(aPostfix), true, 'Has a postfix!');
os_util.systemSync('node ./test/TempFileCleanup.js');
fs.readdir(os.tmpdir(), (err, files) => {
		if (err) {
				console.log(err.stack);
				return;
		}
		files.forEach((file) => {
				if (file.endsWith('.file_util_test')) assert.fail('Should not find any files like this?');
		});
});
console.log('temp testing success');

// test read file stream
const streamReadLines = new file_util.StreamReadLines();
const testData = ['one', 'two', 'three'];
const result = [];
class TestWritable extends stream.Writable {
	constructor(options){
		super(options)
	}
	
	_write(chunk, encoding, callback){
		result.push(chunk.toString());
		callback();
	}

}
const testWritable = new TestWritable();
const tmpFile = file_util.temp();
fs.writeFileSync(tmpFile, testData.join("\n"));
const fileStream =  fs.createReadStream(tmpFile);
fileStream
	.pipe(streamReadLines)
	.pipe(testWritable);

streamReadLines.on("error",(err)=>{
  assert.fail(err);
});

testWritable.on("finish",()=>{
	assert.equal(object_util.equal(result, testData), true, 'Check if test data matches in content and order');
	console.log('StreamReadLines testing success');
	console.log('prose_file done');
});
