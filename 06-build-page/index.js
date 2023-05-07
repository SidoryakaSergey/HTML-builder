const fs = require('fs').promises;
const path = require('path');
const projectDir = path.join(__dirname, 'project-dist');
const templateHTML = path.join(__dirname, 'template.html');
const componentsDir = path.join(__dirname, 'components');
const assetsDirProject = path.join(projectDir, 'assets');
const assetsDir = path.join(__dirname, 'assets');
const stylesDir = path.join(__dirname, 'styles');
const styleCSS = path.join(projectDir, 'style.css');

async function copyDir(sourceDir, destDir) {
  await createDir(destDir);
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

async function concatStyles(sourceDir, outputFilePath) {
  const files = await fs.readdir(sourceDir);
  const cssFiles = files.filter(file => path.extname(file) === '.css');

  let output = '';
  for (const file of cssFiles) {
    const filePath = path.join(sourceDir, file);
    const contents = await fs.readFile(filePath, 'utf-8');
    output += contents + '\n';
  }
  await fs.writeFile(outputFilePath, output);
}

async function createDir(dir) {
  try {
    const destinationDirStats = await fs.stat(dir);
    if (destinationDirStats.isDirectory()) {
      await removeDir(dir);
    }
  } catch (error) {
    console.log(`creating ${dir}`);
  }
  await fs.mkdir(dir);
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

async function replaceTemplateTags(templatePath, componentsDir, destDir) {
  const template = await fs.readFile(templatePath, 'utf-8');
  const componentFiles = await fs.readdir(componentsDir);

  let result = template;
  for (const componentFile of componentFiles) {
    const ext = path.extname(componentFile);
    if (ext === '.html') {
      const componentName = path.parse(componentFile).name;
      const componentPath = path.join(componentsDir, componentFile);
      const component = await fs.readFile(componentPath, 'utf-8');
      const tag = `{{${componentName}}}`;
      result = result.replace(tag, component);
    }
  }

  const outputPath = path.join(destDir, 'index.html');
  await fs.writeFile(outputPath, result);
}

async function buildProject() {
  try {
    await createDir(projectDir);

    await replaceTemplateTags(templateHTML, componentsDir, projectDir);

    await concatStyles(stylesDir, styleCSS);

    await copyDir(assetsDir, assetsDirProject);

    console.log('Проект успешно собран!');
  } catch (error) {
    console.error('Произошла ошибка при сборке проекта', error);
  }
}

buildProject();
