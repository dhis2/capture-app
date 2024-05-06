const fs = require('fs');
const path = require('path');

const getAllFiles = (dirPath, arrayOfFiles = []) => {
    const files = fs.readdirSync(dirPath);

    files.forEach((file) => {
        if (fs.statSync(path.join(dirPath, file)).isDirectory()) {
            arrayOfFiles = getAllFiles(path.join(dirPath, file), arrayOfFiles);
        } else if (path.extname(file) === '.feature') {
            arrayOfFiles.push(path.join(dirPath, file));
        }
    });

    return arrayOfFiles;
};

const cypressSpecsPath = './cypress/e2e';
const specs = getAllFiles(cypressSpecsPath);

console.log(JSON.stringify(specs));
