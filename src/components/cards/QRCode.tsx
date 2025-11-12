import React from 'react';
import { View, StyleSheet } from 'react-native';
import QRCodeSvg from 'react-native-qrcode-svg';
import { COLORS } from '../../constants/config';

interface QRCodeProps {
    value: string;
    size?: number;
}

export default function QRCode({ value, size = 200 }: QRCodeProps) {
    return (
        <View style={styles.container}>
            <QRCodeSvg
                value={value}
                size={size}
                color={COLORS.gray900}
                backgroundColor={COLORS.white}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: COLORS.white,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

