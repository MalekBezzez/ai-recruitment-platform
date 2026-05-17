package com.example.back.Repository;

import com.example.back.dto.InterviewFilterDTO;
import com.example.back.entity.Application;
import com.example.back.entity.Employe;
import com.example.back.entity.Interview;
import com.example.back.entity.Offer;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;
import jakarta.persistence.criteria.Predicate;

public class InterviewSpecification {

    public static Specification<Interview> filterBy(InterviewFilterDTO filter) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Pour éviter les doublons dûs aux jointures
            query.distinct(true);

            // Jointure avec Application
            Join<Interview, Application> applicationJoin = root.join("application");

            // Jointure avec JobOffer (left join car il peut être null dans cas spontané)
            Join<Application, Offer> jobOfferJoin = applicationJoin.join("jobOffer", JoinType.LEFT);

            // Jointure avec interviewers
            Join<Interview, Employe> interviewersJoin = root.join("interviewers", JoinType.LEFT);

            if (filter.applicantName() != null && !filter.applicantName().isBlank()) {
                predicates.add(cb.like(cb.lower(applicationJoin.get("name")), "%" + filter.applicantName().toLowerCase() + "%"));
            }

            if (filter.phone() != null && !filter.phone().isBlank()) {
                predicates.add(cb.like(cb.lower(applicationJoin.get("mobilePhone")), "%" + filter.phone().toLowerCase() + "%"));
            }

            if (filter.email() != null && !filter.email().isBlank()) {
                predicates.add(cb.like(cb.lower(applicationJoin.get("email")), "%" + filter.email().toLowerCase() + "%"));
            }

            if (filter.status() != null && !filter.status().isBlank()) {
                predicates.add(cb.equal(cb.lower(root.get("status")), filter.status().toLowerCase()));
            }

            if (filter.applicationType() != null && !filter.applicationType().isBlank()) {
                if (filter.applicationType().equalsIgnoreCase("Spontaneous")) {
                    predicates.add(cb.isNull(applicationJoin.get("jobOffer")));
                } else if (filter.applicationType().equalsIgnoreCase("By offer")) {
                    predicates.add(cb.isNotNull(applicationJoin.get("jobOffer")));
                }
            }

            if (filter.title() != null && !filter.title().isBlank()) {
                predicates.add(cb.like(cb.lower(root.get("title")), "%" + filter.title().toLowerCase() + "%"));
            }

            if (filter.room() != null && !filter.room().isBlank()) {
                predicates.add(cb.like(cb.lower(root.get("room").get("name")), "%" + filter.room().toLowerCase() + "%"));
            }

            if (filter.jobTitle() != null && !filter.jobTitle().isBlank()) {
                Predicate jobTitlePredicate = cb.or(
                        cb.like(cb.lower(jobOfferJoin.get("jobTitle")), "%" + filter.jobTitle().toLowerCase() + "%"),
                        cb.like(cb.lower(applicationJoin.get("spontaneousJobTitle")), "%" + filter.jobTitle().toLowerCase() + "%")
                );
                predicates.add(jobTitlePredicate);
            }

            if (filter.interviewer() != null && !filter.interviewer().isBlank()) {
                Expression<String> fullName = cb.concat(cb.lower(interviewersJoin.get("firstname")), " ");
                Expression<String> fullNameWithLast = cb.concat(fullName, cb.lower(interviewersJoin.get("lastname")));
                predicates.add(cb.like(fullNameWithLast, "%" + filter.interviewer().toLowerCase() + "%"));
            }

            if (filter.startDate() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("scheduledDateTime"), filter.startDate().atStartOfDay()));
            }

            if (filter.endDate() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("scheduledDateTime"), filter.endDate().atTime(23, 59, 59)));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

}
