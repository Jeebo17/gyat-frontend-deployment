import { useState, useRef, useEffect } from "react";
import { TileSearchProps } from "../types/tile";

interface SearchBarProps {
    searchData: TileSearchProps[];
    onSelect?: (item: TileSearchProps) => void;
}

export function SearchBar({ searchData, onSelect }: SearchBarProps) {
    const [query, setQuery] = useState("");
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const filtered = query.trim().length > 0
        ? searchData.filter(item =>
            item.name.toLowerCase().includes(query.toLowerCase()) ||
            item.description.toLowerCase().includes(query.toLowerCase())
        )
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
        <div ref={wrapperRef} className="relative w-64">
            <input
                type="text"
                placeholder="Search for equipment..."
                value={query}
                onChange={e => { setQuery(e.target.value); setOpen(true); }}
                onFocus={() => setOpen(true)}
                className="w-full px-4 py-2 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 bg-bg-tertiary"
            />
            {open && filtered.length > 0 && (
                <ul className="absolute z-50 mt-1 w-full max-h-60 overflow-auto rounded-lg bg-bg-secondary shadow-lg border border-bg-tertiary">
                    {filtered.map(item => (
                        <li
                            key={item.id}
                            className="px-4 py-2 cursor-pointer hover:bg-accent-primary/20 text-text-primary text-sm transition-colors"
                            onMouseDown={() => {
                                onSelect?.(item);
                                setQuery(item.name);
                                setOpen(false);
                            }}
                        >
                            <span className="font-medium">{item.name}</span>
                            <span className="ml-2 text-xs opacity-60">{item.description}</span>
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