package com.example.bakery.models;

public enum Role {
    ADMIN(0, "ADMIN"),

    USER(1, "USER");


    /** The value. */
    public final int value;

    /** The name. */
    public final String name;


    private Role(int value, String name) {
        this.value = value;
        this.name = name;
    }
}
