package com.example.employeemodule.controller;

import com.example.employeemodule.Service.PhotoService;
import com.example.employeemodule.entity.Photo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@RestController
@RequestMapping("/photos")
public class PhotoController {

    @Autowired
    private PhotoService photoService;
    @Transactional(readOnly = false)

    @PostMapping("/upload/{userId}")
    public ResponseEntity<String> uploadPhoto(@RequestParam("file") MultipartFile file, @PathVariable Long userId) {
        try {
            photoService.savePhoto(file, userId);
            return ResponseEntity.status(HttpStatus.OK).body("Photo uploaded successfully!");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to upload photo");
        }
    }
    @Transactional(readOnly = false)
    @GetMapping("/user/{userId}")
    public ResponseEntity<byte[]> getPhotoByUserId(@PathVariable Long userId) {
        Photo photo = photoService.getPhotoByUserId(userId);
        if (photo != null) {
            String encodedFileName = URLEncoder.encode(photo.getFileName(), StandardCharsets.UTF_8)
                    .replace("+", "%20");
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(photo.getFileType())) // Définir le type de contenu
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + encodedFileName + "\"") // Afficher dans le navigateur
                    .body(photo.getData()); // Retourner les données binaires de la photo
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);

        }}
    @Transactional(readOnly = false)
    @PutMapping("/update/{photoId}/{userId}")
    public ResponseEntity<String> updatePhoto(
            @PathVariable Long photoId,
            @RequestParam("file") MultipartFile file,
            @PathVariable Long userId) {
        try {
            photoService.updatePhoto(photoId, file, userId);
            return ResponseEntity.status(HttpStatus.OK).body("Photo updated successfully!");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update photo");
        }
    }
}
