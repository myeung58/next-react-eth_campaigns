import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  '0xb00756fc42e8fA105e4e4Ee65F89831767f18901'
);

export default instance;
