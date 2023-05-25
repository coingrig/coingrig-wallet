import CONFIG from 'config';
import OneSignal from 'react-native-onesignal';
import {Logs} from 'services/logs';

class NotificationService {
  constructor() {
    //OneSignal Init Code
    OneSignal.setLogLevel(6, 0);
    OneSignal.setAppId(CONFIG.ONESIGNAL_KEY);
    //Method for handling notifications received while app in foreground
    OneSignal.setNotificationWillShowInForegroundHandler(
      notificationReceivedEvent => {
        const notification = notificationReceivedEvent.getNotification();
        Logs.info('notification: ', notification);
        const data = notification.additionalData;
        Logs.info('additionalData: ', data);
        // Complete with null means don't show a notification.
        notificationReceivedEvent.complete(notification);
      },
    );

    //Method for handling notifications opened
    OneSignal.setNotificationOpenedHandler(notification => {
      Logs.info('OneSignal: notification opened:', notification);
    });
  }

  askForPermission = async () => {
    OneSignal.promptForPushNotificationsWithUserResponse(response => {
      Logs.info('PushNotification is enabled:', response);
    });
  };
}
//@ts-ignore
export default new NotificationService();
