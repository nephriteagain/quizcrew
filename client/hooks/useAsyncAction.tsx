import { useCallback, useState } from "react";
type ActionState<T> = {
    data: T | null;
    error: Error | null;
    isLoading: boolean;
    isError: boolean;
};

type AsyncFunction<TArgs extends any[], TResult> = (...args: TArgs) => Promise<TResult>;

/**
 *
 * @param fn the function to wrap
 * @param options
 * @param options.onComplete callback function executed when the async action completes successfully
 * @returns
 */
export function useAsyncAction<TArgs extends any[], TResult>(
    fn: AsyncFunction<TArgs, TResult>,
    options?: {
        /** Callback function executed when the async action completes successfully */
        onComplete?: () => void;
    }
): [(...args: TArgs) => Promise<TResult | undefined>, ActionState<TResult>] {
    const [data, setData] = useState<TResult | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const isError = !!error;

    const run = useCallback(
        async (...args: TArgs) => {
            setIsLoading(true);
            setError(null);
            try {
                const result = await fn(...args);
                setData(result);
                options?.onComplete?.();
                return result;
            } catch (err) {
                console.error(err);
                if (err instanceof Error) {
                    setError(err);
                } else {
                    setError(new Error("Unknown error occurred."));
                }
            } finally {
                setIsLoading(false);
            }
        },
        [fn]
    );

    return [run, { data, error, isLoading, isError }];
}
