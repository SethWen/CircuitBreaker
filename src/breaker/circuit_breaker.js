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

    /**
     * @param thresholdForOpen {string} format: '600/60'
     *              '600/60' for instance, it means maximum allowable request is 600 times per 60 seconds, or the breaker will switch to OpenState
     * @param idleTimeForOpen {number} unit: second
     *              600 for instance, it means if the breaker switched to OpenState, it will keep for 600 seconds
     * @param thresholdForHalfOpen {string} format: '300/60'
     *              '300/60' for instance, it means the breaker will switch to OpenState if the maximum number of requests exceeds 300 per 60 seconds,
     *              or the breaker switch to CloseState
     */
    constructor(thresholdForOpen = '600/60', idleTimeForOpen = 5 * 60, thresholdForHalfOpen = '300/60') {
        this.idleTimeForOpen = idleTimeForOpen;
        this.thresholdForOpen = thresholdForOpen.split('/');
        this.thresholdForHalfOpen = thresholdForHalfOpen.split('/');
        this.counter = new Counter();   // max times for each 60s
        this.state = new CloseState();  // default state
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

