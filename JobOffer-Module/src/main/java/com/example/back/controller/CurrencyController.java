package com.example.back.controller;


import com.example.back.entity.Currency;
import com.example.back.Service.CurrencyService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/currencies")
@RequiredArgsConstructor
public class CurrencyController {


    private final CurrencyService currencyService;

    // CREATE
    @PostMapping
    public Currency createCurrency(@RequestBody Currency currency) {
        return currencyService.saveCurrency(currency);
    }

    // READ - Get all currencies
    @GetMapping
    public List<Currency> getAllCurrencies() {
        return currencyService.getAllCurrencies();
    }

    // READ - Get one currency by ID
    @GetMapping("/{id}")
    public Currency getCurrencyById(@PathVariable Long id) {
        return currencyService.getCurrencyById(id);
    }

    // UPDATE
    @PutMapping("/{id}")
    public Currency updateCurrency(@PathVariable Long id, @RequestBody Currency updatedCurrency) {
        return currencyService.updateCurrency(id, updatedCurrency);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public void deleteCurrency(@PathVariable Long id) {
        currencyService.deleteCurrency(id);
    }


}
