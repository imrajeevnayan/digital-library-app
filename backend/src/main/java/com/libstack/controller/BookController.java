package com.libstack.controller;

import com.libstack.dto.BookDTO;
import com.libstack.dto.CreateBookRequest;
import com.libstack.dto.UpdateBookRequest;
import com.libstack.service.LibraryService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/books")
public class BookController {

    private final LibraryService libraryService;

    public BookController(LibraryService libraryService) {
        this.libraryService = libraryService;
    }

    @GetMapping
    public ResponseEntity<Page<BookDTO>> getAllBooks(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Boolean available,
            @PageableDefault(size = 12) Pageable pageable) {
        
        Page<BookDTO> books;
        
        if (search != null && !search.isEmpty()) {
            books = libraryService.searchBooks(search, pageable);
        } else if (category != null && !category.isEmpty()) {
            books = libraryService.getBooksByCategory(category, pageable);
        } else if (Boolean.TRUE.equals(available)) {
            books = libraryService.getAvailableBooks(pageable);
        } else {
            books = libraryService.getAllBooks(pageable);
        }
        
        return ResponseEntity.ok(books);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookDTO> getBookById(@PathVariable String id) {
        BookDTO book = libraryService.getBookById(id);
        return ResponseEntity.ok(book);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BookDTO> createBook(@Valid @RequestBody CreateBookRequest request) {
        BookDTO book = libraryService.createBook(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(book);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BookDTO> updateBook(@PathVariable String id, @RequestBody UpdateBookRequest request) {
        BookDTO book = libraryService.updateBook(id, request);
        return ResponseEntity.ok(book);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteBook(@PathVariable String id) {
        libraryService.deleteBook(id);
        return ResponseEntity.noContent().build();
    }
}
