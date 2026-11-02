'use strict';
const fs = require('node:fs');
const files = ['index.html', 'script.js', 'style.css'];
const paths = new Set();
for (const filename of files) {
  const contents = fs.readFileSync(filename, 'utf8');
  for (const match of contents.matchAll(/assets\/[a-z0-9._-]+/gi)) paths.add(match[0]);
}
const missing = [...paths].filter(path => !fs.existsSync(path));
if (missing.length) {
  console.error('Missing website assets:\n' + missing.map(s => '  - ' + s).join('\n'));
  process.exit(1);
}
console.log('PASS: all ' + paths.size + ' referenced website assets are present');
