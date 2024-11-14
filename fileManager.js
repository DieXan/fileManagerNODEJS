const fs = require('fs').promises;
const path = require('path');

class FileManager {
    constructor(basePath) {
        this.basePath = basePath;
    }

    async listFiles(dirPath = '.') {
        const fullPath = path.isAbsolute(dirPath) ? dirPath : path.join(this.basePath, dirPath);
        try {
            const files = await fs.readdir(fullPath, { withFileTypes: true });
            return files.map(file => ({
                name: file.name,
                isDirectory: file.isDirectory()
            }));
        } catch (error) {
            console.error('Error listing files:', error);
            throw error;
        }
    }

    async readFile(filePath) {
        const fullPath = path.isAbsolute(filePath) ? filePath : path.join(this.basePath, filePath);
        try {
            const data = await fs.readFile(fullPath, 'utf-8');
            return data;
        } catch (error) {
            console.error('Error reading file:', error);
            throw error;
        }
    }

    async writeFile(filePath, content) {
        const fullPath = path.isAbsolute(filePath) ? filePath : path.join(this.basePath, filePath);
        try {
            await fs.writeFile(fullPath, content);
        } catch (error) {
            console.error('Error writing file:', error);
            throw error;
        }
    }

    async deleteFile(filePath) {
        const fullPath = path.isAbsolute(filePath) ? filePath : path.join(this.basePath, filePath);
        try {
            await fs.unlink(fullPath);
        } catch (error) {
            console.error('Error deleting file:', error);
            throw error;
        }
    }

    async createDirectory(dirPath) {
        const fullPath = path.isAbsolute(dirPath) ? dirPath : path.join(this.basePath, dirPath);
        try {
            await fs.mkdir(fullPath, { recursive: true });
        } catch (error) {
            console.error('Error creating directory:', error);
            throw error;
        }
    }

    async deleteDirectory(dirPath) {
        const fullPath = path.isAbsolute(dirPath) ? dirPath : path.join(this.basePath, dirPath);
        try {
            await fs.rmdir(fullPath, { recursive: true });
        } catch (error) {
            console.error('Error deleting directory:', error);
            throw error;
        }
    }

    async rename(oldPath, newPath) {
        const fullOldPath = path.isAbsolute(oldPath) ? oldPath : path.join(this.basePath, oldPath);
        const fullNewPath = path.isAbsolute(newPath) ? newPath : path.join(this.basePath, newPath);
        try {
            await fs.rename(fullOldPath, fullNewPath);
        } catch (error) {
            console.error('Error renaming:', error);
            throw error;
        }
    }
}

module.exports = FileManager;