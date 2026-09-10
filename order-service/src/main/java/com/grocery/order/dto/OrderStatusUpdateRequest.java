package com.grocery.order.dto;

import com.grocery.order.entity.OrderStatus;

public class OrderStatusUpdateRequest {
    private OrderStatus status;

    public OrderStatusUpdateRequest() {}

    public OrderStatus getStatus() { return status; }
    public void setStatus(OrderStatus status) { this.status = status; }
}
