const FileManager = require('./fileManager');
const readline = require('readline');

const basePath = './testDir'; // Укажите базовый путь для тестирования
const fileManager = new FileManager(basePath);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function promptUser() {
    rl.question('Enter command (list, read, write, delete, createDir, deleteDir, rename, exit): ', async (command) => {
        switch (command.toLowerCase()) {
            case 'list':
                const dirPath = await askQuestion('Enter directory path (default: .): ');
                try {
                    const files = await fileManager.listFiles(dirPath || '.');
                    console.log('Files in directory:', files);
                } catch (error) {
                    console.error('Error:', error);
                }
                break;
            case 'read':
                const filePath = await askQuestion('Enter file path: ');
                try {
                    const content = await fileManager.readFile(filePath);
                    console.log('File content:', content);
                } catch (error) {
                    console.error('Error:', error);
                }
                break;
            case 'write':
                const writeFilePath = await askQuestion('Enter file path: ');
                const content = await askQuestion('Enter content: ');
                try {
                    await fileManager.writeFile(writeFilePath, content);
                    console.log('File written successfully');
                } catch (error) {
                    console.error('Error:', error);
                }
                break;
            case 'delete':
                const deleteFilePath = await askQuestion('Enter file path: ');
                try {
                    await fileManager.deleteFile(deleteFilePath);
                    console.log('File deleted successfully');
                } catch (error) {
                    console.error('Error:', error);
                }
                break;
            case 'createdir':
                const dirName = await askQuestion('Enter directory name: ');
                try {
                    await fileManager.createDirectory(dirName);
                    console.log('Directory created successfully');
                } catch (error) {
                    console.error('Error:', error);
                }
                break;
            case 'deletedir':
                const deleteDirName = await askQuestion('Enter directory name: ');
                try {
                    await fileManager.deleteDirectory(deleteDirName);
                    console.log('Directory deleted successfully');
                } catch (error) {
                    console.error('Error:', error);
                }
                break;
            case 'rename':
                const oldPath = await askQuestion('Enter old path: ');
                const newPath = await askQuestion('Enter new path: ');
                try {
                    await fileManager.rename(oldPath, newPath);
                    console.log('Renamed successfully');
                } catch (error) {
                    console.error('Error:', error);
                }
                break;
            case 'exit':
                rl.close();
                return;
            default:
                console.log('Unknown command');
        }
        promptUser();
    });
}

function askQuestion(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

promptUser();