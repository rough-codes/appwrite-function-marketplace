import { Client, Databases } from 'node-appwrite';
import admin from 'firebase-admin';

/**
 * Push Notification Sender Template
 * Send push notifications to mobile devices using Firebase Cloud Messaging
 * 
 * Environment Variables Required:
 * - FIREBASE_PROJECT_ID: Your Firebase project ID
 * - FIREBASE_PRIVATE_KEY: Firebase service account private key
 * - FIREBASE_CLIENT_EMAIL: Firebase service account client email
 * - APPWRITE_API_KEY: Your Appwrite API key
 * - DATABASE_ID: Your Appwrite database ID
 * - USERS_COLLECTION_ID: Collection ID for user data with FCM tokens
 */

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    }),
  });
}

export default async ({ req, res, log, error }) => {
  try {
    const { 
      userId, 
      userIds, 
      title, 
      body, 
      data, 
      imageUrl,
      actionUrl,
      priority = 'high',
      sound = 'default'
    } = JSON.parse(req.body);

    if (!title || !body) {
      return res.json({
        success: false,
        error: 'Title and body are required'
      }, 400);
    }

    // Initialize Appwrite
    const client = new Client()
      .setEndpoint(process.env.APPWRITE_FUNCTION_ENDPOINT)
      .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
      .setKey(process.env.APPWRITE_API_KEY);

    const databases = new Databases(client);

    let fcmTokens = [];

    // Get FCM tokens for specified users
    if (userId) {
      // Single user
      const user = await databases.getDocument(
        process.env.DATABASE_ID,
        process.env.USERS_COLLECTION_ID,
        userId
      );
      if (user.fcm_token) {
        fcmTokens.push(user.fcm_token);
      }
    } else if (userIds && Array.isArray(userIds)) {
      // Multiple users
      for (const id of userIds) {
        try {
          const user = await databases.getDocument(
            process.env.DATABASE_ID,
            process.env.USERS_COLLECTION_ID,
            id
          );
          if (user.fcm_token) {
            fcmTokens.push(user.fcm_token);
          }
        } catch (err) {
          log(`Failed to get user ${id}: ${err.message}`);
        }
      }
    } else {
      return res.json({
        success: false,
        error: 'Either userId or userIds array is required'
      }, 400);
    }

    if (fcmTokens.length === 0) {
      return res.json({
        success: false,
        error: 'No valid FCM tokens found for specified users'
      }, 400);
    }

    // Prepare notification payload
    const message = {
      notification: {
        title: title,
        body: body,
        ...(imageUrl && { imageUrl: imageUrl })
      },
      data: {
        ...(data || {}),
        ...(actionUrl && { actionUrl: actionUrl }),
        timestamp: new Date().toISOString()
      },
      android: {
        priority: priority,
        notification: {
          sound: sound,
          clickAction: actionUrl || 'FLUTTER_NOTIFICATION_CLICK',
          channelId: 'default'
        }
      },
      apns: {
        payload: {
          aps: {
            sound: sound,
            badge: 1,
            ...(actionUrl && { 'url-args': [actionUrl] })
          }
        }
      },
      tokens: fcmTokens
    };

    // Send notifications
    const response = await admin.messaging().sendMulticast(message);

    // Process results
    const results = {
      successCount: response.successCount,
      failureCount: response.failureCount,
      responses: response.responses.map((resp, index) => ({
        token: fcmTokens[index],
        success: resp.success,
        error: resp.error?.message || null,
        messageId: resp.messageId || null
      }))
    };

    // Remove invalid tokens from database
    const invalidTokens = results.responses
      .filter(resp => !resp.success && resp.error?.includes('registration-token-not-registered'))
      .map(resp => resp.token);

    if (invalidTokens.length > 0) {
      log(`Removing ${invalidTokens.length} invalid FCM tokens`);
      // You might want to implement token cleanup logic here
    }

    // Log notification activity
    await databases.createDocument(
      process.env.DATABASE_ID,
      'notification_logs',
      'unique()',
      {
        title: title,
        body: body,
        recipients_count: fcmTokens.length,
        success_count: response.successCount,
        failure_count: response.failureCount,
        sent_at: new Date().toISOString(),
        data: JSON.stringify(data || {})
      }
    );

    log(`Sent notifications: ${response.successCount} successful, ${response.failureCount} failed`);

    return res.json({
      success: true,
      results: results,
      message: `Notifications sent to ${response.successCount} devices`
    });

  } catch (err) {
    error(`Push notification failed: ${err.message}`);
    
    return res.json({
      success: false,
      error: err.message
    }, 500);
  }
};

// Helper function to send to topic (broadcast)
export async function sendToTopic(topic, title, body, data = {}) {
  const message = {
    notification: {
      title: title,
      body: body
    },
    data: {
      ...data,
      timestamp: new Date().toISOString()
    },
    topic: topic
  };

  return await admin.messaging().send(message);
}

// Helper function to subscribe users to topics
export async function subscribeToTopic(tokens, topic) {
  return await admin.messaging().subscribeToTopic(tokens, topic);
}

// Helper function to unsubscribe users from topics
export async function unsubscribeFromTopic(tokens, topic) {
  return await admin.messaging().unsubscribeFromTopic(tokens, topic);
}