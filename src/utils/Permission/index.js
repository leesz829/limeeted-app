import {Platform} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {PERMISSIONS, requestMultiple} from 'react-native-permissions';
const android_permission = [
  PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
  PERMISSIONS.ANDROID.CAMERA,
  PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
  PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
];
const ios_permission = [
  PERMISSIONS.IOS.PHOTO_LIBRARY,
  PERMISSIONS.IOS.CAMERA,
  PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
];
const PERMISSION_by_OS = Platform.OS === 'ios' ? ios_permission : android_permission;

export function askAllPermission() {
  return requestMultiple(PERMISSION_by_OS);
}

export async function getLocation() {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      position => resolve(position),
      error => reject(error),
      {enableHighAccuracy: true, timeout: 15000}
    );
  });
}

export default {
  askAllPermission,
  getLocation,
};
