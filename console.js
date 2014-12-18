function Console () {}
Console.prototype.error = function () {
  if (this.mocking) {
    this.stderr += Array.prototype.slice.call(arguments, 0).join() + '\n';
  } else {
    console.error.apply(this, arguments);
  }
};
Console.prototype.mock = function () {
  this.mocking = true;
  this.stderr = '';
};
module.exports = new Console();
