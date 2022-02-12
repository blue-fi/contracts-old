const { solidity } = require("ethereum-waffle");
const chai = require("chai");
chai.use(solidity);
const {
  expect,
  assert
} = chai;
const { BigNumber } = ethers;

describe("IdentDeFi", () => {
  let identDeFi;

  beforeEach(async () => {
    const IdentDeFi = await ethers.getContractFactory("IdentDeFi");

    identDeFi = await IdentDeFi.deploy();
  });

  it("Current balance of current address should be 0", async () => {
    const [account1] = await ethers.getSigners();

    expect(await identDeFi.balanceOf(account1.address)).to.equal(0);
  });
});
