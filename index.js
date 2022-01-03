#! /usr/bin/env node

const { Command } = require('commander');
const { wordstest } = require('./words');


const program = new Command();

program.version('1.0.0')
  .argument('<filepath>')
  .action(async (filepath) => {
    await wordstest(filepath);
  })

program.parse(process.argv);

