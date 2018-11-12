/**
 * author: Shawn
 * time  : 11/10/18 5:56 PM
 * desc  :
 * update: Shawn 11/10/18 5:56 PM
 */
const logger = require('../util/logger');
const {CloseState, HalfOpenState, OpenState} = require('./state');
const {Counter} = require('./counter');


class CircuitBreaker {

    constructor() {
        this.idleTimeForOpen = 20; // 60s
        this.thresholdForOpen = [10, 10]; // s
        this.thresholdForHalfOpen = [5, 10]; // s
        this.counter = new Counter(); // max times for each 60s
        this.state = new CloseState(); // default state
    }

    getState() {
        return this.state;
    }

    setState(state) {
        logger.info(`switch state from ${this.getState().getName()} to ${state.getName()}`);
        this.state = state;
    }

    reset() {
        this.counter.reset();
    }

    canPass() {
        return this.getState().canPass(this);
    }

    count() {
        this.counter.increase();
        this.getState().checkout(this);
    }

    getCount() {
        return this.counter.get();
    }
}


module.exports = CircuitBreaker;


// test
// let breaker = new CircuitBreaker();
// setInterval(() => {
//     breaker.count();
//     if (breaker.canPass()) {
//         logger.info('正常执行业务逻辑 -->  = ',);
//     } else {
//         logger.info('阻断 -->  = ',);
//     }
// }, 800);

