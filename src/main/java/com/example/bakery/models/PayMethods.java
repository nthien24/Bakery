package com.example.bakery.models;

import java.util.HashMap;
import java.util.Map;

public enum  PayMethods {
    CASH(0, "CASH"),

    BANK(1, "BANK");


    /** The value. */
    public final int value;

    /** The name. */
    public final String name;
    private static Map map = new HashMap<>();
    
    static {
        for (PayMethods pageType : PayMethods.values()) {
            map.put(pageType.value, pageType);
        }
    }
    public static PayMethods valueOf(int pageType) {
        return (PayMethods) map.get(pageType);
    }


    private PayMethods(int value, String name) {
        this.value = value;
        this.name = name;
    }
}
