package com.example.moduleproject.Service;

import com.example.moduleproject.Repository.ClientRepository;
import com.example.moduleproject.dto.ClientDTO;
import com.example.moduleproject.entity.Client;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ClientService {

    private final ClientRepository repository;

    public ClientService(ClientRepository repository) {
        this.repository = repository;
    }

    public List<ClientDTO> getAll() {
        return repository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    public ClientDTO getById(Long id) {
        return repository.findById(id).map(this::toDto).orElseThrow();
    }

    public ClientDTO create(ClientDTO dto) {
        Client client = toEntity(dto);
        return toDto(repository.save(client));
    }

    public ClientDTO update(Long id, ClientDTO dto) {
        Client existing = repository.findById(id).orElseThrow();
        existing.setName(dto.getName());
        existing.setEmail(dto.getEmail());
        existing.setPhone(dto.getPhone());
        existing.setAddress(dto.getAddress());
        return toDto(repository.save(existing));
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
    public Client getEntityById(Long id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Client not found"));
    }

    private ClientDTO toDto(Client client) {
        ClientDTO dto = new ClientDTO();
        dto.setClientId(client.getClientId());
        dto.setName(client.getName());
        dto.setEmail(client.getEmail());
        dto.setPhone(client.getPhone());
        dto.setAddress(client.getAddress());
        return dto;
    }

    private Client toEntity(ClientDTO dto) {
        Client client = new Client();
        client.setClientId(dto.getClientId());
        client.setName(dto.getName());
        client.setEmail(dto.getEmail());
        client.setPhone(dto.getPhone());
        client.setAddress(dto.getAddress());
        return client;
    }
}