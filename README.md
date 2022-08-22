# Uniswap V2 test in NEON

This project demonstrates usage of Uniswap V2 in NEON environment.

# Testing of Uni V2 LP tokens farming
- testing actions in Uniswap V2 protocol
- addition of 2 pools (one with native SOL token, one with two non-native
tokens)
- deployment of router contracts, testing the "swap_with_exact_input" and "swap_with_exact_output" variants)
- testing the LP farming scenario
- adding liquidity to the two deployed swap pairs, minting LP tokens - performing swaps in both pools, receiving rewards
- gathering rewards from both pools after swaps
- transfer of part of LP tokens from one farming address to another - swaps and rewards receive with new LP tokens distribution

Run:

```shell
npx hardhat run ./scripts/deploy.ts
```

To use wrapped SOL token set
SOL_ADDRESS=""
