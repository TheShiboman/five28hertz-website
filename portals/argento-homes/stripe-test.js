import Stripe from 'stripe';

async function testStripeConnection() {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error("STRIPE_SECRET_KEY is not set");
      return;
    }
    
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    
    // Test connection by retrieving account details
    const account = await stripe.account.retrieve();
    console.log("✅ Stripe connection successful!");
    console.log(`Account ID: ${account.id}`);
    console.log(`Account name: ${account.business_profile?.name || 'Not set'}`);
    
    // Try to create a test payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1000, // $10.00
      currency: 'usd',
      description: 'Test payment intent',
    });
    
    console.log("✅ Payment intent created successfully!");
    console.log(`Payment Intent ID: ${paymentIntent.id}`);
    console.log(`Client Secret: ${paymentIntent.client_secret.substring(0, 10)}...`);
    
  } catch (error) {
    console.error("❌ Stripe connection error:", error.message);
  }
}

testStripeConnection();