'use strict';

const fs = require('fs');
const inquirer = require('inquirer');
const readline = require('readline')
const _ = require('lodash');
const { table } = require('table');

async function retrieveAllWords(filepath) {
  const fileStream = fs.createReadStream(filepath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });
  const words = [];
  for await (const line of rl) {
    const word = line.split(";");
    words.push({
      question: word[0],
      answer: word[1]
    });
  }
  return words;
}

async function testNoun(q, a) {
  console.log('翻译:' + q);
  return inquirer.prompt(
    [
      {
        type: 'input',
        name: 'gender',
        message: '词性'
      },
      {
        type: 'input',
        name: 'single',
        message: '单数'
      },
      {
        type: 'input',
        name: 'plural',
        message: '复数'
      }
    ]
  ).then(answers => {
    if (answers.gender === a[0] && answers.single === a[1] && answers.plural === a[2]) {
      console.log('✅');
      return true;
    } else {
      const result = [
        [answers.gender, a[0], answers.gender === a[0] ? '✅' : '❌'],
        [answers.single, a[1], answers.single === a[1] ? '✅' : '❌'],
        [answers.plural, a[2], answers.plural === a[2] ? '✅' : '❌'],
      ]
      console.log(table(result))
      return false;
    }
  });
}

async function testVerb(q, a) {
  console.log('翻译:' + q);
  return inquirer.prompt(
    [
      {
        type: 'input',
        name: 'ich',
        message: 'ich'
      },
      {
        type: 'input',
        name: 'du',
        message: 'du'
      },
      {
        type: 'input',
        name: 'ersiees',
        message: 'er/sie/es'
      },
      {
        type: 'input',
        name: 'wir',
        message: 'wir'
      },
      {
        type: 'input',
        name: 'ihr',
        message: 'ihr'
      },
      {
        type: 'input',
        name: 'sie',
        message: 'sie/Sie' 
      },
      {
        type: 'input',
        name: 'perfect',
        message: '完成时'
      }
    ]
  ).then(answers => {
    if (answers.ich === a[0] && answers.du === a[1] && answers.ersiees === a[2] 
      && answers.wir === a[3] && answers.ihr === a[4] && answers.sie === a[5]
      && answers.perfect === a[6]) {
      console.log('✅');
      return true;
    } else {
      const result = [
        [answers.ich, a[0], answers.ich === a[0] ? '✅' : '❌'],
        [answers.du, a[1], answers.du === a[1] ? '✅' : '❌'],
        [answers.ersiees, a[2], answers.ersiees === a[2] ? '✅' : '❌'],
        [answers.wir, a[3], answers.wir === a[3] ? '✅' : '❌'],
        [answers.ihr, a[4], answers.ihr === a[4] ? '✅' : '❌'],
        [answers.sie, a[5], answers.sie === a[5] ? '✅' : '❌'],
        [answers.perfect, a[6], answers.perfect === a[6] ? '✅' : '❌']
      ];
      console.log(table(result));
      return false;
    }
  });
}

async function testGenWord(q, a) {
  console.log('翻译:' + q);
  return inquirer.prompt([
    {
      type: 'input',
      name: 'spell',
      message: '拼写'
    }
  ]).then(answers => {
    if (answers.spell === a[0]) {
      console.log('✅');
      return true;
    } else {
      const result = [
        [answers.spell, a[0], answers.spell === a[0] ? '✅' : '❌']
      ];
      console.log(table(result));
    }
  });
}

async function testOneWord(word) {
  const answers = word.answer.split('-');
  if (answers.length === 1) {
    return await testGenWord(word.question, answers);
  } else if (answers.length === 3) {
    return await testNoun(word.question, answers);
  } else {
    return await testVerb(word.question, answers);
  }
}

exports.wordstest = async (filepath) => {
  let words = await retrieveAllWords(filepath);
  words = _.shuffle(words);
  while (words.length > 0) {
    console.clear();
    const word = words.shift();
    const status = await testOneWord(word);
    if (!status) {
      words.push(word);
    }
    await inquirer.prompt([{
      type: 'input',
      name: 'n',
      message: '继续',
      prefix: '-'
    }]);
  }
}