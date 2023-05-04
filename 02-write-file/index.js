const fs = require('fs/promises');
const path = require('path');
const filePath = path.join(__dirname, 'text.txt');
const { stdin, stdout } = process;

console.log('Введите текст или наберите exit для завершения');

stdin.on('data', async input => {
  const text = input.toString().trim();
  if (text === 'exit') {
    console.log('Удачи в учёбе!');
    process.exit(0);
  }
  try {
    await fs.appendFile(filePath, text + '\n');
    console.log('Текст записан в файл');
  } catch (err) {
    console.error('Произошла ошибка при записи в файл:', err);
  }
  stdout.write('Введите текст или наберите exit для завершения\n');
});

fs.access(filePath)
  .catch(() => fs.writeFile(filePath, ''))
  .catch(err => console.error('Произошла ошибка при создании файла:', err));
