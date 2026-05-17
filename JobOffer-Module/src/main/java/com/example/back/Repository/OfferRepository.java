package com.example.back.Repository;

import com.example.back.entity.Offer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface OfferRepository  extends JpaRepository<Offer, Long>  {

    List<Offer> findByCreatedById(Long id);

    //Hérite de JpaRepository pour avoir les méthodes CRUD de base (save, findById, etc.)
    // Requête personnalisée (exemple)
  //  @Query("SELECT o FROM Offer o WHERE o.status = 'ACTIVE'")
   // List<Offer> findActiveOffers();

    // Méthodes dérivées automatiques
    List<Offer> findByJobTitleContainingIgnoreCase(String keyword);
}

