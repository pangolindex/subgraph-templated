pragma solidity =0.8.15;

contract Greeter {
    string private greeting;

    event GreetingSet(string greeting);

    constructor() {}

    function greet() public view returns (string memory) {
        return greeting;
    }

    function setGreeting(string memory _greeting) public {
        greeting = _greeting;
        emit GreetingSet(_greeting);
    }
}
