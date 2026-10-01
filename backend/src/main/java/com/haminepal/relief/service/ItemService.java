package com.haminepal.relief.service;

import com.haminepal.relief.exception.ResourceInUseException;
import com.haminepal.relief.exception.ResourceNotFoundException;
import com.haminepal.relief.model.Item;
import com.haminepal.relief.repository.DispatchItemRepository;
import com.haminepal.relief.repository.ItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ItemService {

    private final ItemRepository itemRepository;
    private final DispatchItemRepository dispatchItemRepository;

    public List<Item> getAllItems() {
        return itemRepository.findAll();
    }

    public Item getItemById(Long id) {
        return itemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found with ID: " + id));
    }

    @Transactional
    public Item createItem(Item item) {
        if (itemRepository.existsByNameIgnoreCase(item.getName())) {
            throw new IllegalArgumentException("Item with name '" + item.getName() + "' already exists");
        }
        return itemRepository.save(item);
    }

    @Transactional
    public Item updateItem(Long id, Item details) {
        Item item = getItemById(id);

        if (!item.getName().equalsIgnoreCase(details.getName()) &&
            itemRepository.existsByNameIgnoreCase(details.getName())) {
            throw new IllegalArgumentException("Item with name '" + details.getName() + "' already exists");
        }

        item.setName(details.getName());
        item.setCategory(details.getCategory());
        item.setUnit(details.getUnit());
        item.setDescription(details.getDescription());

        return itemRepository.save(item);
    }

    @Transactional
    public void deleteItem(Long id) {
        Item item = getItemById(id);
        if (dispatchItemRepository.existsByItemId(id)) {
            throw new ResourceInUseException("Cannot delete item that has been included in dispatches");
        }
        itemRepository.delete(item);
    }
}
