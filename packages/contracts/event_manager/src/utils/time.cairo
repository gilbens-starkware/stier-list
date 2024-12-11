const MINUTE: u64 = 60;
const HOUR: u64 = 60 * MINUTE;
const DAY: u64 = 24 * HOUR;
const WEEK: u64 = 7 * DAY;

/// Represents a Unix timestamp.
#[derive(Copy, Drop, Serde, starknet::Store)]
pub struct Time {
    /// The number of seconds since 1970-01-01 00:00:00 UTC.
    seconds: u64,
}
/// Common time-related operations.
// TODO: Complete the TimeTrait implementation. As for now it just contains the minimum required to
// make the contract work.
#[generate_trait]
pub impl TimeImpl of TimeTrait {
    fn new(seconds: u64) -> Time {
        Time { seconds }
    }
    fn now() -> Time {
        Time { seconds: starknet::get_block_timestamp() }
    }
    /// Returns the number of days since 1970-01-01 00:00:00 UTC.
    fn day(self: Time) -> u64 {
        self.seconds / DAY
    }
    /// Returns the number of weeks since 1970-01-01 00:00:00 UTC.
    fn week(self: Time) -> u64 {
        self.seconds / WEEK
    }
}

impl TimePartialEq of PartialEq<Time> {
    fn eq(lhs: @Time, rhs: @Time) -> bool {
        lhs.seconds == rhs.seconds
    }
}

impl TimePartialOrd of PartialOrd<Time> {
    fn lt(lhs: Time, rhs: Time) -> bool {
        lhs.seconds < rhs.seconds
    }
}
