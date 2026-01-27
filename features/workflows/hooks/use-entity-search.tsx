import { useEffect, useState } from "react";
import { PAGINATION } from "@/config/constants";

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
        if (params.search !== localSearch) {
            localSetSearch(params.search);
        }
    }, [params.search]);
    return { searchValue: localSearch, setSearchValue: localSetSearch };
}