require('dotenv').config();
const { solidity } = require("ethereum-waffle");
const chai = require("chai");
const { ethers } = require("hardhat");
chai.use(solidity);
const {
  expect,
  assert
} = chai;
const { BigNumber } = ethers;
const Arguments = require("../arguments/idf-arguments");
const {
  SERVER_URL,
  ORACLE,
  JOB_ID,
  FEE,
  PRICE,
  NETWORK
} = process.env;

describe("IdentDeFi", () => {
  let identDeFi;

  beforeEach(async () => {
    const IdentDeFi = await ethers.getContractFactory("IdentDeFi");

    identDeFi = await IdentDeFi.deploy(...Arguments);
  });

  it("Current balance of current address should be 0", async () => {
    const [account1] = await ethers.getSigners();

    expect(await identDeFi.balanceOf(account1.address)).to.equal(0);
  });

  it("tokenOf should return 0 for invalid address", async () => {
    const [account1] = await ethers.getSigners();

    expect(await identDeFi.tokenOf(account1.address)).to.equal(0);
  });

  it("verify should return false for invalid address", async () => {
    const [account1] = await ethers.getSigners();

    expect(await identDeFi.verified(account1.address)).to.equal(false);
  });

  it("verify path should be correct match to server API and Network", async () => {
    expect(await identDeFi.path()).to.equal(`${SERVER_URL}${NETWORK}`);
  });

  it(`verify price should equal ${PRICE} ETH`, async () => {
    expect(await identDeFi.price()).to.equal(ethers.utils.parseEther(`${PRICE}`));
  });

  it(`jobId should only be read by owner`, async () => {
    expect(await identDeFi.jobId()).to.equal('0x6263373436363131656265653430613339383962626534396531326130326239');
  });

  it(`oracle should only be ${ORACLE}`, async () => {
    expect(await identDeFi.oracle()).to.equal(`${ORACLE}`);
  });

  it(`verify fee should equal ${FEE}`, async () => {
    expect(await identDeFi.fee()).to.equal(ethers.utils.parseEther(`${FEE}`));
  });

  it(`Mint verification should only work when price has been satisfied`, async () => {
    const [
      account1,
      account2
    ] = await ethers.getSigners();

    await expect(identDeFi.connect(account2).mintVerification({value: ethers.utils.parseEther("0.01")})).to.be.revertedWith('IdentDeFI::mintVerification: Paid value is insufficiant');

    const validationSuccessEvent = new Promise((resolve, reject) => {
      identDeFi.on('ValidationSuccess', (_account, _tokenId, event) => {
        event.removeListener();

        return resolve({
          _account,
          _tokenId
        });
      });
      setTimeout(() => reject(new Error('timeout')), 60000);
    });

    await identDeFi.mint(account2.address);
    const event = await validationSuccessEvent;

    assert.equal(event._account, account2.address);
    assert.equal(event._tokenId, 1);
  });

  it(`Minting more than once should throw error`, async () => {
    const [
      account1,
      account2
    ] = await ethers.getSigners();

    await identDeFi.mint(account2.address);
    await expect(identDeFi.connect(account2).mintVerification({value: ethers.utils.parseEther("0.1")})).to.be.revertedWith('IdentDeFI::mintVerification: Only 1 token per address allowed');
  });

  it(`All transfers should throw`, async () => {
    const [
      account1,
      account2
    ] = await ethers.getSigners();

    await identDeFi.mint(account2.address);
    const tokenId = await identDeFi.tokenOf(account2.address);

    await expect(identDeFi.connect(account2).transferFrom(account2.address, account1.address, tokenId)).to.be.revertedWith('IdentDeFI::transfer: Not allowed');
  });

  it(`Address should be verifiable`, async () => {
    const [
      account1,
      account2
    ] = await ethers.getSigners();

    await identDeFi.mint(account2.address);

    expect(await identDeFi.verified(account2.address)).to.equal(true);
  });

  it(`Minting tokens should incrememnt the ID`, async () => {
    const [
      account1,
      account2
    ] = await ethers.getSigners();

    await identDeFi.mint(account1.address);
    await identDeFi.mint(account2.address);

    expect(await identDeFi.tokenOf(account1.address)).to.equal(1);
    expect(await identDeFi.tokenOf(account2.address)).to.equal(2);
  });

  it(`Only token holders or owners can revoke tokens`, async () => {
    const [
      account1,
      account2,
      account3
    ] = await ethers.getSigners();

    await identDeFi.mint(account2.address);
    await identDeFi.mint(account3.address);
    const tokenId2 = await identDeFi.tokenOf(account2.address);
    const tokenId3 = await identDeFi.tokenOf(account3.address);

    await expect(identDeFi.connect(account2).revoke(tokenId3)).to.be.revertedWith('IdentDeFI::onlyOwnerOrHolder: Invalid signer address.');
    await identDeFi.connect(account1).revoke(tokenId3);
    expect(await identDeFi.tokenOf(account3.address)).to.equal(0);
    await identDeFi.connect(account2).revoke(tokenId2);
    expect(await identDeFi.tokenOf(account2.address)).to.equal(0);
  });

  it(`Revoking should emit event`, async () => {
    const [
      account1,
      account2,
      account3
    ] = await ethers.getSigners();

    await identDeFi.mint(account2.address);
    await identDeFi.mint(account3.address);
    const tokenId2 = await identDeFi.tokenOf(account2.address);
    const tokenId3 = await identDeFi.tokenOf(account3.address);

    const tokenRevokedEvent1 = new Promise((resolve, reject) => {
      identDeFi.on('TokenRevoked', (_tokenId, _account, _revoker, event) => {
        event.removeListener();
        return resolve({
          _account,
          _tokenId,
          _revoker
        });
      });
      setTimeout(() => reject(new Error('timeout')), 60000);
    });

    await identDeFi.connect(account2).revoke(tokenId2);
    const event1 = await tokenRevokedEvent1;

    assert.equal(event1._account, account2.address);
    assert.equal(event1._revoker, account2.address);
    assert.equal(`${event1._tokenId}`, `${tokenId2}`);

    const tokenRevokedEvent2 = new Promise((resolve, reject) => {
      identDeFi.on('TokenRevoked', (_tokenId, _account, _revoker, event) => {
        event.removeListener();
        return resolve({
          _account,
          _tokenId,
          _revoker
        });
      });
      setTimeout(() => reject(new Error('timeout')), 60000);
    });

    await identDeFi.connect(account1).revoke(tokenId3);
    const event2 = await tokenRevokedEvent2;

    assert.equal(event2._account, account3.address);
    assert.equal(event2._revoker, account1.address);
    assert.equal(`${event2._tokenId}`, `${tokenId3}`);
  });
});
