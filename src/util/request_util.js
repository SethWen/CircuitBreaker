/**
 * author: Shawn
 * time  : 18-5-4 下午3:52
 * desc  : request 封装
 * update: Shawn 18-5-4 下午3:52
 */

const request = require('request');

function sleep(ms) {
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve(), ms);
    })
}


async function requestSync(options) {
    return new Promise((resolve, reject) => {
        request(options, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                resolve([error, response, body]);
            } else {
                resolve([error, response, null]);
            }
        });
    });
}


async function requestWithRetrySync(options, retryTimes = 3) {
    for (let i = 1; i <= retryTimes; i++) {
        let [error, response, body] = await requestSync(options);
        if (!error && response.statusCode === 200) {
            return [error, response, body];
        } else {
            if (i === retryTimes) {
                return [error, response, body]
            }
        }
        await sleep(100);
    }
    return new Error("Unknown");
}


async function getWithRetrySync(options, retryTimes = 3) {
    options.method = 'GET';
    return requestWithRetrySync(options, retryTimes);
}

async function postWithRetrySync(options, retryTimes = 3) {
    options.method = 'post';
    return requestWithRetrySync(options, retryTimes);
}


module.exports = {
    requestSync: requestSync,
    requestWithRetrySync: requestWithRetrySync,
    getWithRetrySync: getWithRetrySync,
    postWithRetrySync: postWithRetrySync,
};