package com.example.employeemodule.Service;


import com.example.employeemodule.entity.OtherInformation;
import com.example.employeemodule.Repository.OtherInformationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OtherInformationService {

    @Autowired
    private OtherInformationRepository otherInformationRepository;

    public List<OtherInformation> getAllOtherInformations() {
        return otherInformationRepository.findAll();
    }

    public Optional<OtherInformation> getOtherInformationById(int id) {
        return otherInformationRepository.findById(id);
    }

    public OtherInformation saveOtherInformation(OtherInformation otherInformation) {
        return otherInformationRepository.save(otherInformation);
    }

    public void deleteOtherInformation(int id) {
        otherInformationRepository.deleteById(id);
    }

    public OtherInformation updateOtherInformation(int id, OtherInformation otherInformationDetails) {
        OtherInformation otherInformation = otherInformationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("OtherInformation not found"));
        otherInformation.setStcServi(otherInformationDetails.isStcServi());
        otherInformation.setMariageDate(otherInformationDetails.getMariageDate());
        otherInformation.setBankDomiciliation(otherInformationDetails.isBankDomiciliation());
        otherInformation.setEmploye(otherInformationDetails.getEmploye());
        return otherInformationRepository.save(otherInformation);
    }
}