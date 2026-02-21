import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import type {
    DiamondData,
    GridViewProps,
} from "@/types/diamond.types";
import DiamondDetailView from "./DiamondDetailView";
import { Maven_Pro } from "next/font/google";
import { useDiamondData } from "@/hooks/useDiamondData";
import { useDiamondFilters } from "@/hooks/useDiamondFilters";
import { DiamondTableLoading } from "./Diamond/shared/DiamondTableLoading";
import { DiamondTableError } from "./Diamond/shared/DiamondTableError";
import { DiamondTableEmpty } from "./Diamond/shared/DiamondTableEmpty";
import { DiamondTablePagination } from "./Diamond/shared/DiamondTablePagination";

const mavenPro = Maven_Pro({
    variable: "--font-maven-pro",
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800"],
    display: "swap",
});

const DiamondGridView: React.FC<GridViewProps> = ({
    onRowClick,
    searchTerm = "",
    selectedShape = [],
    selectedColor = [],
    selectedMinCarat = "",
    selectedMaxCarat = "",
    selectedFluor = [],
    selectedClarity = [],
    selectedCut = "",
    selectedPolish = "",
    selectedLocations = [],
    selectedLabs = [],
    selectedSymmetry = "",
    keySymbolFilters,
    inclusionFilters,
    priceFilters,
    pageSize = 10,
}) => {
    // State for pagination - component manages this for server-side pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(pageSize);
    const [selectedDiamond, setSelectedDiamond] = useState<DiamondData | null>(null);

    // Build API filters using custom hook
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
        measurementFilters: undefined,
    });

    // Fetch diamond data from API using custom hook
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

    // Create stable filter key for detecting real filter changes
    const filterKey = useMemo(() => JSON.stringify(filters), [filters]);

    // Reset to page 1 when filters actually change
    useEffect(() => {
        setCurrentPage(1);
    }, [filterKey]);

    // Data is already paginated from server
    const paginatedData = data;

    // Calculate pagination info
    const paginationInfo = useMemo(() => {
        const start = totalRecords === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1;
        const end = Math.min(currentPage * rowsPerPage, totalRecords);
        return { start, end, total: totalRecords };
    }, [currentPage, rowsPerPage, totalRecords]);

    // Check if any filters are active
    const hasActiveFilters = useMemo(() => {
        return !!(
            searchTerm ||
            (Array.isArray(selectedShape) && selectedShape.length > 0) ||
            (Array.isArray(selectedColor) && selectedColor.length > 0) ||
            (Array.isArray(selectedClarity) && selectedClarity.length > 0) ||
            selectedCut ||
            selectedPolish ||
            selectedSymmetry ||
            (Array.isArray(selectedFluor) && selectedFluor.length > 0) ||
            selectedMinCarat ||
            selectedMaxCarat ||
            (Array.isArray(selectedLocations) && selectedLocations.length > 0) ||
            (Array.isArray(selectedLabs) && selectedLabs.length > 0) ||
            (keySymbolFilters?.keyToSymbol && keySymbolFilters.keyToSymbol.length > 0) ||
            (inclusionFilters?.centerBlack && inclusionFilters.centerBlack.length > 0) ||
            (inclusionFilters?.centerWhite && inclusionFilters.centerWhite.length > 0) ||
            (inclusionFilters?.sideBlack && inclusionFilters.sideBlack.length > 0) ||
            (inclusionFilters?.sideWhite && inclusionFilters.sideWhite.length > 0) ||
            priceFilters?.pricePerCarat?.from ||
            priceFilters?.pricePerCarat?.to ||
            priceFilters?.discount?.from ||
            priceFilters?.discount?.to ||
            priceFilters?.totalPrice?.from ||
            priceFilters?.totalPrice?.to
        );
    }, [
        searchTerm,
        selectedShape,
        selectedColor,
        selectedClarity,
        selectedCut,
        selectedPolish,
        selectedSymmetry,
        selectedFluor,
        selectedMinCarat,
        selectedMaxCarat,
        selectedLocations,
        selectedLabs,
        keySymbolFilters,
        inclusionFilters,
        priceFilters,
    ]);

    /**
     * Handle clicking on a diamond to open detail view
     */
    const handleDiamondClick = (e: React.MouseEvent, diamond: DiamondData) => {
        e.stopPropagation();
        if (onRowClick) {
            onRowClick(diamond);
        } else {
            setSelectedDiamond(diamond);
        }
        
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
     * Handle closing the detail view and navigate back to /inventory
     */
    const handleCloseDetail = () => {
        if (typeof window !== "undefined") {
            // Use replaceState to avoid polluting browser history
            window.history.replaceState(null, '', '/inventory');
        }
        setSelectedDiamond(null);
    };

    // Show loader only while loading and hasn't loaded data yet
    if (loading && !hasLoadedOnce) {
        return <DiamondTableLoading />;
    }

    // Error state
    if (error) {
        return <DiamondTableError error={error} />;
    }

    // Show "no diamonds found" only after initial load is complete
    if (!loading && data.length === 0 && hasLoadedOnce) {
        return <DiamondTableEmpty hasFilters={hasActiveFilters} />;
    }

    // Desktop view (no changes)
    const desktopView = (
        <div
            className={`w-full flex flex-col bg-gray-50 p-4 ${mavenPro.className} relative hidden lg:flex`}
        >
            {/* Loading overlay for subsequent data fetches */}
            {loading && hasLoadedOnce && (
                <div className="absolute inset-0 bg-white z-50 flex items-center justify-center rounded-none">
                    <div className="text-center">
                        <Loader2 className="w-12 h-12 animate-spin text-[#050c3a] mx-auto mb-4" />
                        <p className="text-gray-700 font-medium">Loading diamonds...</p>
                    </div>
                </div>
            )}

            <div className={`bg-white shadow-sm flex flex-col rounded-lg ${loading && hasLoadedOnce ? 'opacity-0' : 'opacity-100'}`}>
                {/* Grid Container */}
                <div className="p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {paginatedData.map((diamond) => {
                            const videoUrl =
                                (diamond as DiamondData & { MP4?: string })
                                    .MP4 || "";
                            const ratio = diamond.MEASUREMENTS
                                ? (() => {
                                      const parts =
                                          diamond.MEASUREMENTS.split("-");
                                      if (parts.length >= 2) {
                                          const length = parseFloat(
                                              parts[0]
                                          );
                                          const width = parseFloat(
                                              parts[1].split("*")[0]
                                          );
                                          return !isNaN(length) &&
                                              !isNaN(width)
                                              ? (length / width).toFixed(2)
                                              : "N/A";
                                      }
                                      return "N/A";
                                  })()
                                : "N/A";

                            return (
                                <div
                                    key={diamond._id}
                                    className="bg-white rounded-lg hover:shadow-lg transition-all duration-300 overflow-hidden relative border border-gray-200"
                                >
                                    {/* Video Container - No Padding */}
                                    <div
                                        className="relative w-full bg-gray-100 overflow-hidden cursor-pointer"
                                        style={{ aspectRatio: "1 / 1" }}
                                        onMouseEnter={(e) => {
                                            const video =
                                                e.currentTarget.querySelector(
                                                    "video"
                                                ) as HTMLVideoElement;
                                            if (video) video.play();
                                        }}
                                        onMouseLeave={(e) => {
                                            const video =
                                                e.currentTarget.querySelector(
                                                    "video"
                                                ) as HTMLVideoElement;
                                            if (video) {
                                                video.pause();
                                                video.currentTime = 0;
                                            }
                                        }}
                                        onClick={(e) => {
                                            handleDiamondClick(e, diamond);
                                        }}
                                    >
                                        {videoUrl ? (
                                            <video
                                                src={videoUrl}
                                                muted
                                                loop
                                                playsInline
                                                className="w-full h-full object-cover"
                                                style={{ display: "block" }}
                                            />
                                        ) : diamond.REAL_IMAGE ? (
                                            <Image
                                                src={diamond.REAL_IMAGE}
                                                alt={diamond.STONE_NO}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                                                No Media
                                            </div>
                                        )}
                                    </div>

                                    {/* Diamond Info */}
                                    <div className="px-3 py-3 space-y-2 bg-white">
                                        {/* Title */}
                                        <div className="text-sm font-semibold text-gray-900 truncate">
                                            {diamond.SHAPE} {diamond.CARATS}
                                            ct {diamond.COLOR}{" "}
                                            {diamond.CLARITY} {diamond.CUT}{" "}
                                            {diamond.POL} {diamond.SYM}
                                        </div>

                                        {/* Stock ID & Lab */}
                                        <div className="text-xs text-gray-600">
                                            <span className="font-medium">
                                                {diamond.STONE_NO}
                                            </span>{" "}
                                            • {diamond.LAB}
                                        </div>

                                        {/* Measurements Grid */}
                                        <div className="grid grid-cols-3 gap-2 text-xs">
                                            <div>
                                                <div className="text-gray-500">
                                                    T: {diamond.TABLE_PER}%
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-gray-500">
                                                    D: {diamond.DEPTH_PER}%
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-gray-500">
                                                    R: {ratio}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Measurements */}
                                        <div className="text-xs text-gray-600">
                                            <span className="font-medium">
                                                Measurements:
                                            </span>{" "}
                                            {diamond.MEASUREMENTS || "N/A"}
                                        </div>

                                        {/* View Button */}
                                        <button
                                            onClick={(e) => {
                                                handleDiamondClick(e, diamond);
                                            }}
                                            className="w-full mt-2 px-4 py-1.5 text-xs font-medium text-white bg-[#050C3A] hover:bg-[#030822] transition-colors duration-200 rounded"
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Pagination Footer */}
                <DiamondTablePagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    rowsPerPage={rowsPerPage}
                    paginationInfo={paginationInfo}
                    onPageChange={setCurrentPage}
                    onRowsPerPageChange={(newSize) => {
                        setRowsPerPage(newSize);
                        setCurrentPage(1);
                    }}
                    disabled={loading}
                />
            </div>
        </div>
    );

    // Mobile view with 2 columns
    const mobileView = (
        <div
            className={`w-full flex flex-col bg-gray-50 p-2 ${mavenPro.className} relative lg:hidden`}
        >
            {/* Loading overlay for subsequent data fetches */}
            {loading && hasLoadedOnce && (
                <div className="absolute inset-0 bg-white z-50 flex items-center justify-center rounded-none">
                    <div className="text-center">
                        <Loader2 className="w-8 h-8 animate-spin text-[#050c3a] mx-auto mb-2" />
                        <p className="text-gray-700 font-medium text-sm">Loading diamonds...</p>
                    </div>
                </div>
            )}

            <div className={`bg-white shadow-sm flex flex-col rounded-lg ${loading && hasLoadedOnce ? 'opacity-0' : 'opacity-100'}`}>
                {/* Mobile Grid Container - 2 columns */}
                <div className="p-2">
                    <div className="grid grid-cols-2 gap-2">
                        {paginatedData.map((diamond) => {
                            const videoUrl =
                                (diamond as DiamondData & { MP4?: string })
                                    .MP4 || "";
                            const ratio = diamond.MEASUREMENTS
                                ? (() => {
                                      const parts =
                                          diamond.MEASUREMENTS.split("-");
                                      if (parts.length >= 2) {
                                          const length = parseFloat(
                                              parts[0]
                                          );
                                          const width = parseFloat(
                                              parts[1].split("*")[0]
                                          );
                                          return !isNaN(length) &&
                                              !isNaN(width)
                                              ? (length / width).toFixed(2)
                                              : "N/A";
                                      }
                                      return "N/A";
                                  })()
                                : "N/A";

                            return (
                                <div
                                    key={diamond._id}
                                    className="bg-white rounded-lg hover:shadow-lg transition-all duration-300 overflow-hidden relative border border-gray-200"
                                >
                                    {/* Video Container - Compact */}
                                    <div
                                        className="relative w-full bg-gray-100 overflow-hidden cursor-pointer"
                                        style={{ aspectRatio: "1 / 1" }}
                                        onMouseEnter={(e) => {
                                            const video =
                                                e.currentTarget.querySelector(
                                                    "video"
                                                ) as HTMLVideoElement;
                                            if (video) video.play();
                                        }}
                                        onMouseLeave={(e) => {
                                            const video =
                                                e.currentTarget.querySelector(
                                                    "video"
                                                ) as HTMLVideoElement;
                                            if (video) {
                                                video.pause();
                                                video.currentTime = 0;
                                            }
                                        }}
                                        onClick={(e) => {
                                            handleDiamondClick(e, diamond);
                                        }}
                                    >
                                        {videoUrl ? (
                                            <video
                                                src={videoUrl}
                                                muted
                                                loop
                                                playsInline
                                                className="w-full h-full object-cover"
                                                style={{ display: "block" }}
                                            />
                                        ) : diamond.REAL_IMAGE ? (
                                            <Image
                                                src={diamond.REAL_IMAGE}
                                                alt={diamond.STONE_NO}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400" style={{ fontSize: "10px" }}>
                                                No Media
                                            </div>
                                        )}
                                    </div>

                                    {/* Diamond Info - Compact */}
                                    <div className="px-2 py-2 space-y-1 bg-white">
                                        {/* Title - Smaller */}
                                        <div className="text-[10px] font-semibold text-gray-900 truncate leading-tight">
                                            {diamond.SHAPE} {diamond.CARATS}ct {diamond.COLOR} {diamond.CLARITY}
                                        </div>

                                        {/* Stock ID & Lab - Smaller */}
                                        <div className="text-[9px] text-gray-600">
                                            <span className="font-medium">
                                                {diamond.STONE_NO}
                                            </span>{" "}
                                            • {diamond.LAB}
                                        </div>

                                        {/* Measurements Grid - Compact, improved spacing */}
                                        <div className="flex justify-between items-center text-[9px] mb-0.5 gap-2">
                                            <span className="text-gray-500 whitespace-nowrap">T: {diamond.TABLE_PER}%</span>
                                            <span className="text-gray-500 whitespace-nowrap">D: {diamond.DEPTH_PER}%</span>
                                            <span className="text-gray-500 whitespace-nowrap min-w-[38px] text-right font-mono" style={{overflow: 'visible'}}>
                                                R: {ratio}
                                            </span>
                                        </div>
                                        {/* Measurements - Compact, below grid to avoid collision */}
                                        <div className="text-[9px] text-gray-600 truncate">
                                            <span className="font-medium">M:</span> {diamond.MEASUREMENTS || "N/A"}
                                        </div>

                                        {/* View Button - Compact */}
                                        <button
                                            onClick={(e) => {
                                                handleDiamondClick(e, diamond);
                                            }}
                                            className="w-full mt-1 px-2 py-1 text-[9px] font-medium text-white bg-[#050C3A] hover:bg-[#030822] transition-colors duration-200 rounded"
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Mobile Pagination Footer - Using shared component */}
                <DiamondTablePagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    rowsPerPage={rowsPerPage}
                    paginationInfo={paginationInfo}
                    onPageChange={setCurrentPage}
                    onRowsPerPageChange={(newSize) => {
                        setRowsPerPage(newSize);
                        setCurrentPage(1);
                    }}
                    disabled={loading}
                />
            </div>
        </div>
    );

    return (
        <>
            {desktopView}
            {mobileView}

            {/* Detail Modal - Shared */}
            {selectedDiamond && (
                <DiamondDetailView
                    diamond={selectedDiamond}
                    onClose={handleCloseDetail}
                />
            )}
        </>
    );
};

export default DiamondGridView;
