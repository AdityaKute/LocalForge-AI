@echo off
echo Compiling Launcher...
javac LocalForgeLauncher.java

echo Creating JAR...
jar cfe Launcher.jar LocalForgeLauncher LocalForgeLauncher.class

echo Packaging into EXE using jpackage (This may take a minute)...
rmdir /s /q launcher_out
jpackage --type app-image --name "LocalForgeLauncher" --main-jar Launcher.jar --icon LocalForge_launcher.ico --dest launcher_out 

echo Launcher bundled successfully in launcher_out\LocalForgeLauncher
pause
