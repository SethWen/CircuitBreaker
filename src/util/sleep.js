/**
 * author: Shawn
 * time  : 8/28/18 11:39 PM
 * desc  :
 * update: Shawn 8/28/18 11:39 PM
 */


function sleep(milliseconds) {
    return new Promise((resolve) => {
        setTimeout(() => resolve(), milliseconds);
    })
}

module.exports = sleep;
