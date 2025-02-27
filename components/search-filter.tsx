'use client'

import { Input } from '@/components/ui/input'
import { SearchIcon } from 'lucide-react'
import { useCallback, useState, useEffect } from 'react'
import debounce from 'lodash/debounce'

interface SearchFilterProps {
  defaultValue?: string
}

export function SearchFilter({ defaultValue = '' }: SearchFilterProps) {
  const [searchValue, setSearchValue] = useState(defaultValue)

  // Debounced function to update URL params
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      const params = new URLSearchParams(window.location.search)
      if (value) {
        params.set('search', value.toLowerCase())
      } else {
        params.delete('search')
      }
      window.location.search = params.toString()
    }, 500), // 500ms delay
    []
  )
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      debouncedSearch(e.currentTarget.value)
    }
  }
    // Cleanup debounce on unmount
    useEffect(() => {
        return () => {
          debouncedSearch.cancel()
        }
      }, [debouncedSearch])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchValue(value)
    // debouncedSearch(value)
  }

  return (
    <div className="relative">
      <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search events..."
        className="pl-9"
        value={searchValue}
        onChange={handleSearch}
        onKeyDown={handleKeyDown}
      />
    </div>
  )
}