/**
 * author: Shawn
 * time  : 11/12/18 8:19 PM
 * desc  :
 * update: Shawn 11/12/18 8:19 PM
 */


const logger = require('../util/logger');
const CircuitBreaker = require('./circuit_breaker');
const {Counter} = require('./counter');
const {CloseState, HalfOpenState, OpenState} = require('./state');


let sessions = new Map();
let ex = {
    state: 'OpenState',
    count: 3,
};
sessions.set('testid', ex);

class MyCircuitBreaker extends CircuitBreaker {

    constructor(id) {
        super();
        this.restore(id)
    }

    restore(id) {
        let session = sessions.get(id);
        this.state = eval(`new ${session['state']}()`);
        this.counter = new Counter(session['count']);
        logger.info(`restore breaker: state=${this.state.getName()}, count=${session['count']}`);
    }
}

new MyCircuitBreaker('testid');