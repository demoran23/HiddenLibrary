#[tauri::command]
pub fn test(input: String) {
    println!("{}", input);
}
