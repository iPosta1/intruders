import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

const readVisualViewportHeight = (fallback: number) => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') {
        return fallback;
    }

    return Math.floor(window.visualViewport?.height || window.innerHeight || fallback);
};

export const useVisualViewportHeight = (fallback: number) => {
    const [height, setHeight] = useState(() => readVisualViewportHeight(fallback));

    useEffect(() => {
        if (Platform.OS !== 'web' || typeof window === 'undefined') {
            setHeight(fallback);
            return;
        }

        const updateHeight = () => setHeight(readVisualViewportHeight(fallback));
        const viewport = window.visualViewport;

        updateHeight();
        window.addEventListener('resize', updateHeight);
        viewport?.addEventListener('resize', updateHeight);
        viewport?.addEventListener('scroll', updateHeight);

        return () => {
            window.removeEventListener('resize', updateHeight);
            viewport?.removeEventListener('resize', updateHeight);
            viewport?.removeEventListener('scroll', updateHeight);
        };
    }, [fallback]);

    return Math.min(height, fallback);
};
