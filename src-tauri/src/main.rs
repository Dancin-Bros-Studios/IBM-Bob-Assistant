// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::sync::Mutex;

// State management
struct AppState {
    browser_monitoring_enabled: Mutex<bool>,
}

// Commands for system integration
#[tauri::command]
async fn open_application(app_path: String) -> Result<String, String> {
    #[cfg(target_os = "windows")]
    {
        std::process::Command::new("cmd")
            .args(&["/C", "start", "", &app_path])
            .spawn()
            .map_err(|e| e.to_string())?;
        Ok(format!("Opened application: {}", app_path))
    }
    
    #[cfg(not(target_os = "windows"))]
    {
        Err("This feature is currently only supported on Windows".to_string())
    }
}

#[tauri::command]
async fn open_website(url: String) -> Result<String, String> {
    #[cfg(target_os = "windows")]
    {
        std::process::Command::new("cmd")
            .args(&["/C", "start", &url])
            .spawn()
            .map_err(|e| e.to_string())?;
        Ok(format!("Opened website: {}", url))
    }
    
    #[cfg(not(target_os = "windows"))]
    {
        Err("This feature is currently only supported on Windows".to_string())
    }
}

#[tauri::command]
async fn open_file(file_path: String) -> Result<String, String> {
    #[cfg(target_os = "windows")]
    {
        std::process::Command::new("cmd")
            .args(&["/C", "start", "", &file_path])
            .spawn()
            .map_err(|e| e.to_string())?;
        Ok(format!("Opened file: {}", file_path))
    }
    
    #[cfg(not(target_os = "windows"))]
    {
        Err("This feature is currently only supported on Windows".to_string())
    }
}

#[tauri::command]
async fn request_browser_monitoring_permission(
    state: tauri::State<'_, AppState>,
) -> Result<bool, String> {
    let mut enabled = state.browser_monitoring_enabled.lock().unwrap();
    *enabled = true;
    Ok(true)
}

#[tauri::command]
async fn get_browser_monitoring_status(
    state: tauri::State<'_, AppState>,
) -> Result<bool, String> {
    let enabled = state.browser_monitoring_enabled.lock().unwrap();
    Ok(*enabled)
}

#[tauri::command]
async fn disable_browser_monitoring(
    state: tauri::State<'_, AppState>,
) -> Result<bool, String> {
    let mut enabled = state.browser_monitoring_enabled.lock().unwrap();
    *enabled = false;
    Ok(false)
}

// Get active browser tabs (requires user permission)
#[tauri::command]
async fn get_active_browser_tabs(
    state: tauri::State<'_, AppState>,
) -> Result<Vec<String>, String> {
    let enabled = state.browser_monitoring_enabled.lock().unwrap();
    
    if !*enabled {
        return Err("Browser monitoring not enabled. Please grant permission first.".to_string());
    }
    
    // Note: This is a placeholder. Actual implementation would require
    // browser extensions or native messaging hosts for Chrome/Edge/Firefox
    // For now, we return a message indicating the feature needs setup
    Ok(vec![
        "Browser monitoring requires additional setup".to_string(),
        "Install the IBM Bob browser extension for full functionality".to_string(),
    ])
}

#[tauri::command]
async fn show_notification(_title: String, _body: String) -> Result<(), String> {
    // Notification will be handled by the frontend using Tauri's notification API
    Ok(())
}

// Play Windows system sounds
#[tauri::command]
async fn play_system_sound(sound_name: String) -> Result<(), String> {
    #[cfg(target_os = "windows")]
    {
        use std::process::Command;
        
        // Map sound names to Windows system sound events
        let sound_event = match sound_name.as_str() {
            "SystemAsterisk" => "SystemAsterisk",
            "SystemExclamation" => "SystemExclamation",
            "SystemHand" => "SystemHand",
            "SystemNotification" => "SystemNotification",
            "SystemQuestion" => "SystemQuestion",
            "Default" => "SystemDefault",
            _ => "SystemDefault",
        };
        
        // Use PowerShell with proper syntax to play system sounds
        let script = format!(
            "$sound = [System.Media.SystemSounds]::{}; if ($sound) {{ $sound.Play() }}",
            sound_event
        );
        
        Command::new("powershell")
            .args(&["-NoProfile", "-NonInteractive", "-Command", &script])
            .output()
            .map_err(|e| e.to_string())?;
        
        Ok(())
    }
    
    #[cfg(not(target_os = "windows"))]
    {
        Err("System sounds are only supported on Windows".to_string())
    }
}

#[tauri::command]
async fn get_system_info() -> Result<serde_json::Value, String> {
    Ok(serde_json::json!({
        "platform": std::env::consts::OS,
        "arch": std::env::consts::ARCH,
    }))
}

fn main() {
    tauri::Builder::default()
        .manage(AppState {
            browser_monitoring_enabled: Mutex::new(false),
        })
        .invoke_handler(tauri::generate_handler![
            open_application,
            open_website,
            open_file,
            request_browser_monitoring_permission,
            get_browser_monitoring_status,
            disable_browser_monitoring,
            get_active_browser_tabs,
            show_notification,
            get_system_info,
            play_system_sound,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

// Made with Bob
