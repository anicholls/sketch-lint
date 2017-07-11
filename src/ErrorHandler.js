class ErrorHandler {
  constructor() {
    this.errors = [];
  }

  addError(error) {
    this.errors.push(error);
  }

  output() {
    for (let error of this.errors) {
      console.log(error.constructor.name);
      console.log(_divider());
      console.log(error.getMessage());
      console.log(_divider() + '\n');
    }
  }
}

function _divider() {
  return '-'.repeat(20);
}

module.exports = ErrorHandler;
