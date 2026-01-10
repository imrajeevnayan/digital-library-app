package com.libstack.dto;

import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateBookRequest {
    
    private String title;
    
    private String author;
    
    private String isbn;
    
    private String description;
    
    private String coverUrl;
    
    @Min(value = 0, message = "Stock quantity must be non-negative")
    private Integer stockQuantity;
    
    private String categoryId;
}
