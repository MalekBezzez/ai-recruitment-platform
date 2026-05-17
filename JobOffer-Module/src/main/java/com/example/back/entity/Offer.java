package com.example.back.entity;
import com.example.back.enums.  CurStatus;
import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import lombok.*;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "offers") // Explicit table name

public class Offer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String jobTitle;

/*
    @ManyToOne
    @JoinColumn(name = "contract_type_id") // nom de la colonne dans la table Offer/Post
    private ContractType contract;


 */
// ✅ Remplacement par un simple champ ID
    @Column(name = "contract_type_id")
    private Long contractTypeId;


    private Integer yearsOfExp;

    // ✅ Remplacement par un simple champ ID
    @Column(name = "department_id")
    private Long departmentId;



    @ManyToOne
    @JoinColumn(name = "work_mode_id")
    private WorkMode workMode;



    private String reference;
    private Float salary;

    @ManyToOne
    @JoinColumn(name = "currency_id")
    private  Currency currency ;



    private Integer numberOfPos;

    @ManyToOne
    @JoinColumn(name = "diploma_type_id") // nom de la colonne dans la table Offer/Post
    private DiplomaType diploma;

    private String projectOrClient;



    @Temporal(TemporalType.DATE)
    private Date startingDate;

    @Temporal(TemporalType.DATE)
    private Date expirationDate;

    @Temporal(TemporalType.DATE)
    private Date requestDate;



    @Column(columnDefinition = "jsonb not null default '{}'::jsonb") // PostgreSQL JSONB column
    @JdbcTypeCode(SqlTypes.JSON) // Hibernate 6+ annotation for JSON handling
    private Map<String, String> sections = new HashMap<>();
    @Temporal(TemporalType.DATE)
    private Date publishDate;

    private boolean published= false; //
    /*

    @ManyToOne
    @JoinColumn(name = "created_by_id")
    private Employe createdBy;  // on va retourner sur c'est de type employe

     */

    // ✅ Nouveau champ découplé
    @Column(name = "created_by_id")
    private Long createdById;


// recently 29/08
 //   @Enumerated(EnumType.STRING)
 //   private CurStatus status;

    @Column(name = "cur_status")
    private String curStatus = "Draft";

    @Temporal(TemporalType.DATE)
    private Date creationDate;

}
