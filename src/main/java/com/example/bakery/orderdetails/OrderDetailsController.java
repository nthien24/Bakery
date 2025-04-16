package com.example.bakery.orderdetails;

import com.example.bakery.models.OrderDetails;
import com.example.bakery.models.Orders;
import com.example.bakery.models.Product;
import org.hibernate.criterion.Order;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.temporal.WeekFields;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping(path = "/orders/details")
public class OrderDetailsController {

    @Autowired
    OrderDetailRepository orderDetailRepository;

    @GetMapping(path = "/{idOrder}")
    public ResponseEntity<?> getOrderById(@PathVariable int idOrder) {
        Optional<List<OrderDetails>> orderDetailsList = orderDetailRepository.findAllByIdOrder(idOrder);
        if (orderDetailsList.isPresent()) {
            return ResponseEntity.status(HttpStatus.OK).body(orderDetailsList.get());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không thể lấy danh sách đơn hàng");

    }


}
