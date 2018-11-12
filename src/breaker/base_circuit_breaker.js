/**
 * author: Shawn
 * time  : 11/12/18 11:52 PM
 * desc  :
 * update: Shawn 11/12/18 11:52 PM
 */

const AbstractCircuitBreaker = require('./abstract_circuit_breaker');
const {CloseState, HalfOpenState, OpenState} = require('./state');
const {Counter} = require('./counter');

class BaseCirbuitBreaker extends AbstractCircuitBreaker {
    constructor() {
        super();
    }

    init() {
        this.counter = new Counter(); // max times for each 60s
        this.state = new CloseState(); // default state
    }
}

module.exports = BaseCirbuitBreaker;