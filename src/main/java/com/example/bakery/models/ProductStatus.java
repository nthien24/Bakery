package com.example.bakery.models;

import java.util.HashMap;
import java.util.Map;

public enum ProductStatus {
    IN_STOCK(0, "IN_STOCK"),
    OUT_STOCK(1, "OUT_STOCK");

    private static Map map = new HashMap<>();
    static {
        for (ProductStatus pageType : ProductStatus.values()) {
            map.put(pageType.value, pageType);
        }
    }
    public static ProductStatus valueOf(int pageType) {
        return (ProductStatus) map.get(pageType);
    }

    /** The value. */
    public final int value;

    /** The name. */
    public final String name;


    private ProductStatus(int value, String name) {
        this.value = value;
        this.name = name;
    }
}
