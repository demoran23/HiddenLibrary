use serde::Serialize;

#[derive(Clone, Serialize)]
pub struct ZipInfo {
    pub path: String,
    pub name: String,
    pub length: usize,
    pub pages: Vec<String>,
}

impl ZipInfo {
    pub fn new() -> ZipInfo {
        ZipInfo {
            path: String::new(),
            name: String::new(),
            length: 0,
            pages: Vec::new(),
        }
    }
}

unsafe impl Send for ZipInfo {}
