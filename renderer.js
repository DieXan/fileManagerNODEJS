document.getElementById('execute').addEventListener('click', async () => {
    const commandInput = document.getElementById('command');
    const command = commandInput.value.trim();
    const output = document.getElementById('output').querySelector('pre');

    // Очистка предыдущего вывода
    output.textContent = '';

    // Разделение команды на имя и аргументы
    const [commandName, ...args] = command.split(' ');

    try {
        let result;
        switch (commandName.toLowerCase()) {
            case 'list':
                const dirPath = args[0] || '.';
                result = await sendCommand('list', dirPath);
                output.textContent = `Файлы в директории ${dirPath}:\n${JSON.stringify(result, null, 2)}`;
                break;
            case 'read':
                const filePath = args[0];
                if (!filePath) throw new Error('Не указан путь к файлу');
                result = await sendCommand('read', filePath);
                output.textContent = `Содержимое файла ${filePath}:\n${result}`;
                break;
            case 'write':
                const writeFilePath = args[0];
                const content = args.slice(1).join(' ');
                if (!writeFilePath || !content) throw new Error('Не указан путь к файлу или содержимое');
                await sendCommand('write', writeFilePath, content);
                output.textContent = `Файл ${writeFilePath} успешно записан`;
                break;
            case 'delete':
                const deleteFilePath = args[0];
                if (!deleteFilePath) throw new Error('Не указан путь к файлу');
                await sendCommand('delete', deleteFilePath);
                output.textContent = `Файл ${deleteFilePath} успешно удален`;
                break;
            case 'createdir':
                const dirName = args[0];
                if (!dirName) throw new Error('Не указано имя директории');
                await sendCommand('createDir', dirName);
                output.textContent = `Директория ${dirName} успешно создана`;
                break;
            case 'deletedir':
                const deleteDirName = args[0];
                if (!deleteDirName) throw new Error('Не указано имя директории');
                await sendCommand('deleteDir', deleteDirName);
                output.textContent = `Директория ${deleteDirName} успешно удалена`;
                break;
            case 'rename':
                const oldPath = args[0];
                const newPath = args[1];
                if (!oldPath || !newPath) throw new Error('Не указаны старый и новый пути');
                await sendCommand('rename', oldPath, newPath);
                output.textContent = `Переименование успешно выполнено`;
                break;
            case 'exit':
                electron.send('exit');
                break;
            default:
                throw new Error('Неизвестная команда');
        }
    } catch (error) {
        output.textContent = `Ошибка: ${error.message}`;
    }

    // Очистка поля ввода команды
    commandInput.value = '';
});

async function sendCommand(command, ...args) {
    return new Promise((resolve, reject) => {
        electron.send(command, ...args);
        electron.receive('response', (response) => {
            if (response.error) {
                reject(new Error(response.error));
            } else {
                resolve(response.data);
            }
        });
    });
}