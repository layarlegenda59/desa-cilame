'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { 
  Search, 
  Filter, 
  X, 
  Calendar as CalendarIcon,
  SlidersHorizontal,
  RotateCcw
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface FilterOption {
  key: string;
  label: string;
  type: 'select' | 'date' | 'dateRange' | 'text';
  options?: { value: string; label: string }[];
  placeholder?: string;
}

interface SearchFilterProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  filters?: FilterOption[];
  activeFilters: Record<string, any>;
  onFilterChange: (key: string, value: any) => void;
  onClearFilters: () => void;
  placeholder?: string;
  showFilterCount?: boolean;
}

export function SearchFilter({
  searchValue,
  onSearchChange,
  filters = [],
  activeFilters,
  onFilterChange,
  onClearFilters,
  placeholder = "Cari data...",
  showFilterCount = true
}: SearchFilterProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [dateRanges, setDateRanges] = useState<Record<string, { from?: Date; to?: Date }>>({});

  const activeFilterCount = Object.values(activeFilters).filter(value => 
    value !== undefined && value !== null && value !== ''
  ).length;

  const handleDateRangeChange = (key: string, range: { from?: Date; to?: Date }) => {
    setDateRanges(prev => ({ ...prev, [key]: range }));
    onFilterChange(key, range);
  };

  const renderFilterInput = (filter: FilterOption) => {
    const value = activeFilters[filter.key];

    switch (filter.type) {
      case 'select':
        return (
          <Select
            value={value || ''}
            onValueChange={(newValue) => onFilterChange(filter.key, newValue)}
          >
            <SelectTrigger>
              <SelectValue placeholder={filter.placeholder || `Pilih ${filter.label}`} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Semua</SelectItem>
              {filter.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'date':
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !value && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {value ? format(new Date(value), "dd MMMM yyyy", { locale: id }) : filter.placeholder || "Pilih tanggal"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={value ? new Date(value) : undefined}
                onSelect={(date) => onFilterChange(filter.key, date?.toISOString())}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        );

      case 'dateRange':
        const range = dateRanges[filter.key] || {};
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !range.from && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {range.from ? (
                  range.to ? (
                    <>
                      {format(range.from, "dd MMM yyyy", { locale: id })} -{" "}
                      {format(range.to, "dd MMM yyyy", { locale: id })}
                    </>
                  ) : (
                    format(range.from, "dd MMM yyyy", { locale: id })
                  )
                ) : (
                  filter.placeholder || "Pilih rentang tanggal"
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                defaultMonth={range.from}
                selected={range.from && range.to ? { from: range.from, to: range.to } : undefined}
                onSelect={(newRange) => handleDateRangeChange(filter.key, newRange || {})}
                numberOfMonths={2}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        );

      case 'text':
        return (
          <Input
            value={value || ''}
            onChange={(e) => onFilterChange(filter.key, e.target.value)}
            placeholder={filter.placeholder || `Masukkan ${filter.label.toLowerCase()}`}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {/* Search and Filter Toggle */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={placeholder}
            className="pl-10"
          />
        </div>
        
        {filters.length > 0 && (
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="relative"
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Filter
            {showFilterCount && activeFilterCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
              >
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        )}
        
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-gray-500 hover:text-gray-700"
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            Reset
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(activeFilters).map(([key, value]) => {
            if (!value || value === '') return null;
            
            const filter = filters.find(f => f.key === key);
            if (!filter) return null;

            let displayValue = value;
            if (filter.type === 'select' && filter.options) {
              const option = filter.options.find(opt => opt.value === value);
              displayValue = option?.label || value;
            } else if (filter.type === 'date') {
              displayValue = format(new Date(value), "dd MMM yyyy", { locale: id });
            } else if (filter.type === 'dateRange' && value.from) {
              displayValue = value.to 
                ? `${format(new Date(value.from), "dd MMM", { locale: id })} - ${format(new Date(value.to), "dd MMM yyyy", { locale: id })}`
                : format(new Date(value.from), "dd MMM yyyy", { locale: id });
            }

            return (
              <Badge key={key} variant="secondary" className="flex items-center gap-1">
                <span className="text-xs font-medium">{filter.label}:</span>
                <span className="text-xs">{displayValue}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 ml-1 hover:bg-transparent"
                  onClick={() => onFilterChange(key, '')}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            );
          })}
        </div>
      )}

      {/* Filter Panel */}
      {showFilters && filters.length > 0 && (
        <div className="border rounded-lg p-4 bg-gray-50 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-900">Filter Data</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filters.map((filter) => (
              <div key={filter.key} className="space-y-2">
                <Label htmlFor={filter.key} className="text-sm font-medium">
                  {filter.label}
                </Label>
                {renderFilterInput(filter)}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Hook untuk search dan filter logic
export function useSearchFilter<T>({
  data,
  searchFields,
  filterFields
}: {
  data: T[];
  searchFields: (keyof T)[];
  filterFields?: (keyof T)[];
}) {
  const [searchValue, setSearchValue] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});

  const filteredData = data.filter((item) => {
    // Search filter
    const matchesSearch = searchValue === '' || searchFields.some(field => {
      const value = item[field];
      return value && value.toString().toLowerCase().includes(searchValue.toLowerCase());
    });

    // Active filters
    const matchesFilters = Object.entries(activeFilters).every(([key, filterValue]) => {
      if (!filterValue || filterValue === '') return true;
      
      const itemValue = item[key as keyof T];
      
      if (typeof filterValue === 'object' && filterValue.from) {
        // Date range filter
        const itemDate = new Date(itemValue as string);
        const fromDate = new Date(filterValue.from);
        const toDate = filterValue.to ? new Date(filterValue.to) : fromDate;
        
        return itemDate >= fromDate && itemDate <= toDate;
      }
      
      return itemValue === filterValue;
    });

    return matchesSearch && matchesFilters;
  });

  const handleFilterChange = (key: string, value: any) => {
    setActiveFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleClearFilters = () => {
    setActiveFilters({});
    setSearchValue('');
  };

  return {
    searchValue,
    setSearchValue,
    activeFilters,
    filteredData,
    handleFilterChange,
    handleClearFilters
  };
}