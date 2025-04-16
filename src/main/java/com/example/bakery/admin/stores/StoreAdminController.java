package com.example.bakery.admin.stores;


import com.example.bakery.models.Store;
import com.example.bakery.stores.StoreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping(path = "/admin/providers")
public class StoreAdminController {

    @Autowired
    StoreRepository storeRepository;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping(path = "/create")
    public ResponseEntity<String> createStore(@RequestBody StoreViewModel viewModel) {
        try {
            Store store = new Store(viewModel.nameStore, viewModel.address, viewModel.description, viewModel.image);
            storeRepository.save(store);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Đăng kí Cửa Hàng thất bại");
        }
        return ResponseEntity.status(HttpStatus.OK).body("Đăng kí Cửa Hàng Thành Công");
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping(path = "/delete/{idStore}")
    public ResponseEntity<String> deleteStore(@PathVariable int idStore) {
        try {
            Optional<Store> store = storeRepository.findById(idStore);
            if (!store.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Xóa cửa hàng thất bại, id không tồn tại");
            }
            storeRepository.deleteById(idStore);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Xóa cửa hàng thất bại");
        }
        return ResponseEntity.status(HttpStatus.OK).body("Xóa cửa hàng Thành Công");
    }
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping(path = "/edit")
    public ResponseEntity<String> editStore(@RequestBody StoreViewModel model) {
        try {
            Optional<Store> store = storeRepository.findById(model.idStore);
            if (!store.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Cập nhật cửa hàng thất bại, id không tồn tại");
            }
            store.get().setAddress(model.address);
            store.get().setDescription(model.description);
            store.get().setImage(model.image);
            store.get().setNameStore(model.nameStore);
            storeRepository.save(store.get());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Cập nhật cửa hàng thất bại");
        }
        return ResponseEntity.status(HttpStatus.OK).body("Cập nhật cửa hàng Thành Công");
    }


}
