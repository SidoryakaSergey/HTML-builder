const fs = require('fs').promises;
const path = require('path');

async function copyDir() {
  const sourceDir = path.join(__dirname, 'files');
  const destinationDir = path.join(__dirname, 'files-copy');

  try {
    const destinationDirStats = await fs.stat(destinationDir);
    if (destinationDirStats.isDirectory()) {
      await removeDir(destinationDir);
    }
  } catch (error) {
    console.log('creating files-copy');
  }
  await fs.mkdir(destinationDir);
  const files = await fs.readdir(sourceDir);

  for (const file of files) {
    const sourcePath = path.join(sourceDir, file);
    const destinationPath = path.join(destinationDir, file);

    const stats = await fs.stat(sourcePath);

    if (stats.isDirectory()) {
      await copyDir(sourcePath, destinationPath);
    } else {
      await fs.copyFile(sourcePath, destinationPath);
    }
  }
}

async function removeDir(directory) {
  const files = await fs.readdir(directory);

  for (const file of files) {
    const filePath = path.join(directory, file);
    const stats = await fs.stat(filePath);
    if (stats.isDirectory()) {
      await removeDir(filePath);
    } else {
      await fs.unlink(filePath);
    }
  }
  await fs.rmdir(directory);
}

copyDir()
  .then(() => {
    console.log('Копирование завершено');
  })
  .catch(error => {
    console.error('Произошла ошибка при копировании', error);
  });
