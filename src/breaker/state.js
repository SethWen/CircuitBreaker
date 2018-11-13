/**
 * author: Shawn
 * time  : 11/12/18 8:14 PM
 * desc  :
 * update: Shawn 11/12/18 8:14 PM
 */


const logger = require('../util/logger');

class AbstractState {

    constructor(time = Date.now()) {
        this.startTime = time;
        logger.info(`${this.getName()} --> startTime = ${this.startTime / 1000}`);
    }

    getName() {
        return this.constructor.name;
    }

    canPass() {
        return true;
    }

    checkout(breaker) {
    }
}


/**
 * 闭合
 */
class CloseState extends AbstractState {
    constructor() {
        super();
    }

    canPass(breaker) {
        return true;
    }

    checkout(breaker) {
        let period = breaker.thresholdForOpen[1] * 1000;
        let now = Date.now();
        if (now >= this.startTime + period) {
            this.startTime = Date.now();
            breaker.reset();
        }

        logger.info('checkout -->  = ', breaker.getCount());
        if (breaker.getCount() >= breaker.thresholdForOpen[0]) {
            breaker.reset();
            breaker.setState(new OpenState())
        }
    }
}


/**
 * 半闭合
 */
class HalfOpenState extends AbstractState {
    constructor() {
        super();
    }

    canPass(breaker) {
        let limit = breaker.thresholdForHalfOpen[0];
        return breaker.getCount() <= limit;
    }

    checkout(breaker) {
        logger.info('checkout --> count = ', breaker.getCount());
        let period = breaker.thresholdForHalfOpen[1] * 1000;
        let now = Date.now();
        if (now >= this.startTime + period) {
            breaker.reset();
            if (breaker.getCount() > breaker.thresholdForHalfOpen[0]) {
                breaker.setState(new OpenState());
            } else {
                breaker.setState(new CloseState());
            }
        }
    }

}

/**
 * 断路
 */
class OpenState extends AbstractState {
    constructor() {
        super();
    }

    canPass() {
        return false;
    }

    checkout(breaker) {
        let period = breaker.idleTimeForOpen * 1000;
        let now = Date.now();
        if (now >= this.startTime + period) {
            breaker.reset();
            breaker.setState(new HalfOpenState());
        }
    }
}


module.exports = {
    AbstractState: AbstractState,
    CloseState: CloseState,
    HalfOpenState: HalfOpenState,
    OpenState: OpenState,
};