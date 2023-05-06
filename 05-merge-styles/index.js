const fs = require('fs');
const path = require('path');

const stylesFolderPath = path.join(__dirname, 'styles');
const distFolderPath = path.join(__dirname, 'project-dist');
const outputFile = 'bundle.css';

async function readFilesFromDirectory(directoryPath) {
  return await fs.promises.readdir(directoryPath);
}

async function readFileContents(filePath) {
  return await fs.promises.readFile(filePath, 'utf-8');
}

async function writeToFile(filePath, contents) {
  return await fs.promises.writeFile(filePath, contents);
}

async function main() {
  try {
    const files = await readFilesFromDirectory(stylesFolderPath);

    const cssFiles = files.filter(file => path.extname(file) === '.css');

    const cssContents = await Promise.all(
      cssFiles.map(file => readFileContents(path.join(stylesFolderPath, file)))
    );

    const outputPath = path.join(distFolderPath, outputFile);
    await writeToFile(outputPath, cssContents.join('\n'));

    console.log(`Successfully created ${outputFile} in ${distFolderPath}`);
  } catch (error) {
    console.error(error);
  }
}

main();
