# Prose/File

Copyright (c) 2019 Seán D. Murray
SEE MIT LICENSE FILE

A file Utiliy. Make writing node easier, prettier and less error prone. Writes and reads more like prose

## Usage

```javascript
const file_util = require('prose_file');

// The .xxx is an optional postfix, if not present will be '.tmp'.
// An optional prefix can be added too, if not present, no prefix is used.
// File is created in the OS default temperary directory.
// The file will be deleted if it exists when the program EXITS!
file_util.temp('.xxx', 'someOptionalPrefix');

```
