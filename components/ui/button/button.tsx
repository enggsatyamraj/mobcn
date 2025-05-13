import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';

// Define variants similar to shadcn/ui but adapted for React Native
export const buttonVariants = {
    variant: {
        default: {
            backgroundColor: '#0f172a',  // slate-900
            color: '#ffffff',
        },
        destructive: {
            backgroundColor: '#ef4444',  // red-500
            color: '#ffffff',
        },
        outline: {
            backgroundColor: 'transparent',
            color: '#0f172a',  // slate-900
            borderWidth: 1,
            borderColor: '#e2e8f0',  // slate-200
        },
        secondary: {
            backgroundColor: '#f1f5f9',  // slate-100
            color: '#0f172a',  // slate-900
        },
        ghost: {
            backgroundColor: 'transparent',
            color: '#0f172a',  // slate-900
        },
        link: {
            backgroundColor: 'transparent',
            color: '#2563eb',  // blue-600
            padding: 0,
        },
    },
    size: {
        default: {
            paddingVertical: 10,
            paddingHorizontal: 16,
            borderRadius: 8,
        },
        sm: {
            paddingVertical: 6,
            paddingHorizontal: 12,
            borderRadius: 6,
        },
        lg: {
            paddingVertical: 12,
            paddingHorizontal: 24,
            borderRadius: 10,
        },
        icon: {
            width: 40,
            height: 40,
            borderRadius: 6,
            padding: 0,
            justifyContent: 'center',
            alignItems: 'center',
        },
    },
};

export interface ButtonProps {
    children: React.ReactNode;
    onPress?: () => void;
    variant?: keyof typeof buttonVariants.variant;
    size?: keyof typeof buttonVariants.size;
    style?: ViewStyle;
    textStyle?: TextStyle;
    disabled?: boolean;
    loading?: boolean;
    icon?: React.ReactNode;
    iconPosition?: 'left' | 'right';
}

export const Button = ({
    children,
    onPress,
    variant = 'default',
    size = 'default',
    style,
    textStyle,
    disabled = false,
    loading = false,
    icon,
    iconPosition = 'left',
}: ButtonProps) => {
    const variantStyle = buttonVariants.variant[variant];
    const sizeStyle = buttonVariants.size[size];

    return (
        <Pressable
            onPress={onPress}
            disabled={disabled || loading}
            style={({ pressed }) => [
                styles.button,
                variantStyle,
                sizeStyle,
                pressed && styles.pressed,
                disabled && styles.disabled,
                style,
            ]}
        >
            {loading ? (
                <ActivityIndicator
                    color={
                        variant === 'outline' ||
                            variant === 'ghost' ||
                            variant === 'link' ?
                            '#0f172a' : '#ffffff'
                    }
                />
            ) : (
                <>
                    {icon && iconPosition === 'left' && <View style={styles.iconLeft}>{icon}</View>}
                    <Text
                        style={[
                            styles.text,
                            { color: variantStyle.color },
                            disabled && styles.disabledText,
                            textStyle,
                        ]}
                    >
                        {children}
                    </Text>
                    {icon && iconPosition === 'right' && <View style={styles.iconRight}>{icon}</View>}
                </>
            )}
        </Pressable>
    );
};

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontWeight: '600',
        textAlign: 'center',
    },
    pressed: {
        opacity: 0.8,
    },
    disabled: {
        opacity: 0.5,
    },
    disabledText: {
        opacity: 0.8,
    },
    iconLeft: {
        marginRight: 8,
    },
    iconRight: {
        marginLeft: 8,
    },
});