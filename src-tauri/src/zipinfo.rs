use serde::{Deserialize, Serialize};

#[derive(Clone, Serialize)]
pub struct ZipInfo {
    pub path: String,
    pub name: String,
    pub length: usize,
}

impl ZipInfo {
    pub fn new() -> ZipInfo {
        ZipInfo {
            path: String::new(),
            name: String::new(),
            length: 0,
        }
    }
}

unsafe impl Send for ZipInfo {}
