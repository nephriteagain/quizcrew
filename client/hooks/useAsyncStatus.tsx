import { useCallback, useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AsyncFunction<TArgs extends any[], TResult> = (...args: TArgs) => Promise<TResult>;

/**
 * a simplified version of useAsyncStatus
 * no error catching
 * only to store loading state
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useAsyncStatus<TArgs extends any[], TResult>(
    fn: AsyncFunction<TArgs, TResult>
): [AsyncFunction<TArgs, TResult>, boolean] {
    const [isLoading, setIsLoading] = useState(false);

    const run = useCallback(
        async (...args: TArgs) => {
            setIsLoading(true);
            try {
                const result = await fn(...args);
                return result;
            } finally {
                setIsLoading(false);
            }
        },
        [fn]
    );

    return [run, isLoading];
}
