#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use crate::commands::get_page;
use crate::models::{GetPageRequest, GetPageResponse};
use commands::MyZipInfo;
use models::ZipInfo;
use std::sync::Arc;
use tauri::Manager;
use tokio::sync::Mutex;

mod commands;
mod models;

fn main() {
    tauri::Builder::default()
        .manage(MyZipInfo(Arc::new(Mutex::new(ZipInfo::new()))))
        .setup(|app| {
            // listen to the `event-name` (emitted on any window)
            let handle1 = app.handle();
            app.listen_global("get-page-request", move |event| {
                let req: GetPageRequest = serde_json::from_str(event.payload().unwrap()).unwrap();
                let contents = get_page(req.page, &req.path);
                handle1
                    .emit_all(
                        "get-page-response",
                        GetPageResponse {
                            request: req,
                            contents,
                        },
                    )
                    .unwrap();
            });
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![commands::set_current_zip,])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
