#!/usr/bin/env node
const yargs = require('yargs');
const path = require('path');
const fs = require('fs-extra');

 
if (!module.parent) {
  const argv = yargs.command('init [file]', '- Generate default template config file.', 
    (yargs) => yargs.positional('file', {
        describe: 'Optional file destination',
        type: 'string',
        default: path.resolve('config.json'),
        coerce: path.resolve
      }
    ),
    (argv) => {
      fs.copySync(path.join(__dirname, 'src', 'defaults.json'), argv.file);
    })
    .command(['run [config]', '$0'], 'run krakenbot', (yargs) => { 
      return yargs.positional('config', {
        describe: 'Optional config location',
        type: 'string',
        default: path.resolve('config.json'),
        coerce: path.resolve
      })
      .boolean('nodb');
    }, (argv) => {
      require('./src/Main.js').run(fs.readJsonSync(argv.config), argv);
    })
    .help()
    .argv;
}