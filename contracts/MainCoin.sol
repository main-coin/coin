pragma solidity ^0.4.24;
import "openzeppelin-solidity/contracts/token/ERC20/BurnableToken.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

/// @title Alex token implementation
/// @author Aler Denisov <aler.zampillo@gmail.com>
/// @dev Implements ERC20
contract MainCoin is BurnableToken, Ownable {
  /// @notice Constant field with token full name
  // solium-disable-next-line uppercase
  string constant public name = "MainCoin"; 
  /// @notice Constant field with token symbol
  string constant public symbol = "MNC"; // solium-disable-line uppercase
  /// @notice Constant field with token precision depth
  uint256 constant public decimals = 18; // solium-disable-line uppercase
  /// @notice Constant field with token cap (total supply limit) - 500M 
  uint256 constant public initial = 500 ether * 10 ** 6; // solium-disable-line uppercase

  mapping (address=>bool) public allowedAddresses;
  bool public unfrozen;

  event Unfreeze();

  constructor() public {
    _mint(msg.sender, initial);
  }


  function allowTransfer(address _for) public onlyOwner returns (bool) {
    allowedAddresses[_for] = true;
    return true;
  }

  function disableTransfer(address _for) public onlyOwner returns (bool) {
    allowedAddresses[_for] = false;
    return true;
  }
  
  modifier isTrasferAllowed(address a, address b) {
    require(unfrozen || allowedAddresses[a] || allowedAddresses[b]);
    _;
  }
  /// @notice Finalizes contract
  /// @dev Requires owner role to interact
  /// @return A boolean that indicates if the operation was successful.
  function unfreeze() public onlyOwner returns (bool) {
    require(!unfrozen);
    unfrozen = true;
    emit Unfreeze();
    return true;
  }


  /// @dev Overrides burnable interface to prevent interaction before finalization
  function burn(uint256 _value) public isTrasferAllowed(msg.sender, address(0x0)) {
    super.burn(_value);
  }

  /// @dev Overrides burnable interface to prevent interaction before finalization
  function burnFrom(address _from, uint256 _value) isTrasferAllowed(_from, address(0x0)) public {
    super.burnFrom(_from, _value);
  }

  /// @dev Overrides ERC20 interface to prevent interaction before finalization
  function transferFrom(address _from, address _to, uint256 _value) public isTrasferAllowed(_from, _to) returns (bool) {
    return super.transferFrom(_from, _to, _value);
  }

  /// @dev Overrides ERC20 interface to prevent interaction before finalization
  function transfer(address _to, uint256 _value) public isTrasferAllowed(msg.sender, _to) returns (bool) {
    return super.transfer(_to, _value);
  }

  /// @dev Overrides ERC20 interface to prevent interaction before finalization
  function approve(address _spender, uint256 _value) public isTrasferAllowed(msg.sender, _spender) returns (bool) {
    return super.approve(_spender, _value);
  }

  /// @dev Overrides ERC20 interface to prevent interaction before finalization
  function increaseApproval(address _spender, uint256 _addedValue) public isTrasferAllowed(msg.sender, _spender) returns (bool) {
    return super.increaseApproval(_spender, _addedValue);
  }

  /// @dev Overrides ERC20 interface to prevent interaction before finalization
  function decreaseApproval(address _spender, uint256 _subtractedValue) public isTrasferAllowed(msg.sender, _spender) returns (bool) {
    return super.decreaseApproval(_spender, _subtractedValue);
  }
}