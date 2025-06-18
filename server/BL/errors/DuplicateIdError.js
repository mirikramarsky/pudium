class DuplicateIdError extends Error {
    constructor(message = 'תלמידה עם תעודת זהות זו כבר קיימת') {
        super(message);
        this.name = 'DuplicateIdError';
        this.statusCode = 409; // קוד HTTP מתאים ל־Conflict
    }
}

module.exports = DuplicateIdError;