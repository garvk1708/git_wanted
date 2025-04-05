
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract BountyContract {
    struct Bounty {
        uint256 id;
        address creator;
        uint256 amount;
        bool claimed;
        bool paid;
        address solver;
    }

    mapping(uint256 => Bounty) public bounties;
    uint256 public bountyCount;

    event BountyCreated(uint256 indexed id, address creator, uint256 amount);
    event BountyClaimed(uint256 indexed id, address solver);
    event BountyPaid(uint256 indexed id, address solver, uint256 amount);

    function createBounty() public payable returns (uint256) {
        require(msg.value > 0, "Bounty amount must be greater than 0");
        
        bountyCount++;
        bounties[bountyCount] = Bounty({
            id: bountyCount,
            creator: msg.sender,
            amount: msg.value,
            claimed: false,
            paid: false,
            solver: address(0)
        });

        emit BountyCreated(bountyCount, msg.sender, msg.value);
        return bountyCount;
    }

    function claimBounty(uint256 _bountyId) public {
        Bounty storage bounty = bounties[_bountyId];
        require(!bounty.claimed, "Bounty already claimed");
        require(bounty.amount > 0, "Bounty does not exist");

        bounty.claimed = true;
        bounty.solver = msg.sender;
        
        emit BountyClaimed(_bountyId, msg.sender);
    }

    function payBounty(uint256 _bountyId) public payable {
        Bounty storage bounty = bounties[_bountyId];
        require(bounty.claimed, "Bounty not claimed yet");
        require(!bounty.paid, "Bounty already paid");
        require(bounty.creator == msg.sender, "Only creator can pay bounty");
        require(msg.value == bounty.amount, "Payment amount must match bounty amount");

        bounty.paid = true;
        payable(bounty.solver).transfer(msg.value);
        
        emit BountyPaid(_bountyId, bounty.solver, msg.value);
    }

    function getBounty(uint256 _bountyId) public view returns (Bounty memory) {
        return bounties[_bountyId];
    }
}
