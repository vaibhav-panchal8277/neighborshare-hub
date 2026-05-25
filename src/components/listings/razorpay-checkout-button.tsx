"use client"

import { Button } from "@/components/ui/button"
import { CreditCard } from "lucide-react"
import { useState } from "react"
import { createRazorpayOrder, verifyRazorpayPayment } from "@/app/actions/razorpay-actions"
import Script from "next/script"

export function RazorpayCheckoutButton({ bookingId }: { bookingId: string }) {
  const [isLoading, setIsLoading] = useState(false)

  const handlePayment = async () => {
    try {
      setIsLoading(true)
      const order = await createRazorpayOrder(bookingId)

      const options = {
        key: order.keyId, // Enter the Key ID generated from the Dashboard
        amount: order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        currency: order.currency,
        name: "NeighborShare",
        description: `Rental: ${order.listingTitle}`,
        order_id: order.orderId, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        handler: async function (response: { razorpay_order_id: string, razorpay_payment_id: string, razorpay_signature: string }) {
          try {
            await verifyRazorpayPayment(
              response.razorpay_order_id,
              response.razorpay_payment_id,
              response.razorpay_signature,
              bookingId
            )
            // Success! The server action already revalidated the path
          } catch (error) {
            console.error(error)
            alert("Payment verification failed!")
          }
        },
        prefill: {
          name: order.userName,
          email: order.userEmail,
        },
        theme: {
          color: "#3399cc"
        }
      };

      // @ts-expect-error window.Razorpay not in TS by default
      const rzp1 = new window.Razorpay(options);
      rzp1.on('payment.failed', function (response: { error: { description: string } }){
        console.error(response.error);
        alert(response.error.description);
      });
      rzp1.open();
    } catch (error) {
      console.error(error)
      alert("Failed to initialize payment")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <Button className="w-full mt-4" onClick={handlePayment} disabled={isLoading}>
        <CreditCard className="mr-2 h-4 w-4" /> 
        {isLoading ? "Processing..." : "Pay & Confirm Pickup"}
      </Button>
    </>
  )
}
