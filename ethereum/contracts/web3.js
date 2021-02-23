import Web3 from 'web3';

let web3;

if (typeof window !== undefined &&
  typeof window.web3 !== 'undefined') {
  // we are in the browser and metamask is running
  web3 = new Web3(window.ethereum);
} else {
  // we are on the server or the user is not running metamask
  const provider = new Web3.providers.HttpProvider(
    'https://rinkeby.infura.io/v3/8ac677259cd54e409ae71d6692837a0e'
  );

  web3 = new Web3(provider);
}

export default web3;
