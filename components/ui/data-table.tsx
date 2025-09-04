'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { SearchFilter, useSearchFilter } from '@/components/ui/search-filter';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';
import { LoadingSpinner, TableLoadingSkeleton } from '@/components/ui/loading-spinner';
import { 
  MoreHorizontal, 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown,
  Eye,
  Edit,
  Trash2,
  Download
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface Column<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
  className?: string;
  width?: string;
}

interface FilterOption {
  key: string;
  label: string;
  type: 'select' | 'date' | 'dateRange' | 'text';
  options?: { value: string; label: string }[];
  placeholder?: string;
}

interface Action<T> {
  label: string;
  icon?: React.ReactNode;
  onClick: (row: T) => void;
  variant?: 'default' | 'destructive';
  show?: (row: T) => boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchFields: (keyof T)[];
  filters?: FilterOption[];
  actions?: Action<T>[];
  onRowClick?: (row: T) => void;
  selectable?: boolean;
  selectedRows?: T[];
  onSelectionChange?: (rows: T[]) => void;
  loading?: boolean;
  emptyMessage?: string;
  searchPlaceholder?: string;
  className?: string;
  pageSize?: number;
}

type SortDirection = 'asc' | 'desc' | null;

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  searchFields,
  filters = [],
  actions = [],
  onRowClick,
  selectable = false,
  selectedRows = [],
  onSelectionChange,
  loading = false,
  emptyMessage = "Tidak ada data yang ditemukan",
  searchPlaceholder = "Cari data...",
  className,
  pageSize = 10
}: DataTableProps<T>) {
  const [sortColumn, setSortColumn] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(pageSize);

  const {
    searchValue,
    setSearchValue,
    activeFilters,
    filteredData,
    handleFilterChange,
    handleClearFilters
  } = useSearchFilter({
    data,
    searchFields,
    filterFields: filters.map(f => f.key as keyof T)
  });

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortColumn || !sortDirection) return 0;
    
    const aValue = a[sortColumn];
    const bValue = b[sortColumn];
    
    if (aValue === bValue) return 0;
    
    const comparison = aValue < bValue ? -1 : 1;
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  // Paginate data
  const totalItems = sortedData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, endIndex);

  const handleSort = (column: keyof T) => {
    if (!columns.find(col => col.key === column)?.sortable) return;
    
    if (sortColumn === column) {
      setSortDirection(prev => {
        if (prev === 'asc') return 'desc';
        if (prev === 'desc') return null;
        return 'asc';
      });
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (!onSelectionChange) return;
    
    if (checked) {
      const newSelection = [...selectedRows];
      paginatedData.forEach(row => {
        if (!selectedRows.some(selected => selected === row)) {
          newSelection.push(row);
        }
      });
      onSelectionChange(newSelection);
    } else {
      const newSelection = selectedRows.filter(selected => 
        !paginatedData.some(row => row === selected)
      );
      onSelectionChange(newSelection);
    }
  };

  const handleSelectRow = (row: T, checked: boolean) => {
    if (!onSelectionChange) return;
    
    if (checked) {
      onSelectionChange([...selectedRows, row]);
    } else {
      onSelectionChange(selectedRows.filter(selected => selected !== row));
    }
  };

  const isRowSelected = (row: T) => {
    return selectedRows.some(selected => selected === row);
  };

  const isAllSelected = paginatedData.length > 0 && 
    paginatedData.every(row => isRowSelected(row));
  const isIndeterminate = paginatedData.some(row => isRowSelected(row)) && !isAllSelected;

  const getSortIcon = (column: keyof T) => {
    if (!columns.find(col => col.key === column)?.sortable) return null;
    
    if (sortColumn !== column) {
      return <ArrowUpDown className="ml-2 h-4 w-4" />;
    }
    
    if (sortDirection === 'asc') {
      return <ArrowUp className="ml-2 h-4 w-4" />;
    }
    
    if (sortDirection === 'desc') {
      return <ArrowDown className="ml-2 h-4 w-4" />;
    }
    
    return <ArrowUpDown className="ml-2 h-4 w-4" />;
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className={cn('space-y-4', className)}>
        <SearchFilter
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          filters={filters}
          activeFilters={activeFilters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          placeholder={searchPlaceholder}
        />
        <div className="border rounded-lg">
          <TableLoadingSkeleton rows={itemsPerPage} cols={columns.length} />
        </div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Search and Filter */}
      <SearchFilter
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        filters={filters}
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        placeholder={searchPlaceholder}
      />

      {/* Selection Info */}
      {selectable && selectedRows.length > 0 && (
        <div className="flex items-center justify-between p-2 bg-blue-50 border border-blue-200 rounded-lg">
          <span className="text-sm text-blue-700">
            {selectedRows.length} item dipilih
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSelectionChange?.([])}>
            Batal Pilih
          </Button>
        </div>
      )}

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              {selectable && (
                <TableHead className="w-12">
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
              )}
              {columns.map((column) => (
                <TableHead
                  key={String(column.key)}
                  className={cn(
                    column.className,
                    column.sortable && 'cursor-pointer hover:bg-gray-50'
                  )}
                  style={{ width: column.width }}
                  onClick={() => handleSort(column.key)}
                >
                  <div className="flex items-center">
                    {column.label}
                    {getSortIcon(column.key)}
                  </div>
                </TableHead>
              ))}
              {actions.length > 0 && (
                <TableHead className="w-12">Aksi</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell 
                  colSpan={columns.length + (selectable ? 1 : 0) + (actions.length > 0 ? 1 : 0)}
                  className="text-center py-8 text-gray-500"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row, index) => (
                <TableRow
                  key={index}
                  className={cn(
                    onRowClick && 'cursor-pointer hover:bg-gray-50',
                    isRowSelected(row) && 'bg-blue-50'
                  )}
                  onClick={() => onRowClick?.(row)}
                >
                  {selectable && (
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={isRowSelected(row)}
                        onCheckedChange={(checked) => handleSelectRow(row, checked as boolean)}
                      />
                    </TableCell>
                  )}
                  {columns.map((column) => (
                    <TableCell key={String(column.key)} className={column.className}>
                      {column.render ? column.render(row[column.key], row) : row[column.key]}
                    </TableCell>
                  ))}
                  {actions.length > 0 && (
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Buka menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          {actions.map((action, actionIndex) => {
                            if (action.show && !action.show(row)) return null;
                            
                            return (
                              <DropdownMenuItem
                                key={actionIndex}
                                onClick={() => action.onClick(row)}
                                className={action.variant === 'destructive' ? 'text-red-600' : ''}
                              >
                                {action.icon && <span className="mr-2">{action.icon}</span>}
                                {action.label}
                              </DropdownMenuItem>
                            );
                          })}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalItems > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Menampilkan {((currentPage - 1) * itemsPerPage) + 1} sampai {Math.min(currentPage * itemsPerPage, totalItems)} dari {totalItems} data
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                  className={currentPage <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => handlePageChange(page)}
                    isActive={currentPage === page}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                  className={currentPage >= totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}