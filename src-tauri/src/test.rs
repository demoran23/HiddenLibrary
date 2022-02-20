use std::env;
use std::fs;

#[tauri::command]
pub fn test(input: String) {
    println!("{}", input);
}

#[tauri::command]
pub fn read_file(path: String) {
    println!("In file {}", path);

    let contents = fs::read_to_string(path).expect("Something went wrong reading the file");

    println!("With text:\n{}", contents);
}
