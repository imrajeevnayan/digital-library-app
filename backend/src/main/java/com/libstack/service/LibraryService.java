package com.libstack.service;

import com.libstack.dto.BookDTO;
import com.libstack.dto.CategoryDTO;
import com.libstack.dto.CreateBookRequest;
import com.libstack.dto.CreateCategoryRequest;
import com.libstack.dto.UpdateBookRequest;
import com.libstack.model.Book;
import com.libstack.model.Category;
import com.libstack.repository.BookRepository;
import com.libstack.repository.CategoryRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class LibraryService {

    private final BookRepository bookRepository;
    private final CategoryRepository categoryRepository;

    public LibraryService(BookRepository bookRepository, CategoryRepository categoryRepository) {
        this.bookRepository = bookRepository;
        this.categoryRepository = categoryRepository;
    }

    // Book Services
    public Page<BookDTO> getAllBooks(Pageable pageable) {
        return bookRepository.findAll(pageable).map(this::toBookDTO);
    }

    public Page<BookDTO> searchBooks(String query, Pageable pageable) {
        return bookRepository.searchBooks(query, pageable).map(this::toBookDTO);
    }

    public Page<BookDTO> getAvailableBooks(Pageable pageable) {
        return bookRepository.findAvailableBooks(pageable).map(this::toBookDTO);
    }

    public Page<BookDTO> getBooksByCategory(String categoryId, Pageable pageable) {
        return bookRepository.findByCategoryId(categoryId, pageable).map(this::toBookDTO);
    }

    public BookDTO getBookById(String id) {
        return bookRepository.findById(id)
            .map(this::toBookDTO)
            .orElseThrow(() -> new RuntimeException("Book not found with id: " + id));
    }

    public BookDTO createBook(CreateBookRequest request) {
        Book book = new Book();
        book.setTitle(request.getTitle());
        book.setAuthor(request.getAuthor());
        book.setIsbn(request.getIsbn());
        book.setDescription(request.getDescription());
        book.setCoverUrl(request.getCoverUrl());
        book.setStockQuantity(request.getStockQuantity() != null ? request.getStockQuantity() : 0);

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + request.getCategoryId()));
            book.setCategory(category);
        }

        Book savedBook = bookRepository.save(book);
        return toBookDTO(savedBook);
    }

    public BookDTO updateBook(String id, UpdateBookRequest request) {
        Book book = bookRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Book not found with id: " + id));

        if (request.getTitle() != null) {
            book.setTitle(request.getTitle());
        }
        if (request.getAuthor() != null) {
            book.setAuthor(request.getAuthor());
        }
        if (request.getIsbn() != null) {
            book.setIsbn(request.getIsbn());
        }
        if (request.getDescription() != null) {
            book.setDescription(request.getDescription());
        }
        if (request.getCoverUrl() != null) {
            book.setCoverUrl(request.getCoverUrl());
        }
        if (request.getStockQuantity() != null) {
            book.setStockQuantity(request.getStockQuantity());
        }
        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + request.getCategoryId()));
            book.setCategory(category);
        }

        Book updatedBook = bookRepository.save(book);
        return toBookDTO(updatedBook);
    }

    public void deleteBook(String id) {
        if (!bookRepository.existsById(id)) {
            throw new RuntimeException("Book not found with id: " + id);
        }
        bookRepository.deleteById(id);
    }

    // Category Services
    public List<CategoryDTO> getAllCategories() {
        return categoryRepository.findAll().stream()
            .map(this::toCategoryDTO)
            .collect(Collectors.toList());
    }

    public CategoryDTO getCategoryById(String id) {
        return categoryRepository.findById(id)
            .map(this::toCategoryDTO)
            .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));
    }

    public CategoryDTO createCategory(CreateCategoryRequest request) {
        if (categoryRepository.existsByName(request.getName())) {
            throw new RuntimeException("Category already exists with name: " + request.getName());
        }

        Category category = new Category();
        category.setName(request.getName());
        category.setDescription(request.getDescription());

        Category savedCategory = categoryRepository.save(category);
        return toCategoryDTO(savedCategory);
    }

    public CategoryDTO updateCategory(String id, CreateCategoryRequest request) {
        Category category = categoryRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));

        if (!category.getName().equals(request.getName()) && categoryRepository.existsByName(request.getName())) {
            throw new RuntimeException("Category already exists with name: " + request.getName());
        }

        category.setName(request.getName());
        category.setDescription(request.getDescription());

        Category updatedCategory = categoryRepository.save(category);
        return toCategoryDTO(updatedCategory);
    }

    public void deleteCategory(String id) {
        if (!categoryRepository.existsById(id)) {
            throw new RuntimeException("Category not found with id: " + id);
        }
        categoryRepository.deleteById(id);
    }

    // Conversion Methods
    private BookDTO toBookDTO(Book book) {
        BookDTO dto = new BookDTO();
        dto.setId(book.getId());
        dto.setTitle(book.getTitle());
        dto.setAuthor(book.getAuthor());
        dto.setIsbn(book.getIsbn());
        dto.setDescription(book.getDescription());
        dto.setCoverUrl(book.getCoverUrl());
        dto.setStockQuantity(book.getStockQuantity());
        dto.setAvailable(book.isAvailable());
        dto.setAvailableStock(book.getStockQuantity());
        
        if (book.getCategory() != null) {
            dto.setCategoryId(book.getCategory().getId());
            dto.setCategoryName(book.getCategory().getName());
        }
        
        return dto;
    }

    private CategoryDTO toCategoryDTO(Category category) {
        CategoryDTO dto = new CategoryDTO();
        dto.setId(category.getId());
        dto.setName(category.getName());
        dto.setDescription(category.getDescription());
        return dto;
    }
}
