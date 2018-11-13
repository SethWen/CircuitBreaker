/**
 * author: Shawn
 * time  : 7/24/18 11:38 AM
 * desc  :
 * update: Shawn 7/24/18 11:38 AM
 */


const restify = require('restify');
const logger = require('./util/logger');


class AbstractServer {

    constructor(name, version, port) {
        this.catchUnhandleException();
        this.name = name;
        this.version = version;
        this.port = port;
    }


    /**
     * 根据配置项启动服务
     */
    run() {
        this.server = restify.createServer({
            name: this.name,
            version: this.version,
            // log: log
        });

        this.setFork();
        this.setPlugin();

        this.initApi();
        this.initPort();
        this.onNotFound();
    }


    onNotFound() {
        this.server.on('NotFound', function (req, res, error, cb) {
            logger.info(`Request for ${req.url} not found`);
            res.send('not found')
        });
    }


    setFork() {
        this.server.pre((req, res, next) => {
            res.charSet('utf-8');
            next();
        });
    }


    setPlugin() {
        this.server.use(restify.pre.userAgentConnection());
        this.server.use(restify.plugins.acceptParser(this.server.acceptable));
        this.server.use(restify.plugins.queryParser());
        this.server.use(restify.plugins.bodyParser({
            maxBodySize: 5120,
            mapParams: true,
            mapFiles: false,
            overrideParams: false
        }));

        this.server.use((req, res, next) => {
            logger.info(`Request received: method: ${req.method}, URL: ${req.url}`);
            next();
        });
    }


    /**
     * 设置服务端口
     */
    initPort() {
        this.server.listen(this.port, () => {
            logger.info(`http server started and listening on port ${this.port}`);
        });
    }


    /**
     * 初始化 Api， 子类必须重写
     */
    initApi() {
        // 下为 example
        // this.server.post('task', function (req, res, next) {
        //
        // });
    }


    /**
     * 捕获异常
     */
    catchUnhandleException() {
        // 捕获 uncaughtException
        process.on('uncaughtException', function (err) {
            logger.error(`uncaughtException: ${err}`);
        });

        // 捕获 unhandledRejection
        process.on('unhandledRejection', function (err, p) {
            logger.error(`unhandledRejection: ${err}`);
        });
    }
}

module.exports = AbstractServer;