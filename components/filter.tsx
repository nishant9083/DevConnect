'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FilterIcon } from 'lucide-react'

interface CategoryFilterProps {
  categories: string[]
  defaultValue?: string
}

export function CategoryFilter({ categories, defaultValue = 'All' }: CategoryFilterProps) {
  return (
    <Select 
      defaultValue={defaultValue}
      onValueChange={(value) => {
        const params = new URLSearchParams(window.location.search)
        if (value === "All") {
          params.delete("category")
        } else {
          params.set("category", value)
        }
        window.location.search = params.toString()
      }}
    >
      <SelectTrigger>
        <FilterIcon className="mr-2 h-4 w-4" />
        <SelectValue placeholder="Filter by category" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="All">All</SelectItem>
        {categories.map((category) => (
          <SelectItem key={category} value={category}>
            {category}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}