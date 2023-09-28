FROM node:14

RUN apt-get update && apt-get install -y \
    wget \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY ./docker/entrypoint.sh /usr/local/bin
ENTRYPOINT ["/bin/sh", "/usr/local/bin/entrypoint.sh"]

COPY . /usr/src/app

# Download solc separatly as hardhat implementation is flucky
RUN ./docker/download_solc.sh

# Add env stubs and compile Solidity Artifacts
ENV NEON_PROXY_URL=https://a/ \
    NEON_ACCOUNTS=0x0000000000000000000000000000000000000000000000000000000000000000
RUN ./docker/compile.sh