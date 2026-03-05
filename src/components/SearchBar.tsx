import { useState, useRef, useEffect, ReactNode } from "react";

interface SearchBarProps<T extends { id: number | string; name: string }> {
    searchData: T[];
    onSelect?: (item: T) => void;
    placeholder?: string;
    filterFn?: (item: T, query: string) => boolean;
    renderItem?: (item: T) => ReactNode;
}

function defaultFilter<T extends { id: number | string; name: string }>(item: T, query: string): boolean {
    return item.name.toLowerCase().includes(query.toLowerCase());
}

function defaultRenderItem<T extends { id: number | string; name: string }>(item: T): ReactNode {
    return (
        <span>
            <span className="font-medium">{item.name}</span>
            <span className="font-light ml-1 text-xs">#{item.id}</span>
        </span>
    );
}

export default function SearchBar<T extends { id: number | string; name: string }>({
    searchData,
    onSelect,
    placeholder = "Search...",
    filterFn = defaultFilter,
    renderItem = defaultRenderItem,
}: SearchBarProps<T>) {
    const [query, setQuery] = useState("");
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const filtered = query.trim().length > 0
        ? searchData.filter(item => filterFn(item, query))
        : [];

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    return (
        <div ref={wrapperRef} className="relative w-full sm:w-64">
            <input
                type="text"
                placeholder={placeholder}
                value={query}
                onChange={e => { setQuery(e.target.value); setOpen(true); }}
                onFocus={() => setOpen(true)}
                className="w-full px-3 sm:px-4 py-2 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 bg-bg-tertiary text-sm sm:text-base"
            />
            {open && filtered.length > 0 && (
                <ul className="absolute z-50 mt-1 w-full max-h-60 overflow-auto rounded-lg bg-bg-secondary shadow-lg border border-bg-tertiary">
                    {filtered.map(item => (
                        <li
                            key={item.id}
                            className="px-4 py-2 cursor-pointer hover:bg-accent-primary/20 text-text-primary text-sm transition-colors flex flex-col"
                            onMouseDown={() => {
                                onSelect?.(item);
                                setQuery(item.name);
                                setOpen(false);
                            }}
                        >
                            {renderItem(item)}
                        </li>
                    ))}
                </ul>
            )}
            {open && query.trim().length > 0 && filtered.length === 0 && (
                <div className="absolute z-50 mt-1 w-full rounded-lg bg-bg-secondary shadow-lg border border-bg-tertiary px-4 py-2 text-sm text-text-primary opacity-60">
                    No results found
                </div>
            )}
        </div>
    );
}