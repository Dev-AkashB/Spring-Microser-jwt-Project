package com.grocery.payment.dto;

import com.grocery.payment.entity.DeliveryStatus;

public class DeliveryStatusUpdateRequest {
    private Long orderId;
    private DeliveryStatus status;

    public DeliveryStatusUpdateRequest() {}

    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }

    public DeliveryStatus getStatus() { return status; }
    public void setStatus(DeliveryStatus status) { this.status = status; }
}
