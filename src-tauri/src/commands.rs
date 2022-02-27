use crate::models::ZipInfo;
use async_zip::read::seek::ZipFileReader;
use memmap::Mmap;
use piz::ZipArchive;
use std::ffi::OsStr;
use std::ops::Index;
use std::path::Path;
use std::sync::Arc;
use tauri::State;
use tokio::sync::Mutex;

// use tokio::fs::File;
pub struct MyZipInfo(pub Arc<Mutex<ZipInfo>>);

// ref https://medium.com/@marm.nakamura/trying-to-the-tauri-gui-on-rust-4-state-management-on-the-rust-side-8899bda08936
#[tauri::command]
pub async fn set_current_zip(
    path: String,
    current_zip: State<'_, MyZipInfo>,
) -> Result<ZipInfo, String> {
    let x = Arc::clone(&current_zip.inner().0);

    let handle = tokio::spawn(async move {
        let mut zip_info = x.lock().await;
        let mut file = tokio::fs::File::open(&path)
            .await
            .expect("Failed to get file");
        let file_reader = Arc::new(
            ZipFileReader::new(&mut file)
                .await
                .expect("Failed to read zip"),
        );

        println!("Setting current zip to: {}, was {}", &path, &zip_info.path);

        let info = ZipInfo {
            path: path.to_string(),
            name: get_filename_from_path(&path).unwrap().to_string(),
            length: file_reader.entries().len(),
        };
        *zip_info = info;
    });

    handle.await.expect("handle failed");

    let y = Arc::clone(&current_zip.inner().0);
    let info = y.lock().await;
    println!("Current zip is {}", &info.path);

    Ok(info.clone())
}

pub fn get_page(page: usize, path: &str) -> String {
    let zip_file = std::fs::File::open(path).unwrap();
    let mapping = unsafe { Mmap::map(&zip_file).unwrap() };
    let archive = ZipArchive::new(&mapping).unwrap();
    let entry = archive.entries().index(page);
    let mut reader = archive.read(entry).unwrap();
    let mut contents = Vec::new();
    reader.read_to_end(&mut contents).unwrap();
    base64::encode(contents)
}

fn get_filename_from_path(path: &str) -> Option<&str> {
    Path::new(path).file_name().and_then(OsStr::to_str)
}
