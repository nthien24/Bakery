package com.example.bakery.users;

import com.example.bakery.models.Role;
import com.example.bakery.models.Store;
import com.example.bakery.models.User;
import com.example.bakery.stores.StoreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.webmvc.support.RepositoryEntityLinks;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.*;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping(path = "/users")
public class UserController {
    @Autowired
    UserRepository userRepository;

    @Autowired
    BCryptPasswordEncoder bCryptPasswordEncoder;

    @PostMapping(path = "/create")
    public ResponseEntity<String> getAllStores(@RequestBody UserViewModel user) {
        User check = userRepository.findByEmail(user.email);
        if (check == null) {
            try {
                userRepository.save(new User(null,
                        user.name,
                        user.email,
                        bCryptPasswordEncoder.encode(user.password),
                        Role.valueOf(user.role),
                        user.address,
                        user.birthDay,
                        user.phone,
                        null
                ));
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Đăng kí thất bại");
            }
            return ResponseEntity.status(HttpStatus.OK).body("Đăng kí thành công");
        }
        return ResponseEntity.status(HttpStatus.CONFLICT).body("Đã tồn tại");
    }

    @GetMapping(path = "/")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = new ArrayList<>();
        try {
            users = userRepository.findAll();

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        return ResponseEntity.status(HttpStatus.OK).body(users);
    }
    @GetMapping(path = "/find-by-email/{email}")
    public ResponseEntity<List<User>> getAllUsersByEmail(@PathVariable String email) {
        List<User> users = new ArrayList<>();
        try {
            users = userRepository.findAllByEmailContainingIgnoreCase(email);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        return ResponseEntity.status(HttpStatus.OK).body(users);
    }
    @GetMapping(path = "/{idUser}")
    public ResponseEntity<?> getUserById(@PathVariable int idUser) {
        Optional<User> users;
        try {
            users = userRepository.findById(idUser);
            if(!users.isPresent())
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy người dùng");

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Lỗi");
        }
        users.get().setPassword(null);
        return ResponseEntity.status(HttpStatus.OK).body(users.get());
    }

    @PutMapping(path = "/")
    public ResponseEntity<?> getUserById(@RequestBody UserViewModel model) {
        try {
            Optional<User> users = userRepository.findById(model.id);
            User userHasEmailInuse = userRepository.findByEmail(model.email);
            if(userHasEmailInuse != null && userHasEmailInuse.getId() != model.id){
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Email đã tồn tại");
            }
            if(users.isPresent()){
                users.get().setAddress(model.address);
                users.get().setEmail(model.email);
                users.get().setName(model.name);
                users.get().setPhone(model.phone);
                users.get().setBirthDay(model.birthDay);
                users.get().setRole(Role.valueOf(model.role));
                if(model.password != null && !model.password.isEmpty() && !model.password.equals("notchange")){
                    users.get().setPassword(bCryptPasswordEncoder.encode(model.password));
                }
                userRepository.save(users.get());
                return ResponseEntity.status(HttpStatus.OK).body(users);
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy người dùng");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Lỗi cập nhật thông tin");
        }
    }

}
