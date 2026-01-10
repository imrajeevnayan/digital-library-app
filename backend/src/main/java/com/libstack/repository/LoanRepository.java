package com.libstack.repository;

import com.libstack.model.Loan;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LoanRepository extends JpaRepository<Loan, String> {
    
    Page<Loan> findByUserId(String userId, Pageable pageable);
    
    List<Loan> findByUserIdAndStatus(String userId, String status);
    
    @Query("SELECT l FROM Loan l WHERE l.user.id = :userId AND l.status = 'ACTIVE'")
    List<Loan> findActiveLoansByUserId(@Param("userId") String userId);
    
    @Query("SELECT COUNT(l) FROM Loan l WHERE l.user.id = :userId AND l.status = 'ACTIVE'")
    long countActiveLoansByUserId(@Param("userId") String userId);
    
    boolean existsByUserIdAndBookIdAndStatus(String userId, String bookId, String status);
    
    @Query("SELECT l FROM Loan l WHERE l.book.id = :bookId AND l.status = 'ACTIVE'")
    List<Loan> findActiveLoansByBookId(@Param("bookId") String bookId);
    
    @Query("SELECT l FROM Loan l WHERE l.status = 'ACTIVE' AND l.dueDate < CURRENT_DATE")
    List<Loan> findOverdueLoans();
    
    Page<Loan> findAll(Pageable pageable);
}
