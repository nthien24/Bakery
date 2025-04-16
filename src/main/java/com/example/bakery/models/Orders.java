package com.example.bakery.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Orders {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private Integer id;

    @Column(name = "id_user")
    private int idUser;

    @ManyToOne
    @JoinColumn(name = "id_user",referencedColumnName = "id",insertable = false,updatable = false)
    @JsonIgnore
    private User user;

    @Column(name = "full_name", columnDefinition = "NVARCHAR(MAX)")
    private String fullName;

    @Column(name = "address", columnDefinition = "NVARCHAR(MAX)")
    private String address;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "ship_method")
    private ShipMethod shipMethod;

    @Column(name = "pay_method")
    private PayMethods payMethod;

    @Column(name = "total_amount")
    private String totalAmount;

    @Column(name = "date_order")
    @Temporal(TemporalType.DATE)
    private Date dateOrder;

    @Column(name = "description", columnDefinition = "NVARCHAR(MAX)")
    private String description;

    @Column(name = "status")
    private Status status;

    @OneToMany(mappedBy = "orders",fetch = FetchType.LAZY,cascade = {CascadeType.REMOVE})
    @JsonIgnore
    private List<OrderDetails> orderDetails;

}
