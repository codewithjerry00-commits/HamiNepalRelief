package com.haminepal.relief.repository;

import com.haminepal.relief.model.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ItemRepository extends JpaRepository<Item, Long> {
    Optional<Item> findByNameIgnoreCase(String name);
    boolean existsByNameIgnoreCase(String name);
    List<Item> findByCategoryIgnoreCase(String category);
}
