[Setup]
AppName=LocalForge AI v2
AppVersion=2.0
; Installing to LocalAppData avoids Admin permission requirements for npm install/mvn compile
DefaultDirName={localappdata}\LocalForge AI
DefaultGroupName=LocalForge AI
OutputDir=.\Output
OutputBaseFilename=LocalForgeAI_Setup
SetupIconFile=LocalForge_launcher.ico
UninstallDisplayIcon={app}\LocalForge_launcher.ico
Compression=lzma2
SolidCompression=yes
PrivilegesRequired=lowest

[Files]
; 1. Copy the packaged Java Launcher and bundled runtime
Source: "Output\LocalForgeLauncher.jar"; DestDir: "{app}"; Flags: ignoreversion
; 2. Copy the actual project code, excluding build outputs and heavy directories
Source: "*"; DestDir: "{app}\project"; Excludes: "node_modules\*,target\*,launcher_out\*,Output\*,*.class,Launcher.jar"; Flags: ignoreversion recursesubdirs createallsubdirs
; 3. Copy the Icon
Source: "LocalForge_launcher.ico"; DestDir: "{app}"; Flags: ignoreversion

[Icons]
Name: "{commondesktop}\LocalForge AI"; Filename: "{app}\LocalForgeLauncher.exe"; IconFilename: "{app}\LocalForge_launcher.ico"
Name: "{group}\LocalForge AI"; Filename: "{app}\LocalForgeLauncher.exe"; IconFilename: "{app}\LocalForge_launcher.ico"

[Run]
; Run initial installation commands during the setup process
Filename: "cmd.exe"; Parameters: "/c npm install"; WorkingDir: "{app}\project"; Description: "Installing Frontend Dependencies (Requires Node.js)"; Flags: postinstall waituntilterminated
Filename: "cmd.exe"; Parameters: "/c mvn clean compile"; WorkingDir: "{app}\project\backend"; Description: "Compiling Backend (Requires Maven)"; Flags: postinstall waituntilterminated
; Automatically launch the app after setup completes
Filename: "{app}\LocalForgeLauncher.exe"; Description: "Launch LocalForge AI"; Flags: postinstall nowait skipifsilent
