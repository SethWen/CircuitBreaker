/**
 * author: Shawn
 * time  : 11/11/18 12:55 PM
 * desc  :
 * update: Shawn 11/11/18 12:55 PM
 */


const AbstractServer = require('./abstract_server');
const MyCircuitBreaker = require('./breaker/my_circuit_breaker');
const logger = require('./util/logger');

global.globalSessions = new Map();
// let ex = {
//     state: 'OpenState',
//     count: 3,
// };
// sessions.set('testid', ex);

class App extends AbstractServer {

    constructor(name, version, port) {
        super(name, version, port);
    }


    checkFlow(req, res, next) {
        logger.debug('come into check flow');
        let appid = req.query['appid'];
        console.log('checkFlow --> appid = ', appid);
        let breaker = new MyCircuitBreaker(appid); // 鸡蛋问题
        breaker.count();
        globalSessions.set(appid, {
            state: breaker.getState().getName(),
            count: breaker.getCount(),
            startTime: breaker.getState().startTime
        });
        console.log('checkFlow --> sessions = ', globalSessions);
        if (breaker.canPass()) {
            next();
        } else {
            res.send('reject');
        }

        // this.circuitBreaker.count();
        // if (this.circuitBreaker.canPass()) {
        //     next();
        // } else {
        //     res.send('reject')
        // }
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