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
        // 为方便测试, 观察效果, 我们使用较小的阈值
        this.breaker = new CircuitBreaker('10/10', 20, '5/10');
    }

    checkFlow(req, res, next) {
        logger.debug('come into check flow');
        let appid = req.query['appid'];
        if (!appid) {
            logger.error('no appid');
            res.end('no appid\n');
            return;
        }
        logger.debug('checkFlow --> appid = ' + appid);

        this.breaker.count();
        if (this.breaker.canPass()) {
            next();
        } else {
            res.end('reject\n');
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
        res.end('ok\n');
    }
}

let app = new App('test_server', '1.0.0', 6666);
app.run();