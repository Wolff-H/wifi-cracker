use serde::Serialize;

pub mod run_command;
pub mod get_data_directory;



#[derive(Serialize)]
pub struct TimestampedData<T> {
    timestamp: i64,
    data: T,
}

pub fn to_timestamped_data<T>(data: T, timestamp: Option<i64>) -> TimestampedData<T> {
    TimestampedData {
        timestamp: timestamp.unwrap_or_else(|| chrono::Local::now().timestamp() * 1000),
        data,
    }
}