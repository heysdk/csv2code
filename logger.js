/**
 * Created by zhs007 on 2014/12/3.
 */
var winston = require('winston');
var config = require('./config');

winston.loggers.add('dev', {
    console: {
        level: 'silly',
        colorize: 'true',
        label: 'dev'
    },
    file: {
        filename: config.logdev_path
    }
});

winston.loggers.add('normal', {
    console: {
        level: 'silly',
        colorize: 'true',
        label: 'normal'
    },
    file: {
        filename: config.log_path
    }
});

exports.dev = winston.loggers.get('dev');
exports.normal = winston.loggers.get('normal');