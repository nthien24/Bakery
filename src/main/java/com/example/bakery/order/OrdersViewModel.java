package com.example.bakery.order;

import com.example.bakery.orderdetails.OrderDetailViewModel;
import java.util.Date;
import lombok.Data;

import java.util.List;
@Data
public class OrdersViewModel {
    int idUser;
    int idOrder;
    int shipMethod;
    int payMethod;
    int status;
    Date dateOrder;
    String totalAmount;
    String discription;
    List<OrderDetailViewModel> orderDetailViewModels;

}
