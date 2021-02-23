const HDWalletProvider = require("truffle-hdwallet-provider");
const Web3 = require("web3");
const compiledFactory = require('./build/CampaignFactory.json');

const path = require('path');
const configPath = path.resolve(__dirname, '../.env');
const config = require('dotenv').config({ path: configPath });

const MNEMONIC = process.env.MNEMONIC;
const RINKEBY_URL = process.env.RINKEBY_URL;

const provider = new HDWalletProvider(MNEMONIC, RINKEBY_URL);
const web3 = new Web3(provider);

// declaring this so we could use the async syntax
const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log("Attempting deploy from", accounts[0]);

  const result = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({ data: "0x" + compiledFactory.bytecode })
    .send({ gas: '1000000', from: accounts[0] });

  // good practice to print out the destination of deployment
  console.log("Deployed to", result.options.address);
};

deploy();

// deployed to 0xb00756fc42e8fA105e4e4Ee65F89831767f18901
