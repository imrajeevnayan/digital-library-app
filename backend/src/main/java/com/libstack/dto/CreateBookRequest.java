package com.libstack.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateBookRequest {
    
    @NotBlank(message = "Title is required")
    private String title;
    
    @NotBlank(message = "Author is required")
    private String author;
    
    private String isbn;
    
    private String description;
    
    private String coverUrl;
    
    @Min(value = 0, message = "Stock quantity must be non-negative")
    private Integer stockQuantity;
    
    private String categoryId;
}
