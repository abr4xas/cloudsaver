import { useState, useEffect } from "react";

interface UseScrollPositionOptions {
    threshold?: number;
}

export function useScrollPosition({ threshold = 20 }: UseScrollPositionOptions = {}) {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        let ticking = false;

        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    setIsScrolled(window.scrollY > threshold);
                    ticking = false;
                });
                ticking = true;
            }
        };

        // Check initial scroll position
        handleScroll();

        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [threshold]);

    return isScrolled;
}
