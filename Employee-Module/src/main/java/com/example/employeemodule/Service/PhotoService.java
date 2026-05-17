package com.example.employeemodule.Service;


import com.example.employeemodule.Repository.UserRepository;
import com.example.employeemodule.entity.Photo;
import com.example.employeemodule.Repository.PhotoRepository;
import com.example.employeemodule.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
@Service
public class PhotoService {

    @Autowired
    private PhotoRepository photoRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public void savePhoto(MultipartFile file, Long userId) throws IOException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Photo photoToSave;
        Photo existingPhoto = photoRepository.findByUser(user);

        if (existingPhoto != null) {
            // Mise à jour de la photo existante
            existingPhoto.setFileName(file.getOriginalFilename());
            existingPhoto.setFileType(file.getContentType());
            existingPhoto.setData(file.getBytes());
            photoToSave = existingPhoto;
        } else {
            // Création d'une nouvelle photo
            Photo newPhoto = new Photo();
            newPhoto.setFileName(file.getOriginalFilename());
            newPhoto.setFileType(file.getContentType());
            newPhoto.setData(file.getBytes());
            newPhoto.setUser(user);
            photoToSave = newPhoto;
        }

        photoRepository.save(photoToSave);
    }

    public Photo updatePhoto(Long photoId, MultipartFile file, Long userId) throws IOException {
        Photo existingPhoto = photoRepository.findById(photoId)
                .orElseThrow(() -> new RuntimeException("Photo not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        existingPhoto.setFileName(file.getOriginalFilename());
        existingPhoto.setFileType(file.getContentType());
        existingPhoto.setData(file.getBytes());
        existingPhoto.setUser(user);

        return photoRepository.save(existingPhoto);
    }

    public Photo getPhotoByUserId(Long userId) {
        return photoRepository.findByUserId(userId);
    }
}