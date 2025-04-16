package com.example.bakery.orderdetails;

import com.example.bakery.models.Orders;
import com.example.bakery.models.Status;
import lombok.Data;

import javax.persistence.*;
@Data
public class OrderDetailViewModel {
    /* id product*/
    public int id;
    public int idOrder;
    public int quantity;
    public String amount;
}
