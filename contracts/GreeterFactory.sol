pragma solidity =0.8.15;

import "./Greeter.sol";

contract GreeterFactory {
    uint256 private index;

    event GreeterCreated(address greeter);

    constructor() {}

    function create() external returns (address greeter) {
        bytes memory bytecode = type(Greeter).creationCode;
        bytes32 salt = keccak256(abi.encodePacked(++index));
        assembly {
            greeter := create2(0, add(bytecode, 32), mload(bytecode), salt)
        }
        require(greeter != address(0), 'Greeter Exists');
        emit GreeterCreated(greeter);
    }

    function createManually(address manuallyCreated) external returns (address) {
        ++index;
        emit GreeterCreated(manuallyCreated);
        return manuallyCreated;
    }
}
