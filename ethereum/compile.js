const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');

// Remove existing build artifacts
const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath);

const campaignPath = path.resolve(__dirname, 'contracts', 'Campaign.sol');
const source = fs.readFileSync(campaignPath, 'utf8');

// for newer versions of solc, check
// https://stackoverflow.com/questions/53353167/npm-solc-assertionerror-err-assertion-invalid-callback-specified
const output = solc.compile(source, 1).contracts;

fs.ensureDirSync(buildPath);

for (let contract in output) {
  const fileName = `${contract.replace(':', '')}.json`;

  fs.outputJsonSync(
    path.resolve(buildPath, fileName),
    output[contract]
  );
}
