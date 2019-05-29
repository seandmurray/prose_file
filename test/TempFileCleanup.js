const file_util = require('../index');
const postfix = '.file_util_test';
const max = 3;
for (let i = 0; i < max; i++) {
  file_util.temp(postfix);
}
