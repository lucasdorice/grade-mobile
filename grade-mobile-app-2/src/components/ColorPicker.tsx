import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../src/theme';

interface ColorPickerProps {
    selectedColor: string;
    onSelect: (color: string) => void;
    palette?: readonly string[];
}

export default function ColorPicker({ selectedColor, onSelect, palette }: ColorPickerProps) {
    const colorList = palette ?? colors.coursePalette;

    return (
        <View style={styles.container}>
            {colorList.map((color) => (
                <TouchableOpacity
                    key={color}
                    style={[
                        styles.circle,
                        { backgroundColor: color },
                        selectedColor === color && styles.selected,
                    ]}
                    onPress={() => onSelect(color)}
                    activeOpacity={0.7}
                />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        gap: 12,
        flexWrap: 'wrap',
    },
    circle: {
        width: 32,
        height: 32,
        borderRadius: 16,
    },
    selected: {
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
});
