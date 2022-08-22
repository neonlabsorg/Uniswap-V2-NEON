import { ethers } from "hardhat";

require('dotenv').config();

const overrides = { gasLimit: 1e10 }
const MaxUint256 = ethers.constants.MaxUint256;

let fromEther = ethers.utils.parseEther
let toEther = ethers.utils.formatEther

var SOL_ADDRESS = process.env.SOL_ADDRESS || "";

async function fixture() {
  var [deployer] = await ethers.getSigners();

  const ERC20 = await ethers.getContractFactory("contracts/v2-core/test/ERC20.sol:ERC20");
  const UniswapV2Factory = await ethers.getContractFactory("UniswapV2Factory");
  const UniswapV2Router01 = await ethers.getContractFactory("UniswapV2Router01");
  const Pair = await ethers.getContractFactory("UniswapV2Pair");

  const tokenA = SOL_ADDRESS ? await ERC20.attach(SOL_ADDRESS) : await ERC20.deploy(fromEther('10000'))
  const tokenB = await ERC20.deploy(fromEther('10000'))
  const WETH = await ERC20.deploy(fromEther('10000'))
  const WETHPartner = await ERC20.deploy(fromEther('10000'))

  await tokenA.deployed()
  await tokenB.deployed()
  await WETH.deployed()
  await WETHPartner.deployed()

  const factoryV2 = await UniswapV2Factory.deploy(deployer.address)
  await factoryV2.deployed()

  const router = await UniswapV2Router01.deploy(factoryV2.address, WETH.address, overrides)
  await router.deployed()

  await factoryV2.createPair(tokenA.address, tokenB.address)
  const pairAddress = await factoryV2.getPair(tokenA.address, tokenB.address)
  const pair = await Pair.attach(pairAddress)

  return {router: router, pair: pair};
}

