/**
 * author: Shawn
 * time  : 11/12/18 8:19 PM
 * desc  :
 * update: Shawn 11/12/18 8:19 PM
 */


const logger = require('../util/logger');
const AbstractCircuitBreaker = require('./abstract_circuit_breaker');
const {Counter} = require('./counter');
const {CloseState, HalfOpenState, OpenState} = require('./state');


class MyCircuitBreaker extends AbstractCircuitBreaker {

    constructor(id) {
        super();
        this.restore(id);
    }

    restore(id) {
        let session = globalSessions.get(id);
        if (session) {
            console.log('restore --> 111111111 = ', session['startTime']);
            this.state = eval(`new ${session['state']}(${session['startTime']})`);
            this.counter = new Counter(session['count']);
            logger.info(`restore breaker: state=${this.state.getName()}, count=${this.counter.get()}`);
        } else {
            this.state = new CloseState();
            this.counter = new Counter(0);
            logger.info(`init breaker: state=${this.state.getName()}, count=${this.counter.get()}`);
        }
    }
}

// new MyCircuitBreaker('testid');

module.exports = MyCircuitBreaker;