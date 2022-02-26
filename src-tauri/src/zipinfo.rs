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

impl Clone for ZipInfo {
    fn clone(&self) -> Self {
        todo!()
    }

    fn clone_from(&mut self, source: &Self) {
        todo!()
    }
}

unsafe impl Send for ZipInfo {}
