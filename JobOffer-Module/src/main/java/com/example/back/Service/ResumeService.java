package com.example.back.Service;

import com.example.back.Repository.ResumeRepository;
import com.example.back.entity.Resume;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ResumeService {

    private final ResumeRepository resumeRepository;

    public Resume saveResume(Resume resume) {
        return resumeRepository.save(resume);
    }

    public Resume getResumeById(Long id) {
        return resumeRepository.findById(id).orElse(null);
    }

    public List<Resume> getAllResumes() {
        return resumeRepository.findAll();
    }

    public void deleteResume(Long id) {
        resumeRepository.deleteById(id);
    }

    public Resume updateResume(Resume resume) {
        return resumeRepository.save(resume);
    }

    public Resume getResumeByEmail(String email) {
        return resumeRepository.findByEmail(email);
    }

}
