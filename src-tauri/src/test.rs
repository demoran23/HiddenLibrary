use base64;
use std::env;
use std::fs;

#[tauri::command]
pub fn test(input: String) {
    println!("{}", input);
}

#[tauri::command]
pub fn read_file(path: String) -> String {
    println!("In file {}", path);

    let contents = fs::read(path).expect("Something went wrong reading the file");
    base64::encode(contents)
}
