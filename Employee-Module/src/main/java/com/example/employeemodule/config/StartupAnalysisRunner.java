package com.example.employeemodule.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.nio.file.*;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component
public class StartupAnalysisRunner implements ApplicationRunner {

    private static final Logger logger = LoggerFactory.getLogger(AuthtenticationSuccessListener.class);

    @Autowired
    private FolderMessageAnalyzer folderMessageAnalyzer;

    @Value("${messages.folder.path:/app/data}")
    private String messagesFolderPath;

    @Override
    public void run(ApplicationArguments args) {
        // Start the file watcher in a separate thread
        ExecutorService executor = Executors.newSingleThreadExecutor();
        executor.submit(() -> startFileWatcher());
        logger.info("✅ File watcher started for directory: {}", messagesFolderPath);
    }

    private void startFileWatcher() {
        try {
            // Initialize WatchService
            WatchService watchService = FileSystems.getDefault().newWatchService();
            Path dirPath = Paths.get(messagesFolderPath);

            // Validate directory
            if (!Files.isDirectory(dirPath)) {
                logger.error("Invalid directory path: {}", messagesFolderPath);
                throw new IllegalArgumentException("Invalid directory path: " + messagesFolderPath);
            }

            // Register directory with WatchService for CREATE and MODIFY events
            dirPath.register(watchService, StandardWatchEventKinds.ENTRY_CREATE, StandardWatchEventKinds.ENTRY_MODIFY);

            logger.info("Monitoring directory for JSON files: {}", messagesFolderPath);

            // Process existing JSON files at startup
            processExistingFiles(dirPath);

            // Watch loop
            while (true) {
                WatchKey key;
                try {
                    key = watchService.take(); // Blocks until an event occurs
                } catch (InterruptedException e) {
                    logger.warn("File watcher interrupted: {}", e.getMessage());
                    Thread.currentThread().interrupt();
                    break;
                }

                // Process events
                for (WatchEvent<?> event : key.pollEvents()) {
                    WatchEvent.Kind<?> kind = event.kind();

                    // Ignore OVERFLOW events
                    if (kind == StandardWatchEventKinds.OVERFLOW) {
                        continue;
                    }

                    // Get the file name
                    @SuppressWarnings("unchecked")
                    WatchEvent<Path> ev = (WatchEvent<Path>) event;
                    Path filePath = dirPath.resolve(ev.context());

                    // Process only JSON files
                    if (filePath.toString().endsWith(".json")) {
                        logger.info("Detected {} event for file: {}", kind.name(), filePath);
                        try {
                            // Wait briefly to ensure file is fully written
                            Thread.sleep(100);
                            folderMessageAnalyzer.analyzeMessagesFromFile(filePath.toString());
                        } catch (Exception e) {
                            logger.error("Error processing file {}: {}", filePath, e.getMessage());
                        }
                    }
                }

                // Reset key to continue watching
                boolean valid = key.reset();
                if (!valid) {
                    logger.error("Watch key no longer valid. Stopping file watcher.");
                    break;
                }
            }

            watchService.close();
        } catch (Exception e) {
            logger.error("File watcher failed: {}", e.getMessage(), e);
        }
    }

    private void processExistingFiles(Path dirPath) {
        try (var stream = Files.list(dirPath).filter(path -> path.toString().endsWith(".json"))) {
            for (Path filePath : stream.toList()) {
                logger.info("Processing existing file: {}", filePath);
                try {
                    folderMessageAnalyzer.analyzeMessagesFromFile(filePath.toString());
                } catch (Exception e) {
                    logger.error("Error processing existing file {}: {}", filePath, e.getMessage());
                }
            }
        } catch (Exception e) {
            logger.error("Error processing existing files: {}", e.getMessage());
        }
    }
}

