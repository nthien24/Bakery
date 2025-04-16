package com.example.bakery.admin.product;

import lombok.Data;

import java.util.List;

@Data
public class ProductViewModel {
    Integer id;

    String nameProduct;

    String price;

    String realPrice;

    String description;

    String images;

    int quantity;

    Integer idStore;

}
