package com.example.bakery.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "import_infor")
@Getter
@Setter
@NoArgsConstructor
public class ImportInfor {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private int id;

    @Column(name = "description", columnDefinition = "NVARCHAR(MAX)")
    private String description;

    @Column(name = "import_time")
    @Temporal(TemporalType.DATE)
    private Date importTime;

    @Column(name ="product_id")
    private int productId;

    @Column(name ="quantity")
    private int quantity;


    public ImportInfor(String description, Date importTime, int productId,int quantity) {
        this.description = description;
        this.importTime = importTime;
        this.productId = productId;
        this.quantity = quantity;
    }
}
