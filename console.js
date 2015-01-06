function Console () {}
Console.prototype.log = function () {
  if (this.mocking) {
    this.stdout += Array.prototype.slice.call(arguments, 0).join() + '\n';
  } else {
    console.log.apply(this, arguments);
  }
};
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
  this.stdout = '';
};
module.exports = new Console();
