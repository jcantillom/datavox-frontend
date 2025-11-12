// src/components/ui/AudioWavesLogo.jsx
import { Mic, Waves } from 'lucide-react';

export const AudioWavesLogo = ({ size = "md" }) => {
    const sizes = {
        sm: "w-8 h-8",
        md: "w-12 h-12",
        lg: "w-16 h-16"
    };

    return (
        <div className={`${sizes[size]} bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center shadow-lg`}>
            <Mic className={`${size === "sm" ? "w-4 h-4" : size === "md" ? "w-6 h-6" : "w-8 h-8"} text-white`} />
        </div>
    );
};