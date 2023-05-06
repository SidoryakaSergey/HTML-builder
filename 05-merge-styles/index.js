const fs = require('fs');
const path = require('path');

const sourseDir = path.join(__dirname, 'styles');
const destinationFile = path.join(__dirname, 'project-dist', 'bundle.css');

const filePicker = async sourceDir => {
  const arrStyles = [];
  try {
    const files = await fs.promises.readdir(sourceDir);
    for (const file of files) {
      const filePath = path.join(sourceDir, file);
      fs.stat(filePath, (err, stats) => {
        if (err) {
          throw err;
        }
        if (stats.isFile()) {
          const ext = path.extname(file).substring(1);
          if (ext === 'css') {
            console.log(filePath);
            const data = readData(filePath);
            arrStyles.push(data);
          }
        }
      });
    }
  } catch (error) {
    console.error(`Ошибка: ${error.message}`);
  }
};

const readData = async filename => {
  try {
    const data = await fs.promises.readFile(filename, 'utf8');
    // console.log(data);
  } catch (error) {
    console.error(`Ошибка: ${error.message}`);
  }
};

const writeData = async data => {
  try {
    newData = data.join('\n');
    await fs.promises.writeFile(destinationFile, newData);
    console.log('Данные записаны в файл');
  } catch (error) {
    console.error(`Ошибка: ${error.message}`);
  }
};

const arr = filePicker(sourseDir);

writeData(arr);
