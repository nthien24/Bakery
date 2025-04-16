package com.example.bakery.news;

import com.example.bakery.models.News;
import com.example.bakery.models.Store;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping(path = "/news")
public class NewsController {
    @Autowired
    NewsRepository repository;

    @GetMapping(path = "/")
    public ResponseEntity<?> getAllNews() {
        try{
            List<News> news= repository.findAll();
            return ResponseEntity.status(HttpStatus.OK).body(news);
        }
        catch (Exception ex){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("lấy thông tin tin tức lỗi");
        }

    }
    @GetMapping(path = "/{id}")
    public ResponseEntity<?> getById(@PathVariable int id) {
        try{
            Optional<News> news= repository.findById(id);
            return ResponseEntity.status(HttpStatus.OK).body(news.get());
        }
        catch (Exception ex){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("lấy thông tin tin tức lỗi");
        }

    }
    @PutMapping(path = "/")
    public ResponseEntity<?> update(@RequestBody NewsViewModel modal) {
        try{
            News news= repository.findById(modal.id).orElse(null);
            if(news != null){
                news.setUrlImage(modal.urlImage);
                news.setTitle(modal.title);
                news.setContent(modal.content);
                repository.save(news);
                return ResponseEntity.status(HttpStatus.OK).body(news);
            }

            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không thể tìm thấy tin tức theo id này");
        }
        catch (Exception ex){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("lấy thông tin tin tức lỗi");
        }

    }

    @PostMapping(path = "/")
    public ResponseEntity<?> create(@RequestBody NewsViewModel modal) {
        try{
            News news = new News();
            news.setContent(modal.content);
            news.setTitle(modal.title);
            news.setUrlImage(modal.urlImage);
            repository.save(news);
            return ResponseEntity.status(HttpStatus.OK).body(news);
        }
        catch (Exception ex){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("lấy thông tin tin tức lỗi");
        }

    }
    @DeleteMapping(path = "/{id}")
    public ResponseEntity<?> update(@PathVariable int id) {
        try {
            Optional<News> news = repository.findById(id);
            if (!news.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Xóa thất bại, id không tồn tại");
            }
            repository.deleteById(id);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Xóa thất bại");
        }
        return ResponseEntity.status(HttpStatus.OK).body("Xóa  Thành Công");

    }
}