async function main() {
  
  const ERC20 = await ethers.getContractFactory("contracts/v2-core/test/ERC20.sol:ERC20");

  var [LP, user, beneficiary] = await ethers.getSigners();

  var {router, pair} = await fixture();

  const token0 = await ERC20.attach(await pair.token0());
  const token1 = await ERC20.attach(await pair.token1());

  await token0.transfer(LP.address, fromEther('10'))
  await token1.transfer(LP.address, fromEther('10'))

  console.log("LP initial balances    token0:", toEther(await token0.balanceOf(LP.address)), "   token1:", toEther(await token1.balanceOf(LP.address)), "    LP token:", toEther(await pair.balanceOf(LP.address)))
  console.log("Pair total supply:", toEther(await pair.totalSupply()))
  
  await token0.connect(LP).approve(router.address, MaxUint256)
  await token1.connect(LP).approve(router.address, MaxUint256)
  await router.connect(LP).addLiquidity(token0.address, token1.address, fromEther('10'), fromEther('10'), 0, 0, LP.address, MaxUint256, overrides)
  
  console.log("\nLP adds liquidity to the pool")

  console.log("LP current balances    token0:", toEther(await token0.balanceOf(LP.address)), "   token1:", toEther(await token1.balanceOf(LP.address)), "    LP token:", toEther(await pair.balanceOf(LP.address)))
  console.log("Pair total supply:", toEther(await pair.totalSupply()))

  await token0.transfer(user.address, fromEther('10'))
  await token1.transfer(user.address, fromEther('10'))
  
  await token0.connect(user).approve(router.address, MaxUint256)
  await token1.connect(user).approve(router.address, MaxUint256)

  var swapAmount = fromEther('1')
  var outputAmount = fromEther('1')
  console.log("\nUser performs swaps token0 -> token1 in the pool with swap amount 1 ether using router.swapExactTokensForTokens()\n")
  await router.connect(user).swapExactTokensForTokens(swapAmount, 0, [token0.address, token1.address], user.address, MaxUint256, overrides)
  console.log("\nSwap 1");
  console.log("User balance    token0:", toEther(await token0.balanceOf(user.address)), "   token1:", toEther(await token1.balanceOf(user.address)))
  console.log("Pool balance    token0:", toEther(await token0.balanceOf(pair.address)), "   token1:", toEther(await token1.balanceOf(pair.address)))
  await router.connect(user).swapExactTokensForTokens(swapAmount, 0, [token0.address, token1.address], user.address, MaxUint256, overrides)
  console.log("\nSwap 2");
  console.log("User balance    token0:", toEther(await token0.balanceOf(user.address)), "   token1:", toEther(await token1.balanceOf(user.address)))
  console.log("Pool balance    token0:", toEther(await token0.balanceOf(pair.address)), "   token1:", toEther(await token1.balanceOf(pair.address)))
  await router.connect(user).swapExactTokensForTokens(swapAmount, 0, [token0.address, token1.address], user.address, MaxUint256, overrides)
  console.log("\nSwap 3");
  console.log("User balance    token0:", toEther(await token0.balanceOf(user.address)), "   token1:", toEther(await token1.balanceOf(user.address)))
  console.log("Pool balance    token0:", toEther(await token0.balanceOf(pair.address)), "   token1:", toEther(await token1.balanceOf(pair.address)))
  await router.connect(user).swapExactTokensForTokens(swapAmount, 0, [token0.address, token1.address], user.address, MaxUint256, overrides)
  console.log("\nSwap 4");
  console.log("User balance    token0:", toEther(await token0.balanceOf(user.address)), "   token1:", toEther(await token1.balanceOf(user.address)))
  console.log("Pool balance    token0:", toEther(await token0.balanceOf(pair.address)), "   token1:", toEther(await token1.balanceOf(pair.address)))
  await router.connect(user).swapExactTokensForTokens(swapAmount, 0, [token0.address, token1.address], user.address, MaxUint256, overrides)
  console.log("\nSwap 5");
  console.log("User balance    token0:", toEther(await token0.balanceOf(user.address)), "   token1:", toEther(await token1.balanceOf(user.address)))
  console.log("Pool balance    token0:", toEther(await token0.balanceOf(pair.address)), "   token1:", toEther(await token1.balanceOf(pair.address)))

  console.log("\nUser performs swaps token1 -> token0 in the pool with output amount 1 ether using router.swapTokensForExactTokens()")
  await router.connect(user).swapTokensForExactTokens(outputAmount, MaxUint256, [token1.address, token0.address], user.address, MaxUint256, overrides)
  console.log("\nSwap 1");
  console.log("User balance    token0:", toEther(await token0.balanceOf(user.address)), "   token1:", toEther(await token1.balanceOf(user.address)))
  console.log("Pool balance    token0:", toEther(await token0.balanceOf(pair.address)), "   token1:", toEther(await token1.balanceOf(pair.address)))
  await router.connect(user).swapTokensForExactTokens(outputAmount, MaxUint256, [token1.address, token0.address], user.address, MaxUint256, overrides)
  console.log("\nSwap 2");
  console.log("User balance    token0:", toEther(await token0.balanceOf(user.address)), "   token1:", toEther(await token1.balanceOf(user.address)))
  console.log("Pool balance    token0:", toEther(await token0.balanceOf(pair.address)), "   token1:", toEther(await token1.balanceOf(pair.address)))
  await router.connect(user).swapTokensForExactTokens(outputAmount, MaxUint256, [token1.address, token0.address], user.address, MaxUint256, overrides)
  console.log("\nSwap 3");
  console.log("User balance    token0:", toEther(await token0.balanceOf(user.address)), "   token1:", toEther(await token1.balanceOf(user.address)))
  console.log("Pool balance    token0:", toEther(await token0.balanceOf(pair.address)), "   token1:", toEther(await token1.balanceOf(pair.address)))
  await router.connect(user).swapTokensForExactTokens(outputAmount, MaxUint256, [token1.address, token0.address], user.address, MaxUint256, overrides)
  console.log("\nSwap 4");
  console.log("User balance    token0:", toEther(await token0.balanceOf(user.address)), "   token1:", toEther(await token1.balanceOf(user.address)))
  console.log("Pool balance    token0:", toEther(await token0.balanceOf(pair.address)), "   token1:", toEther(await token1.balanceOf(pair.address)))
  await router.connect(user).swapTokensForExactTokens(outputAmount, MaxUint256, [token1.address, token0.address], user.address, MaxUint256, overrides)
  console.log("\nSwap 5");
  console.log("User balance    token0:", toEther(await token0.balanceOf(user.address)), "   token1:", toEther(await token1.balanceOf(user.address)))
  console.log("Pool balance    token0:", toEther(await token0.balanceOf(pair.address)), "   token1:", toEther(await token1.balanceOf(pair.address)))
  
  console.log("\n\nLP transfers LP tokens to beneficiary");
  await pair.connect(LP).transfer(beneficiary.address, await pair.balanceOf(LP.address))
  console.log("LP current balances             token0:", toEther(await token0.balanceOf(LP.address)), "   token1:", toEther(await token1.balanceOf(LP.address)), "    LP token:", toEther(await pair.balanceOf(LP.address)))
  console.log("Beneficiary current balances    token0:", toEther(await token0.balanceOf(beneficiary.address)), "   token1:", toEther(await token1.balanceOf(beneficiary.address)), "    LP token:", toEther(await pair.balanceOf(beneficiary.address)))
  await pair.connect(beneficiary).approve(router.address, MaxUint256)
  
  console.log("\nBeneficiary removes liquidity from the pool collecting rewards");
  await router.connect(beneficiary).removeLiquidity(token0.address, token1.address, await pair.balanceOf(beneficiary.address), 0, 0, beneficiary.address, MaxUint256, overrides)
  console.log("Beneficiary current balances    token0:", toEther(await token0.balanceOf(beneficiary.address)), "   token1:", toEther(await token1.balanceOf(beneficiary.address)), "    LP token:", toEther(await pair.balanceOf(beneficiary.address)))
  console.log("Pair total supply:", toEther(await pair.totalSupply()))
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
