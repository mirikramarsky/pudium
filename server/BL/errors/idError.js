class idError extends Error{
    constructor(message){
        super(message)
        this.name = idError
    }
}
module.exports = idError;