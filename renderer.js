document.addEventListener('DOMContentLoaded', () => {
    const fileList = document.getElementById('file-list');
    const output = document.getElementById('output').querySelector('pre');
    const currentPathDisplay = document.getElementById('current-path');
    const backButton = document.getElementById('back-button');
    let currentPath = '.';
    let pathHistory = [];

    async function loadDirectory(path) {
        currentPath = path;
        pathHistory.push(path);
        updatePathDisplay();
        fileList.innerHTML = '';
        backButton.disabled = pathHistory.length <= 1;

        try {
            const result = await sendCommand('list', path);
            result.forEach(item => {
                const element = document.createElement('div');
                element.className = item.isDirectory ? 'directory' : 'file';
                element.textContent = item.name;

                // if (!item.isDirectory) {
                //     const fileSize = document.createElement('span');
                //     fileSize.textContent = ` (${formatFileSize(item.size)})`;
                //     element.appendChild(fileSize);
                // }

                element.addEventListener('click', async () => {
                    if (item.isDirectory) {
                        loadDirectory(path === '.' ? item.name : path + '/' + item.name);
                    } else {
                        const content = await sendCommand('read', path === '.' ? item.name : path + '/' + item.name);
                        output.textContent = `Содержимое файла ${item.name}:\n${content}`;
                    }
                });

                fileList.appendChild(element);
            });
        } catch (error) {
            output.textContent = `Ошибка: ${error.message}`;
        }
    }

    function updatePathDisplay() {
        currentPathDisplay.textContent = `Текущий путь: ${currentPath}`;
    }

    // function formatFileSize(bytes) {
    //     if (bytes === 0) return '0 Bytes';
    //     const k = 1024;
    //     const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    //     const i = Math.floor(Math.log(bytes) / Math.log(k));
    //     return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    // }

    backButton.addEventListener('click', () => {
        if (pathHistory.length > 1) {
            pathHistory.pop();
            const previousPath = pathHistory[pathHistory.length - 1];
            loadDirectory(previousPath);
        }
    });

    loadDirectory(currentPath);

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
});