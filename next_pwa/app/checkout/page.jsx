'use client';

import { useState, useEffect } from "react";
import { Box, Button, Flex, Heading, Separator, Text, TextField } from "@radix-ui/themes";
import { addToSyncQueue } from "../../lib/offline";

// Helper to generate a simple UUID (for demo/testing)
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export default function CheckoutPage() {
  const [checkout, setCheckout] = useState({
    products: [],
    subtotal: 0,
  });
  useEffect(() => {
  const savedCheckout = JSON.parse(localStorage.getItem("checkoutData") || "{}");
  if (savedCheckout.products && savedCheckout.subtotal !== undefined) {
    setCheckout(savedCheckout);
  }
  console.log(savedCheckout);
}, []);
  const [confirmation, setConfirmation] = useState("");
  const handlePlaceOrder = async () => {
    // Dummy transaction data for testing
    const transactionId = generateUUID();
    const transactionData = {
      customer: {
        name: "Test User",
        email: "test@example.com",
        phone: "1234567890",
        address: "123 Main St, City, ZIP"
      },
      items: [
        { name: "Product 1", price: 499, qty: 1 },
        { name: "Product 2", price: 799, qty: 1 }
      ],
      total: 1348,
      createdAt: new Date().toISOString()
    };
    await addToSyncQueue(transactionId, transactionData);
    setConfirmation(`Transaction queued for sync! ID: ${transactionId}`);
  };

  return (
    <Box className="p-6 max-w-6xl mx-auto">
      <Heading size="6" mb="6">Checkout</Heading>

      <Flex direction="row" gap="6" wrap="wrap">

        {/* Billing Details */}
        <Box className="flex-1 min-w-[300px]">
          <Heading size="4" mb="3">Billing Details</Heading>
          <Flex direction="column" gap="3">
            <TextField.Root placeholder="Full Name" />
            <TextField.Root placeholder="Email Address" />
            <TextField.Root placeholder="Phone Number" />
            <TextField.Root placeholder="Address" />
            <Flex gap="3">
              <TextField.Root placeholder="City" />
              <TextField.Root placeholder="ZIP Code" />
            </Flex>
          </Flex>
        </Box>

        {/* Order Summary */}
        <Box className="flex-1 min-w-[300px] bg-white rounded-lg p-4 shadow-md">
          <Heading size="4" mb="3">Order Summary</Heading>

          <Flex direction="column" gap="3">
            {checkout.products?.map((product) => {
              return(
                <>
                <Flex justify="between">
                  <Text>{product.name}</Text>
                  <Text>₹{product.price}</Text>
                </Flex>
                </>
              )
            })}
            {/* <Flex justify="between">
              <Text>Product 1</Text>
              <Text>₹499</Text>
            </Flex>
            <Flex justify="between">
              <Text>Product 2</Text>
              <Text>₹799</Text>
            </Flex> */}

            {/* <Separator my="2" />

            <Flex justify="between">
              <Text weight="bold">Subtotal</Text>
              <Text weight="bold">₹{checkout.subtotal}</Text>
            </Flex>
            <Flex justify="between">
              <Text>Shipping</Text>
              <Text>₹50</Text>
            </Flex> */}

            <Separator my="2" />

            <Flex justify="between">
              <Text weight="bold">Total</Text>
              <Text weight="bold">₹{checkout.subtotal}</Text>
            </Flex>

            <Button className="mt-4" size="3" onClick={handlePlaceOrder}>Place Order</Button>
            {confirmation && (
              <Text color="green" mt="3">{confirmation}</Text>
            )}
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
}
