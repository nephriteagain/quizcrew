import { useEffect, useMemo, useState } from "react";

export function useAsyncStateEffect<T>(
    func: () => Promise<T>,
    deps: unknown[] = [],
    options: {
        initialValue?: T;
        loadingTrueAtStart?: boolean;
    } = {
        initialValue: undefined,
        loadingTrueAtStart: true,
    }
) {
    const { initialValue, loadingTrueAtStart = true } = useMemo(() => {
        if (!options) return {};
        return options;
    }, [options]);
    const [value, setValue] = useState(initialValue);
    const [isLoading, setIsLoading] = useState(loadingTrueAtStart);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const refresh = async () => {
        console.log("refreshing...");
        setIsRefreshing(true);
        setIsLoading(true);
        await func()
            .then((result) => {
                setValue(result ?? initialValue);
                setIsError(false);
                setError(null);
            })
            .catch((err) => {
                setIsError(true);
                if (err instanceof Error) {
                    setError(err);
                } else {
                    setError(new Error(String(err)));
                }
            })
            .finally(() => {
                setIsLoading(false);
                setIsRefreshing(false);
            });
    };

    useEffect(() => {
        setIsLoading(true);
        func()
            .then((result) => {
                setValue(result ?? initialValue);
                setIsError(false);
                setError(null);
            })
            .catch((err) => {
                setIsError(true);
                if (err instanceof Error) {
                    setError(err);
                } else {
                    setError(new Error(String(err)));
                }
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, deps);

    return [value, { isLoading, isError, error, refresh, isRefreshing }] as const;
}
