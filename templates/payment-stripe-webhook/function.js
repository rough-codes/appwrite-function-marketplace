import { Client, Databases } from 'node-appwrite';
import crypto from 'crypto';

/**
 * Stripe Webhook Handler Template
 * Securely processes Stripe webhook events for payment processing
 * 
 * Environment Variables Required:
 * - STRIPE_WEBHOOK_SECRET: Your Stripe webhook endpoint secret
 * - APPWRITE_API_KEY: Your Appwrite API key
 * - DATABASE_ID: Your Appwrite database ID
 * - ORDERS_COLLECTION_ID: Collection ID for storing order data
 */

export default async ({ req, res, log, error }) => {
  try {
    const sig = req.headers['stripe-signature'];
    const payload = req.body;

    if (!sig || !payload) {
      return res.json({
        success: false,
        error: 'Missing signature or payload'
      }, 400);
    }

    // Verify webhook signature
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    let event;

    try {
      const elements = sig.split(',');
      const signature = elements.find(el => el.startsWith('v1='))?.split('=')[1];
      const timestamp = elements.find(el => el.startsWith('t='))?.split('=')[1];

      if (!signature || !timestamp) {
        throw new Error('Invalid signature format');
      }

      // Create expected signature
      const payloadString = timestamp + '.' + payload;
      const expectedSignature = crypto
        .createHmac('sha256', endpointSecret)
        .update(payloadString, 'utf8')
        .digest('hex');

      if (signature !== expectedSignature) {
        throw new Error('Invalid signature');
      }

      event = JSON.parse(payload);
    } catch (err) {
      error(`Webhook signature verification failed: ${err.message}`);
      return res.json({
        success: false,
        error: 'Invalid signature'
      }, 400);
    }

    // Initialize Appwrite
    const client = new Client()
      .setEndpoint(process.env.APPWRITE_FUNCTION_ENDPOINT)
      .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
      .setKey(process.env.APPWRITE_API_KEY);

    const databases = new Databases(client);

    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSuccess(databases, event.data.object);
        break;
      
      case 'payment_intent.payment_failed':
        await handlePaymentFailed(databases, event.data.object);
        break;
      
      case 'customer.subscription.created':
        await handleSubscriptionCreated(databases, event.data.object);
        break;
      
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(databases, event.data.object);
        break;
      
      case 'customer.subscription.deleted':
        await handleSubscriptionCanceled(databases, event.data.object);
        break;
      
      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(databases, event.data.object);
        break;
      
      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(databases, event.data.object);
        break;
      
      default:
        log(`Unhandled event type: ${event.type}`);
    }

    log(`Successfully processed webhook event: ${event.type}`);

    return res.json({
      success: true,
      event_type: event.type,
      processed_at: new Date().toISOString()
    });

  } catch (err) {
    error(`Webhook processing failed: ${err.message}`);
    
    return res.json({
      success: false,
      error: err.message
    }, 500);
  }
};

// Helper functions for different event types
async function handlePaymentSuccess(databases, paymentIntent) {
  const orderId = paymentIntent.metadata?.order_id;
  
  if (orderId) {
    await databases.updateDocument(
      process.env.DATABASE_ID,
      process.env.ORDERS_COLLECTION_ID,
      orderId,
      {
        status: 'paid',
        payment_intent_id: paymentIntent.id,
        amount_received: paymentIntent.amount_received,
        paid_at: new Date().toISOString()
      }
    );
  }
}

async function handlePaymentFailed(databases, paymentIntent) {
  const orderId = paymentIntent.metadata?.order_id;
  
  if (orderId) {
    await databases.updateDocument(
      process.env.DATABASE_ID,
      process.env.ORDERS_COLLECTION_ID,
      orderId,
      {
        status: 'failed',
        payment_intent_id: paymentIntent.id,
        failure_reason: paymentIntent.last_payment_error?.message || 'Payment failed',
        failed_at: new Date().toISOString()
      }
    );
  }
}

async function handleSubscriptionCreated(databases, subscription) {
  const customerId = subscription.customer;
  
  await databases.createDocument(
    process.env.DATABASE_ID,
    'subscriptions',
    'unique()',
    {
      stripe_subscription_id: subscription.id,
      stripe_customer_id: customerId,
      status: subscription.status,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      created_at: new Date().toISOString()
    }
  );
}

async function handleSubscriptionUpdated(databases, subscription) {
  try {
    const existingSubscription = await databases.listDocuments(
      process.env.DATABASE_ID,
      'subscriptions',
      [`stripe_subscription_id=${subscription.id}`]
    );

    if (existingSubscription.documents.length > 0) {
      await databases.updateDocument(
        process.env.DATABASE_ID,
        'subscriptions',
        existingSubscription.documents[0].$id,
        {
          status: subscription.status,
          current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          updated_at: new Date().toISOString()
        }
      );
    }
  } catch (err) {
    console.error('Failed to update subscription:', err);
  }
}

async function handleSubscriptionCanceled(databases, subscription) {
  try {
    const existingSubscription = await databases.listDocuments(
      process.env.DATABASE_ID,
      'subscriptions',
      [`stripe_subscription_id=${subscription.id}`]
    );

    if (existingSubscription.documents.length > 0) {
      await databases.updateDocument(
        process.env.DATABASE_ID,
        'subscriptions',
        existingSubscription.documents[0].$id,
        {
          status: 'canceled',
          canceled_at: new Date().toISOString()
        }
      );
    }
  } catch (err) {
    console.error('Failed to cancel subscription:', err);
  }
}

async function handleInvoicePaymentSucceeded(databases, invoice) {
  // Handle successful invoice payment
  // Update subscription or order status as needed
}

async function handleInvoicePaymentFailed(databases, invoice) {
  // Handle failed invoice payment
  // Update subscription status, send notifications, etc.
}