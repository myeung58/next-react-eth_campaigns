import React, { Component } from 'react';
import { Card, Button } from 'semantic-ui-react';
import web3 from '../ethereum/web3';
import factory from '../ethereum/factory';
import Layout from '../components/Layout';
import { Link } from '../routes';


class CampaignIndex extends Component {
  // getInitialProps is a class method provided
  // by Next for data loading during server side rendering.
  // *no access to window vairable here because it's server side
  static async getInitialProps() {
    const campaigns = await factory.methods.getDeployedCampaigns().call();
    console.log('campaigns', campaigns);

    return { campaigns };
  }

  // Because Next does server side rendering,
  // code in this block does not get executed until
  // we're in the browser.
  async componentDidMount() {  
    // not doing data loading here
    await window.ethereum.enable();
  }

  renderCampaigns() {
    const items = this.props.campaigns.map((address) => {
      return {
        header: address,
        description: (
          <Link route={`/campaigns/${address}`}>
            <a>View Campaign</a>
          </Link>
        ),
        fluid: true // Card config property
      }  
    });

    return (
      <Card.Group items={items} />
    );
  }

  render() {
    return(
      <Layout>
        <div>
          <h3>Open Campaigns</h3>

          <Link route="/campaigns/new">
            <a>
              <Button
                floated="right"
                content="Create Campaign"
                icon="add circle"
                primary
            />
            </a>
          </Link>
          {this.renderCampaigns()}
        </div>
      </Layout>
    )
  }
}

export default CampaignIndex;
