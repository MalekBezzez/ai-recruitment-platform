package com.example.employeemodule.entity;

import jakarta.persistence.*;

@Entity
public class Photo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String fileName; // Nom du fichier

    @Column(nullable = false)
    private String fileType; // Type de fichier (ex: image/jpeg)

    @Lob
    @Column(nullable = false)
    private byte[] data; // Données binaires de la photo

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user; // Relation avec l'utilisateur

    // Getters et Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getFileType() {
        return fileType;
    }

    public void setFileType(String fileType) {
        this.fileType = fileType;
    }

    public byte[] getData() {
        return data;
    }

    public void setData(byte[] data) {
        this.data = data;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}