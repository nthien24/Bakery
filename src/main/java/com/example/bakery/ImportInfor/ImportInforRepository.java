package com.example.bakery.ImportInfor;

import com.example.bakery.models.ImportInfor;
import com.example.bakery.models.OrderDetails;
import com.example.bakery.models.Orders;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Date;
import java.util.List;

public interface ImportInforRepository extends JpaRepository<ImportInfor,Integer> {

    @Query("SELECT i FROM ImportInfor i  WHERE  i.importTime between :startDate AND :endDate ")
    List<ImportInfor> findAllByImportTimeByTime(@Param("startDate") Date startDate, @Param("endDate")Date endDate);

    List<ImportInfor> findAllByProductId(int productId);
}
