/**
 * author: Shawn
 * time  : 2017/10/16 14:24
 * desc  : I/O 工具集
 * update: Shawn 2017/10/16 14:24
 */

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const logger = require('./logger');


const ioUtil = {};

ioUtil.makeDir = function (dirName) {
    if (!path.isAbsolute(dirName)) dirName = path.join(process.cwd(), dirName);
    dirName = path.normalize(dirName);
    if (fs.existsSync(dirName)) {
        let stat = fs.statSync(dirName);
        if (stat.isFile()) {
            throw new Error(`There is a file named ${dirName}`);
        } else {
            logger.info(`${dirName} directory exists, do not need create it`);
        }

    } else {
        fs.mkdirSync(dirName);
        logger.info(`${dirName} directory has been created`);
    }
    return dirName;
};

ioUtil.str2GzBuffer = function (str) {
    try {
        return zlib.deflateSync(str);
    } catch (error) {
        logger.error(`str2GzBuffer --> Error: ${error}`);
    }
    return null;
};

ioUtil.gzBuffer2Str = function (buffer) {
    try {
        return zlib.inflateSync(buffer).toString();
    } catch (error) {
        logger.error(`gzBuffer2Str --> Error: ${error}`);
    }
};

ioUtil.readFile = async function (fileName, encoding = 'utf8') {
    let readStream = fs.createReadStream(fileName);
    readStream.setEncoding(encoding);

    return new Promise((resolve, reject) => {
        readStream.on('error', function (error) {
            logger.error(`readFile --> Error: ${error}`);
            reject(error);
        });

        readStream.on('data', function (data) {
            // console.log(data);
            resolve(data);
        })
    })
    // readStream.on('end', function () {
    //     console.log('the end');
    // });
};

/**
 * 写文件
 *
 * @param fileName
 * @param encoding
 * @param buffer
 */
ioUtil.writeFile = function (fileName, encoding, buffer) {
    let writeStream = fs.createWriteStream(fileName);
    writeStream.write(buffer, encoding);
    writeStream.end();
    writeStream.on('finish', function () {
        logger.info(`writeFile --> finish write ${fileName}`);
    });

    writeStream.on('error', function (error) {
        logger.error(`writeFile --> Error: ${error}`);
    });
}


module.exports = ioUtil;