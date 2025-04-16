package com.example.bakery.ultis;

import org.hibernate.dialect.SQLServerDialect;

import java.sql.Types;

public class UnicodeSQLServerDialect extends SQLServerDialect {

    public UnicodeSQLServerDialect() {
        super();

        // Use Unicode Characters
        registerColumnType(Types.VARCHAR, 255, "nvarchar($l)");
        registerColumnType(Types.CHAR, "nchar(1)");
        registerColumnType(Types.CLOB, "nvarchar(max)");

        // Microsoft SQL Server 2000 supports bigint and bit
        registerColumnType(Types.BIGINT, "bigint");
        registerColumnType(Types.BIT, "bit");
    }
}
