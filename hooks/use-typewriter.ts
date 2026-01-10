import { useEffect, useState, useRef, useCallback } from "react";
import { ANIMATION_DURATIONS } from "@/lib/constants";

interface UseTypewriterOptions {
    phrases: string[];
    typingSpeed?: number;
    deletingSpeed?: number;
    pauseDuration?: number;
}

export function useTypewriter({
    phrases,
    typingSpeed = 150,
    deletingSpeed = 50,
    pauseDuration = ANIMATION_DURATIONS.TYPEWRITER_PAUSE,
}: UseTypewriterOptions) {
    const [currentText, setCurrentText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const loopNumRef = useRef(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const pauseTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Memoize handleType to avoid recreation on every render
    const handleType = useCallback(() => {
        const i = loopNumRef.current % phrases.length;
        const fullText = phrases[i];

        setCurrentText((prev) => {
            if (isDeleting) {
                const newText = fullText.substring(0, prev.length - 1);
                if (newText === "") {
                    setIsDeleting(false);
                    loopNumRef.current += 1;
                }
                return newText;
            } else {
                const newText = fullText.substring(0, prev.length + 1);
                if (newText === fullText) {
                    // Use ref to avoid dependency on pauseDuration
                    pauseTimerRef.current = setTimeout(() => {
                        setIsDeleting(true);
                    }, pauseDuration);
                }
                return newText;
            }
        });
    }, [isDeleting, phrases, pauseDuration]);

    useEffect(() => {
        // Clear any existing timers
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        if (pauseTimerRef.current) {
            clearTimeout(pauseTimerRef.current);
        }

        timerRef.current = setTimeout(handleType, isDeleting ? deletingSpeed : typingSpeed);

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
            if (pauseTimerRef.current) {
                clearTimeout(pauseTimerRef.current);
            }
        };
    }, [currentText, isDeleting, typingSpeed, deletingSpeed, handleType]);

    return { currentText, isDeleting };
}
