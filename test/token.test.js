import { assertRevert } from "openzeppelin-solidity/test/helpers/assertRevert";

const sig = address => ({
  from: address
});

const MainCoin = artifacts.require("./MainCoin.sol");

contract("Token test", function([owner, another]) {
  beforeEach(async function() {
    this.token = await MainCoin.new();
  });

  it("should have mint initial balance", async function() {
    const balance = await this.token.balanceOf(owner);
    expect(balance.div(1e18).toNumber()).equal(500e6);
  });

  it("should be frozen by default", async function() {
    assert.isFalse(await this.token.unfrozen());
  });

  it("should reject transfer before unfreeze", async function() {
    await assertRevert(this.token.transfer(another, 50000, sig(owner)));
    await assertRevert(this.token.approve(another, 50000, sig(owner)));
    await assertRevert(this.token.increaseApproval(another, 50000, sig(owner)));
    await assertRevert(this.token.decreaseApproval(another, 100, sig(owner)));
    await assertRevert(
      this.token.transferFrom(owner, another, 100, sig(another))
    );
  });

  it("should reject burning before unfreeze", async function() {
    await assertRevert(this.token.burn(500, sig(owner)));
  });

  it("should reject unfreeze from non-owners", async function() {
    await assertRevert(this.token.unfreeze(sig(another)));
  });

  it("should allow owner unfreeze token", async function() {
    await this.token.unfreeze(sig(owner));
    assert.isTrue(
      await this.token.unfrozen(),
      "Token isn't finali after finali action"
    );
  });

  it("should revert after second try", async function() {
    await this.token.unfreeze(sig(owner));
    await assertRevert(this.token.unfreeze(sig(owner)));
  });

  it("should fire Unfreeze event in unfreeze action", async function() {
    const { logs } = await this.token.unfreeze(sig(owner));
    assert.equal(logs.length, 1);
    assert.equal(logs[0].event, "Unfreeze");
  });

  it("should allow to transfer tokens after unfreeze", async function() {
    await this.token.unfreeze(sig(owner));
    await this.token.transfer(another, 5000, sig(owner));
    await this.token.approve(another, 50000, sig(owner));
    await this.token.increaseApproval(another, 1000, sig(owner));
    await this.token.decreaseApproval(another, 1000, sig(owner));
    await this.token.transferFrom(owner, another, 25000, sig(another));
  });

  it("should reject allowing address from non-owner", async function() {
    await assertRevert(this.token.allowTransfer(another, sig(another)));
  });

  it("should accept allowing address from non-owner", async function() {
    await this.token.allowTransfer(owner, sig(owner));
  });

  it("should allows transfer from/to special addresses (before unfreeze)", async function() {
    assert.isFalse(await this.token.unfrozen());
    await this.token.allowTransfer(owner, sig(owner));
    await this.token.transfer(another, 5000, sig(owner));
    await assertRevert(this.token.transfer(another, 50, sig(another)));

    await this.token.approve(another, 50000, sig(owner));
    await this.token.increaseApproval(another, 1000, sig(owner));
    await this.token.decreaseApproval(another, 1000, sig(owner));
    await this.token.transferFrom(owner, another, 25000, sig(another));
  });
});
