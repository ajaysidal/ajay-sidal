// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract MarzToken is ERC20, Ownable, ReentrancyGuard {
    uint256 public constant BURN_FEE_PERCENT = 2;
    uint256 public constant TREASURY_FEE_PERCENT = 1;
    uint256 public totalBurned;
    address public treasuryAddress;

    struct Stake { uint256 amount; uint256 startTime; bool active; }
    mapping(address => Stake) public stakes;
    mapping(address => uint256) public rewards;

    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount);
    event RewardClaimed(address indexed user, uint256 amount);
    event Burned(uint256 amount);

    constructor(string memory name, string memory symbol, uint256 initialSupply, address _treasuryAddress)
        ERC20(name, symbol) Ownable(msg.sender)
    {
        _mint(msg.sender, initialSupply * 10 ** decimals());
        treasuryAddress = _treasuryAddress;
    }

    function _update(address from, address to, uint256 value) internal override {
        if (from != address(0) && to != address(0) && from != address(this) && to != address(this)) {
            uint256 burnAmount = (value * BURN_FEE_PERCENT) / 100;
            uint256 treasuryAmount = (value * TREASURY_FEE_PERCENT) / 100;
            
            if (burnAmount > 0) {
                super._update(from, address(0), burnAmount);
                totalBurned += burnAmount;
                emit Burned(burnAmount);
            }
            if (treasuryAmount > 0) {
                super._update(from, treasuryAddress, treasuryAmount);
            }
            value = value - burnAmount - treasuryAmount;
        }
        super._update(from, to, value);
    }

    function stake(uint256 amount) external nonReentrant {
        require(amount > 0, "Must stake > 0");
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");
        if (stakes[msg.sender].active) unstake();
        _transfer(msg.sender, address(this), amount);
        stakes[msg.sender] = Stake(amount, block.timestamp, true);
        emit Staked(msg.sender, amount);
    }

    function unstake() public nonReentrant {
        Stake memory s = stakes[msg.sender];
        require(s.active, "No active stake");
        uint256 duration = block.timestamp - s.startTime;
        uint256 reward = (s.amount * duration) / 365 days;
        rewards[msg.sender] += reward;
        stakes[msg.sender] = Stake(0, 0, false);
        _transfer(address(this), msg.sender, s.amount);
        emit Unstaked(msg.sender, s.amount);
    }

    function claimReward() external nonReentrant {
        uint256 r = rewards[msg.sender];
        require(r > 0, "No rewards");
        rewards[msg.sender] = 0;
        _mint(msg.sender, r);
        emit RewardClaimed(msg.sender, r);
    }

    function setTreasuryAddress(address newTreasury) external onlyOwner {
        treasuryAddress = newTreasury;
    }
}
