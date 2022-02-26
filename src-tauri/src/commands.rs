use crate::zipinfo::ZipInfo;
use async_zip::error::ZipError;
use async_zip::read::seek::ZipFileReader;
use async_zip::read::ZipEntry;
use futures::future::join_all;
use std::borrow::{Borrow, BorrowMut};
use std::fs;
use std::ops::Deref;
use std::path::Path;
use std::sync::Arc;
use tauri::State;
use tokio::fs::File;
use tokio::sync::Mutex;
use tokio::task::JoinHandle;

// use tokio::fs::File;
pub struct MyZipInfo(pub Arc<Mutex<ZipInfo>>);

#[tauri::command]
pub fn read_file(path: &str) -> String {
    println!("In file {}", path);

    let contents = fs::read(path).expect("Something went wrong reading the file");
    base64::encode(contents)
}

pub struct Counter(pub Mutex<i32>);

#[tauri::command]
pub async fn counter(count_val: i32, counter: State<'_, Counter>) -> Result<i32, String> {
    // Lock the counter(Mutex) to get the current value
    let mut ct = counter.0.lock().await;

    // Change and return a new value
    *ct += count_val;
    Ok(*ct)
    // Mutex is automatically unlocked when you exit the block
}

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
        let mut file_reader = Arc::new(
            ZipFileReader::new(&mut file)
                .await
                .expect("Failed to read zip"),
        );
        println!("Setting current zip to: {}, was {}", &path, &zip_info.path);
        let enumerate = file_reader.entries().into_iter().enumerate();
        let pages = enumerate
            .map(|(i, z)| get_page(i, path.to_string()))
            .collect::<Vec<_>>();
        let pages = join_all(pages).await;
        println!("Page count: {}", &pages.len());
        println!("Page value: {}", &pages.first().expect("getting page"));
        let info = ZipInfo {
            path: path.to_string(),
            name: path.to_string(),
            length: pages.len(),
            pages,
        };
        *zip_info = info;
    });

    handle.await.expect("handle failed");

    let y = Arc::clone(&current_zip.inner().0);
    let info = y.lock().await;
    println!("Current zip is {}", &info.path);

    Ok(info.clone())
}

async fn get_page(index: usize, path: String) -> String {
    let mut file = tokio::fs::File::open(&path)
        .await
        .expect("Failed to get file");
    let mut zip_file_reader = ZipFileReader::new(&mut file)
        .await
        .expect("Failed to read zip");
    let entry_reader = zip_file_reader
        .entry_reader(index)
        .await
        .expect("read entry");
    let contents = entry_reader
        .read_to_end_crc()
        .await
        .expect("Failed to read entry as string");
    base64::encode(contents)
}

#[tauri::command]
pub async fn get_image_from_current_zip(
    page: usize,
    current_zip: State<'_, Mutex<ZipInfo>>,
) -> Result<String, ZipError> {
    let current = current_zip.inner();
    let x = current.lock().await;
    let mut file = tokio::fs::File::open(x.path.clone()).await.unwrap();
    let mut zip = ZipFileReader::new(&mut file).await.unwrap();
    let reader = zip.entry_reader(page).await.unwrap();
    reader.read_to_string_crc().await
}

async fn asd() {
    let mut file = tokio::fs::File::open("./Archive.zip").await.unwrap();
    let mut zip = ZipFileReader::new(&mut file).await.unwrap();

    for i in 0..zip.entries().len() {
        let reader = zip.entry_reader(i).await.unwrap();

        if reader.entry().dir() {
            continue;
        }

        let path_str = format!("./output/{}", reader.entry().name());
        let path = Path::new(&path_str);
        tokio::fs::create_dir_all(path.parent().unwrap())
            .await
            .unwrap();

        // let mut output = File::create(path).await.unwrap();
        // reader.copy_to_end_crc(&mut output, 65536).await.unwrap();
    }
}
