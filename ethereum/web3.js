// import web3 from '../ethereum/web3';
import Web3 from 'web3';

// same as the one in deploy.js
const RINKEBY_URL = "https://rinkeby.infura.io/v3/8ac677259cd54e409ae71d6692837a0e";
let web3;

if (typeof window !== 'undefined' &&
  typeof window.web3 !== 'undefined') {
  console.log('using metamask');
  // we are in the browser and metamask is running.
  web3 = new Web3(window.ethereum);
} else {
  console.log('using http provider');
  // we are on the server or user does not have metamask.
  const provider = new Web3.providers.HttpProvider(RINKEBY_URL);
  web3 = new Web3(provider);
}

export default web3;
