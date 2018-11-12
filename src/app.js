/**
 * author: Shawn
 * time  : 11/11/18 12:55 PM
 * desc  :
 * update: Shawn 11/11/18 12:55 PM
 */


const AbstractServer = require('./abstract_server');
const CircuitBreaker = require('./breaker/circuit_breaker');
const logger = require('./util/logger');

class App extends AbstractServer {

    constructor(name, version, port) {
        super(name, version, port);
        this.circuitBreaker = new CircuitBreaker();
    }


    checkFlow(req, res, next) {
        logger.debug('come into check flow');
        this.circuitBreaker.count();
        if (this.circuitBreaker.canPass()) {
            next();
        } else {
            res.send('reject')
        }
    }

    setPlugin() {
        super.setPlugin();
        this.server.use(this.checkFlow.bind(this));
    }


    initApi() {
        this.server.get('/test', this.test.bind(this));
    }

    test(req, res, next) {
        logger.debug('come into test');
        res.send('ok\n');
    }
}

let app = new App('test_server', '1.0.0', 6666);
app.run();