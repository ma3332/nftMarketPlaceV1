// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./TransparentUpgradeableProxy.sol";

contract ProxyAdmin {
    string public constant UPGRADE_INTERFACE_VERSION = "5.0.0";
    address private _owner;

    TransparentUpgradeableProxy public proxy;

    constructor() {
        _owner = msg.sender;
    }

    event OwnershipTransferred(
        address indexed previousOwner,
        address indexed newOwner
    );

    modifier onlyOwner() {
        require(msg.sender == _owner, "Not Allow");
        _;
    }

    function owner() public view virtual returns (address) {
        return _owner;
    }

    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "Not Allow");
        _transferOwnership(newOwner);
    }

    function _transferOwnership(address newOwner) internal virtual {
        address oldOwner = _owner;
        _owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }

    function upgradeToNewVersionAndCall(
        address _implementation,
        bytes memory _data
    ) public payable onlyOwner {
        proxy.upgradeToAndCall{value: msg.value}(_implementation, _data);
    }

    function upgradeToNewVersion(address _implementation) public onlyOwner {
        proxy.upgradeTo(_implementation);
    }

    function setUpProxy(address payable _proxy) public onlyOwner {
        proxy = TransparentUpgradeableProxy(_proxy);
    }
}
