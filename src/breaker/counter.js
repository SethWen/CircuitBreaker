/**
 * author: Shawn
 * time  : 11/12/18 8:15 PM
 * desc  :
 * update: Shawn 11/12/18 8:15 PM
 */

class Counter {
    constructor(num) {
        this.num = 0;
    }

    get() {
        return this.num;
    }

    increase() {
        this.num += 1;
    }

    reset() {
        this.num = 0;
    }
}

module.exports = {
    Counter: Counter,
};