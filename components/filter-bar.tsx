"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { categories, genderOptions, ageRanges } from "@/lib/types"

interface FilterBarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  selectedCategory: string
  onCategoryChange: (category: string) => void
  selectedGender: string
  onGenderChange: (gender: string) => void
  selectedAgeRange: string
  onAgeRangeChange: (ageRange: string) => void
}

export function FilterBar({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedGender,
  onGenderChange,
  selectedAgeRange,
  onAgeRangeChange,
}: FilterBarProps) {
  return (
    <div className="flex flex-wrap gap-3 p-4 bg-card border-b border-border">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search groups..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      <Select value={selectedCategory} onValueChange={onCategoryChange}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((cat) => (
            <SelectItem key={cat} value={cat}>
              {cat}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={selectedGender} onValueChange={onGenderChange}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Gender" />
        </SelectTrigger>
        <SelectContent>
          {genderOptions.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={selectedAgeRange} onValueChange={onAgeRangeChange}>
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Age Range" />
        </SelectTrigger>
        <SelectContent>
          {ageRanges.map((age) => (
            <SelectItem key={age} value={age}>
              {age}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
