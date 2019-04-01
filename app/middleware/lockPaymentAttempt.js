'use strict';

const lockPaymentAttempt = (req, res, next) => {
    const session = req.session;
    const applicationId = session.form.applicationId;
    if (session.paymentLock === 'Locked') {
        req.log.info('Ignoring 2nd locking attempt for: ' + applicationId);
        res.sendStatus(204);
    } else {
        req.log.info('Locking payment: ' + applicationId);
        session.paymentLock = 'Locked';
        req.session.save();
        next();
    }
};

module.exports = lockPaymentAttempt;
