const fs = require('fs');
const path = require('path');

const dirPath = path.join(__dirname, 'secret-folder');

fs.readdir(dirPath, (err, files) => {
  if (err) {
    throw err;
  }
  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    fs.stat(filePath, (err, stats) => {
      if (err) {
        throw err;
      }
      if (stats.isFile()) {
        const name = file.substring(0, file.lastIndexOf('.'));
        const ext = path.extname(file).substring(1);
        const size = stats.size / 1024;
        console.log(`${name} - ${ext} - ${size}kb`);
      }
    });
  });
});
