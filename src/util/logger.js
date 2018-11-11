/**
 * author: Shawn
 * time  : 8/29/18 9:56 AM
 * desc  :
 * update: Shawn 8/29/18 9:56 AM
 */


// const config = require('config');
// const Logger = require('bunyan');
const process = require('process');
const color = require('bash-color');
const fs = require('fs');
const path = require('path');


function _makeDir(dirName) {
    if (!path.isAbsolute(dirName)) dirName = path.join(process.cwd(), dirName);
    dirName = path.normalize(dirName);
    if (fs.existsSync(dirName)) {
        let stat = fs.statSync(dirName);
        if (stat.isFile()) {
            throw new Error(`There is a file named ${dirName}`);
        } else {
            console.log(`${dirName} directory exists, do not need create it`);
        }

    } else {
        fs.mkdirSync(dirName);
        console.log(`${dirName} directory has been created`);
    }
    return dirName;
}


function _getLogger() {
    const logs = config.get("logs");
    for (let log of logs) {
        if (log.output === 'stdout') {
            log.stream = process.stdout;
        } else if (log.output === 'stderr') {
            log.stream = process.stderr;
        } else {
            log.path = _makeDir(log.output);
            if (process.env.name) {
                log.path = path.join(log.path, process.env.name);
            } else {
                log.path = path.join(log.path, 'torres');
            }

            log.path += '.log';
            log.type = 'rotating-file';
        }
    }

    return new Logger({
        name: process.env.name ? process.env.name : "torres",
        streams: logs,
        src: process.env.NODE_ENV === 'production',
    });
}

function _getConsoleLogger() {
    this.level = 80;

    this.debug = (content) => {
        if (this.level >= 80) console.log(color.cyan(`[debug] ${content}`));
    };
    this.info = (content) => {
        if (this.level >= 60) console.log(color.blue(`[ info] ${content}`));
    };
    this.warn = (content) => {
        if (this.level >= 40) console.log(color.purple(`[ warn] ${content}`));
    };

    this.error = (content) => {
        if (this.level >= 20) console.log(color.red(`[error] ${content}`));
    };

    return this;
}


module.exports = _getConsoleLogger();
