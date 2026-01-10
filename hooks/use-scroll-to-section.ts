import { useCallback } from "react";

interface UseScrollToSectionOptions {
    onScrollComplete?: () => void;
}

export function useScrollToSection({
    onScrollComplete,
}: UseScrollToSectionOptions = {}) {
    const scrollTo = useCallback(
        (href: string) => {
            // Handle both #hash and full selectors
            const selector = href.startsWith("#") ? href.slice(1) : href;
            const element = document.getElementById(selector) ||
                document.querySelector(href);

            if (element) {
                element.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });

                // Call callback after scroll completes (approximate)
                if (onScrollComplete) {
                    setTimeout(() => {
                        onScrollComplete();
                    }, 1000);
                }
            }
        },
        [onScrollComplete]
    );

    return { scrollTo };
}
