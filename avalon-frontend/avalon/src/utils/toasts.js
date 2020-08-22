import {ToastAndroid} from 'react-native';

export const showShortBottomToast = message => {
  ToastAndroid.show(message, ToastAndroid.SHORT, ToastAndroid.BOTTOM);
};

export const showLongBottomToast = message => {
  ToastAndroid.show(message, ToastAndroid.LONG, ToastAndroid.BOTTOM);
};
