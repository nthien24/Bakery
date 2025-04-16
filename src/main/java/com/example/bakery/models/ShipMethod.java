package com.example.bakery.models;

import java.util.HashMap;
import java.util.Map;

public enum ShipMethod {
    NORMAL(0, "NORMAL"),

    FAST(1, "FAST");


    /** The value. */
    public final int value;

    /** The name. */
    public final String name;
    
    private static Map map = new HashMap<>();
    static {
        for (ShipMethod pageType : ShipMethod.values()) {
            map.put(pageType.value, pageType);
        }
    }
    public static ShipMethod valueOf(int pageType) {
        return (ShipMethod) map.get(pageType);
    }

    private ShipMethod(int value, String name) {
        this.value = value;
        this.name = name;
    }
}
