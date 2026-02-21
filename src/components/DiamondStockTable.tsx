import React, { useState, useEffect, useMemo } from 'react';
import type { DiamondData, TableProps } from '@/types/diamond.types';
import DiamondDetailView from './DiamondDetailView';
import { Maven_Pro } from 'next/font/google';
import { DiamondTable } from './Diamond/Table';
import { DiamondTablePagination, DiamondTableLoading, DiamondTableError, DiamondTableEmpty } from './Diamond/shared';
import { useDiamondData } from '@/hooks/useDiamondData';
import { useDiamondFilters } from '@/hooks/useDiamondFilters';
import { useDiamondSelection } from '@/hooks/useDiamondSelection';

const mavenPro = Maven_Pro({
  variable: '--font-maven-pro',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

/**
 * DiamondStockTable Component
 * Main table component for displaying diamond inventory
 * Features: filtering, sorting, pagination, selection, and detail view
 */
const DiamondStockTable: React.FC<TableProps> = ({
    pageSize = 10,
    onRowClick,
  searchTerm = '',
    selectedShape = [],
    selectedColor = [],
  selectedMinCarat = '',
  selectedMaxCarat = '',
    selectedFluor = [],
    selectedClarity = [],
  selectedCut = '',
  selectedPolish = '',
  selectedSymmetry = '',
    selectedLocations = [],
    selectedLabs = [],
    keySymbolFilters,
    inclusionFilters,
  priceFilters,
  measurementFilters,
    onSelectionChange,
    clearSelectionTrigger,
}) => {
  // UI State
  const [selectedDiamond, setSelectedDiamond] = useState<DiamondData | null>(null);

  // Build API filters from UI inputs
  // Pass props directly - useDiamondFilters handles memoization
  const { filters } = useDiamondFilters({
                    searchTerm,
                    selectedShape,
                    selectedColor,
                    selectedMinCarat,
                    selectedMaxCarat,
                    selectedFluor,
                    selectedClarity,
                    selectedCut,
                    selectedPolish,
                    selectedSymmetry,
                    selectedLocations,
                    selectedLabs,
                    keySymbolFilters,
    inclusionFilters,
                    priceFilters,
                    measurementFilters,
  });

  // State for pagination - component manages this for server-side pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(pageSize);

  // Fetch diamond data from API
  const {
    data,
    loading,
    error,
    totalRecords,
    totalPages,
    hasLoadedOnce,
  } = useDiamondData({
    filters,
        currentPage,
        rowsPerPage,
  });

  // Calculate pagination info
  const paginationInfo = useMemo(() => {
    const start = totalRecords === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1;
    const end = Math.min(currentPage * rowsPerPage, totalRecords);
    return { start, end, total: totalRecords };
  }, [currentPage, rowsPerPage, totalRecords]);

  // Create stable filter key for detecting real filter changes
  const filterKey = useMemo(() => JSON.stringify(filters), [filters]);
  
  // Reset to page 1 when filters actually change
  useEffect(() => {
    setCurrentPage(1);
  }, [filterKey]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleRowsPerPageChange = (newSize: number) => {
    setRowsPerPage(newSize);
    setCurrentPage(1);
  };

  // Initialize selection hook
  const { selectedRows, selectAll, handleSelectAll, handleRowSelect, clearSelection } = 
    useDiamondSelection<DiamondData>({
      onSelectionChange,
    });

  // Clear selection when trigger changes
  useEffect(() => {
    if (clearSelectionTrigger !== undefined && clearSelectionTrigger > 0) {
      clearSelection();
    }
  }, [clearSelectionTrigger, clearSelection]);

  /**
   * Handle clicking on Stock ID to open detail view
   */
  const handleStockIdClick = (e: React.MouseEvent, diamond: DiamondData) => {
    e.stopPropagation();
    setSelectedDiamond(diamond);
    onRowClick?.(diamond);
    
    // Update URL with diamond details: /inventory/shape/color/cut/sym
    // Normalize to lowercase for consistent URLs
    if (typeof window !== "undefined") {
      const shape = (diamond.SHAPE || 'unknown').toLowerCase();
      const color = (diamond.COLOR || 'unknown').toLowerCase();
      const cut = (diamond.CUT || 'unknown').toLowerCase();
      const sym = (diamond.SYM || 'unknown').toLowerCase();
      const newUrl = `/inventory/${encodeURIComponent(shape)}/${encodeURIComponent(color)}/${encodeURIComponent(cut)}/${encodeURIComponent(sym)}`;
      // Use replaceState to avoid polluting browser history
      window.history.replaceState(null, '', newUrl);
    }
  };

  /**
   * Close detail view modal
   */
  const handleCloseDetail = () => {
    setSelectedDiamond(null);
  };

  // Show loading state on initial load
  if (loading && !hasLoadedOnce) {
        return (
      <div className={mavenPro.className}>
        <DiamondTableLoading message="Loading diamonds..." />
            </div>
        );
    }

  // Show error state if API call failed
  if (error && !hasLoadedOnce) {
        return (
      <div className={mavenPro.className}>
        <DiamondTableError error={error} />
            </div>
        );
    }

  // Show empty state if no diamonds found
  if (!loading && data.length === 0 && hasLoadedOnce) {
        return (
      <div className={mavenPro.className}>
        <DiamondTableEmpty message="No diamonds found matching your filters." />
            </div>
        );
    }

    // Desktop view (no changes)
    const desktopView = (
      <div className={`w-full h-full flex flex-col ${mavenPro.className} relative hidden lg:flex`}>
        {/* Loading overlay for subsequent data fetches */}
        {loading && hasLoadedOnce && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
            <DiamondTableLoading />
          </div>
        )}

        {/* Main Table Container */}
        <div className={`flex-1 overflow-hidden border border-gray-300 ${loading && hasLoadedOnce ? 'opacity-50 pointer-events-none' : ''}`}>
          <DiamondTable
            diamonds={data}
            selectedRows={selectedRows}
            selectAll={selectAll}
            onSelectAll={(checked) => handleSelectAll(checked, data)}
            onRowSelect={(id, checked) => handleRowSelect(id, checked, data)}
            onStockIdClick={handleStockIdClick}
          />
        </div>

        {/* Pagination Controls */}
        <DiamondTablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          rowsPerPage={rowsPerPage}
          paginationInfo={paginationInfo}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          disabled={loading}
        />
      </div>
    );

    // Mobile view with compact design
    const mobileView = (
      <div className={`w-full h-full flex flex-col ${mavenPro.className} relative lg:hidden`}>
        {/* Loading overlay for subsequent data fetches */}
        {loading && hasLoadedOnce && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
            <DiamondTableLoading />
          </div>
        )}

        {/* Mobile Table Container with horizontal scroll - Fixed scrolling */}
        <div className={`flex-1 overflow-auto border border-gray-300 ${loading && hasLoadedOnce ? 'opacity-50 pointer-events-none' : ''}`} style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <div style={{ minWidth: '800px', width: 'max-content' }}>
            <DiamondTable
              diamonds={data}
              selectedRows={selectedRows}
              selectAll={selectAll}
              onSelectAll={(checked) => handleSelectAll(checked, data)}
              onRowSelect={(id, checked) => handleRowSelect(id, checked, data)}
              onStockIdClick={handleStockIdClick}
            />
          </div>
        </div>

        {/* Mobile Pagination - Using shared component */}
        <DiamondTablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          rowsPerPage={rowsPerPage}
          paginationInfo={paginationInfo}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          disabled={loading}
        />
      </div>
    );

    return (
      <>
        {desktopView}
        {mobileView}

        {/* Detail View Modal - Shared */}
        {selectedDiamond && (
          <DiamondDetailView
            diamond={selectedDiamond}
            onClose={handleCloseDetail}
          />
        )}
      </>
    );
};

export default DiamondStockTable;

