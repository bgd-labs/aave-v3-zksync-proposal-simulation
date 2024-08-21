# Aave v3 zkSync Activation Proposal Simulation

Repo for simulating the zksync activation proposal on [era-test-node](https://github.com/matter-labs/era-test-node)

## Setup

This will install era-test-node locally on your machine:

```sh
cp .env.example .env
make install-deps
yarn
```

## Fork simulation

1. Create an era-test-node fork of the zkSync mainnet that runs on locally on your machine.
```
make start-node
```

2. Open another terminal and run the following command. This will execute the payload and activate zkSync aave v3 market.
```
make execute-script
```

3. You can now use the era-test-node url (generally `http://127.0.0.1:8011`) instead of the rpc to test stuff on the UI or any other places.
