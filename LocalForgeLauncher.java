import javax.swing.*;
import javax.swing.text.DefaultCaret;
import java.awt.*;
import java.awt.event.WindowAdapter;
import java.awt.event.WindowEvent;
import java.io.BufferedReader;
import java.io.File;
import java.io.InputStreamReader;
import java.net.URI;
import java.util.ArrayList;
import java.util.List;

public class LocalForgeLauncher extends JFrame {
    private final JTextArea backendLogs;
    private final JTextArea frontendLogs;
    private final JTextArea ollamaLogs;
    private final List<Process> activeProcesses = new ArrayList<>();
    
    private boolean backendReady = false;
    private boolean frontendReady = false;
    private boolean browserOpened = false;

    public LocalForgeLauncher() {
        setTitle("LocalForge AI v2 - System Launcher");
        setSize(900, 600);
        setDefaultCloseOperation(JFrame.DO_NOTHING_ON_CLOSE);
        setLocationRelativeTo(null);

        try {
            ImageIcon icon = new ImageIcon("LocalForge_launcher.ico");
            setIconImage(icon.getImage());
        } catch (Exception ignored) {}

        JTabbedPane tabbedPane = new JTabbedPane();
        backendLogs = createLogArea();
        frontendLogs = createLogArea();
        ollamaLogs = createLogArea();

        tabbedPane.addTab("Backend (Spring Boot)", new JScrollPane(backendLogs));
        tabbedPane.addTab("Frontend (React)", new JScrollPane(frontendLogs));
        tabbedPane.addTab("Ollama Service", new JScrollPane(ollamaLogs));

        add(tabbedPane, BorderLayout.CENTER);

        addWindowListener(new WindowAdapter() {
            @Override
            public void windowClosing(WindowEvent e) {
                shutdownServices();
                System.exit(0);
            }
        });
    }

    private JTextArea createLogArea() {
        JTextArea area = new JTextArea();
        area.setEditable(false);
        area.setBackground(new Color(30, 30, 30));
        area.setForeground(new Color(200, 200, 200));
        area.setFont(new Font("Consolas", Font.PLAIN, 12));
        DefaultCaret caret = (DefaultCaret) area.getCaret();
        caret.setUpdatePolicy(DefaultCaret.ALWAYS_UPDATE);
        return area;
    }

    public void startServices() {
        File appDir = new File(System.getProperty("user.dir"));
        File projectDir = new File(appDir, "project");
        
        // Fallback for running the launcher directly in development
        if (!projectDir.exists()) projectDir = appDir; 
        File backendDir = new File(projectDir, "backend");

        startProcess(new String[]{"ollama", "serve"}, projectDir, ollamaLogs, "ollama");
        startProcess(new String[]{"cmd.exe", "/c", "mvn", "spring-boot:run"}, backendDir, backendLogs, "backend");
        startProcess(new String[]{"cmd.exe", "/c", "npm", "run", "dev"}, projectDir, frontendLogs, "frontend");
    }

    private void startProcess(String[] command, File dir, JTextArea logArea, String serviceType) {
        new Thread(() -> {
            try {
                ProcessBuilder pb = new ProcessBuilder(command);
                pb.directory(dir);
                pb.redirectErrorStream(true);
                Process process = pb.start();
                
                synchronized (activeProcesses) {
                    activeProcesses.add(process);
                }

                try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
                    String line;
                    while ((line = reader.readLine()) != null) {
                        final String output = line;
                        SwingUtilities.invokeLater(() -> logArea.append(output + "\n"));

                        if (!browserOpened) {
                            if (serviceType.equals("backend") && output.contains("Started")) {
                                backendReady = true;
                                checkReadyAndOpenBrowser();
                            } else if (serviceType.equals("frontend") && output.contains("Local:")) {
                                frontendReady = true;
                                checkReadyAndOpenBrowser();
                            }
                        }
                    }
                }
            } catch (Exception e) {
                SwingUtilities.invokeLater(() -> logArea.append("Error starting " + serviceType + ": " + e.getMessage() + "\n"));
            }
        }).start();
    }

    private synchronized void checkReadyAndOpenBrowser() {
        if (backendReady && frontendReady && !browserOpened) {
            browserOpened = true;
            try {
                if (Desktop.isDesktopSupported() && Desktop.getDesktop().isSupported(Desktop.Action.BROWSE)) {
                    Desktop.getDesktop().browse(new URI("http://localhost:5173"));
                }
            } catch (Exception e) {
                frontendLogs.append("\nFailed to open browser automatically.\n");
            }
        }
    }

    private void shutdownServices() {
        for (Process p : activeProcesses) {
            if (p != null && p.isAlive()) {
                // Kills the cmd.exe and its child processes (Node, Java, etc.)
                p.descendants().forEach(ProcessHandle::destroyForcibly);
                p.destroyForcibly();
            }
        }
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> {
            LocalForgeLauncher launcher = new LocalForgeLauncher();
            launcher.setVisible(true);
            launcher.startServices();
        });
    }
}
