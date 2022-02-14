const { solidity } = require("ethereum-waffle");
const chai = require("chai");
chai.use(solidity);
const {
  expect,
  assert
} = chai;
const { BigNumber } = ethers;
const Arguments = require("../arguments/idf-arguments");

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
});
