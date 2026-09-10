package com.grocery.order.dto;

import java.util.List;

public class CheckoutRequest {
    private String deliveryAddress;
    private String recipientPhone;
    private String paymentMethod; // CREDIT_CARD, DEBIT_CARD, UPI, CASH_ON_DELIVERY
    private List<CheckoutItem> items; // Optional: If empty, uses items in user's cart

    public static class CheckoutItem {
        private Long productId;
        private Integer quantity;

        public CheckoutItem() {}
        public CheckoutItem(Long productId, Integer quantity) {
            this.productId = productId;
            this.quantity = quantity;
        }

        public Long getProductId() { return productId; }
        public void setProductId(Long productId) { this.productId = productId; }

        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }
    }

    public CheckoutRequest() {}

    public String getDeliveryAddress() { return deliveryAddress; }
    public void setDeliveryAddress(String deliveryAddress) { this.deliveryAddress = deliveryAddress; }

    public String getRecipientPhone() { return recipientPhone; }
    public void setRecipientPhone(String recipientPhone) { this.recipientPhone = recipientPhone; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public List<CheckoutItem> getItems() { return items; }
    public void setItems(List<CheckoutItem> items) { this.items = items; }
}
