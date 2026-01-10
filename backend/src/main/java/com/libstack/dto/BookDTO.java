package com.libstack.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookDTO {
    private String id;
    private String title;
    private String author;
    private String isbn;
    private String description;
    private String coverUrl;
    private Integer stockQuantity;
    private Integer availableStock;
    private String categoryId;
    private String categoryName;
    private boolean available;
}
