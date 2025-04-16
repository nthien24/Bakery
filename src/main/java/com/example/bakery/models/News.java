package com.example.bakery.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Table(name = "news")
@Getter
@Setter
@NoArgsConstructor
public class News {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private Integer id;

    @Column(name = "url_image")
    private String urlImage;

    @Column(name = "title", columnDefinition = "NVARCHAR(MAX)")
    private String title;

    @Column(name = "content",columnDefinition = "NVARCHAR(MAX)")
    private String content;
}
