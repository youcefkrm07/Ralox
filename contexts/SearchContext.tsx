"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"

interface SearchContextType {
  searchQuery: string
  setSearchQuery: (query: string) => void
}

const SearchContext = createContext<SearchContextType | null>(null)

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [searchQuery, setSearchQuery] = useState("")

  return <SearchContext.Provider value={{ searchQuery, setSearchQuery }}>{children}</SearchContext.Provider>
}

export function useSearch() {
  const context = useContext(SearchContext)
  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider")
  }
  return context
}
