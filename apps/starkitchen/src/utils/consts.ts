import { Abi } from '@starknet-react/core';
import { RpcProvider } from 'starknet';

/// A prefix to be added to the src path of resources (images, etc.) in order to correctly load them.
/// Production mode is when deploying the app to a server, github pages in our case.
export const SrcPrefix =
  import.meta.env.MODE === 'production' ? '/catering-app' : '';

/// The address of the deployed contract.
export const CONTRACT_ADDRESS =
  '0x038b229a17f4f618727770d6a9e8cccfca4abaa0f09d79dedf44cdf4db73779b';
export const PROVIDER = new RpcProvider({
  nodeUrl: 'https://starknet-sepolia.public.blastapi.io/rpc/v0_7',
});

/// The ABI of the deployed contract. Can be found on starkscan.
/// For the above contract, the ABI can be found at:
/// https://sepolia.starkscan.co/contract/0x038b229a17f4f618727770d6a9e8cccfca4abaa0f09d79dedf44cdf4db73779b
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
      },
      {
        "name": "image_id",
        "type": "core::felt252"
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
    "name": "core::array::Span::<core::integer::u64>",
    "type": "struct",
    "members": [
      {
        "name": "snapshot",
        "type": "@core::array::Array::<core::integer::u64>"
      }
    ]
  },
  {
    "name": "core::array::Span::<core::array::Span::<core::integer::u64>>",
    "type": "struct",
    "members": [
      {
        "name": "snapshot",
        "type": "@core::array::Array::<core::array::Span::<core::integer::u64>>"
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
          },
          {
            "name": "image_id",
            "type": "core::felt252"
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
        "inputs": [
          {
            "name": "n_max",
            "type": "core::integer::u32"
          }
        ],
        "outputs": [
          {
            "type": "core::array::Span::<stier_list::stier_list::TierListMeta>"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "vote_to_list",
        "type": "function",
        "inputs": [
          {
            "name": "list_id",
            "type": "core::integer::u64"
          },
          {
            "name": "votes",
            "type": "core::array::Span::<core::integer::u64>"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "name": "get_votes",
        "type": "function",
        "inputs": [
          {
            "name": "list_id",
            "type": "core::integer::u64"
          }
        ],
        "outputs": [
          {
            "type": "core::array::Span::<core::array::Span::<core::integer::u64>>"
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
