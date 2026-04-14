# ✨ LocalForge AI v2.0

> 🚀 A fully local, privacy-first AI stack with a powerful control plane and seamless UX.

---

## 🌟 What’s New in v2.0?

### 🖥️ The Forge Launcher (NEW)
A dedicated **Java Swing GUI** (`LocalForgeLauncher.java`) to orchestrate your entire system:

- 📊 Real-time logs for:
  - Frontend  
  - Backend  
  - Ollama  
- 🎛️ Unified control dashboard  
- ⚡ Start/Stop services with ease  

---

### ⚡ Zero-Friction Startup

No more port conflicts.

**New:** `start_services.bat`

✔ Automatically:
- Detects port conflicts  
- Clears ports **8081**, **5173**, **11434**  
- Launches all services  
- Opens browser automatically  

---

### 🎨 Refined UI/UX (Major Upgrade)

- 🌗 **Dark / Light Mode Toggle (NEW)**  
- 💎 Migrated to **shadcn/ui**  
- 🧠 Improved AI rendering:
  - Syntax-highlighted code blocks  
  - Math notation support  
- ⚡ Faster, smoother interactions  

---

### 🔄 Smart Model Discovery

- 🔍 Auto-detects new Ollama models  
- ⚡ No refresh required  
- 📡 Real-time polling  

---

## 🏗️ System Architecture

LocalForge AI v2.0 uses a **Mediator Pattern** via Spring Boot.

### 🔒 Benefits
- No direct frontend → LLM exposure  
- Improved security  
- Easy persistence  

---

### 📊 Architecture Diagram

```mermaid
flowchart TD
    User((User)) -->|Interacts| UI[React Frontend]

    subgraph "LocalForge Control Plane"
        Launcher[Java Swing Launcher]
        SB[Spring Boot Backend]
        OL[Ollama Service]

        Launcher -.->|Manages| UI
        Launcher -.->|Manages| SB
        Launcher -.->|Manages| OL
    end

    UI -->|REST / JSON| SB
    SB -->|Inference Requests| OL
    SB -->|Persistence| DB[(MySQL)]
    OL -->|Load / Unload| Models[[Local LLMs]]
