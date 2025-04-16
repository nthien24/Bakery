package com.example.bakery.news;

import com.example.bakery.models.News;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NewsRepository  extends JpaRepository<News,Integer> {
}
