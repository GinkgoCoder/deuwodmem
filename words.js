'use strict';

const fs = require('fs');
const inquirer = require('inquirer');
const readline = require('readline')
const _ = require('lodash')

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
    if (answers.single === a[0] && answers.plural === a[1]) {
      console.log('✅');
      return true;
    } else {
      console.log('❌');
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
      }
    ]
  ).then(answers => {
    if (answers.ich === a[0] && answers.du === a[1] && answers.ersiees === a[2] 
      && answers.wir === a[3] && answers.ihr === a[4] && answers.sie === a[5]) {
      console.log('✅');
      return true;
    } else {
      console.log('❌');
      return false;
    }
  });
}

async function testOneWord(word) {
  const answers = word.answer.split('-');
  if (answers.length === 2) {
    return await testNoun(word.question, answers);
  } else {
    return await testVerb(word.question, answers);
  }
}

exports.wordstest = async (filepath) => {
  let words = await retrieveAllWords(filepath);
  words = _.shuffle(words);
  while(words.length > 0) {
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