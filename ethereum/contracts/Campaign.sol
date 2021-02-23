pragma solidity ^0.4.25;

contract CampaignFactory {
  address[] public deployedCampaigns;

  function createCampaign(uint minimum) public {
    // with campaigns created by the factory, we need to set manager,
    // otherwise the manager will be the factory contract instead of the user.
    address newCampaign = new Campaign(minimum, msg.sender);
    deployedCampaigns.push(newCampaign);
  }
  
  function getDeployedCampaigns() public view returns (address[]) {
    return deployedCampaigns;
  }
}

contract Campaign {
  // unlike variable declarations, this is just a definition of type, not an instance 
  struct Request {
    string description;
    uint value;
    address recipient;
    bool complete;
    mapping(address => bool) approvals;
    uint approvalCount;
  }
  
  // these variables will create an instance
  Request[] public requests;
  address public manager;
  uint public minimumContribution;
  mapping(address => bool) public approvers;
  uint public approversCount;

  // modifiers go above constructor
  modifier restricted() {
    require(msg.sender == manager);
    _;
  }

  constructor (uint minimum, address creator) public {
    manager = creator;
    minimumContribution = minimum;
  }
  
  function contribute() public payable {
    require(msg.value > minimumContribution);
    
    approvers[msg.sender] = true;
    approversCount++;
  }
  
  function createRequest(string description, uint value, address recipient)
    public restricted {
    // the new request instance is by default in memory, so the variable has to be declared
    // as memory variable to point to that.
    Request memory newRequest = Request({
      description: description,
      value: value,
      recipient: recipient,
      complete: false,
      approvalCount: 0
      // When we initialize properties of a struct, we only have to initialize value types.
      // We are not initializing reference types ie. the approvals. Those are modifiable by the functions that update the references.
    });
    
    requests.push(newRequest);
  }
  
  function approveRequest(uint index) public {
    // has to be storage variable because we want to manipulate the actual stored values
    Request storage request = requests[index];

    require(msg.sender != manager);
    require(approvers[msg.sender]); // check if sender has contributed ie. an eligible approver
    require(!request.approvals[msg.sender]); // check if sender has voted

    request.approvals[msg.sender] = true;
    request.approvalCount++;
  }
  
  function finalizeRequest(uint index) public {
    Request storage request = requests[index];
    
    require(request.approvalCount > (approversCount / 2)); // check that approvals are over 50% of approvers
    require(!request.complete);

    request.recipient.transfer(request.value);
    request.complete = true;
  }

  function getSummary() public view returns(
    uint,
    uint,
    uint,
    uint,
    address
  ) {
    return (
      minimumContribution,
      this.balance,
      requests.length,
      approversCount,
      manager
    );
  }

  function getRequestsCount() public view returns (uint) {
    return requests.length;
  }
}
