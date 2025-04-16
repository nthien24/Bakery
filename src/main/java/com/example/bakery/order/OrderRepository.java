package com.example.bakery.order;

import com.example.bakery.models.Orders;
import com.example.bakery.models.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import java.util.Date;
import java.util.List;

public interface OrderRepository extends JpaRepository<Orders,Integer> {
    List<Orders> findAllByIdUser(int IdUser);

    List<Orders> findAllBydateOrderBetweenAndStatus(@Param("startDate") Date startDate, @Param("endDate")Date endDate,Status status);
    List<Orders> findAllBydateOrderBetween(@Param("startDate") Date startDate, @Param("endDate")Date endDate);

    List<Orders> findAllByStatus(Status status);
}
