# IBM Bob - Your Desktop Companion 🤖

A nostalgic desktop AI assistant inspired by Microsoft Bob and classic desktop pets, built with modern technology.

![IBM Bob](https://img.shields.io/badge/version-0.1.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## Features ✨

- 🤖 **AI-Powered Chat Assistant** - Powered by OpenAI GPT-4 or Anthropic Claude
- 📝 **Task & Reminder Management** - Keep track of your todos and reminders
- 🖥️ **Desktop Integration** - Open apps, websites, and files with voice commands
- 🎭 **Animated Virtual Companion** - Bob has emotional states and personality
- 🪟 **Always-On-Top Window** - Draggable desktop pet that stays visible
- 🎨 **Retro Windows 95/98 UI** - Nostalgic design with modern functionality
- 🔒 **Privacy-Focused** - Optional browser monitoring with explicit user permission
- 💾 **Local Storage** - All your data stays on your machine

## Prerequisites 📋

Before you begin, ensure you have the following installed:

1. **Node.js** (v18 or higher)
   - Download from: https://nodejs.org/en/download/
   - Choose the LTS (Long Term Support) version
   - This includes npm (Node Package Manager)

2. **Rust** (for Tauri)
   - Download from: https://www.rust-lang.org/tools/install
   - On Windows, run: `rustup-init.exe`
   - Follow the installation prompts

3. **Visual Studio C++ Build Tools** (Windows only)
   - Download from: https://visualstudio.microsoft.com/visual-cpp-build-tools/
   - Install "Desktop development with C++" workload

## Installation 🚀

### Step 1: Verify Prerequisites

Open PowerShell or Command Prompt and verify installations:

```powershell
node --version
npm --version
rustc --version
cargo --version
```

### Step 2: Install Dependencies

Navigate to the project directory and install npm packages:

```powershell
cd "C:/Users/bbaji/Desktop/IBM BOB/retro-ai-assistant"
npm install
```

### Step 3: Get Your API Key

Choose one of the following AI providers:

**Option A: OpenAI (GPT-4)**
1. Go to https://platform.openai.com/
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key (starts with `sk-`)

**Option B: Anthropic (Claude)**
1. Go to https://console.anthropic.com/
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key

### Step 4: Run the Application

**Development Mode:**
```powershell
npm run tauri:dev
```

**Build for Production:**
```powershell
npm run tauri:build
```

The built application will be in `src-tauri/target/release/`

## Configuration ⚙️

### First Time Setup

1. Launch IBM Bob
2. Click on the **Settings** tab
3. Select your AI provider (OpenAI or Anthropic)
4. Enter your API key
5. Click **Save**
6. Configure other preferences:
   - Always on top
   - Notifications
   - Browser monitoring (optional)

### Browser Monitoring (Optional)

To enable browser tab detection:
1. Go to Settings
2. Enable "Monitor active browser tabs"
3. Grant permission when prompted
4. Note: Full functionality requires a browser extension (coming soon)

## Usage 💬

### Chat with Bob

Simply type your message in the chat window and press Enter or click Send.

**Examples:**
- "Hello Bob!"
- "Open Notepad"
- "Go to google.com"
- "Remind me to call mom at 3pm"
- "Add task: finish project report"

### Opening Applications

Bob can open Windows applications:
- "Open Calculator"
- "Launch Chrome"
- "Start Notepad"
- "Open Paint"

### Opening Websites

Bob can open websites in your default browser:
- "Open google.com"
- "Go to youtube.com"
- "Visit github.com"

### Managing Tasks

1. Click the **Tasks** tab
2. Enter a task title
3. Select priority (Low, Medium, High)
4. Click the + button
5. Check off tasks when complete
6. Delete tasks with the trash icon

## Project Structure 📁

```
retro-ai-assistant/
├── src/                      # React frontend source
│   ├── components/          # React components
│   │   ├── Character/      # Bob character animations
│   │   ├── Chat/           # Chat interface
│   │   ├── Tasks/          # Task manager
│   │   └── Settings/       # Settings panel
│   ├── services/           # Service layer
│   │   ├── llm/           # LLM integration
│   │   └── tauri/         # Tauri API wrapper
│   ├── store/             # Zustand state management
│   ├── styles/            # CSS styles
│   ├── types/             # TypeScript types
│   ├── App.tsx            # Main app component
│   └── main.tsx           # Entry point
├── src-tauri/             # Tauri backend (Rust)
│   ├── src/
│   │   └── main.rs       # Rust backend code
│   ├── Cargo.toml        # Rust dependencies
│   └── tauri.conf.json   # Tauri configuration
├── package.json           # npm dependencies
├── tsconfig.json         # TypeScript config
├── vite.config.ts        # Vite config
└── README.md             # This file
```

## Technology Stack 🛠️

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Zustand** - State management
- **Framer Motion** - Animations
- **Lucide React** - Icons

### Backend
- **Tauri** - Desktop framework
- **Rust** - System integration

### AI Integration
- **OpenAI API** - GPT-4 language model
- **Anthropic API** - Claude language model

## Keyboard Shortcuts ⌨️

- `Enter` - Send message in chat
- `Ctrl + ,` - Open settings (coming soon)
- `Esc` - Hide window (coming soon)

## Troubleshooting 🔧

### npm not recognized
- Install Node.js from https://nodejs.org/
- Restart your terminal after installation
- Verify with `node --version`

### Rust/Cargo not found
- Install Rust from https://rustup.rs/
- Restart your terminal
- Verify with `rustc --version`

### API Key not working
- Verify the key is correct
- Check you have credits/quota available
- Ensure you selected the right provider

### Window not appearing
- Check if Bob is running in system tray
- Right-click the tray icon and select "Show Bob"

### TypeScript errors
- Run `npm install` to ensure all dependencies are installed
- Restart your IDE/editor

## Development 👨‍💻

### Available Scripts

```powershell
# Start development server
npm run dev

# Build frontend only
npm run build

# Start Tauri development mode
npm run tauri:dev

# Build Tauri application
npm run tauri:build

# Preview production build
npm run preview
```

### Adding New Features

1. Create components in `src/components/`
2. Add services in `src/services/`
3. Update types in `src/types/`
4. Add Rust commands in `src-tauri/src/main.rs`

## Roadmap 🗺️

- [ ] Voice interaction
- [ ] Browser extension for tab monitoring
- [ ] Custom themes
- [ ] Plugin system
- [ ] Multi-language support
- [ ] Cloud sync (optional)
- [ ] Screen capture assistance
- [ ] Calendar integration

## Contributing 🤝

Contributions are welcome! Please feel free to submit a Pull Request.

## License 📄

This project is licensed under the MIT License.

## Credits 👏

Inspired by:
- Microsoft Bob (1995)
- Clippy (Microsoft Office Assistant)
- Desktop Pets of the 90s

Built with love and nostalgia ❤️

## Support 💬

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check the troubleshooting section above

---

**Made with IBM Bob** 🤖