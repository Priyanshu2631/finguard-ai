package finguard_backend.controller;

import finguard_backend.model.Transaction;
import finguard_backend.service.TransactionService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "http://localhost:5173")
public class TransactionController {

    private final TransactionService service;

    public TransactionController(
            TransactionService service
    ) {
        this.service = service;
    }

    @PostMapping
    public Transaction addTransaction(
            @RequestBody Transaction transaction
    ) {
        return service.addTransaction(transaction);
    }

    @GetMapping
    public List<Transaction> getAllTransactions() {
        return service.getAllTransactions();
    }

    @GetMapping("/{id}")
    public Transaction getTransactionById(
            @PathVariable Long id
    ) {
        return service.getTransactionById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Transaction not found"
                        )
                );
    }

    @PutMapping("/{id}")
    public Transaction updateTransaction(
            @PathVariable Long id,
            @RequestBody Transaction transaction
    ) {
        return service.updateTransaction(
                id,
                transaction
        );
    }

    @PutMapping("/{id}/fraud-analysis")
    public Transaction updateFraudAnalysis(
            @PathVariable Long id,
            @RequestBody Map<String, Object> request
    ) {

        boolean fraud =
                Boolean.TRUE.equals(
                        request.get("fraud")
                );

        double fraudProbability =
                ((Number) request.get(
                        "fraudProbability"
                )).doubleValue();

        return service.updateFraudAnalysis(
                id,
                fraud,
                fraudProbability
        );
    }

    @DeleteMapping("/{id}")
    public String deleteTransaction(
            @PathVariable Long id
    ) {
        service.deleteTransaction(id);

        return "Transaction deleted successfully";
    }
}