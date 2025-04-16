package com.example.bakery.orderdetails;

import com.example.bakery.models.OrderDetails;
import com.example.bakery.models.Orders;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.Date;
import java.util.List;
import java.util.Optional;

public interface OrderDetailRepository extends JpaRepository<OrderDetails,Integer> {
    Optional<List<OrderDetails>> findAllByIdOrder(int idOrder);

    @Query("SELECT u.quantity FROM OrderDetails u inner join Orders a on a.id = u.idOrder WHERE u.idProduct=:idProduct and a.dateOrder between :startDate AND :endDate ")
    Integer countQuantityByIdProduct(@Param("idProduct") int idProduct, @Param("startDate") Date startDate, @Param("endDate")Date endDate);

    @Query("SELECT u FROM OrderDetails u inner join Orders a on a.id = u.idOrder WHERE  a.dateOrder between :startDate AND :endDate ")
    List<OrderDetails> getProductStocks(@Param("startDate") Date startDate, @Param("endDate")Date endDate);

    @Query("SELECT u FROM OrderDetails u inner join Orders a on a.id = u.idOrder WHERE  a.dateOrder between :startDate AND :endDate and a.status not in (:notAllow) ")
    List<OrderDetails> getProductStocksNotAllow(@Param("startDate") Date startDate, @Param("endDate")Date endDate,@Param("notAllow")int[] notAllow);
    int countQuantityByIdOrder(int idOrder);

    List<OrderDetails> findAllByIdProduct(int idProduct);
}

