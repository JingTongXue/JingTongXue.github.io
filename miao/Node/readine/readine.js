const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('What do you think of Node.js? ', (answer) => {
  // TODO: Log the answer in a database
  console.log(`Thank you for your valuable feedback: ${answer}`);

  rl.question('How old are you? ', (answer) => {
    // TODO: Log the answer in a database
    console.log(`you are ${answer} years old`);
    
  });
  
});