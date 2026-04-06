package com.project.product_admin;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import jakarta.servlet.http.HttpServletRequest;
import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/products")
public class ProductController {

    @Autowired
    private ProductRepository repo;

    @GetMapping
    public List<Product> getProducts() {
        return repo.findAll();
    }

    @PostMapping
    public ResponseEntity<?> addProduct(@RequestBody Product product, HttpServletRequest request) {
        if (!"ADMIN".equals(request.getAttribute("role"))) {
            return ResponseEntity.status(403).body("You do not have permission");
        }
        return ResponseEntity.ok(repo.save(product));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable Long id, @RequestBody Product updatedProduct, HttpServletRequest request) {
        if (!"ADMIN".equals(request.getAttribute("role"))) {
            return ResponseEntity.status(403).body("You do not have permission");
        }

        Product product = repo.findById(id).orElseThrow();
        product.setName(updatedProduct.getName());
        product.setPrice(updatedProduct.getPrice());
        product.setImageUrl(updatedProduct.getImageUrl());

        return ResponseEntity.ok(repo.save(product));
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id, HttpServletRequest request) {
        if (!"ADMIN".equals(request.getAttribute("role"))) {
            return ResponseEntity.status(403).body("You do not have permission");
        }
        repo.deleteById(id);
        return ResponseEntity.ok("Product deleted");
    }
}