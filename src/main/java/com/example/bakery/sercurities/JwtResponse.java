package com.example.bakery.sercurities;

import com.example.bakery.models.User;
import lombok.Getter;

import java.io.Serializable;
import java.util.List;

@Getter
public class JwtResponse implements Serializable {

    private static final long serialVersionUID = -8091879091924046844L;
    private final String jwttoken;
    private final Integer idUser;
    private final Integer role;
    private final String userName;
    private final User user;


    public JwtResponse(String jwttoken, int idUser, int role,String userName,User user) {
        this.jwttoken = jwttoken;
        this.idUser = idUser;
        this.role = role;
        this.userName = userName;
        this.user = user;
    }


}
