package com.example.bakery.admin.stores;

import lombok.Data;

import javax.persistence.Column;

@Data
public class StoreViewModel {

    Integer idStore;

    String nameStore;

    String address;

    String description;

    String image;
}
