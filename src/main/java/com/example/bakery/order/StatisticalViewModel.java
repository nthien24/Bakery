package com.example.bakery.order;

import com.example.bakery.models.Product;
import lombok.Data;

import java.util.Date;

@Data
public class StatisticalViewModel {

    public Date startDate;
    public Date endDate;
    public Date date;
    public Product product;
    public int totalStock;
    public int outStock;
    public int amount;


}
