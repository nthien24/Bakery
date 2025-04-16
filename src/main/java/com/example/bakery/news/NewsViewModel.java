package com.example.bakery.news;


import lombok.Data;

@Data
public class NewsViewModel {
    int id;
    String title;
    String content;
    String urlImage;
}
