package com.example.employeemodule.dto;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.IOException;
import java.nio.file.DirectoryStream; // Added import
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

@Component
public class MessageLoader {

    private final ObjectMapper mapper;

    public MessageLoader() {
        this.mapper = new ObjectMapper();
    }

    /**
     * Loads messages from a single JSON file.
     *
     * @param filePath The path to the JSON file.
     * @return A list of ResponseDTO1 objects representing the messages.
     * @throws IOException If the file does not exist, is not readable, or is malformed.
     */
    public List<ResponseDTO1> loadMessagesFromJson(String filePath) throws IOException {
        File file = new File(filePath);
        if (!file.exists() || !file.canRead()) {
            throw new IOException("File not found or not readable: " + filePath);
        }

        try {
            return mapper.readValue(
                    file,
                    mapper.getTypeFactory().constructCollectionType(List.class, ResponseDTO1.class)
            );
        } catch (IOException e) {
            throw new IOException("Error parsing JSON file: " + filePath + ". " + e.getMessage(), e);
        }
    }

    /**
     * Loads messages from multiple JSON files in a directory.
     *
     * @param directoryPath The path to the directory containing JSON files.
     * @return A list of ResponseDTO1 objects representing all messages from all JSON files.
     * @throws IOException If the directory is invalid or an error occurs while reading files.
     */
    public List<ResponseDTO1> loadMessagesFromJsonDirectory(String directoryPath) throws IOException {
        List<ResponseDTO1> allMessages = new ArrayList<>();
        Path dirPath = Paths.get(directoryPath);

        if (!Files.isDirectory(dirPath)) {
            throw new IOException("Invalid directory path: " + directoryPath);
        }

        try (DirectoryStream<Path> stream = Files.newDirectoryStream(dirPath, "*.json")) {
            for (Path entry : stream) {
                List<ResponseDTO1> messages = loadMessagesFromJson(entry.toString());
                allMessages.addAll(messages);
            }
        } catch (IOException e) {
            throw new IOException("Error reading JSON files from directory: " + directoryPath + ". " + e.getMessage(), e);
        }

        return allMessages;
    }
}