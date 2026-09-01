from pydantic import BaseModel,Field

class CreateRazorpayOrderRequest(BaseModel):
    roster_id: int
    

class VerifyRazorpayPaymentRequest(BaseModel):
    razorpay_order_id: str = Field(min_length=1)
    razorpay_payment_id: str = Field(min_length=1)
    razorpay_signature: str = Field(min_length=1)