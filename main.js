const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const FileManager = require('./fileManager');

const basePath = 'C:/'; // Укажите базовый путь для тестирования
const fileManager = new FileManager(basePath);

function createWindow () {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true
        }
    });

    mainWindow.loadFile('index.html');
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});

// Обработка команд от рендерера
ipcMain.on('list', async (event, dirPath) => {
    try {
        const files = await fileManager.listFiles(dirPath);
        event.reply('response', { data: files });
    } catch (error) {
        event.reply('response', { error: error.message });
    }
});

ipcMain.on('read', async (event, filePath) => {
    try {
        const content = await fileManager.readFile(filePath);
        event.reply('response', { data: content });
    } catch (error) {
        event.reply('response', { error: error.message });
    }
});

ipcMain.on('write', async (event, filePath, content) => {
    try {
        await fileManager.writeFile(filePath, content);
        event.reply('response', { data: 'Файл успешно записан' });
    } catch (error) {
        event.reply('response', { error: error.message });
    }
});

ipcMain.on('delete', async (event, filePath) => {
    try {
        await fileManager.deleteFile(filePath);
        event.reply('response', { data: 'Файл успешно удален' });
    } catch (error) {
        event.reply('response', { error: error.message });
    }
});

ipcMain.on('createDir', async (event, dirName) => {
    try {
        await fileManager.createDirectory(dirName);
        event.reply('response', { data: 'Директория успешно создана' });
    } catch (error) {
        event.reply('response', { error: error.message });
    }
});

ipcMain.on('deleteDir', async (event, dirName) => {
    try {
        await fileManager.deleteDirectory(dirName);
        event.reply('response', { data: 'Директория успешно удалена' });
    } catch (error) {
        event.reply('response', { error: error.message });
    }
});

ipcMain.on('rename', async (event, oldPath, newPath) => {
    try {
        await fileManager.rename(oldPath, newPath);
        event.reply('response', { data: 'Переименование успешно выполнено' });
    } catch (error) {
        event.reply('response', { error: error.message });
    }
});

ipcMain.on('exit', () => {
    app.quit();
});