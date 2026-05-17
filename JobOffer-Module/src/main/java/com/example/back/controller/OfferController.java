package com.example.back.controller;

import com.example.back.dto.OfferDetailsDTO;
import com.example.back.dto.OfferRequestDTO;
import com.example.back.dto.OfferResponseDTO;
import com.example.back.dto.OfferSummarizeDTO;
import com.example.back.Service.OfferService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/offers")
@RequiredArgsConstructor


public class OfferController {


     private final OfferService offerService;

    // CREATE - POST /api/offers

    @PostMapping
    public ResponseEntity<OfferResponseDTO> createOffer(
            @Valid @RequestBody OfferRequestDTO requestDTO
    ) {
        OfferResponseDTO response = offerService.createOffer(requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // GET /api/offers/created-by/{id}
    @GetMapping("/created-by/{id}")
    public List<OfferSummarizeDTO> getOffersCreatedBy(@PathVariable Long id) {
        return offerService.getOffersCreatedBy(id);
    }
    // pour affichage dans le tableau

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOffer(@PathVariable Long id) {
        offerService.deleteOfferById(id);
        return ResponseEntity.noContent().build(); // 204 No Content
    }

    // Endpoint to update an offer
    @PutMapping("/{id}")
    public ResponseEntity<OfferResponseDTO>  updateOffer(@PathVariable Long id, @RequestBody OfferRequestDTO updatedDTO) {
        try {
            // Call the service method to update the offer
            OfferResponseDTO updatedOffer = offerService.updateOffer(id, updatedDTO);

            // Return the response with the updated offer and status 200 OK
            return ResponseEntity.ok(updatedOffer);

        } catch (RuntimeException e) {
            // If the offer is not found, return a 404 Not Found error
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<OfferResponseDTO> getOfferById(@PathVariable Long id) {
        return ResponseEntity.ok(offerService.getOfferById(id));
    }
    // pour recuperation dans le formulair

    @GetMapping("/details/{id}")
    public ResponseEntity<OfferDetailsDTO> getOfferDetails(@PathVariable Long id) {
        try {
            OfferDetailsDTO dto = offerService.getOfferDetailsById(id);
            return ResponseEntity.ok(dto);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
        // pour recuperation dans le details page
    }

    @GetMapping("/{id}/title")
    public ResponseEntity<String> getJobTitleById(@PathVariable Long id) {
        String title = offerService.getJobTitleById(id);
        if (title != null) {
            return ResponseEntity.ok(title);
        } else {
            return ResponseEntity.notFound().build();
        }
    }



    /*
    // READ (Single) - GET /api/offers/{id}
    @GetMapping("/{id}")
    public ResponseEntity<OfferResponseDTO> getOfferById(
            @PathVariable UUID id // ID désormais en UUID
    ) {
        return ResponseEntity.ok(offerService.getById(id));
    }

    // READ (All) - GET /api/offers
    @GetMapping
    public ResponseEntity<List<OfferResponseDTO>> getAllOffers() {
        return ResponseEntity.ok(offerService.getAllOffers());
    }

    // UPDATE - PUT /api/offers/{id}
    @PutMapping("/{id}")
    public ResponseEntity<OfferResponseDTO> updateOffer(
            @PathVariable UUID id, // ID en UUID
            @Valid @RequestBody OfferRequestDTO requestDTO
    ) {
        return ResponseEntity.ok(offerService.updateOffer(id, requestDTO));
    }

    // DELETE - DELETE /api/offers/{id}
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteOffer(
            @PathVariable UUID id // ID en UUID
    ) {
        offerService.deleteOffer(id);
    }
*/
}
