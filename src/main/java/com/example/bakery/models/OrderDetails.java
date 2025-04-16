package com.example.bakery.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "order_details")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private Integer id;

    @Column(name = "id_order")
    private Integer idOrder;

    @ManyToOne
    @JoinColumn(name = "id_order",referencedColumnName = "id",insertable = false,updatable = false, nullable = false)
    private Orders orders;

    @Column(name = "id_product")
    private int idProduct;

    @ManyToOne
    @JoinColumn(name = "id_product",referencedColumnName = "id",insertable = false,updatable = false)
    private Product product;

    @Column(name = "quantity")
    private int quantity;

    @Column(name = "amount")
    private String amount;




}
