pragma solidity ^0.4.24;
import "openzeppelin-solidity/contracts/token/ERC20/StandardToken.sol";

/// @title Alex token implementation
/// @author Aler Denisov <aler.zampillo@gmail.com>
/// @dev Implements ERC20, ERC223
contract AlexToken is StandardToken {
  /// @notice Constant field with token full name
  // solium-disable-next-line uppercase
  string constant public name = "Alex token"; 
  /// @notice Constant field with token symbol
  string constant public symbol = "ALX"; // solium-disable-line uppercase
  /// @notice Constant field with token precision depth
  uint256 constant public decimals = 18; // solium-disable-line uppercase
  /// @notice Constant field with token cap (total supply limit) - 500M 
  uint256 constant public initial = 500 ether * 10 ** 6; // solium-disable-line uppercase

  constructor() {
    _mint(msg.sender, initial);
  }
}