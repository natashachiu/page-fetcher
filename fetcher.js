const request = require("request");
const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const makeRequest = (url, filePath) => {
  request(url, (error, response, body) => {
    if (error) {
      console.log("Url invalid - Website does not exist\n", error);

    } else if (response && response.statusCode !== 200) {
      console.log("Url invalid - Status code:", response.statusCode);

    } else {
      readFile(filePath, body);
    }
    rl.close();
  });
};

const writeToFile = (filePath, body) => {

  fs.writeFile(filePath, body, (err) => {
    if (err) {
      console.log("Cannot write to invalid file path\n", err);
    } else {
      console.log(`Downloaded and saved ${body.length} bytes to ${filePath}\r`);
    }
    rl.close();
  });
};

const readFile = (filePath, body) => {
  // check if file exists
  fs.readFile(filePath, 'utf-8', (err) => {

    if (!err) { // file exists

      rl.question(`Overwrite existing ${filePath} file? `, (answer) => {
        if (answer === "Y" || answer === "y") {
          writeToFile(filePath, body);
        }
        rl.close();
      });
    } else {
      writeToFile(filePath, body);
    }
  });
};



if (!process.argv[2] || !process.argv[3]) return;

const url = process.argv[2];
const filePath = process.argv[3];


makeRequest(url, filePath);


