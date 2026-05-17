package com.example.back.Service;

import com.example.back.Repository.SiteRepository;
import com.example.back.entity.Site;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SiteService {
    private final SiteRepository siteRepository;

    public List<Site> getAllSites() {
        return siteRepository.findAll();
    }

    public Optional<Site> getSiteById(Long id) {
        return siteRepository.findById(id);
    }

    public Site createSite(Site site) {
        return siteRepository.save(site);
    }

    public Site updateSite(Long id, Site updatedSite) {
        return siteRepository.findById(id)
                .map(site -> {
                    site.setName(updatedSite.getName());
                    return siteRepository.save(site);
                })
                .orElseThrow(() -> new RuntimeException("Site not found"));
    }

    public void deleteSite(Long id) {
        siteRepository.deleteById(id);
    }

}
