package com.example.employeemodule.controller;

import com.example.employeemodule.Service.ChannelService;
import com.example.employeemodule.dto.ChannelDTO;
import com.example.employeemodule.entity.Channel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/channels")
public class ChannelController {

    private final ChannelService channelService;

    public ChannelController(ChannelService channelService) {
        this.channelService = channelService;
    }

    @GetMapping
    public List<ChannelDTO> getAllChannels() {
        return channelService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ChannelDTO> getChannelById(@PathVariable Long id) {
        return channelService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ChannelDTO> createChannel(@RequestBody ChannelDTO channelDTO) {
        return ResponseEntity.ok(channelService.save(channelDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ChannelDTO> updateChannel(@PathVariable Long id, @RequestBody ChannelDTO channelDTO) {
        return channelService.update(id, channelDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteChannel(@PathVariable Long id) {
        if (channelService.delete(id)) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}


