// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./ERC1967Proxy.sol";

contract TransparentUpgradeableProxy is ERC1967Proxy {
    error ProxyDeniedAdminAccess();

    event ReceivedEth(uint256 amount);

    constructor(
        address _logic,
        address initialOwner,
        bytes memory _data
    ) payable ERC1967Proxy(_logic, _data) {
        assert(
            _ADMIN_SLOT ==
                bytes32(uint256(keccak256("eip1967.proxy.admin")) - 1)
        );
        _changeAdmin(initialOwner);
    }

    modifier ifAdmin() {
        if (msg.sender == _getAdmin()) {
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

    function changeAdmin(address newAdmin) external virtual ifAdmin {
        _changeAdmin(newAdmin);
    }

    function _proxyAdmin() internal view virtual returns (address) {
        return _getAdmin();
    }

    function _fallback() internal virtual override {
        super._fallback();
    }

    function _dispatchUpgradeToAndCall() private {
        (address newImplementation, bytes memory data) = abi.decode(
            msg.data[4:],
            (address, bytes)
        );
        _upgradeToAndCall(newImplementation, data);
    }

    function upgradeTo(address newImplementation) external ifAdmin {
        _upgradeToAndCall(newImplementation, bytes(""));
    }

    function upgradeToAndCall(
        address newImplementation,
        bytes calldata data
    ) external payable ifAdmin {
        _upgradeToAndCall(newImplementation, data);
    }
}
