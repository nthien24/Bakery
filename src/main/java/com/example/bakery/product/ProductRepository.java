package com.example.bakery.product;

import com.example.bakery.models.OrderDetails;
import com.example.bakery.models.Product;
import com.example.bakery.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product,Integer> {

    List<Product> findAllByIdStore(int idStore);


    @Query(value = "SELECT DISTINCT pr.* " +
            "FROM " +
            " products pr\n" +
            " INNER JOIN product_properties pp ON pr.id_store = :idStore \n" +
            " AND pr.\"id\" = pp.product_id " +
            " AND pp.properties_id IN ( :propertiesId )",nativeQuery = true)
    List<Product> findAllByProperty(@Param("idStore")int idStore, @Param("propertiesId") List<Integer> propertiesId);

    List<Product> findAllByNameProductContainingIgnoreCase(String nameProduct);

    List<Product> findAllByNameProductContaining(String nameProduct);
    List<Product> findAllByIdStoreAndAndNameProductContainingIgnoreCase(int idStore,String name);

    List<Product> findAllByIdStoreAndAndNameProductLike(int idStore,String name);
    Optional<Product> findAllByNameProduct(String nameProduct);

    @Query("SELECT p FROM Product p inner join ImportInfor i on p.id = i.productId WHERE  i.importTime between :startDate AND :endDate ")
    List<Product> getProductStocks(@Param("startDate") Date startDate, @Param("endDate")Date endDate);
}
