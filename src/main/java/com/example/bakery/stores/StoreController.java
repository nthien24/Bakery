package com.example.bakery.stores;

import com.example.bakery.models.Product;
import com.example.bakery.models.Store;
import com.example.bakery.product.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping(path = "/providers")
public class StoreController {

        @Autowired
        StoreRepository storeRepository;

        @Autowired
        ProductRepository productRepository;

        @GetMapping(path="/")
        public List<Store> getAllStores(){
            return storeRepository.findAll();
        }

        @GetMapping(path="/{idStore}")
        public ResponseEntity<Store> getStoreById(@PathVariable int idStore){
                Store store = storeRepository.findById(idStore).orElse(null);
                if (store != null) {
                        return ResponseEntity.status(HttpStatus.OK).body(store);
                }
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        @GetMapping(path="/find-store-have-product/{nameProduct}")
        public ResponseEntity<?> getStoreById(@PathVariable String nameProduct){
                List<Store> resulf = new ArrayList<>();
                List<Integer> storeIds = productRepository.findAllByNameProductContaining(nameProduct).stream().map(Product::getIdStore).collect(Collectors.toList()).stream().distinct().collect(Collectors.toList());
                for (Integer storeId : storeIds) {
                        resulf.add(storeRepository.findById(storeId).get());
                }
                return ResponseEntity.status(HttpStatus.OK).body(resulf);
        }
}
