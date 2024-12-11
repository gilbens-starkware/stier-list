import { Abi } from '@starknet-react/core';

/// A prefix to be added to the src path of resources (images, etc.) in order to correctly load them.
/// Production mode is when deploying the app to a server, github pages in our case.
export const SrcPrefix =
  import.meta.env.MODE === 'production' ? '/catering-app' : '';

/// The address of the deployed contract.
export const CONTRACT_ADDRESS =
  '0x01fbb9ddf8a318ec6101fc9685964baae292c2c6aefe01e7a28b62a446df0fe4';
/// The ABI of the deployed contract. Can be found on starkscan.
/// For the above contract, the ABI can be found at:
/// https://sepolia.starkscan.co/contract/0x01fbb9ddf8a318ec6101fc9685964baae292c2c6aefe01e7a28b62a446df0fe4
/// And the ABI is accessible under the 'Class Code/History' tab -> 'Copy ABI Code' button.
export const ABI = [
  {
    "name": "TierListMakerImpl",
    "type": "impl",
    "interface_name": "stier_list::stier_list::ITierListMaker"
  },
  {
    "name": "stier_list::stier_list::TierListElement",
    "type": "struct",
    "members": [
      {
        "name": "name",
        "type": "core::felt252"
      },
      {
        "name": "image_id",
        "type": "core::felt252"
      }
    ]
  },
  {
    "name": "core::array::Span::<stier_list::stier_list::TierListElement>",
    "type": "struct",
    "members": [
      {
        "name": "snapshot",
        "type": "@core::array::Array::<stier_list::stier_list::TierListElement>"
      }
    ]
  },
  {
    "name": "stier_list::utils::time::Time",
    "type": "struct",
    "members": [
      {
        "name": "seconds",
        "type": "core::integer::u64"
      }
    ]
  },
  {
    "name": "stier_list::stier_list::TierListMeta",
    "type": "struct",
    "members": [
      {
        "name": "id",
        "type": "core::integer::u64"
      },
      {
        "name": "name",
        "type": "core::felt252"
      },
      {
        "name": "creation_time",
        "type": "stier_list::utils::time::Time"
      },
      {
        "name": "owner",
        "type": "core::starknet::contract_address::ContractAddress"
      }
    ]
  },
  {
    "name": "core::array::Span::<stier_list::stier_list::TierListMeta>",
    "type": "struct",
    "members": [
      {
        "name": "snapshot",
        "type": "@core::array::Array::<stier_list::stier_list::TierListMeta>"
      }
    ]
  },
  {
    "name": "stier_list::stier_list::ITierListMaker",
    "type": "interface",
    "items": [
      {
        "name": "add_tier_list",
        "type": "function",
        "inputs": [
          {
            "name": "name",
            "type": "core::felt252"
          },
          {
            "name": "initial_elements",
            "type": "core::array::Span::<stier_list::stier_list::TierListElement>"
          }
        ],
        "outputs": [
          {
            "type": "core::integer::u64"
          }
        ],
        "state_mutability": "external"
      },
      {
        "name": "get_tier_list_meta",
        "type": "function",
        "inputs": [
          {
            "name": "id",
            "type": "core::integer::u64"
          }
        ],
        "outputs": [
          {
            "type": "stier_list::stier_list::TierListMeta"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "get_tier_list_elements",
        "type": "function",
        "inputs": [
          {
            "name": "id",
            "type": "core::integer::u64"
          }
        ],
        "outputs": [
          {
            "type": "core::array::Span::<stier_list::stier_list::TierListElement>"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "get_number_of_tier_lists",
        "type": "function",
        "inputs": [],
        "outputs": [
          {
            "type": "core::integer::u64"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "get_all_tier_lists",
        "type": "function",
        "inputs": [],
        "outputs": [
          {
            "type": "core::array::Span::<stier_list::stier_list::TierListMeta>"
          }
        ],
        "state_mutability": "view"
      }
    ]
  },
  {
    "name": "constructor",
    "type": "constructor",
    "inputs": [
      {
        "name": "admin",
        "type": "core::starknet::contract_address::ContractAddress"
      }
    ]
  },
  {
    "kind": "enum",
    "name": "stier_list::stier_list::tier_list_maker::Event",
    "type": "event",
    "variants": []
  }
] as const satisfies Abi;
