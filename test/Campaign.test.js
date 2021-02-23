const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  factory = await new web3.eth
    .Contract(JSON.parse(compiledFactory.interface))
    .deploy({ data: compiledFactory.bytecode })
    .send({ from: accounts[0], gas: '1000000' });

  await factory.methods.createCampaign('100')
    .send({ from: accounts[0], gas: '1000000' });

  const addresses = await factory.methods.getDeployedCampaigns().call();
  campaignAddress = addresses[0];

  // get contract instance based on address
  campaign = await new web3.eth.Contract(
      JSON.parse(compiledCampaign.interface),
      campaignAddress
    )
});

describe('Campaigns', () => {
  it('deploys a factory and a campaign', () => {
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });

  it('marks caller as the campaign manager', async () => {
    const manager = await campaign.methods.manager().call();
    assert.equal(accounts[0], manager);
  });

  it('allows people to contribute money and marks them as approvers', async () => {
    await campaign.methods.contribute().send({
      from: accounts[1],
      value: '200'
    });

    const approver = await campaign.methods.approvers(accounts[1]).call();
    assert.ok(approver);
  });

  it('requires minimum contributions', async () => {
    try {
      await campaign.methods.contribute().send({
        from: accounts[1],
        value: '0'
      });
    } catch(err) {
      assert(err);
    }
  });

  it('allows manager to make a payment request', async () => {
    await campaign.methods
      .createRequest('Buy batteries', '100', accounts[2])
      .send({ from: accounts[0], gas: '1000000' });

    const request = await campaign.methods.requests(0).call();

    assert.equal('Buy batteries', request.description);
  });

  it('processes requests', async () => {
    await campaign.methods.contribute().send({
      from: accounts[1],
      value: web3.utils.toWei('10', 'ether')
    })

    let beforeBalance = await web3.eth.getBalance(accounts[2]);
    beforeBalance = web3.utils.fromWei(beforeBalance, 'ether');
    beforeBalance = parseFloat(beforeBalance);

    await campaign.methods
      .createRequest(
        'Buy pen',
        web3.utils.toWei('5', 'ether'),
        accounts[2]
      ).send({ from: accounts[0], gas: '1000000' });


    await campaign.methods.approveRequest(0)
      .send({ from: accounts[1], gas: '1000000' });


    await campaign.methods.finalizeRequest(0)
      .send({ from: accounts[0], gas: '1000000' });

    let afterBalance = await web3.eth.getBalance(accounts[2]);
    afterBalance = web3.utils.fromWei(afterBalance, 'ether');
    afterBalance = parseFloat(afterBalance);

    assert(afterBalance > beforeBalance + 4.99);
  });
});
