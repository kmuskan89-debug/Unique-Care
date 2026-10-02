import webpush from 'web-push';
import Subscription from '../models/Subscription';

// In a real app, these would come from env vars
const vapidKeys = {
  publicKey: process.env.VAPID_PUBLIC_KEY || 'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLcg05SRYig',
  privateKey: process.env.VAPID_PRIVATE_KEY || '8pE8H_Y4Jq2y7K_V_4oIuY1H2vVq_GZ0X_7_Q_A_T8o'
};

webpush.setVapidDetails(
  'mailto:example@yourdomain.org',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

export const sendPushNotificationToTechnicians = async (payload: object) => {
  try {
    const subscriptions = await Subscription.find().populate('userId');
    const technicianSubs = subscriptions.filter((sub: any) => sub.userId && sub.userId.role === 'technician');

    const notificationPayload = JSON.stringify(payload);
    
    const pushPromises = technicianSubs.map(sub => 
      webpush.sendNotification({
        endpoint: sub.endpoint,
        keys: sub.keys
      }, notificationPayload).catch(err => {
        if (err.statusCode === 404 || err.statusCode === 410) {
          console.log('Subscription has expired or is no longer valid: ', err);
          return Subscription.findByIdAndDelete(sub._id);
        }
      })
    );
    
    await Promise.all(pushPromises);
  } catch (error) {
    console.error('Error sending push notifications:', error);
  }
};
