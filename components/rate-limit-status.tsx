"use client";

import { useEffect, useState } from "react";
import { getClientRateLimitStatus } from "@/lib/client-rate-limit";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Clock } from "lucide-react";

/**
 * Component to display rate limit status to users
 */
export function RateLimitStatus() {
  const [status, setStatus] = useState<{
    remaining: number;
    resetAt: number;
    resetInSeconds: number;
  } | null>(null);

  useEffect(() => {
    const updateStatus = () => {
      const currentStatus = getClientRateLimitStatus();
      setStatus(currentStatus);
    };

    // Update immediately
    updateStatus();

    // Update every second to show countdown
    const interval = setInterval(updateStatus, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!status || status.remaining >= 5) {
    // Don't show if plenty of requests remaining
    return null;
  }

  const isLow = status.remaining <= 2;
  const isExhausted = status.remaining === 0;

  return (
    <Alert
      variant={isExhausted ? "destructive" : "default"}
      className="mb-4 border-zinc-800"
    >
      {isExhausted ? (
        <AlertTriangle className="h-4 w-4" />
      ) : (
        <Clock className="h-4 w-4" />
      )}
      <AlertDescription>
        {isExhausted ? (
          <div className="flex items-center justify-between">
            <span>Rate limit exceeded</span>
            <span className="text-sm text-zinc-400">
              Resets in {status.resetInSeconds}s
            </span>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <span>
              {status.remaining} request{status.remaining !== 1 ? "s" : ""}{" "}
              remaining
            </span>
            {status.resetInSeconds < 60 && (
              <span className="text-sm text-zinc-400">
                Resets in {status.resetInSeconds}s
              </span>
            )}
          </div>
        )}
      </AlertDescription>
    </Alert>
  );
}
