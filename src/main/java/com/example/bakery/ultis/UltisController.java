package com.example.bakery.ultis;

import org.apache.tomcat.util.http.fileupload.IOUtils;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.ResourceUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
@RestController
@RequestMapping(path = "/files")
public class UltisController {

    @GetMapping(value = "/image")
    public  ResponseEntity<byte[]> getImageWithMediaType() throws IOException {
        byte[] dataFile = readFileUsingResourceUtils();
        return ResponseEntity.ok().contentType(MediaType.IMAGE_JPEG).body(dataFile);
    }
    public static byte[] readFileUsingResourceUtils() throws IOException {
        System.out.println("Read file from resource folder using Spring ResourceUtils");
        File file = ResourceUtils.getFile("classpath:static/image.jpg");
        // Read File Content
        return Files.readAllBytes(file.toPath());
    }
}
