var chai = require('chai');
var should = chai.should();

var fs = require('fs-extra');
var path = require('path');

describe('General', function() {
  it('should parse the default config', function(){
    fs.readJsonSync(path.join(__dirname, '..', 'src', 'defaults.json'));
  });
});