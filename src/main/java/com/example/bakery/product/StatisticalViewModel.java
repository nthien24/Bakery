package com.example.bakery.product;

import com.example.bakery.admin.product.ProductViewModel;
import com.example.bakery.models.Product;
import lombok.Data;

import java.util.Date;

@Data
public class StatisticalViewModel {
    public Date startDate;
    public Date endDate;
    public int inStock;
    public int outStock;
    int totalStock;
    public int inUseStock;
    public Product product;


}
