package com.example.bakery.users;

import com.example.bakery.models.Role;
import lombok.Data;

import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import java.util.Date;

@Data
public class UserViewModel {
    int id;
    String name;
    String email;
    String password;
    String address;
    Date birthDay;
    String phone;
    String role;
}
