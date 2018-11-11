/**
 * author: Shawn
 * time  : 11/10/18 5:56 PM
 * desc  :
 * update: Shawn 11/10/18 5:56 PM
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
        console.log(`switch state from ${this.getState().getName()} to ${state.getName()}`);
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


class AbstractState {

    constructor() {
        this.startTime = Date.now();
        console.log(`${this.getName()} --> startTime = ${this.startTime / 1000}`);
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

        console.log('checkout -->  = ', breaker.getCount());
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
        console.log('checkout --> count = ', breaker.getCount());
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


module.exports = CircuitBreaker;


// test
// let breaker = new CircuitBreaker();
// setInterval(() => {
//     breaker.count();
//     if (breaker.canPass()) {
//         console.log('正常执行业务逻辑 -->  = ',);
//     } else {
//         console.log('阻断 -->  = ',);
//     }
// }, 800);

