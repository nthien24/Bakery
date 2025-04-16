package com.example.bakery.models;


import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "Store")
@Getter
@Setter
@NoArgsConstructor
public class Store {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private int id;

    @Column(name = "name_store", columnDefinition = "NVARCHAR(MAX)")
    private String nameStore;

    @Column(name = "address", columnDefinition = "NVARCHAR(MAX)")
    private String address;

    @Column(name = "description", columnDefinition = "NVARCHAR(MAX)")
    private String description;

    @Column(name = "image_store")
    private String image;

    @OneToMany(mappedBy = "store",fetch = FetchType.EAGER,cascade = CascadeType.REMOVE)
    @JsonIgnore
    private List<Product> products;

    public Store(String nameStore, String address, String description, String image) {
        this.nameStore = nameStore;
        this.address = address;
        this.description = description;
        this.image = image;
    }

}
