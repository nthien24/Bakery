package com.example.bakery.admin.users;

import com.example.bakery.models.Store;
import com.example.bakery.models.User;
import com.example.bakery.users.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;
@RestController
@RequestMapping(path = "/admin/user")
public class UserAdminController {
    
    @Autowired
    UserRepository userRepository;
    
    @DeleteMapping(path = "/delete/{idUser}")
    public ResponseEntity<String> deleteStore(@PathVariable int idUser) {
        try {
            Optional<User> user = userRepository.findById(idUser);
            if (!user.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Xóa cửa người dùng bại, id không tồn tại");

            }
            userRepository.deleteById(idUser);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Xóa cửa người dùng bại vui lòng xóa giỏ hàng trước");
        }
        return ResponseEntity.status(HttpStatus.OK).body("Xóa cửa hàng Thành Công");
    }
}
