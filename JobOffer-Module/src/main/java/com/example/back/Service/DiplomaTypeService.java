package com.example.back.Service;

import com.example.back.Repository.DiplomaTypeRepository;
import com.example.back.entity.DiplomaType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DiplomaTypeService {
private final DiplomaTypeRepository diplomaTypeRepository ;

 // CREATE
    public DiplomaType saveDiploma(DiplomaType diplomaType) {
        return diplomaTypeRepository.save(diplomaType);
    }

    public List<DiplomaType> getAllDiplomas() {
        return diplomaTypeRepository.findAll();
    }


    public DiplomaType getDiplomaById(Long id) {
        return diplomaTypeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Diploma not found with id: " + id));
    }


    public DiplomaType updateDiploma(Long id, DiplomaType newDiploma) {
        DiplomaType existing = getDiplomaById(id);
        existing.setDiplomaName(newDiploma.getDiplomaName());
        existing.setSpeciality(newDiploma.getSpeciality());
        return diplomaTypeRepository.save(existing);
    }

    public void deleteDiploma(Long id) {
        diplomaTypeRepository.deleteById(id);
    }
}
