// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import {ERC1967Utils} from "./ERC1967Utils.sol";
import {ERC1967Proxy} from "./ERC1967Proxy.sol";
import {IERC1967} from "./IERC1967.sol";
import {ProxyAdmin} from "./ProxyAdmin.sol";

contract TransparentUpgradeableProxy is ERC1967Proxy {
    address private immutable _admin;

    error ProxyDeniedAdminAccess();

    event ReceivedEth(uint256 amount);

    constructor(
        address _logic,
        address initialOwner,
        bytes memory _data
    ) payable ERC1967Proxy(_logic, _data) {
        _admin = address(ProxyAdmin(initialOwner));
        // Set the storage value and emit an event for ERC-1967 compatibility
        ERC1967Utils.changeAdmin(_proxyAdmin());
    }

    modifier ifAdmin() {
        if (msg.sender == _proxyAdmin()) {
            _;
        } else {
            _fallback();
        }
    }

    function fundme() public payable {
        emit ReceivedEth(msg.value);
    }

    receive() external payable {
        fundme();
    }

    function _proxyAdmin() internal view virtual returns (address) {
        return _admin;
    }

    function _fallback() internal virtual override {
        super._fallback();
    }

    function _dispatchUpgradeToAndCall() private {
        (address newImplementation, bytes memory data) = abi.decode(
            msg.data[4:],
            (address, bytes)
        );
        ERC1967Utils.upgradeToAndCall(newImplementation, data);
    }

    function upgradeTo(address newImplementation) external ifAdmin {
        ERC1967Utils.upgradeToAndCall(newImplementation, bytes(""));
    }

    function upgradeToAndCall(
        address newImplementation,
        bytes calldata data
    ) external payable ifAdmin {
        ERC1967Utils.upgradeToAndCall(newImplementation, data);
    }
}
