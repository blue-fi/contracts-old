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

    expect(await identDeFi.verify(account1.address)).to.equal(false);
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
      account2,
      account3
    ] = await ethers.getSigners();

    // console.log(await identDeFi.connect(account2).mintVerification());

    await expect(identDeFi.connect(account2).mintVerification()).to.be.revertedWith('IdentDeFI::mintVerification: paid value is insufficient');
    await expect(identDeFi.connect(account2).mintVerification({value: ethers.utils.parseEther("0.01")})).to.be.revertedWith('IdentDeFI::mintVerification: paid value is insufficient');

    // event InvalidValidation(address indexed _account);
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

    await identDeFi.connect(account2).mintVerification({value: ethers.utils.parseEther("0.1")});
    const event = await validationSuccessEvent;

    assert.equal(event._account, account2.address);
    assert.equal(event._tokenId, 1);
  });
  // string public path;
  // address private _oracle;
  // bytes32 private jobId;
  // uint256 private _fee;
  // uint256 public price;
  // it("All token transfers should revert", async () => {
  //   const [
  //     account1,
  //     account2
  //   ] = await ethers.getSigners();
  //
  //   await expect(identDeFi.connect(account1).transferFrom(account1.address, account2.address, 1)).to.be.revertedWith('IdentDeFI:_transfer: Not allowed');
  //   await expect(identDeFi.connect(account1).safeTransferFrom(account1.address, account2.address, 1)).to.be.revertedWith('IdentDeFI:_transfer: Not allowed');
  //   await expect(identDeFi.connect(account1).transferFrom(account1.address, account2.address, 1)).to.be.revertedWith('IdentDeFI:_transfer: Not allowed');
  // });
});
