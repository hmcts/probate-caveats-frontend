import config from 'config';
import express from 'express';
import logger from '../../app/components/logger.js';

const __filename = import.meta.filename;

class EqualityAndDiversityHealthStub {
    constructor() {
        this.app = express();
        this.logger = logger('EqualityAndDiversityHealthStub');
        this.equalityPort = config.services.equalityAndDiversity.port;
        this.router = express.Router();

        this.app.use(express.json());

        this.app.get('/health', (req, res) => {
            this.logger.info(req.body);
            res.send({
                status: 'UP',
                'pcq-backend': {
                    status: 'UP'
                }
            });
        });

        this.router.get('/info', (req, res) => {
            res.send({
                'git': {
                    'commit': {
                        'time': '2018-06-05T16:31+0000',
                        'id': 'e210e75b38c6b8da03551b9f83fd909fe80832e4'
                    }
                }
            });
        });

        this.app.use(this.router);
    }

    start() {
        this.logger.info(`starting, listening on: ${this.equalityPort}`);

        this.server = this.app.listen(this.equalityPort);
        this.logger.info('started');
    }

    stop() {
        this.logger.info('stopping');
        this.server.close();
        this.logger.info('stopped');
    }
}

export default EqualityAndDiversityHealthStub;

const entryFile = process.argv?.[1];

if (entryFile === __filename) {
    logger().info(`entryFile: ${entryFile}`);
    const instance = new EqualityAndDiversityHealthStub();
    instance.start();
}
