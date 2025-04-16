package com.example.bakery.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import javax.persistence.criteria.CriteriaBuilder;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private int id;

    @Column(name = "name_product", columnDefinition = "NVARCHAR(MAX)")
    private String nameProduct;

    @Column(name = "price")
    private String price;

    @Column(name = "real_price")
    private String realPrice;

    @Column(name = "description", columnDefinition = "NVARCHAR(MAX)")
    private String description;

    @Column(name = "image_product", columnDefinition = "NVARCHAR(MAX)")
    private String images;

    @Column(name = "id_store")
    private Integer idStore;

    @ManyToOne
    @JoinColumn(name = "id_store", referencedColumnName = "id", insertable = false, updatable = false)
    @JsonIgnore
    private Store store;

    @OneToMany(mappedBy = "product",cascade = CascadeType.REMOVE)
    @JsonIgnore
    private List<OrderDetails> orderDetails;

    @Column(name = "quantity")
    private int quantity;

    @Column(name = "sale")
    private int sale;

    @Column(name = "in_stock")
    private int inStock;

    @Column(name = "status")
    private ProductStatus status;


    public Product(String nameProduct , String price, String description, String images, Integer idStore,int quantity, int sale, ProductStatus status) {
        this.nameProduct = nameProduct;
        this.price = price;
        this.description = description;
        this.images = images;
        this.idStore = idStore;
        this.quantity = quantity;
        this.sale = sale;
        this.status = status;
        this.inStock = quantity;
    }
}
