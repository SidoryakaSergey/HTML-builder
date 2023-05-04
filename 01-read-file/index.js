
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'text.txt');
const readStream = fs.createReadStream(filePath);
readStream.on('data', function(chunk) {
  console.log(chunk.toString());
});

readStream.on('error', function(err) {
  console.log(err);
});