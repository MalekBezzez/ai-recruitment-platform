package com.example.back.Repository;

import com.example.back.dto.FilterApplicationDTO;
import com.example.back.entity.Application;
import com.example.back.entity.Offer;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Expression;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class ApplicationSpecification {

    public static Specification<Application> filterBy(FilterApplicationDTO filter) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            query.distinct(true);

            // Join avec Offer (peut être null pour Spontané)
            Join<Application, Offer> offerJoin = root.join("jobOffer", JoinType.LEFT);

            // Nom complet
            if (filter.fullName() != null && !filter.fullName().isBlank()) {
                predicates.add(cb.like(cb.lower(root.get("name")), "%" + filter.fullName().toLowerCase() + "%"));
            }

            if (filter.email() != null && !filter.email().isBlank()) {
                predicates.add(cb.like(cb.lower(root.get("email")), "%" + filter.email().toLowerCase() + "%"));
            }

            if (filter.mobilePhone() != null && !filter.mobilePhone().isBlank()) {
                predicates.add(cb.like(cb.lower(root.get("mobilePhone")), "%" + filter.mobilePhone().toLowerCase() + "%"));
            }

            if (filter.applicationStatus() != null && !filter.applicationStatus().isBlank()) {
                predicates.add(cb.equal(cb.lower(root.get("applicationStatus")), filter.applicationStatus().toLowerCase()));
            }

            if (filter.applicationType() != null && !filter.applicationType().isBlank()) {
                if (filter.applicationType().equalsIgnoreCase("Spontaneous")) {
                    predicates.add(cb.isNull(root.get("jobOffer")));
                } else if (filter.applicationType().equalsIgnoreCase("By offer")) {
                    predicates.add(cb.isNotNull(root.get("jobOffer")));
                }
            }

            if (filter.jobTitle() != null && !filter.jobTitle().isBlank()) {
                Predicate jobTitlePredicate = cb.or(
                        cb.like(cb.lower(offerJoin.get("jobTitle")), "%" + filter.jobTitle().toLowerCase() + "%"),
                        cb.like(cb.lower(root.get("spontaneousJobTitle")), "%" + filter.jobTitle().toLowerCase() + "%")
                );
                predicates.add(jobTitlePredicate);
            }

            if (filter.startDate() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("applicationDate"), filter.startDate()));
            }

            if (filter.endDate() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("applicationDate"), filter.endDate()));
            }

            if (filter.minScore() != null) {
                double scoreSeuil = filter.minScore() / 100.0;
                predicates.add(cb.greaterThanOrEqualTo(root.get("match").get("finalScore"), scoreSeuil));
            }

            if (filter.jobOfferId() != null) {
                predicates.add(cb.equal(root.get("jobOffer").get("id"), filter.jobOfferId()));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

}
