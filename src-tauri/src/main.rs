#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use commands::{Counter, MyZipInfo};
use std::sync::Arc;
use tokio::sync::Mutex;
use zipinfo::ZipInfo;

mod commands;
mod zipinfo;

fn main() {
    tauri::Builder::default()
        .manage(MyZipInfo(Arc::new(Mutex::new(ZipInfo::new()))))
        .manage(Counter(Default::default()))
        .invoke_handler(tauri::generate_handler![
            commands::read_file,
            commands::counter,
            // test::get_image_from_current_zip,
            commands::set_current_zip,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
