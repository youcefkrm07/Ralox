"use client"

import { useSearch } from "@/contexts/SearchContext"
import { Search } from "lucide-react"

export function SearchBar() {
  const { searchQuery, setSearchQuery } = useSearch()

  return (
    <div className="search-container mb-6 sticky top-2 z-[999] bg-white/85 backdrop-blur-sm p-2 rounded-lg">
      <div className="relative">
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search features..."
          className="w-full px-4 py-3 pr-12 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
      </div>
    </div>
  )
}
