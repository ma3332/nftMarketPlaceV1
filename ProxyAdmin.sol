// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import {TransparentUpgradeableProxy} from "./TransparentUpgradeableProxy.sol";
import {Ownable} from "./Ownable.sol";

/**
 * @dev This is an auxiliary contract meant to be assigned as the admin of a {TransparentUpgradeableProxy}. For an
 * explanation of why you would want to use this see the documentation for {TransparentUpgradeableProxy}.
 */
contract ProxyAdmin is Ownable {
    string public constant UPGRADE_INTERFACE_VERSION = "5.0.0";

    constructor(address initialOwner) Ownable(initialOwner) {}

    function upgradeAndCall(
        TransparentUpgradeableProxy proxy,
        address implementation,
        bytes memory data
    ) public payable virtual onlyOwner {
        proxy.upgradeToAndCall{value: msg.value}(implementation, data);
    }

    function upgrade(
        TransparentUpgradeableProxy proxy,
        address implementation
    ) public virtual onlyOwner {
        proxy.upgradeTo(implementation);
    }
}
