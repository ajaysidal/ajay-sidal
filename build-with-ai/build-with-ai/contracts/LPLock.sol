// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LPLock is Ownable {
    address public immutable lpToken;
    uint256 public immutable unlockTime;

    event Locked(address indexed lpToken, uint256 amount, uint256 unlockTime);
    event Withdrawn(address indexed lpToken, uint256 amount);

    constructor(address _lpToken, uint256 _unlockDuration) Ownable(msg.sender) {
        lpToken = _lpToken;
        unlockTime = block.timestamp + _unlockDuration;
    }

    function lock() external onlyOwner {
        uint256 amount = IERC20(lpToken).balanceOf(address(this));
        require(amount > 0, "No LP tokens to lock");
        emit Locked(lpToken, amount, unlockTime);
    }

    function withdraw() external onlyOwner {
        require(block.timestamp >= unlockTime, "Lock not expired");
        uint256 amount = IERC20(lpToken).balanceOf(address(this));
        require(amount > 0, "Nothing to withdraw");
        IERC20(lpToken).transfer(owner(), amount);
        emit Withdrawn(lpToken, amount);
    }
}
