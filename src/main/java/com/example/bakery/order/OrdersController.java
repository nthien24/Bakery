package com.example.bakery.order;

import com.example.bakery.models.*;
import com.example.bakery.orderdetails.OrderDetailRepository;
import com.example.bakery.orderdetails.OrderDetailViewModel;
import com.example.bakery.product.ProductRepository;
import com.example.bakery.order.StatisticalViewModel;
import com.example.bakery.users.UserRepository;
import com.example.bakery.users.UserViewModel;
import javassist.NotFoundException;
import jdk.nashorn.internal.runtime.Context;
import org.apache.poi.openxml4j.opc.OPCPackage;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFCellStyle;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.hibernate.criterion.Order;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.ResourceUtils;
import org.springframework.web.bind.annotation.*;
import sun.invoke.empty.Empty;

import javax.servlet.http.HttpServletResponse;
import javax.xml.crypto.Data;
import java.io.ByteArrayOutputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.text.DecimalFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.Duration;
import java.time.Instant;
import java.time.temporal.WeekFields;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping(path = "/orders")
public class OrdersController {

    @Autowired
    OrderRepository orderRepository;

    @Autowired
    OrderDetailRepository orderDetailRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    ProductRepository productRepository;

    @PostMapping(path = "")
    public ResponseEntity<String> doAddOrder(@RequestBody OrdersViewModel model) {
        try {
            if(model.payMethod == PayMethods.BANK.value){
                return ResponseEntity.status(HttpStatus.OK).body("Đăng kí thành công");
            }
            Optional<User> user = userRepository.findById(model.idUser);
            if (!user.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Đăng kí thất bại");
            }
            List<Product> products = new ArrayList<>();
            for (OrderDetailViewModel e : model.orderDetailViewModels) {
                products.add(updateStatusProduct(e.id, e.quantity)) ;
            }
            Orders orders = new Orders(null,
                    model.idUser,
                    null,
                    user.get().getName(),
                    user.get().getAddress(),
                    user.get().getPhone(),
                    ShipMethod.valueOf(model.shipMethod),
                    PayMethods.valueOf(model.payMethod),
                    model.totalAmount,
                    new Date(),
                    model.discription,
                    Status.PROCESS, null);
            orderRepository.save(orders);
            for (OrderDetailViewModel e : model.orderDetailViewModels) {
                orderDetailRepository.save(new OrderDetails(null, orders.getId(), orders, e.id, null, e.quantity, e.amount));
                productRepository.save(products.stream().filter(a -> {
                    return  a.getId()== e.id;
                }).findFirst().get());
            }
            //Update status product
        } catch (NotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Số lượng hàng không đủ");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Đăng kí thất bại");
        }

