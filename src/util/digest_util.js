/**
 * author: Shawn
 * time  : 2018/3/26 9:37
 * desc  :
 * update: Shawn 2018/3/26 9:37
 */


let crypto = require('crypto');


const digestUtil = {};


/**
 * 字符串转 MD5
 *
 * @param originStr
 * @returns {*}
 */
digestUtil.str2md5 = function str2md5(originStr) {
    return crypto.createHash('md5').update(originStr).digest('hex');
};


module.exports = digestUtil;
