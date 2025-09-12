import { messaging, VAPID_KEY } from "@/config/firebase-config";
import { getToken, onMessage } from "firebase/messaging";

class NotificationService {
  async requestPermission() {
    try {
      const permission = await Notification.requestPermission();

      if (permission === "granted") {
        console.log("Notification permission granted.");
        return true;
      } else {
        console.log("Unable to get permission to notify.");
        return false;
      }
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      return false;
    }
  }

  async getToken() {
    try {
      const token = await getToken(messaging, {
        vapidKey: VAPID_KEY,
      });

      if (token) {
        console.log("FCM registration token:", token);
        return token;
      } else {
        console.log("No registration token available.");
        return null;
      }
    } catch (error) {
      console.error("An error occurred while retrieving token:", error);
      return null;
    }
  }

  async initializeNotifications() {
    // Request permission first
    const hasPermission = await this.requestPermission();

    if (!hasPermission) {
      return { success: false, message: "Permission denied" };
    }

    // Get FCM token
    const token = await this.getToken();

    if (!token) {
      return { success: false, message: "Failed to get FCM token" };
    }

    // Send token to your backend
    await this.registerTokenWithBackend(token);

    // Listen for foreground messages
    this.setupForegroundMessageListener();

    return { success: true, token };
  }

  async registerTokenWithBackend(token) {
    try {
      const response = await fetch("/fcm/initialize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          token: token,
          deviceType: "web",
          deviceInfo: {
            platform: "web",
            userAgent: navigator.userAgent,
            url: window.location.origin,
          },
        }),
      });

      const result = await response.json();
      console.log("Token registered with backend:", result);
    } catch (error) {
      console.error("Error registering token with backend:", error);
    }
  }

  setupForegroundMessageListener() {
    onMessage(messaging, (payload) => {
      console.log("Message received in foreground:", payload);

      // Show notification manually when app is in foreground
      if (payload.notification) {
        this.showNotification(payload.notification, payload.data);
      }
    });
  }

  showNotification(notification, data = {}) {
    if ("serviceWorker" in navigator && "Notification" in window) {
      const { title, body, icon } = notification;

      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification(title, {
          body,
          icon: icon || "/firebase-logo.png",
          badge: "/badge-icon.png",
          data: data,
          actions: [
            {
              action: "open",
              title: "Open App",
            },
          ],
        });
      });
    }
  }
}

export default new NotificationService();