        return ResponseEntity.status(HttpStatus.OK).body("Đăng kí thành công");
    }

    private Product updateStatusProduct(int idProduct, int orderQuantity) throws NotFoundException {
        Optional<Product> product = productRepository.findById(idProduct);
        if (!product.isPresent()) {
            throw new NotFoundException("không tìm thấy sản phẩm");
        }
        int quantity = product.get().getInStock() - orderQuantity;
        if (quantity >= 0) {
            product.get().setInStock(quantity);
            product.get().setStatus(ProductStatus.IN_STOCK);
        } else {
            product.get().setStatus(ProductStatus.OUT_STOCK);
            throw new NotFoundException("Hết hàng");
        }
        return product.get();

    }

    @GetMapping(path = "/{idUser}")
    public ResponseEntity<?> getAllOrders(@PathVariable int idUser) {
        try {
            List<Orders> orders = orderRepository.findAllByIdUser(idUser);
            return ResponseEntity.status(HttpStatus.OK).body(orders);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Lỗi lấy đơn hàng");
        }


    }

    @GetMapping(path = "/get-amount")
    public ResponseEntity<?> getAmount(@PathVariable int idUser) {
        try {
            int amount = 0;
            List<Orders> orders = orderRepository.findAll();
            for (Orders item: orders ) {
                amount += Integer.parseInt(item.getTotalAmount());
            }
            return ResponseEntity.status(HttpStatus.OK).body(formatVnd(amount));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Lỗi lấy đơn hàng");
        }
    }
    @GetMapping(path = "/")
    public ResponseEntity<?> getAllOrders() {
        List<Orders> orders = orderRepository.findAll();
        return ResponseEntity.status(HttpStatus.OK).body(orders);

    }

    @GetMapping(path = "/find-by-status/{status}")
    public ResponseEntity<?> getAllOrdersByStatus(@PathVariable int status ) {
        List<Orders> orders = orderRepository.findAllByStatus(Status.valueOf(status));
        return ResponseEntity.status(HttpStatus.OK).body(orders);

    }

    @PutMapping(path = "/")
    public ResponseEntity<?> doUpdateOrders(@RequestBody OrdersViewModel viewModel) {
        Optional<Orders> orders = orderRepository.findById(viewModel.idOrder);
        try {
            if (orders.isPresent()) {
                if(viewModel.status == Status.RETURN.value){
                    refundProduct(orders.get());
                }
                orders.get().setStatus(Status.valueOf(viewModel.status));
                orderRepository.save(orders.get());
                return ResponseEntity.status(HttpStatus.OK).body("Thay đổi trạng thái đơn hàng thành công");
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Đơn hàng không tồn tại");
        } catch (Exception ex) {
            System.out.println("Lỗi cập nhận trạng thái đơn hàng: " + ex.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Lỗi cập nhận trạng thái đơn hàng");
        }

    }
    private void refundProduct(Orders orders){
        List<OrderDetails> orderDetailsList = orderDetailRepository.findAllByIdOrder(orders.getId()).get();
        orderDetailsList.forEach(e -> {
            Product product = productRepository.findById(e.getIdProduct()).get();
            product.setInStock(product.getInStock() + e.getQuantity());
            productRepository.save(product);
        });
    }
    @DeleteMapping(path = "/{idOrder}")
    public ResponseEntity<?> doDeleteOrder(@PathVariable int idOrder) {
        Orders orders = orderRepository.findById(idOrder).orElse(null);
        try {
            if(orders==null){
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy đơn hàng");
            }
            if(orders.getStatus() == Status.PROCESS){
                updateQuantityWhenDelete(orders);
            }
            orderRepository.delete(orders);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Lỗi xóa đơn hàng");
        }
        return ResponseEntity.status(HttpStatus.OK).body("Xóa đơn hàng thành công");
    }
    private void updateQuantityWhenDelete(Orders orders){
        Optional<List<OrderDetails>> orderDetailsList = orderDetailRepository.findAllByIdOrder(orders.getId());
        orderDetailsList.get().forEach(e -> {
            int quantity = e.getQuantity();
            Optional<Product> product = productRepository.findById(e.getIdProduct());
            product.ifPresent(value -> {
                value.setInStock(value.getInStock() + quantity);
                productRepository.save(value);
            });

        });
    }

    @GetMapping(path = "/find-by-date/{typeFilter}")
    public ResponseEntity<?> getOrderByDate(@PathVariable int typeFilter) {
        List<Orders> orders = null;
        final int TODAY = 0;
        final int WEEK = 1;
        final int MOUNT = 2;
        int dayLeft = 0;
        switch (typeFilter) {
            case TODAY: {
                dayLeft = 0;
                break;
            }
            case WEEK: {
                dayLeft = 7;
                break;
            }
            case MOUNT: {
                dayLeft = 30;
                break;
            }
        }
        Instant now = Instant.now(); //current date
        Instant before = now.minus(Duration.ofDays(dayLeft));
        Date startDate = Date.from(before);
        Date end = new Date();
        orders = orderRepository.findAllBydateOrderBetween(startDate, end);
        if (orders.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không có đơn hàng nào");
        }
        return ResponseEntity.status(HttpStatus.OK).body(orders);

    }

    @GetMapping(path = "/statistical-order/find-by-date/{typeFilter}")
    public ResponseEntity<?> getStatisticalOrderByDate(@PathVariable int typeFilter) {
        List<Orders> orders = null;
        final int TODAY = 0;
        final int WEEK = 1;
        final int MOUNT = 2;
        int dayLeft = 0;
        switch (typeFilter) {
            case TODAY: {
                dayLeft = 0;
                break;
            }
            case WEEK: {
                dayLeft = 7;
                break;
            }
            case MOUNT: {
                dayLeft = 30;
                break;
            }
        }
        Instant now = Instant.now(); //current date
        Instant before = now.minus(Duration.ofDays(dayLeft));
        Date startDate = Date.from(before);
        Date end = new Date();
        orders = orderRepository.findAllBydateOrderBetweenAndStatus(startDate, end,Status.DONE);

        if (orders.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không có đơn hàng nào");
        }
        return ResponseEntity.status(HttpStatus.OK).body(orders);

    }
    @PostMapping(path = "/export/order_report.xlsx")
    public ResponseEntity<?> exportData(@RequestBody com.example.bakery.order.StatisticalViewModel model)  {
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=product_template.xlsx");

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        try{
            List<com.example.bakery.order.StatisticalViewModel> statisticalViewModels = getDataStatistical(model);
            XSSFWorkbook workbook = new XSSFWorkbook(ResourceUtils.getFile("classpath:orders_template_05.xlsx"));
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
            for (com.example.bakery.order.StatisticalViewModel item : statisticalViewModels) {
                Row row = sheet.createRow(rowNum++);
                Cell cell1 = row.createCell(0);
                cell1.setCellValue(item.getProduct().getId());
                Cell cell2 = row.createCell(1);
                cell2.setCellValue(item.getProduct().getNameProduct());
                Cell cell3 = row.createCell(2);
                cell3.setCellValue(item.getProduct().getPrice());
                Cell cell4 = row.createCell(3);
                cell4.setCellValue(item.product.getPrice());
                Cell cell5 = row.createCell(4);
                cell5.setCellValue(item.getOutStock());
                Cell cell6 = row.createCell(5);
                cell6.setCellValue(item.getAmount());
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
    private String formatVnd(long value){
        DecimalFormat formatter = new DecimalFormat("###,###,###");

        return formatter.format(value)+" VNĐ";
    }
    public String convertShipMethod(ShipMethod val){
        String result = "";
        switch (val){
            case FAST:{
                result = "GIAO NHANH";
                break;
            }
            case NORMAL:{
                result = "GIAO THƯỜNG";
                break;
            }
        }
        return result;
    }

    public String convertPayMethod(PayMethods val){
        String result = "";
        switch (val){
            case BANK:{
                result = "CHUYỂN KHOẢN";
                break;
            }
            case CASH:{
                result = "TIỀN MẶT";
                break;
            }
        }
        return result;
    }
    public String convertStatusOrder(Status val){
        String status = "";
        switch (val) {
            case WAITING: {
                status = "CHỜ XỬ LÝ";
                break;
            }
            case PROCESS: {
                status = "ĐANG XỬ LÍ";
                break;
            }
            case SHIPPING: {
                status = "ĐANG GIAO HÀNG";
                break;
            }
            case DONE: {
                status = "XONG";
                break;
            }
            case RETURN: {
                status = "TRẢ HÀNG";
                break;
            }
            case HOLD: {
                status = "GIỮ KHO";
                break;
            }
            default : {
                status = "KHÔNG TÌM THẤY";
            }

        }
        return status;
    }
    @PostMapping(path = "/statistical")
    public ResponseEntity<?> getStatistical(@RequestBody StatisticalViewModel model){
        List<StatisticalViewModel> statisticalViewModels = getDataStatistical(model);
        if (!statisticalViewModels.isEmpty()) {
            return ResponseEntity.status(HttpStatus.OK).body(statisticalViewModels);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);

    }

    private List<StatisticalViewModel> getDataStatistical(StatisticalViewModel model)  {
        List<StatisticalViewModel> statisticalViewModels = new ArrayList<>();
        List<OrderDetails> orderDetails = orderDetailRepository.getProductStocks(model.startDate,model.endDate);
        List<Integer> ids = orderDetails.stream().map(OrderDetails::getIdProduct).distinct().collect(Collectors.toList());
        for(Integer id : ids){
            StatisticalViewModel data = new StatisticalViewModel();
            Product product = productRepository.findById(id).get();
            data.product = product;
            data.totalStock = product.getInStock();
            for(OrderDetails details:orderDetails){ 
                if(details.getIdProduct() == id){
                    if(details.getOrders().getStatus() == Status.DONE){
                        data.amount+=Integer.parseInt(details.getAmount());
                    }
                    data.outStock+=details.getQuantity();
                    data.date = details.getOrders().getDateOrder();
                }
            }
            statisticalViewModels.add(data);
        }
        return statisticalViewModels;
    }
}
