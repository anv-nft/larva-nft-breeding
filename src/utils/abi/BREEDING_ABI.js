const BREEDING_ABI = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "tokenOwner",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "enum baby.legendaryType",
				"name": "_breedingType",
				"type": "uint8"
			}
		],
		"name": "Breeded",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "beforeAddress",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "afterAddress",
				"type": "address"
			}
		],
		"name": "Setted",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_parent",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "parent1TokenId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "parent2TokenId",
				"type": "uint256"
			}
		],
		"name": "breeding",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "enum baby.legendaryType",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_parent",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "getCoolTime",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "parent",
		"outputs": [
			{
				"internalType": "string",
				"name": "baseURI",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "child",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "baseCoolTime",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "parentDataContract",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "childDataContract",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "tokenAddress",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "breedingFee",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_parent",
				"type": "address"
			}
		],
		"name": "reddem",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "renounceOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_parent",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_cooltime",
				"type": "uint256"
			}
		],
		"name": "setBaseCoolTime",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_parent",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "_baseURI",
				"type": "string"
			}
		],
		"name": "setBaseURI",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_parent",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_breedingFee",
				"type": "uint256"
			}
		],
		"name": "setBreedingFee",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_parent",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_parentDataContract",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_childDataContract",
				"type": "address"
			}
		],
		"name": "setDataContract",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_parent",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "child",
				"type": "address"
			}
		],
		"name": "setTargetAddress",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_parent",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "tokenAddress",
				"type": "address"
			}
		],
		"name": "setTokenAddress",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_parent",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_parentDataContract",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_childDataContract",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_child",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_tokenAddress",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "_baseURI",
				"type": "string"
			}
		],
		"name": "settingAll",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]

module.exports = {
	BREEDING_ABI
}
