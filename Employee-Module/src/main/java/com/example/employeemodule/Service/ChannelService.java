package com.example.employeemodule.Service;

import com.example.employeemodule.Repository.ChannelRepository;
import com.example.employeemodule.dto.ChannelDTO;
import com.example.employeemodule.entity.Channel;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


@Service
    public class ChannelService {

        private final ChannelRepository channelRepository;

        public ChannelService(ChannelRepository channelRepository) {
            this.channelRepository = channelRepository;
        }

        public List<ChannelDTO> findAll() {
            return channelRepository.findAll()
                    .stream()
                    .map(this::toDTO)
                    .collect(Collectors.toList());
        }

        public Optional<ChannelDTO> findById(Long id) {
            return channelRepository.findById(id)
                    .map(this::toDTO);
        }

        public ChannelDTO save(ChannelDTO channelDTO) {
            Channel saved = channelRepository.save(this.toEntity(channelDTO));
            return this.toDTO(saved);
        }

        public Optional<ChannelDTO> update(Long id, ChannelDTO channelDTO) {
            return channelRepository.findById(id)
                    .map(existing -> {
                        existing.setName(channelDTO.getName());
                        existing.setDescription(channelDTO.getDescription());
                        Channel updated = channelRepository.save(existing);
                        return this.toDTO(updated);
                    });
        }

        public boolean delete(Long id) {
            if (channelRepository.existsById(id)) {
                channelRepository.deleteById(id);
                return true;
            }
            return false;
        }



    public  ChannelDTO toDTO(Channel entity) {
        ChannelDTO dto = new ChannelDTO();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setDescription(entity.getDescription());
        return dto;
    }

    public  Channel toEntity(ChannelDTO dto) {
        Channel entity = new Channel();
        entity.setId(dto.getId());
        entity.setName(dto.getName());
        entity.setDescription(dto.getDescription());
        return entity;
    }
}

