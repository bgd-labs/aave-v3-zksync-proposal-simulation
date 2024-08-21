-include .env

# install era-test-node
install-deps:; 
	curl --proto '=https' -sSf https://raw.githubusercontent.com/matter-labs/era-test-node/main/scripts/install.sh > install.sh
	chmod +x install.sh
	sudo ./install.sh
	rm ./install.sh

# start zksync era node
start-node:; 
	era_test_node --show-calls=all fork ${RPC_ZKSYNC}

# execute script
execute-script:;
	npx hardhat run scripts/execute.ts