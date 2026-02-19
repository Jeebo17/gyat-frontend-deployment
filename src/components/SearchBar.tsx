import { TileSearchProps } from "../types/tile";

export function SearchBar() {
    return (
        <div className="">
            <input
                type="text"
                placeholder="Search for equipment..."
                className="w-full px-4 py-2 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 bg-bg-tertiary"
            />
        </div>
    );
}