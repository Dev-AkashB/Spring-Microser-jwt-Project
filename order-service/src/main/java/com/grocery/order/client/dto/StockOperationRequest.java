package com.grocery.order.client.dto;

import java.util.List;

public class StockOperationRequest {
    private List<StockItem> items;

    public StockOperationRequest() {}

    public StockOperationRequest(List<StockItem> items) {
        this.items = items;
    }

    public List<StockItem> getItems() { return items; }
    public void setItems(List<StockItem> items) { this.items = items; }
}
