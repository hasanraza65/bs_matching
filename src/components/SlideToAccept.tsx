import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { ChevronRight, Check } from 'lucide-react';

interface SlideToAcceptProps {
    onAccept: () => void;
    text?: string;
    successText?: string;
    /** When true, resets the slider back to initial draggable state */
    reset?: boolean;
}

export const SlideToAccept: React.FC<SlideToAcceptProps> = ({
    onAccept,
    text = "Slide to Accept",
    successText = "Accepted",
    reset = false
}) => {
    const [isAccepted, setIsAccepted] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);

    // Calculate the drag constraints based on container width
    const [dragWidth, setDragWidth] = useState(0);

    useEffect(() => {
        if (containerRef.current) {
            // Button width is 64px (h-16 w-16), padding is 4px (p-1)
            setDragWidth(containerRef.current.offsetWidth - 64 - 8);
        }
    }, []);

    // Reset slider when `reset` prop changes to true
    useEffect(() => {
        if (reset && isAccepted) {
            setIsAccepted(false);
            x.set(0);
        }
    }, [reset, isAccepted, x]);

    // Transform opacity based on drag position
    const opacity = useTransform(x, [0, dragWidth * 0.8], [1, 0]);
    const successOpacity = useTransform(x, [dragWidth * 0.8, dragWidth], [0, 1]);

    const handleDragEnd = () => {
        if (x.get() >= dragWidth - 10) {
            setIsAccepted(true);
            onAccept();
        } else {
            x.set(0);
        }
    };

    return (
        <div
            ref={containerRef}
            className="relative w-full h-16 bg-slate-100 rounded-2xl p-1 overflow-hidden select-none border border-slate-200"
        >
            {/* Background Text */}
            <motion.div
                style={{ opacity }}
                className="absolute inset-0 flex items-center justify-center text-slate-400 font-bold text-sm uppercase tracking-widest pl-12"
            >
                {text}
            </motion.div>

            {/* Success Text Overlay */}
            <motion.div
                style={{ opacity: isAccepted ? 1 : successOpacity }}
                className="absolute inset-0 flex items-center justify-center text-brand-blue font-bold text-sm uppercase tracking-widest pl-4 pointer-events-none"
            >
                {successText}
            </motion.div>

            {/* Slider Button */}
            {!isAccepted && (
                <motion.div
                    drag="x"
                    dragConstraints={{ left: 0, right: dragWidth }}
                    dragElastic={0.1}
                    style={{ x }}
                    onDragEnd={handleDragEnd}
                    className="absolute left-1 top-1 bottom-1 w-14 h-14 bg-white rounded-xl shadow-md cursor-grab active:cursor-grabbing flex items-center justify-center text-brand-blue z-10 border border-slate-100 hover:shadow-lg transition-shadow"
                >
                    <ChevronRight size={24} strokeWidth={3} />
                </motion.div>
            )}

            {isAccepted && (
                <div className="absolute right-1 top-1 bottom-1 w-14 h-14 bg-brand-blue rounded-xl flex items-center justify-center text-white z-10 shadow-lg shadow-brand-blue/20">
                    <Check size={24} strokeWidth={3} />
                </div>
            )}
        </div>
    );
};
