package com.example.bakery.admin.product;

import com.example.bakery.ImportInfor.ImportInforRepository;
import com.example.bakery.models.ImportInfor;
import com.example.bakery.models.OrderDetails;
import com.example.bakery.models.Product;
import com.example.bakery.models.ProductStatus;
import com.example.bakery.orderdetails.OrderDetailRepository;
import com.example.bakery.product.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping(path = "/admin/product")
public class ProductAdminController {

    @Autowired
    ProductRepository productRepository;

    @Autowired
    OrderDetailRepository orderDetailRepository;

    @Autowired
    ImportInforRepository importInforRepository;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping(path = "/")
    public ResponseEntity<String> createProduct(@RequestBody ProductViewModel viewModel) {
        try {
            Optional<Product> productInUser = productRepository.findAllByNameProduct(viewModel.nameProduct);
            if(productInUser.isPresent()){
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Sản phẩm đã tồn tại");
            }
            Product product = new Product(viewModel.nameProduct,viewModel.price,viewModel.description,viewModel.images,viewModel.idStore,viewModel.quantity,0,viewModel.quantity > 0 ? ProductStatus.IN_STOCK : ProductStatus.OUT_STOCK);
            product.setRealPrice(viewModel.realPrice);
            productRepository.save(product);
            // save history import product
            ImportInfor importInfor = new ImportInfor();
            importInfor.setImportTime(new Date());
            importInfor.setDescription(viewModel.description);
            importInfor.setProductId(product.getId());
            importInfor.setQuantity(viewModel.quantity);
            importInforRepository.save(importInfor);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Đăng kí sản phẩm thất bại");
        }
        return ResponseEntity.status(HttpStatus.OK).body("Đăng kí sản phẩm thành công");
    }

    @PostMapping(path = "/import")
    public ResponseEntity<String> createProductByImport(@RequestBody List<ProductImportViewModel> viewModel) {
        try {
            for (ProductImportViewModel item: viewModel) {
                Product product = productRepository.findById(item.id).get();
                product.setQuantity(product.getQuantity()+item.quantity);
                product.setInStock(product.getInStock()+item.quantity);
                // save history import product
                ImportInfor importInfor = new ImportInfor();
                importInfor.setImportTime(new Date());
                importInfor.setDescription("");
                importInfor.setProductId(product.getId());
                importInfor.setQuantity(item.quantity);
                importInforRepository.save(importInfor);
                productRepository.save(product);
            }

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Đăng kí sản phẩm thất bại");
        }
        return ResponseEntity.status(HttpStatus.OK).body("Đăng kí sản phẩm thành công");
    }
    @PostMapping(path = "/export")
    public ResponseEntity<String> createProductByExport(@RequestBody List<ProductImportViewModel> viewModel) {
        try {
            for (ProductImportViewModel item: viewModel) {
                Product product = productRepository.findById(item.id).get();
                int quantity = product.getQuantity() - item.quantity;
                int quantity2 = product.getInStock() - item.quantity;
                if (quantity < 0 || quantity2 < 0 ){
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Số lượng hàng không đủ");
                }
                product.setQuantity(quantity);
                product.setInStock(quantity2);
                productRepository.save(product);
            }

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Đăng kí sản phẩm thất bại");
        }
        return ResponseEntity.status(HttpStatus.OK).body("Đăng kí sản phẩm thành công");
    }
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping(path = "/delete/{idProduct}")
    public ResponseEntity<String> deleteStore(@PathVariable int idProduct) {
        try {
            List<OrderDetails> orderDetails = orderDetailRepository.findAllByIdProduct(idProduct);
            if(orderDetails == null || orderDetails.isEmpty()) {
                Optional<Product> product = productRepository.findById(idProduct);
                if (!product.isPresent()) {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Xóa sản phẩm thất bại, id không tồn tại");
                }
                List<ImportInfor> importInfors = importInforRepository.findAllByProductId(idProduct);
                importInforRepository.deleteAll(importInfors);
                productRepository.deleteById(idProduct);
            } else {
            	return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Sản phẩm đã được đặt hàng");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Xóa sản phẩm thất bại");
        }
        return ResponseEntity.status(HttpStatus.OK).body("Xóa sản phẩm Thành Công");
    }
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping(path = "/")
    public ResponseEntity<String> editStore(@RequestBody ProductViewModel model) {
        try {
            Optional<Product> product = productRepository.findById(model.id);
            if (!product.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Cập nhật sản phẩm thất bại, id không tồn tại");
            }
            product.get().setPrice(model.price);
            product.get().setDescription(model.description);
            product.get().setRealPrice(model.realPrice);
            product.get().setImages(model.images);
            product.get().setNameProduct(model.nameProduct);
            product.get().setIdStore(model.idStore);
            product.get().setStore(null);
            product.get().setQuantity(model.quantity);
            product.get().setInStock(model.quantity);
            productRepository.save(product.get());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Cập nhật sản phẩm thất bại");
        }
        return ResponseEntity.status(HttpStatus.OK).body("Cập nhật sản phẩm Thành Công");
    }

}
