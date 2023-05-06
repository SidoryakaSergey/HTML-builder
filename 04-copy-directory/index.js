const fs = require('fs');
const path = require('path');

const sourseDir = path.join(__dirname, 'files');
const destinationDir = path.join(__dirname, 'files-copy');

const copyFiles = async (sourceDir, destDir) => {
  try {
    if (fs.existsSync(destDir)) {
      await deleteFolderRecursive(destDir);
    }
    await fs.promises.mkdir(destDir, { recursive: true });

    const files = await fs.promises.readdir(sourceDir);
    for (const file of files) {
      const sourcePath = path.join(sourceDir, file);
      const destPath = path.join(destDir, file);

      const stats = await fs.promises.stat(sourcePath);
      if (stats.isDirectory()) {
        await copyFiles(sourcePath, destPath);
      } else {
        await fs.promises.copyFile(sourcePath, destPath);
      }
    }

    console.log('Все файлы успешно скопированы');
  } catch (error) {
    console.error(`Ошибка: ${error.message}`);
  }
};

const deleteFolderRecursive = async folderPath => {
  const files = await fs.promises.readdir(folderPath);
  for (const file of files) {
    const filePath = path.join(folderPath, file);
    const stats = await fs.promises.stat(filePath);
    if (stats.isDirectory()) {
      await deleteFolderRecursive(filePath);
    } else {
      await fs.promises.unlink(filePath);
    }
  }
  await fs.promises.rmdir(folderPath);
};

copyFiles(sourseDir, destinationDir);
