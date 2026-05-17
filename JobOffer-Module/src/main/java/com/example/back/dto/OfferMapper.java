package com.example.back.dto;

import com.example.back.entity.Offer;
import org.mapstruct.*;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface OfferMapper {
    OfferMapper INSTANCE = Mappers.getMapper(OfferMapper.class);

    // Convert DTO to Entity (auto-handles Map<String, String>)
    //@Mapping(target = "id", ignore = true) // Ignore ID for new entities
    //@Mapping(target = "status", constant = "Pending") // Default value
    Offer toEntity(OfferRequestDTO dto);

    // Convert Entity to DTO
    OfferResponseDTO toDto(Offer entity);

    // Update existing Entity from DTO (ignores null fields)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateFromDto(OfferRequestDTO dto, @MappingTarget Offer entity);

}
