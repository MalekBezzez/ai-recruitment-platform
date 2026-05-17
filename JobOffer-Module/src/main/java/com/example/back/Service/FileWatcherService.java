package com.example.back.Service;


import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.*;
import java.util.HashSet;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class FileWatcherService {
    private final FileProcessor fileProcessor;

    @Value("${watch.folder1}")
    private String folder1;

    @Value("${watch.folder2}")
    private String folder2;

    private final Set<Path> seenFiles = new HashSet<>();

    @PostConstruct
    public void startWatcher() {
        new Thread(() -> {
            try {
                Path path1 = Paths.get(folder1);
                Path path2 = Paths.get(folder2);

                // 🔹 Crée les dossiers s'ils n'existent pas
                ensureDirectoryExists(path1);
                ensureDirectoryExists(path2);

                // 🔹 Scan initial au démarrage pour détecter les fichiers existants
                scanFolder(path1);
                scanFolder(path2);

                // 🔹 Boucle de polling
                while (true) {
                    scanFolder(path1);
                    scanFolder(path2);

                    Thread.sleep(2000); // Polling toutes les 2 secondes
                }

            } catch (InterruptedException | IOException e) {
                e.printStackTrace();
            }
        }).start();
    }

    /**
     * Scanne le dossier et traite les nouveaux fichiers non encore vus.
     */
    private void scanFolder(Path folder) {
        try (DirectoryStream<Path> stream = Files.newDirectoryStream(folder)) {
            for (Path file : stream) {
                if (!Files.isDirectory(file) && seenFiles.add(file)) {
                    String dirName = folder.getFileName().toString();
                    String sourceType = dirName.equals("spontaneousApplication") ? "SPONTANEOUS" : "OFFER";

                    System.out.println("📄 New file detected: " + file);
                    fileProcessor.processFile(file.toFile(), sourceType);
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    /**
     * Crée le dossier si il n'existe pas
     */
    private void ensureDirectoryExists(Path path) throws IOException {
        if (!Files.exists(path)) {
            Files.createDirectories(path);
            System.out.println("📁 Directory created: " + path);
        }
    }
}
