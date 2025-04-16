package com.example.bakery.models;

import java.util.HashMap;
import java.util.Map;

public enum Status {

    WAITING(0, "WAITING"),
    PROCESS(1, "IN-PROCESS"),
    SHIPPING(2, "SHIPPING"),
    DONE(3, "DONE"),
    RETURN(4, "RETURN"),
    HOLD(5, "HOLD");

    private static Map map = new HashMap<>();
    static {
        for (Status pageType : Status.values()) {
            map.put(pageType.value, pageType);
        }
    }
    public static Status valueOf(int pageType) {
        return (Status) map.get(pageType);
    }

    /** The value. */
    public final int value;

    /** The name. */
    public final String name;




    private Status(int value, String name) {
        this.value = value;
        this.name = name;
    }


}
