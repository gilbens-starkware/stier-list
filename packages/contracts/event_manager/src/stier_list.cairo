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
    image_id: felt252,
}
// TODO(Gil): Make variable number of tiers.
const NUM_TIERS: u64 = 5;
/// Represents an element in a tier list.
#[derive(Clone, Drop, starknet::Store, Serde)]
struct TierListElement {
    name: ShortString,
    image_id: felt252,
}

#[derive(Copy, Drop, Serde)]
struct VotesAndId {
    image_id: felt252,
    votes: Span<u64>,
}

#[starknet::interface]
trait ITierListMaker<T> {
    fn add_tier_list(
        ref self: T, name: ShortString, initial_elements: Span<TierListElement>, image_id: felt252,
    ) -> u64;
    fn get_tier_list_meta(self: @T, id: u64) -> TierListMeta;
    fn get_tier_list_elements(self: @T, id: u64) -> Span<TierListElement>;
    fn get_number_of_tier_lists(self: @T) -> u64;
    fn get_all_tier_lists(self: @T, n_max: usize) -> Span<TierListMeta>;
    fn vote_to_list(ref self: T, list_id: u64, votes: Span<u64>);
    fn get_votes(self: @T, list_id: u64) -> Span<VotesAndId>;
}

#[starknet::contract]
mod tier_list_maker {
    use starknet::storage::MutableVecTrait;
    use starknet::storage::VecTrait;
    use starknet::storage::StoragePointerReadAccess;
    use starknet::storage::StoragePointerWriteAccess;
    use starknet::storage::StoragePathEntry;
    use starknet::storage::StorageMapWriteAccess;
    use starknet::ContractAddress;
    use starknet::storage::{Map, Vec};
    use crate::utils::time::TimeTrait;
    use super::{TierList, TierListElement, ShortString, TierListMeta, VotesAndId};
    use openzeppelin::token::erc20::{ERC20Component};

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
            ref self: ContractState,
            name: ShortString,
            initial_elements: Span<TierListElement>,
            image_id: felt252,
        ) -> u64 {
            let tier_list_id = self.tier_list_order.len();
            let tier_list_meta = TierListMeta {
                id: tier_list_id,
                name,
                creation_time: TimeTrait::now(),
                owner: starknet::get_caller_address(),
                image_id,
            };
            self.tier_list_order.append().write(tier_list_id);
            let tier_list_ptr = self.tier_lists.entry(tier_list_id);
            tier_list_ptr.meta_data.write(tier_list_meta);
            let mut c = 0;
            for element in initial_elements {
                tier_list_ptr.elements.append().write(element.clone());
                tier_list_ptr.votes.append();
                #[cairofmt::skip]
                for _ in 0..super::NUM_TIERS {
                    tier_list_ptr.votes[c].append();
                };
                c += 1;
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
        fn get_all_tier_lists(self: @ContractState, n_max: usize) -> Span<TierListMeta> {
            let mut res = array![];
            let n_tier_lists = self.tier_list_order.len();
            for tier_list_id in 0..n_tier_lists {
                res.append(self.tier_lists.entry(tier_list_id).meta_data.read());
                if res.len().into() == n_max {
                    break;
                };
            };
            res.span()
        }
        fn vote_to_list(ref self: ContractState, list_id: u64, votes: Span<u64>) {
            let tier_list_ptr = self.tier_lists.entry(list_id);
            let n_elements = tier_list_ptr.elements.len();
            assert!(
                votes.len().into() == n_elements,
                "Votes length does not match the number of elements, {} != {}",
                votes.len(),
                n_elements,
            );
            let mut votes_ptr = tier_list_ptr.votes;
            for i in 0..n_elements {
                let element_votes_ptr = votes_ptr[i];
                let voted_tier = votes[i.try_into().unwrap()];
                let vote_ptr = element_votes_ptr[*voted_tier.into()];
                vote_ptr.write(vote_ptr.read() + 1);
            };
        }
        fn get_votes(self: @ContractState, list_id: u64) -> Span<VotesAndId> {
            let tier_list_ptr = self.tier_lists.entry(list_id);
            let n_elements = tier_list_ptr.elements.len();
            let mut res = array![];
            let votes_ptr = tier_list_ptr.votes;
            for i in 0..n_elements {
                let element_votes_ptr = votes_ptr[i];
                let mut element_votes = array![];
                for j in 0..super::NUM_TIERS {
                    element_votes.append(element_votes_ptr[j].read());
                };
                let image_id = tier_list_ptr.elements[i].image_id.read();
                res.append(VotesAndId { image_id, votes: element_votes.span() });
            };
            res.span()
        }
    }
}
