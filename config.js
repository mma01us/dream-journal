var convict = require('convict');

convict.addFormat(require('convict-format-with-validator').ipaddress);

// Define a schema
var config = convict({
  env: {
    doc: 'The application environment.',
    format: ['production', 'development', 'test'],
    default: 'development',
    env: 'NODE_ENV'
  },
  ip: {
    doc: 'The IP address to bind.',
    format: 'ipaddress',
    default: '127.0.0.1',
    env: 'IP_ADDRESS',
  },
  port: {
    doc: 'The port to bind.',
    format: 'port',
    default: 8080,
    env: 'PORT',
    arg: 'port'
  },
  db: {
    host: {
      doc: 'Database host name/IP',
      format: '*',
      default: 'localhost'
    },
    name: {
      doc: 'Database name',
      format: String,
      default: 'dreamdb'
    }
  }
});
//
// // Load environment dependent configuration
// var env = config.get('env');
// config.loadFile('./config/' + env + '.json');
//
// // Perform validation
// config.validate({allowed: 'strict'});

module.exports = config;
