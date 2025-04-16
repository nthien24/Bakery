package com.example.bakery.product;

import com.example.bakery.ImportInfor.ImportInforRepository;
import com.example.bakery.admin.product.ProductViewModel;
import com.example.bakery.models.*;
import com.example.bakery.orderdetails.OrderDetailRepository;
import com.example.bakery.stores.StoreRepository;
import javassist.NotFoundException;
import org.apache.poi.hssf.util.HSSFColor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFCellStyle;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.ResourceUtils;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayOutputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import java.util.stream.Stream;

@RestController
@RequestMapping(path = "/product")
public class ProductController {

    @Autowired
    ProductRepository productRepository;

    @Autowired
    StoreRepository storeRepository;

    @Autowired
    OrderDetailRepository orderDetailRepository;

    @Autowired
    ImportInforRepository importInforRepository;
    @GetMapping(path = "/{idStore}")
    public ResponseEntity<List<Product>> getAllProductByIdStore(@PathVariable int idStore) {
        List<Product> products = productRepository.findAllByIdStore(idStore);
        return ResponseEntity.status(HttpStatus.OK).body(products);

    }
    @GetMapping(path = "/")
    public ResponseEntity<List<Product>> getAllProducts() {
        List<Product> products = productRepository.findAll();
        return ResponseEntity.status(HttpStatus.OK).body(products);

    }
    @GetMapping(path = "/find/{idProduct}")
    public ResponseEntity<Product> getProductById(@PathVariable int idProduct) {
        Product product = productRepository.findById(idProduct).orElse(null);
        if (product != null) {
            return ResponseEntity.status(HttpStatus.OK).body(product);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);

    }
    @GetMapping(path = "/find-by-name/{idStore}/{name}")
    public ResponseEntity<?> getProductByLikeId(@PathVariable int idStore,@PathVariable String name) {
        List<Product> product = productRepository.findAllByIdStoreAndAndNameProductContainingIgnoreCase(idStore,name);
        return ResponseEntity.status(HttpStatus.OK).body(product);

    }
    @GetMapping(path = "/find-by-name/{name}")
    public ResponseEntity<?> getProductByName(@PathVariable String name) {
        List<Product> product = productRepository.findAllByNameProductContaining(name);
        return ResponseEntity.status(HttpStatus.OK).body(product);

    }
    @PostMapping(path = "/statistical")
    public ResponseEntity<?> getStatistical(@RequestBody StatisticalViewModel model) throws NotFoundException{
        List<StatisticalViewModel> statisticalViewModels = getDataStatistical(model);
        if (!statisticalViewModels.isEmpty()) {
            return ResponseEntity.status(HttpStatus.OK).body(statisticalViewModels);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);

    }
    private List<StatisticalViewModel> getDataStatistical(StatisticalViewModel model) throws NotFoundException {
        List<StatisticalViewModel> statisticalViewModels = new ArrayList<>();
//        List<Product> product = productRepository.findAll();
        List<OrderDetails> orderDetails = orderDetailRepository.getProductStocks(model.startDate,model.endDate);
        List<Integer> orderDetailsIds = orderDetails.stream().map(OrderDetails::getIdProduct).collect(Collectors.toList());
        List<ImportInfor> importInfors = importInforRepository.findAllByImportTimeByTime(model.startDate,model.endDate);
        List<Integer> importInforsIds = importInfors.stream().map(ImportInfor::getProductId).collect(Collectors.toList());
        orderDetailsIds.addAll(importInforsIds);
        List<Integer> ids =  orderDetailsIds.stream().distinct().collect(Collectors.toList());
        for(Integer productId : ids){
            StatisticalViewModel data = new StatisticalViewModel();
            Product product = productRepository.findById(productId).get();
            data.product = product;
            for (OrderDetails details: orderDetails){
                if(details.getIdProduct() == productId){
                    data.outStock+=details.getQuantity();
                }
            }
            for (ImportInfor importInfor: importInfors){
                if(importInfor.getProductId() == productId){
                    data.inStock+=importInfor.getQuantity();
                }
            }
            data.totalStock = product.getInStock();
            statisticalViewModels.add(data);
        }
        return statisticalViewModels;
    }
	/*
	 * @PostMapping(path = "/findByProperties") public ResponseEntity<?>
	 * getProductsByProperties(@RequestBody ProductViewModel model) {
	 * 
	 * try{ List<Product> products = new ArrayList<>();
	 * if(model.getPropertiesProducts().isEmpty()){ products =
	 * productRepository.findAllByIdStore(model.getIdStore()); } else{ products =
	 * productRepository.findAllByProperty(model.getIdStore(),model.
	 * getPropertiesProducts().stream().map(e -> { return e.getId();
	 * }).collect(Collectors.toList())); } return
	 * ResponseEntity.status(HttpStatus.OK).body(products); } catch (Exception ex){
	 * return ResponseEntity.status(HttpStatus.NOT_FOUND).
	 * body("Không thể tin thấy sản phẩm"); } }
	 */

    @PostMapping(path = "/export/product_report")
    public ResponseEntity<?> exportData(@RequestBody StatisticalViewModel model)  {
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=product_template.xlsx");

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        try{
            List<StatisticalViewModel> statisticalViewModels = getDataStatistical(model);
            XSSFWorkbook workbook = new XSSFWorkbook(ResourceUtils.getFile("classpath:product_template_03.xlsx"));
            XSSFSheet sheet = workbook.getSheet("report");
            XSSFCellStyle style = workbook.createCellStyle();
            CreationHelper createHelper = workbook.getCreationHelper();
            style.setBorderTop(BorderStyle.THIN);
            style.setBorderBottom(BorderStyle.THIN);
            style.setBorderLeft(BorderStyle.THIN);
            style.setBorderRight(BorderStyle.THIN);
            //header
            CellStyle cellStyle = workbook.createCellStyle();
            cellStyle.setDataFormat(
                    createHelper.createDataFormat().getFormat("dd/mm/yyyy"));
            cellStyle.setFillBackgroundColor(IndexedColors.YELLOW.getIndex());
            Row r = sheet.getRow(2); // 10-1
            Cell cellStartDate = r.createCell(1);
            cellStartDate.setCellStyle(cellStyle);
            cellStartDate.setCellValue(model.startDate);
            Cell cellEndDate = r.createCell(3);
            cellEndDate.setCellStyle(cellStyle);
            cellEndDate.setCellValue(model.endDate);
            int rowNum = 4;
            for (StatisticalViewModel item : statisticalViewModels) {
                Row row = sheet.createRow(rowNum++);
                Cell cell1 = row.createCell(0);
                cell1.setCellValue(item.getProduct().getId());
                Cell cell2 = row.createCell(1);
                cell2.setCellValue(item.getProduct().getNameProduct());
                Cell cell3 = row.createCell(2);
                cell3.setCellValue(item.getProduct().getPrice());
                Cell cell4 = row.createCell(3);
//                cell4.setCellValue(item.getQuantity());
                Cell cell5 = row.createCell(4);
                cell5.setCellValue(item.getOutStock());
                Cell cell6 = row.createCell(5);
                cell6.setCellValue(item.getInStock());
                cell1.setCellStyle(style);
                cell2.setCellStyle(style);
                cell3.setCellStyle(style);
                cell4.setCellStyle(style);
                cell5.setCellStyle(style);
                cell6.setCellStyle(style);
            }
            try {
                workbook.write(out);
                workbook.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        catch (Exception ex){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex);
        }

        return ResponseEntity.ok().headers(headers).body(out.toByteArray());

    }
}
