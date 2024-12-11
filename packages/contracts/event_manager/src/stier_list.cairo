//! A contract to manage tier lists, allowing users to create, update, and view tier lists, and vote
//! on the elements in them.

use starknet::ContractAddress;
use starknet::storage::Vec;
use crate::utils::time::Time;


type ShortString = felt252;

/// Represents a tier list.
// TODO(Gil): Complete the struct.
#[starknet::storage_node]
struct TierList {
    meta_data: TierListMeta,
    elements: Vec<TierListElement>,
    /// A 2D array where the first dimension is the element index and the second dimension is the
    /// number of times it was ranked in each tier.
    votes: Vec<Vec<u64>>,
}

#[derive(Copy, Drop, starknet::Store, Serde)]
struct TierListMeta {
    id: u64,
    name: ShortString,
    creation_time: Time,
    owner: ContractAddress,
}

/// Represents an element in a tier list.
#[derive(Clone, Drop, starknet::Store, Serde)]
struct TierListElement {
    name: ShortString,
    image_id: felt252,
}

#[starknet::interface]
trait ITierListMaker<T> {
    fn add_tier_list(
        ref self: T, name: ShortString, initial_elements: Span<TierListElement>,
    ) -> u64;
    fn get_tier_list_meta(self: @T, id: u64) -> TierListMeta;
    fn get_tier_list_elements(self: @T, id: u64) -> Span<TierListElement>;
    fn get_number_of_tier_lists(self: @T) -> u64;
    fn get_all_tier_lists(self: @T) -> Span<TierListMeta>;
}

#[starknet::contract]
mod tier_list_maker {
    use starknet::storage::VecTrait;
    use starknet::storage::StoragePointerReadAccess;
    use starknet::storage::StoragePointerWriteAccess;
    use starknet::storage::StoragePathEntry;
    use starknet::storage::MutableVecTrait;
    use starknet::storage::StorageMapWriteAccess;
    use starknet::ContractAddress;
    use starknet::storage::{Map, Vec};
    use crate::utils::time::TimeTrait;
    use super::{TierList, TierListElement, ShortString, TierListMeta};

    // TODO(Gil): Add filterable data structures for tier lists, e.g. by owner, creation time,
    // category, etc.
    #[storage]
    struct Storage {
        admins: Map<ContractAddress, bool>,
        tier_lists: Map<u64, TierList>,
        tier_list_order: Vec<u64>,
    }

    // The constructor of the contract. It is being called when the contract is deployed (see
    // deploy_contract.sh).
    #[constructor]
    fn constructor(ref self: ContractState, admin: ContractAddress) {
        self.admins.write(admin, true);
    }

    // #[generate_trait] is useful for traits with only one implementation. It generates a trait
    // with the same functions as the implementation.
    /// Helper functions that are not part of the interface.
    #[generate_trait]
    impl PrivateFunctionsImpl of PrivateFunctions {}

    // Implementing the contract interface. #[abi(embed_v0)] is used to indicate that the functions
    // should be part of the contract's ABI.
    #[abi(embed_v0)]
    impl TierListMakerImpl of super::ITierListMaker<ContractState> {
        fn add_tier_list(
            ref self: ContractState, name: ShortString, initial_elements: Span<TierListElement>,
        ) -> u64 {
            let tier_list_id = self.tier_list_order.len();
            let tier_list_meta = TierListMeta {
                id: tier_list_id,
                name,
                creation_time: TimeTrait::now(),
                owner: starknet::get_caller_address()
            };
            self.tier_list_order.append().write(tier_list_id);
            let tier_list_ptr = self.tier_lists.entry(tier_list_id);
            tier_list_ptr.meta_data.write(tier_list_meta);
            for element in initial_elements {
                tier_list_ptr.elements.append().write(element.clone());
            };
            tier_list_id
        }
        fn get_tier_list_meta(self: @ContractState, id: u64) -> TierListMeta {
            self.tier_lists.entry(id).meta_data.read()
        }
        fn get_tier_list_elements(self: @ContractState, id: u64) -> Span<TierListElement> {
            let mut res = array![];
            let tier_list_elements_ptr = self.tier_lists.entry(id).elements;
            let n_elements = tier_list_elements_ptr.len();
            #[cairofmt::skip]
            for element_id in 0..n_elements {
                res.append(tier_list_elements_ptr[element_id].read());
            };
            res.span()
        }
        fn get_number_of_tier_lists(self: @ContractState) -> u64 {
            self.tier_list_order.len()
        }
        fn get_all_tier_lists(self: @ContractState) -> Span<TierListMeta> {
            let mut res = array![];
            let n_tier_lists = self.tier_list_order.len();
            #[cairofmt::skip]
            for tier_list_id in 0..n_tier_lists {
                res.append(self.tier_lists.entry(tier_list_id).meta_data.read());
            };
            res.span()
        }
    }
}
