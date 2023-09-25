#!/bin/bash

DOWNLOAD_PATH="/root/.cache/hardhat-nodejs/compilers-v2/linux-amd64"
REPOSITORY_PATH="https://binaries.soliditylang.org/linux-amd64"

# Solc binaries to download
declare -a BINARIES=(
  "solc-linux-amd64-v0.5.0+commit.1d4f565a"
  "solc-linux-amd64-v0.5.16+commit.9c3226ce"
  "solc-linux-amd64-v0.6.6+commit.6c089d02"
  "solc-linux-amd64-v0.6.12+commit.27d51765"
)

mkdir -p $DOWNLOAD_PATH
wget -O $DOWNLOAD_PATH/list.json $REPOSITORY_PATH/list.json

for SOLC_BINARY in "${BINARIES[@]}"
do
   wget -O $DOWNLOAD_PATH/"$SOLC_BINARY" $REPOSITORY_PATH/"$SOLC_BINARY"
done

chmod -R 755 $DOWNLOAD_PATH
