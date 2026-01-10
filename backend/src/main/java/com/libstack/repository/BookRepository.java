package com.libstack.repository;

import com.libstack.model.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookRepository extends JpaRepository<Book, String> {
    Optional<Book> findByIsbn(String isbn);
    
    @Query("SELECT b FROM Book b WHERE " +
           "LOWER(b.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(b.author) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(b.isbn) LIKE LOWER(CONCAT('%', :query, '%'))")
    Page<Book> searchBooks(@Param("query") String query, Pageable pageable);
    
    Page<Book> findByCategoryId(String categoryId, Pageable pageable);
    
    Page<Book> findByStockQuantityGreaterThan(int quantity, Pageable pageable);
    
    @Query("SELECT b FROM Book b WHERE b.stockQuantity > 0")
    Page<Book> findAvailableBooks(Pageable pageable);
    
    List<Book> findByTitleContainingIgnoreCase(String title);
}
