package com.haminepal.relief.repository;

import com.haminepal.relief.model.DispatchItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DispatchItemRepository extends JpaRepository<DispatchItem, Long> {
    List<DispatchItem> findByDispatchId(Long dispatchId);
    boolean existsByItemId(Long itemId);
}
