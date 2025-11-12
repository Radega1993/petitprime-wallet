import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Device from 'expo-device';
import * as Application from 'expo-application';
import { STORAGE_KEYS } from '../constants/config';

/**
 * Obtiene o crea un ID único para el dispositivo
 */
export async function getOrCreateDeviceId(): Promise<string> {
    try {
        let deviceId = await AsyncStorage.getItem(STORAGE_KEYS.DEVICE_ID);

        if (!deviceId) {
            // Intentar obtener el ID único del dispositivo usando expo-application
            try {
                if (Device.osName === 'android') {
                    const androidId = Application.getAndroidId();
                    if (androidId) {
                        deviceId = androidId;
                    }
                } else if (Device.osName === 'ios') {
                    const iosId = await Application.getIosIdForVendorAsync();
                    if (iosId) {
                        deviceId = iosId;
                    }
                }
            } catch (error) {
                console.log('Could not get device ID from expo-application:', error);
            }

            // Si no se puede obtener, generar uno aleatorio
            if (!deviceId) {
                // Usar una combinación de timestamp y random para garantizar unicidad
                deviceId = `device_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
            }

            await AsyncStorage.setItem(STORAGE_KEYS.DEVICE_ID, deviceId);
        }

        return deviceId;
    } catch (error) {
        console.error('Error getting device ID:', error);
        // Fallback a un ID generado
        return `device_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    }
}

/**
 * Obtiene el nombre del dispositivo
 */
export async function getDeviceName(): Promise<string> {
    try {
        let deviceName = await AsyncStorage.getItem(STORAGE_KEYS.DEVICE_NAME);

        if (!deviceName) {
            // Intentar obtener el nombre del dispositivo
            if (Device.deviceName) {
                deviceName = Device.deviceName;
            } else if (Device.modelName) {
                deviceName = Device.modelName;
            } else {
                deviceName = 'Mi Dispositivo';
            }

            if (deviceName) {
                await AsyncStorage.setItem(STORAGE_KEYS.DEVICE_NAME, deviceName);
            }
        }

        return deviceName;
    } catch (error) {
        console.error('Error getting device name:', error);
        return 'Mi Dispositivo';
    }
}

