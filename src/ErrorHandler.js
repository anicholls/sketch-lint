const SketchError = require('./SketchError');

class ErrorHandler {
  constructor() {
    this.errors = [];
  }

  // TODO: Add second version of addError that accepts an error itself

  addError(objClass, type, value, expected) {
    let error = new SketchError(objClass, type, value, expected);
    this.errors.push(error);

    return error;
  }

  output() {
    for (let error of this.errors) {
      let msg = error.getMessage() + '\n';
      console.log(msg);
    }
  }
}

module.exports = ErrorHandler;
