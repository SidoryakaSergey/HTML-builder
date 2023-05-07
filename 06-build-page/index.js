const fs = require('fs').promises;
const path = require('path');

async function deleteDir(dirPath) {
  try {
    const files = await fs.readdir(dirPath);
    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const stat = await fs.stat(filePath);
      if (stat.isDirectory()) {
        await deleteDir(filePath);
      } else {
        await fs.unlink(filePath);
      }
    }
    await fs.rmdir(dirPath);
  } catch (error) {
    console.error(`Ошибка при удалении папки ${dirPath}: ${error.message}`);
    throw error;
  }
}

async function copyDir(sourceDir, destDir) {
  try {
    await fs.access(destDir);
    await deleteDir(destDir);
  } catch (error) {
    // если папка не существует, то ошибки не будет
  }
  await fs.mkdir(destDir);

  const components = {};
  const styles = [];

  // копируем assets
  const assetsSourceDir = path.join(sourceDir, 'assets');
  const assetsDestDir = path.join(destDir, 'assets');
  await fs.mkdir(assetsDestDir);
  await copyDirRecursive(assetsSourceDir, assetsDestDir);

  // читаем исходный файл
  const templateFilePath = path.join(sourceDir, 'template.html');
  const templateContent = await fs.readFile(templateFilePath, 'utf-8');

  // собираем компоненты и стили
  const componentsSourceDir = path.join(sourceDir, 'components');
  const componentsFiles = await fs.readdir(componentsSourceDir);
  for (const componentFile of componentsFiles) {
    const componentName = path.parse(componentFile).name;
    const componentFilePath = path.join(componentsSourceDir, componentFile);
    const componentContent = await fs.readFile(componentFilePath, 'utf-8');
    components[componentName] = componentContent;
  }
  const stylesSourceDir = path.join(sourceDir, 'styles');
  const stylesFiles = await fs.readdir(stylesSourceDir);
  for (const styleFile of stylesFiles) {
    const styleFilePath = path.join(stylesSourceDir, styleFile);
    const styleContent = await fs.readFile(styleFilePath, 'utf-8');
    styles.push(styleContent);
  }

  // заменяем шаблонные теги на содержимое компонентов
  let indexHtml = templateContent;
  for (const componentName in components) {
    const componentContent = components[componentName];
    const tag = `{{${componentName}}}`;
    indexHtml = indexHtml.replace(new RegExp(tag, 'g'), componentContent);
  }

  // сохраняем index.html
  const indexHtmlFilePath = path.join(destDir, 'index.html');
  await fs.writeFile(indexHtmlFilePath, indexHtml);

  // сохраняем стили
  const stylesFilePath = path.join(destDir, 'style.css');
  await fs.writeFile(stylesFilePath, styles.join('\n'));
}

async function copyDirRecursive(sourceDir, destDir) {
  try {
    await fs.access(destDir);
  } catch (error) {
    await fs.mkdir(destDir);
  }

  const files = await fs.readdir(sourceDir);
  for (const file of files) {
    const sourceFilePath = path.join(sourceDir, file);
    const destFilePath = path.join(destDir, file);
    const stat = await fs.stat(sourceFilePath);
    if (stat.isDirectory()) {
      await copyDir(sourceFilePath, destFilePath);
    } else {
      await fs.copyFile(sourceFilePath, destFilePath);
    }
  }
}
