import {Logger} from '@hmcts/nodejs-logging';

const log = (sessionId) => {
    return Logger.getLogger(`caveat-frontend, sessionId: ${sessionId}`);
};

export default log;
