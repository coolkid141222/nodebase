import { useEffect, useState } from "react";

interface UseEntitySearchOptions<T extends {
    search: string,
    page: number
}> {
    params: T;
    setParams: (params: T) => void;
    debounceMs?: number;
}

export function useEntitySearch<T extends {
    search: string,
    page: number
}>({
    params,
    setParams,
    debounceMs = 300,
}: UseEntitySearchOptions<T>) {
    const [localSearch, localSetSearch] = useState(params.search);

    useEffect(() => {
        if (localSearch !== params.search) {
            const timer = setTimeout(() => {
                setParams({ ...params, search: localSearch });
            }, debounceMs);

            return () => clearTimeout(timer);
        }
    }, [localSearch, params, setParams, debounceMs]);

    useEffect(() => {
        if (params.search === localSearch) {
            return;
        }

        const timer = setTimeout(() => {
            localSetSearch(params.search);
        }, 0);

        return () => clearTimeout(timer);
    }, [localSearch, params.search]);
    return { searchValue: localSearch, setSearchValue: localSetSearch };
}
