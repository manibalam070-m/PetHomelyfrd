import Razorpay from 'razorpay';
import crypto from 'crypto';

export const processPayment = async (req, res, next) => {
  try {
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    const options = {
      amount: Math.round(req.body.amount * 100),
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    };
    const order = await instance.orders.create(options);
    res.status(200).json({ success: true, order });
  } catch (error) { next(error); }
};

export const verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expected = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString()).digest('hex');
    if (expected === razorpay_signature) {
      res.status(200).json({ success: true, message: 'Payment verified' });
    } else {
      res.status(400).json({ success: false, message: 'Invalid signature' });
    }
  } catch (error) { next(error); }
};