package com.example.back.Service;


import com.example.back.Repository.CurrencyRepository;
import com.example.back.entity.Currency;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CurrencyService {

    private final CurrencyRepository currencyRepository;

    // CREATE
    public Currency saveCurrency(Currency currency) {
        return currencyRepository.save(currency);
    }

    // READ - Get All
    public List<Currency> getAllCurrencies() {
        return currencyRepository.findAll();
    }

    // READ - Get by ID
    public Currency getCurrencyById(Long id) {
        return currencyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Currency not found with id: " + id));
    }

    // UPDATE
    public Currency updateCurrency(Long id, Currency newCurrency) {
        Currency existing = getCurrencyById(id);
        existing.setCurrencyName(newCurrency.getCurrencyName());
        return currencyRepository.save(existing);
    }

    // DELETE
    public void deleteCurrency(Long id) {
        currencyRepository.deleteById(id);
    }


}
