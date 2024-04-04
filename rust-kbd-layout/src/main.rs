// use winapi::um::winnt::LANGID;
use std::ffi::CStr;
use winapi::um::winuser::GetKeyboardLayoutNameA;

fn main() {
    unsafe {
        // Create a buffer to receive the keyboard layout name
        let mut buffer: [i8; 9] = [0; 9];

        // Get the current keyboard layout
        GetKeyboardLayoutNameA(buffer.as_mut_ptr());

        // Convert the buffer to a string
        let layout = CStr::from_ptr(buffer.as_ptr()).to_str().unwrap();

        // Print the layout
        println!("Keyboard layout: {}", layout);
    }
}
