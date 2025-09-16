import React, { useState, useMemo, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { EmptyState } from './empty-state'
import { LoadingSpinner } from './loading-spinner'
import {
  Search,
  Filter,
  SortAsc,
  SortDesc,
  MoreHorizontal,
  Download,
  Upload,
  RefreshCw,
  Eye,
  EyeOff,
  Settings,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  X,
  Plus
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/hooks/use-translation'

export interface Column<T = any> {
  id: string
  key: keyof T
  title: string
  sortable?: boolean
  filterable?: boolean
  searchable?: boolean
  width?: string | number
  minWidth?: string | number
  maxWidth?: string | number
  align?: 'left' | 'center' | 'right'
  type?: 'text' | 'number' | 'date' | 'boolean' | 'select' | 'custom'
  render?: (value: any, row: T, index: number) => React.ReactNode
  filterOptions?: { label: string; value: any }[]
  hidden?: boolean
  sticky?: 'left' | 'right'
  resizable?: boolean
}

export interface DataTableProps<T = any> {
  data: T[]
  columns: Column<T>[]
  loading?: boolean
  searchable?: boolean
  filterable?: boolean
  sortable?: boolean
  selectable?: boolean
  pagination?: boolean
  pageSize?: number
  pageSizeOptions?: number[]
  showHeader?: boolean
  showFooter?: boolean
  showRowNumbers?: boolean
  showActions?: boolean
  striped?: boolean
  bordered?: boolean
  hoverable?: boolean
  compact?: boolean
  resizable?: boolean
  exportable?: boolean
  variant?: 'default' | 'simple' | 'card'
  selectedRows?: Set<string | number>
  onRowSelect?: (selectedRows: Set<string | number>) => void
  onRowClick?: (row: T, index: number) => void
  onSort?: (column: string, direction: 'asc' | 'desc') => void
  onFilter?: (filters: Record<string, any>) => void
  onSearch?: (query: string) => void
  onExport?: (format: 'csv' | 'xlsx' | 'json') => void
  rowKey?: keyof T | ((row: T) => string | number)
  emptyState?: React.ReactNode
  actions?: Array<{
    label: string
    icon?: React.ComponentType<any>
    onClick: (row: T) => void
    variant?: 'default' | 'secondary' | 'destructive' | 'ghost'
    show?: (row: T) => boolean
  }>
  bulkActions?: Array<{
    label: string
    icon?: React.ComponentType<any>
    onClick: (selectedRows: T[]) => void
    variant?: 'default' | 'secondary' | 'destructive'
  }>
  className?: string
}

export function DataTable<T = any>({
  data,
  columns,
  loading = false,
  searchable = true,
  filterable = true,
  sortable = true,
  selectable = false,
  pagination = true,
  pageSize = 10,
  pageSizeOptions = [5, 10, 20, 50, 100],
  showHeader = true,
  showFooter = true,
  showRowNumbers = false,
  showActions = false,
  striped = true,
  bordered = false,
  hoverable = true,
  compact = false,
  resizable = false,
  exportable = false,
  variant = 'default',
  selectedRows = new Set(),
  onRowSelect,
  onRowClick,
  onSort,
  onFilter,
  onSearch,
  onExport,
  rowKey = 'id',
  emptyState,
  actions = [],
  bulkActions = [],
  className
}: DataTableProps<T>) {
  const { t } = useTranslation()

  // Local state
  const [currentPage, setCurrentPage] = useState(1)
  const [currentPageSize, setCurrentPageSize] = useState(pageSize)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [filters, setFilters] = useState<Record<string, any>>({})
  const [hiddenColumns, setHiddenColumns] = useState<Set<string>>(new Set())
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({})

  // Get row key
  const getRowKey = useCallback((row: T, index: number) => {
    if (typeof rowKey === 'function') {
      return rowKey(row)
    }
    return row[rowKey] || index
  }, [rowKey])

  // Filter and search data
  const filteredData = useMemo(() => {
    let result = [...data]

    // Apply search
    if (searchQuery && searchable) {
      const searchableColumns = columns.filter(col => col.searchable !== false)
      result = result.filter(row =>
        searchableColumns.some(col => {
          const value = row[col.key]
          return String(value).toLowerCase().includes(searchQuery.toLowerCase())
        })
      )
    }

    // Apply filters
    if (filterable) {
      Object.entries(filters).forEach(([columnId, filterValue]) => {
        if (filterValue !== undefined && filterValue !== null && filterValue !== '') {
          const column = columns.find(col => col.id === columnId)
          if (column) {
            result = result.filter(row => {
              const value = row[column.key]
              if (Array.isArray(filterValue)) {
                return filterValue.includes(value)
              }
              return String(value).toLowerCase().includes(String(filterValue).toLowerCase())
            })
          }
        }
      })
    }

    // Apply sorting
    if (sortColumn && sortable) {
      const column = columns.find(col => col.id === sortColumn)
      if (column) {
        result.sort((a, b) => {
          const aVal = a[column.key]
          const bVal = b[column.key]

          if (aVal === bVal) return 0

          let comparison = 0
          if (column.type === 'number') {
            comparison = Number(aVal) - Number(bVal)
          } else if (column.type === 'date') {
            comparison = new Date(aVal).getTime() - new Date(bVal).getTime()
          } else {
            comparison = String(aVal).localeCompare(String(bVal))
          }

          return sortDirection === 'desc' ? -comparison : comparison
        })
      }
    }

    return result
  }, [data, searchQuery, filters, sortColumn, sortDirection, columns, searchable, filterable, sortable])

  // Paginate data
  const paginatedData = useMemo(() => {
    if (!pagination) return filteredData

    const startIndex = (currentPage - 1) * currentPageSize
    const endIndex = startIndex + currentPageSize
    return filteredData.slice(startIndex, endIndex)
  }, [filteredData, currentPage, currentPageSize, pagination])

  // Calculate pagination info
  const totalPages = Math.ceil(filteredData.length / currentPageSize)
  const startRow = (currentPage - 1) * currentPageSize + 1
  const endRow = Math.min(currentPage * currentPageSize, filteredData.length)

  // Handle sorting
  const handleSort = (columnId: string) => {
    if (!sortable) return

    const column = columns.find(col => col.id === columnId)
    if (!column?.sortable) return

    let newDirection: 'asc' | 'desc' = 'asc'
    if (sortColumn === columnId) {
      newDirection = sortDirection === 'asc' ? 'desc' : 'asc'
    }

    setSortColumn(columnId)
    setSortDirection(newDirection)
    onSort?.(columnId, newDirection)
  }

  // Handle row selection
  const handleRowSelect = (rowKey: string | number, selected: boolean) => {
    if (!selectable || !onRowSelect) return

    const newSelected = new Set(selectedRows)
    if (selected) {
      newSelected.add(rowKey)
    } else {
      newSelected.delete(rowKey)
    }
    onRowSelect(newSelected)
  }

  // Handle select all
  const handleSelectAll = (selected: boolean) => {
    if (!selectable || !onRowSelect) return

    if (selected) {
      const allKeys = paginatedData.map((row, index) => getRowKey(row, index))
      onRowSelect(new Set(allKeys))
    } else {
      onRowSelect(new Set())
    }
  }

  // Handle filter change
  const handleFilterChange = (columnId: string, value: any) => {
    const newFilters = { ...filters, [columnId]: value }
    if (value === null || value === undefined || value === '') {
      delete newFilters[columnId]
    }
    setFilters(newFilters)
    setCurrentPage(1) // Reset to first page
    onFilter?.(newFilters)
  }

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1) // Reset to first page
    onSearch?.(query)
  }

  // Get visible columns
  const visibleColumns = columns.filter(col => !hiddenColumns.has(col.id))

  // Render cell content
  const renderCell = (column: Column<T>, row: T, index: number) => {
    const value = row[column.key]

    if (column.render) {
      return column.render(value, row, index)
    }

    switch (column.type) {
      case 'boolean':
        return value ? (
          <Badge variant="default" className="bg-green-100 text-green-800">
            {t('yes')}
          </Badge>
        ) : (
          <Badge variant="secondary">
            {t('no')}
          </Badge>
        )

      case 'date':
        return value ? new Date(value).toLocaleDateString() : '-'

      case 'number':
        return typeof value === 'number' ? value.toLocaleString() : value

      default:
        return value || '-'
    }
  }

  // Render table header
  const renderHeader = () => (
    <thead className="bg-muted/50">
      <tr>
        {selectable && (
          <th className="w-12 px-4 py-3">
            <Checkbox
              checked={paginatedData.length > 0 && paginatedData.every((row, index) =>
                selectedRows.has(getRowKey(row, index))
              )}
              onCheckedChange={handleSelectAll}
            />
          </th>
        )}

        {showRowNumbers && (
          <th className="w-16 px-4 py-3 text-left font-medium">#</th>
        )}

        {visibleColumns.map((column) => (
          <th
            key={column.id}
            className={cn(
              "px-4 py-3 font-medium",
              column.align === 'center' && "text-center",
              column.align === 'right' && "text-right",
              column.sortable && sortable && "cursor-pointer hover:bg-muted/80",
              compact && "py-2"
            )}
            style={{
              width: column.width,
              minWidth: column.minWidth,
              maxWidth: column.maxWidth
            }}
            onClick={() => column.sortable && sortable && handleSort(column.id)}
          >
            <div className="flex items-center gap-2">
              <span>{column.title}</span>
              {column.sortable && sortable && (
                <div className="flex items-center">
                  {sortColumn === column.id ? (
                    sortDirection === 'asc' ? (
                      <SortAsc className="h-4 w-4" />
                    ) : (
                      <SortDesc className="h-4 w-4" />
                    )
                  ) : (
                    <ArrowUpDown className="h-4 w-4 opacity-50" />
                  )}
                </div>
              )}
            </div>
          </th>
        ))}

        {showActions && actions.length > 0 && (
          <th className="w-20 px-4 py-3 text-right font-medium">
            {t('actions')}
          </th>
        )}
      </tr>
    </thead>
  )

  // Render table body
  const renderBody = () => (
    <tbody>
      {paginatedData.map((row, index) => {
        const key = getRowKey(row, index)
        const isSelected = selectedRows.has(key)
        const globalIndex = (currentPage - 1) * currentPageSize + index

        return (
          <tr
            key={key}
            className={cn(
              "border-b transition-colors",
              hoverable && "hover:bg-muted/50",
              striped && index % 2 === 0 && "bg-muted/25",
              isSelected && "bg-primary/10",
              onRowClick && "cursor-pointer",
              compact && "h-12"
            )}
            onClick={() => onRowClick?.(row, globalIndex)}
          >
            {selectable && (
              <td className="px-4 py-3">
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={(checked) => handleRowSelect(key, !!checked)}
                  onClick={(e) => e.stopPropagation()}
                />
              </td>
            )}

            {showRowNumbers && (
              <td className="px-4 py-3 text-sm text-muted-foreground">
                {globalIndex + 1}
              </td>
            )}

            {visibleColumns.map((column) => (
              <td
                key={column.id}
                className={cn(
                  "px-4 py-3",
                  column.align === 'center' && "text-center",
                  column.align === 'right' && "text-right",
                  compact && "py-2"
                )}
                style={{
                  width: column.width,
                  minWidth: column.minWidth,
                  maxWidth: column.maxWidth
                }}
              >
                {renderCell(column, row, globalIndex)}
              </td>
            ))}

            {showActions && actions.length > 0 && (
              <td className="px-4 py-3 text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {actions
                      .filter(action => !action.show || action.show(row))
                      .map((action, actionIndex) => {
                        const Icon = action.icon
                        return (
                          <DropdownMenuItem
                            key={actionIndex}
                            onClick={(e) => {
                              e.stopPropagation()
                              action.onClick(row)
                            }}
                            className={cn(
                              action.variant === 'destructive' && "text-destructive focus:text-destructive"
                            )}
                          >
                            {Icon && <Icon className="h-4 w-4 mr-2" />}
                            {action.label}
                          </DropdownMenuItem>
                        )
                      })}
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            )}
          </tr>
        )
      })}
    </tbody>
  )

  // Render toolbar
  const renderToolbar = () => (
    <div className="flex items-center justify-between gap-4 p-4">
      <div className="flex items-center gap-4 flex-1">
        {/* Search */}
        {searchable && (
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 h-6 w-6 p-0 -translate-y-1/2"
                onClick={() => handleSearch('')}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        )}

        {/* Active filters */}
        {Object.keys(filters).length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{t('filters')}:</span>
            {Object.entries(filters).map(([columnId, value]) => {
              const column = columns.find(col => col.id === columnId)
              return (
                <Badge key={columnId} variant="secondary" className="gap-1">
                  {column?.title}: {String(value)}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => handleFilterChange(columnId, null)}
                  />
                </Badge>
              )
            })}
          </div>
        )}

        {/* Selected count */}
        {selectable && selectedRows.size > 0 && (
          <div className="flex items-center gap-2">
            <Badge variant="default">
              {selectedRows.size} {t('selected')}
            </Badge>
            {bulkActions.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    {t('bulkActions')}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {bulkActions.map((action, index) => {
                    const Icon = action.icon
                    return (
                      <DropdownMenuItem
                        key={index}
                        onClick={() => {
                          const selectedData = data.filter((row, rowIndex) =>
                            selectedRows.has(getRowKey(row, rowIndex))
                          )
                          action.onClick(selectedData)
                        }}
                        className={cn(
                          action.variant === 'destructive' && "text-destructive focus:text-destructive"
                        )}
                      >
                        {Icon && <Icon className="h-4 w-4 mr-2" />}
                        {action.label}
                      </DropdownMenuItem>
                    )
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Column visibility */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              {t('columns')}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64" align="end">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">{t('showColumns')}</h4>
              {columns.map((column) => (
                <div key={column.id} className="flex items-center space-x-2">
                  <Checkbox
                    checked={!hiddenColumns.has(column.id)}
                    onCheckedChange={(checked) => {
                      const newHidden = new Set(hiddenColumns)
                      if (checked) {
                        newHidden.delete(column.id)
                      } else {
                        newHidden.add(column.id)
                      }
                      setHiddenColumns(newHidden)
                    }}
                  />
                  <span className="text-sm">{column.title}</span>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Export */}
        {exportable && onExport && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                {t('export')}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => onExport('csv')}>
                {t('exportCSV')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onExport('xlsx')}>
                {t('exportExcel')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onExport('json')}>
                {t('exportJSON')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* Refresh */}
        <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )

  // Render pagination
  const renderPagination = () => {
    if (!pagination || filteredData.length <= currentPageSize) return null

    return (
      <div className="flex items-center justify-between p-4 border-t">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{t('rowsPerPage')}</span>
            <Select
              value={currentPageSize.toString()}
              onValueChange={(value) => {
                setCurrentPageSize(Number(value))
                setCurrentPage(1)
              }}
            >
              <SelectTrigger className="w-16">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map((size) => (
                  <SelectItem key={size} value={size.toString()}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <span className="text-sm text-muted-foreground">
            {t('showingRows', { start: startRow, end: endRow, total: filteredData.length })}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <span className="text-sm text-muted-foreground px-4">
            {t('pageOf', { current: currentPage, total: totalPages })}
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    )
  }

  // Loading state
  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="p-8">
          <LoadingSpinner
            size="lg"
            label={t('loadingData')}
            centered
          />
        </CardContent>
      </Card>
    )
  }

  // Empty state
  if (data.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="p-8">
          {emptyState || (
            <EmptyState
              icon="inbox"
              title={t('noDataAvailable')}
              description={t('noDataToDisplay')}
              variant="centered"
            />
          )}
        </CardContent>
      </Card>
    )
  }

  // Render table based on variant
  const tableContent = (
    <div className={cn("relative", className)}>
      {showHeader && renderToolbar()}

      <div className={cn("overflow-x-auto", bordered && "border")}>
        <table className="w-full">
          {renderHeader()}
          {renderBody()}
        </table>
      </div>

      {/* No results from filtering */}
      {filteredData.length === 0 && (
        <div className="p-8">
          <EmptyState
            icon="search"
            title={t('noResultsFound')}
            description={t('tryAdjustingFilters')}
            variant="centered"
            size="sm"
          />
        </div>
      )}

      {showFooter && renderPagination()}
    </div>
  )

  if (variant === 'card') {
    return (
      <Card className={className}>
        <CardContent className="p-0">
          {tableContent}
        </CardContent>
      </Card>
    )
  }

  return tableContent
}

export default DataTable