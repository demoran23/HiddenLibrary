use serde::{Deserialize, Serialize};

#[derive(Clone, Serialize)]
pub struct ZipInfo {
    pub path: String,
    pub name: String,
    pub length: usize,
    pub current_page: usize,
}

impl ZipInfo {
    pub fn new() -> ZipInfo {
        ZipInfo {
            path: String::new(),
            name: String::new(),
            length: 0,
            current_page: 0,
        }
    }
}

unsafe impl Send for ZipInfo {}

#[derive(Clone, Serialize, Deserialize)]
pub struct GetPageRequest {
    pub page: usize,
    pub path: String,
}

#[derive(Clone, Serialize, Deserialize)]
pub struct GetPageResponse {
    pub request: GetPageRequest,
    pub contents: String,
}
