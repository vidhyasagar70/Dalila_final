"use client";
import React, { useState, useEffect } from "react";
import { Grid3x3, List, ChevronDown, ChevronUp, Filter, Search, RotateCcw, ShoppingCart, Hand, GitCompare } from "lucide-react";
import Image from "next/image";
import { DiamondData } from "@/types/diamond.types";
import DiamondComparisonPage from "./DiamondComparisonPage";
import SearchBar from "./shared/SearchBar";
import ColorFilter from "./Filters/ColorFilter";
import ShapeFilter from "./Filters/ShapeFilter";
import CaratFilter from "./Filters/CaratFilter";
import ClarityFilter from "./Filters/ClarityFilter";
import FluorFilter from "./Filters/FluorescenceFilter";
import InclusionFilter, { type InclusionFilters } from "./Filters/InclusionFilter";
import MeasurementFilter from "./Filters/MeasurementFilter";
import KeySymbolFilter, { type KeySymbolFilters } from "./Filters/KeyToSymbolFilter";
import PriceLocationFilter, {
  type PriceLocationFilters,
} from "./Filters/PriceAndLocationFilter";
import DiamondStockTable from "./DiamondStockTable";
import DiamondGridView from "./DiamondGridView";
import CompareButton from "./CompareButton";
import EmailButton from "./shared/EmailButton";
import AddToCartButton from "../components/cart/AddToCartButton";
import HoldButton from "../components/cart/HoldButton";
import { Maven_Pro } from "next/font/google";

const mavenPro = Maven_Pro({
  variable: "--font-maven-pro",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export default function DiamondStockTableWithFilter() {
  // Admin check state
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshMessage, setRefreshMessage] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user");
      const token = localStorage.getItem("authToken");
      if (userStr && token) {
        try {
          const user = JSON.parse(userStr);
          setIsAdmin(user.role === "ADMIN" || user.role === "SUPER_ADMIN");
          setIsLoggedIn(true);
        } catch {
          setIsAdmin(false);
          setIsLoggedIn(false);
        }
      } else {
        setIsLoggedIn(false);
      }
    }
  }, []);
    // Refresh handler
    const handleRefresh = async () => {
      setRefreshing(true);
      setRefreshMessage(null);
      try {
        const { diamondApi } = await import("@/lib/api");
        const response = await diamondApi.refresh();
        if (response && response.success) {
          setRefreshMessage("Inventory refresh started successfully.");
        } else {
          setRefreshMessage(response?.message || "Failed to refresh inventory.");
        }
      } catch {
        setRefreshMessage("Error refreshing inventory.");
      } finally {
        setRefreshing(false);
      }
    };
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [selectedColor, setSelectedColor] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedShape, setSelectedShape] = useState<string[]>([]);
  const [selectedClarity, setSelectedClarity] = useState<string[]>([]);
  const [selectedSpecial, setSelectedSpecial] = useState("");
  const [selectedCut, setSelectedCut] = useState("");
  const [selectedPolish, setSelectedPolish] = useState("");
  const [selectedSymmetry, setSelectedSymmetry] = useState("");
  const [selectedFluor, setSelectedFluor] = useState<string[]>([]);
  const [selectedCaratRanges, setSelectedCaratRanges] = useState<{ min: string; max: string }[]>([]);
  const [selectedDiamonds, setSelectedDiamonds] = useState<DiamondData[]>([]);
  const [compareDiamonds, setCompareDiamonds] = useState<DiamondData[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [clearSelectionTrigger, setClearSelectionTrigger] = useState(0);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [measurements, setMeasurements] = useState({
    length: { from: "", to: "" },
    width: { from: "", to: "" },
    depth: { from: "", to: "" },
    table: { from: "", to: "" },
    depthPercent: { from: "", to: "" },
    ratio: { from: "", to: "" },
    crAngle: { from: "", to: "" },
    pavAngle: { from: "", to: "" },
    gridle: { from: "", to: "" },
    crHeight: { from: "", to: "" },
    pavHeight: { from: "", to: "" },
  });

  const [inclusions, setInclusions] = useState<InclusionFilters>({
    centerBlack: [],
    centerWhite: [],
    sideBlack: [],
    sideWhite: [],
  });

  const [keySymbolFilters, setKeySymbolFilters] = useState<KeySymbolFilters>({
    keyToSymbol: [],
  });

  const [priceLocationFilters, setPriceLocationFilters] =
    useState<PriceLocationFilters>({
      pricePerCarat: { from: "", to: "" },
      discount: { from: "", to: "" },
      totalPrice: { from: "", to: "" },
      locations: [],
      labs: [],
    });

  const [showFilters, setShowFilters] = useState(false);

  const handleColorChange = (colors: string[]) => {
    setSelectedColor(colors);
  };

  const handleShapeChange = (shapes: string[]) => {
    setSelectedShape(shapes);
  };

  const handleFluorChange = (fluor: string[]) => {
    setSelectedFluor(fluor);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleClarityChange = (clarity: string[]) => {
    setSelectedClarity(clarity);
    setSearchTerm("");
  };

  const handleSpecialChange = (special: string) => {
    setSelectedSpecial(special);
    setSearchTerm("");
  };

  const handleCutChange = (cut: string) => {
    setSelectedCut(cut);
    setSearchTerm("");
  };

  const handlePolishChange = (polish: string) => {
    setSelectedPolish(polish);
    setSearchTerm("");
  };

  const handleSymmetryChange = (symmetry: string) => {
    setSelectedSymmetry(symmetry);
    setSearchTerm("");
  };

  const handleCaratChange = (ranges: { min: string; max: string }[]) => {
    setSelectedCaratRanges(ranges);
  };

  const handleSelectionChange = (
    selectedIds: string[],
    diamonds: DiamondData[],
  ) => {
    setSelectedDiamonds(diamonds);
  };

  const handleCompare = () => {
    if (selectedDiamonds.length > 0) {
      // store the diamonds to be compared so modal gets the data
      setCompareDiamonds(selectedDiamonds);
      setShowComparison(true);
      // Clear selections after opening comparison
      setSelectedDiamonds([]);
      setClearSelectionTrigger((prev) => prev + 1);
    }
  };

  const handleEmail = () => {
    console.log(
      "Email sent for diamonds:",
      selectedDiamonds.map((d) => d.STONE_NO),
    );
    // Clear selections after email
    setSelectedDiamonds([]);
    setClearSelectionTrigger(prev => prev + 1);
  };

  const handleAddToCart = () => {
    setSelectedDiamonds([]);
    setClearSelectionTrigger(prev => prev + 1);
    console.log("Diamonds added to cart successfully, selection cleared");
  };

  const handleAddToHold = () => {
    setSelectedDiamonds([]);
    setClearSelectionTrigger(prev => prev + 1);
    console.log("Diamonds added to hold successfully, selection cleared");
  };

  const handleResetFilters = () => {
    setSelectedColor([]);
    setSelectedShape([]);
    setSelectedClarity([]);
    setSelectedSpecial("");
    setSelectedCut("");
    setSelectedPolish("");
    setSelectedSymmetry("");
    setSelectedFluor([]);
    setSelectedCaratRanges([]);
    setKeySymbolFilters({
      keyToSymbol: [],
    });
    setInclusions({
      centerBlack: [],
      centerWhite: [],
      sideBlack: [],
      sideWhite: [],
    });
    setPriceLocationFilters({
      pricePerCarat: { from: "", to: "" },
      discount: { from: "", to: "" },
      totalPrice: { from: "", to: "" },
      locations: [],
      labs: [],
    });
    setMeasurements({
      length: { from: "", to: "" },
      width: { from: "", to: "" },
      depth: { from: "", to: "" },
      table: { from: "", to: "" },
      depthPercent: { from: "", to: "" },
      ratio: { from: "", to: "" },
      crAngle: { from: "", to: "" },
      pavAngle: { from: "", to: "" },
      gridle: { from: "", to: "" },
      crHeight: { from: "", to: "" },
      pavHeight: { from: "", to: "" },
    });
  };

  const toggleView = () => {
    setViewMode(viewMode === "list" ? "grid" : "list");
  };

  return (
    <div className="w-full">
      {/* Desktop Layout - Hidden on Mobile */}
      <div className="hidden lg:block w-full px-4 py-4 bg-[#F5F7FA] mt-30">
        {/* Admin Refresh Button */}
        {isAdmin && (
        <div className="flex items-center mb-4 justify-end">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-[#050C3A] text-white rounded shadow hover:bg-[#000055] transition-colors disabled:opacity-60"
            title="Refresh Inventory"
          >
            <Image src="/filtersicon/filter-add.png" alt="Refresh" width={18} height={18} className="w-4 h-4" />
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
          {refreshMessage && (
            <span className="ml-4 text-sm text-green-700">{refreshMessage}</span>
          )}
        </div>
      )}
      {/* TOP ROW: Shapes, Carat, Clarity + Fluor/Color stack */}
      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0.5">
        <ShapeFilter
          selectedShape={selectedShape}
          onShapeChange={handleShapeChange}
        />
        <CaratFilter
          selectedCaratRanges={selectedCaratRanges}
          onCaratChange={handleCaratChange}
        />
        <ClarityFilter
          selectedClarity={selectedClarity}
          selectedSpecial={selectedSpecial}
          selectedCut={selectedCut}
          selectedPolish={selectedPolish}
          selectedSymmetry={selectedSymmetry}
          onClarityChange={handleClarityChange}
          onSpecialChange={handleSpecialChange}
          onCutChange={handleCutChange}
          onPolishChange={handlePolishChange}
          onSymmetryChange={handleSymmetryChange}
        />
        <div className="flex flex-col ">
          <FluorFilter
            selectedFluor={selectedFluor}
            onFluorChange={handleFluorChange}
          />
          <ColorFilter
            selectedColor={selectedColor}
            onColorChange={handleColorChange}
          />
        </div>
      </div>

      {/* SEARCH AND NAVIGATION ROW */}
      <div
        className={`flex items-center gap-2 mt-0.5 bg-[#faf6eb] px-4 py-2 rounded ${mavenPro.className}`}
      >
        <div className="flex items-center gap-1 bg-[#faf6eb] rounded-none p-0.5">
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded cursor-pointer transition-colors ${
              viewMode === "list"
                ? "bg-[#000033] text-white"
                : "bg-[#faf6eb] text-gray-600 hover:bg-gray-200"
            }`}
            title="Table View"
          >
            <List className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded cursor-pointer transition-colors ${
              viewMode === "grid"
                ? "bg-[#000033] text-white"
                : "bg-[#faf6eb] text-gray-600 hover:bg-gray-200"
            }`}
            title="Grid View"
          >
            <Grid3x3 className="w-5 h-5" />
          </button>
        </div>

        <SearchBar onSearch={handleSearch} />

        <div className="flex-1"></div>

        <div className="flex items-center gap-2">
          {isLoggedIn && (
            <>
              <AddToCartButton
                selectedCount={selectedDiamonds.length}
                selectedStoneNumbers={selectedDiamonds.map((d) => d.STONE_NO)}
                onAddToCart={handleAddToCart}
              />

              <HoldButton
                selectedCount={selectedDiamonds.length}
                selectedStoneNumbers={selectedDiamonds.map((d) => d.STONE_NO)}
                onAddToHold={handleAddToHold}
              />

              <CompareButton
                selectedCount={selectedDiamonds.length}
                onCompare={handleCompare}
                disabled={selectedDiamonds.length === 0}
              />

              <EmailButton
                selectedCount={selectedDiamonds.length}
                selectedStoneNumbers={selectedDiamonds.map((d) => d.STONE_NO)}
                onEmail={handleEmail}
              />
            </>
          )}

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-[#000033] text-white transition-colors shadow-sm rounded-none hover:bg-[#000055] whitespace-nowrap"
          >
            <Image
              src="/filtersicon/filter-add.png"
              alt="Filter"
              width={16}
              height={16}
              className="w-4 h-4"
            />
            <span className="text-sm font-medium cursor-pointer">Advanced Filters</span>
            {showFilters ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>

          <button
            onClick={handleResetFilters}
            className="flex items-center cursor-pointer gap-2 px-4 py-2 bg-[#000033] text-white transition-colors shadow-sm rounded-none hover:bg-[#000055] whitespace-nowrap"
            title="Reset All Filters"
          >
            <Image
              src="/filtersicon/filter-remove.png"
              alt="Reset"
              width={18}
              height={18}
              className="w-4.5 h-4.5"
            />
            <span className="text-sm font-medium">Reset Filters</span>
          </button>
        </div>
      </div>

      {/* Advanced Filters Section */}
      {showFilters && (
        <div className="grid grid-cols-4 gap-0.5 mt-1">
          <InclusionFilter
            inclusions={inclusions}
            onInclusionChange={setInclusions}
            className="ml-13 mr-5"
            
          />
          <KeySymbolFilter
            filters={keySymbolFilters}
            onFiltersChange={setKeySymbolFilters}
            className="ml-17 mr-5"
          />
          <div className="ml-20">
              <PriceLocationFilter
                filters={priceLocationFilters}
                onFiltersChange={setPriceLocationFilters}
            />
          </div>
        <div className="ml-5">
          <MeasurementFilter
            measurements={measurements}
            onMeasurementChange={setMeasurements}
          />
          </div>
         
        </div>
      )}

      {/* Table or Grid View */}
      {viewMode === "list" ? (
        <DiamondStockTable
          searchTerm={searchTerm}
          selectedShape={selectedShape}
          selectedColor={selectedColor}
          selectedMinCarat={selectedCaratRanges.length === 1 ? selectedCaratRanges[0].min : ""}
          selectedMaxCarat={selectedCaratRanges.length === 1 ? selectedCaratRanges[0].max : ""}
          selectedFluor={selectedFluor}
          selectedClarity={selectedClarity}
          selectedCut={selectedCut}
          selectedPolish={selectedPolish}
          selectedSymmetry={selectedSymmetry}
          onSelectionChange={handleSelectionChange}
          priceFilters={priceLocationFilters}
          selectedLocations={priceLocationFilters.locations}
          selectedLabs={priceLocationFilters.labs}
          keySymbolFilters={keySymbolFilters}
          inclusionFilters={inclusions}
          measurementFilters={{
            length: measurements.length,
            width: measurements.width,
            depth: measurements.depth,
            table: measurements.table,
            depthPercent: measurements.depthPercent,
            pavAngle: measurements.pavAngle,
            pavHeight: measurements.pavHeight,
            crAngle: measurements.crAngle,
            crHeight: measurements.crHeight,
          }}
          pageSize={10}
          clearSelectionTrigger={clearSelectionTrigger}
        />
      ) : (
        <DiamondGridView
          searchTerm={searchTerm}
          selectedShape={selectedShape}
          selectedColor={selectedColor}
          selectedMinCarat={selectedCaratRanges.length === 1 ? selectedCaratRanges[0].min : ""}
          selectedMaxCarat={selectedCaratRanges.length === 1 ? selectedCaratRanges[0].max : ""}
          selectedFluor={selectedFluor}
          selectedClarity={selectedClarity}
          selectedCut={selectedCut}
          selectedPolish={selectedPolish}
          selectedSymmetry={selectedSymmetry}
          keySymbolFilters={keySymbolFilters}
          pageSize={10}
        />
      )}

        {/* Comparison Modal */}
        {showComparison && (
          <DiamondComparisonPage
            diamonds={compareDiamonds}
            onClose={() => {
              setShowComparison(false);
              setCompareDiamonds([]);
            }}
          />
        )}
      </div>

      {/* Mobile Layout - Visible only on Mobile */}
      <div className="lg:hidden flex flex-col min-h-screen max-h-screen overflow-hidden bg-[#F5F7FA]">
        {/* Top Controls - Mobile */}
        <div className="px-1.5 py-1.5 bg-gray-100 border-b sticky top-0 z-20 rounded-lg">
          <div className="flex items-center gap-1.5 justify-between mt-20">
            {/* View Toggle Button */}
            <button
              onClick={toggleView}
              className="bg-white border border-gray-300 text-black rounded-full h-7 w-7 p-0 flex items-center justify-center min-w-0 hover:bg-gray-50 flex-shrink-0"
            >
              {viewMode === "list" ? (
                <Grid3x3 className="w-3 h-3" />
              ) : (
                <List className="w-3 h-3" />
              )}
            </button>

            {/* Search with Button Inside */}
            <div className="flex-1 min-w-0 relative">
              <input
                type="text"
                placeholder="Diamond ID"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-full h-7 text-[10px] pr-7 pl-2.5 placeholder:text-[10px] placeholder:text-gray-400 focus:placeholder:text-gray-400"
                style={{ color: '#222', background: '#fff' }}
              />
              <button
                onClick={() => handleSearch(searchTerm)}
                className="absolute right-0.5 top-1/2 -translate-y-1/2 rounded-full h-5.5 w-5.5 p-0 bg-black hover:bg-gray-800 text-white flex items-center justify-center min-w-0"
              >
                <Search className="h-2.5 w-2.5" />
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="bg-white border border-gray-300 rounded-full h-7 w-7 p-0 flex items-center justify-center min-w-0 hover:bg-gray-50"
                title="Refresh Inventory"
              >
                <RotateCcw className="w-3 h-3 text-black" />
              </button>

              {isLoggedIn && (
                <>
                  <AddToCartButton
                    selectedCount={selectedDiamonds.length}
                    selectedStoneNumbers={selectedDiamonds.map((d) => d.STONE_NO)}
                    onAddToCart={handleAddToCart}
                    iconOnly
                  />

                  <HoldButton
                    selectedCount={selectedDiamonds.length}
                    selectedStoneNumbers={selectedDiamonds.map((d) => d.STONE_NO)}
                    onAddToHold={handleAddToHold}
                    iconOnly
                  />
                </>
              )}

              <button
                onClick={handleCompare}
                disabled={selectedDiamonds.length < 2}
                className="bg-gray-700 hover:bg-gray-900 text-white rounded-full h-7 px-1.5 flex items-center gap-0.5 disabled:opacity-50 min-w-0"
              >
                <GitCompare className="w-3 h-3" />
              </button>

              <button
                onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                className={`rounded-full h-7 w-7 p-0 flex items-center justify-center min-w-0 ${
                  mobileFiltersOpen
                    ? "bg-black hover:bg-gray-800 text-white"
                    : "bg-white hover:bg-gray-50 text-black border border-gray-300"
                }`}
              >
                <Filter className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Two Column Layout - Mobile */}
        <div className="flex flex-1 min-h-0 overflow-hidden">
          {/* Left Column - Filter Sidebar (Conditional) */}
          {mobileFiltersOpen && (
            <div className="w-1/2 border-r overflow-y-auto bg-white max-h-full">
              <div className="space-y-2 p-2 pt-0">
                <ShapeFilter
                  selectedShape={selectedShape}
                  onShapeChange={handleShapeChange}
                />
                <CaratFilter
                  selectedCaratRanges={selectedCaratRanges}
                  onCaratChange={handleCaratChange}
                />
                <ClarityFilter
                  selectedClarity={selectedClarity}
                  selectedSpecial={selectedSpecial}
                  selectedCut={selectedCut}
                  selectedPolish={selectedPolish}
                  selectedSymmetry={selectedSymmetry}
                  onClarityChange={handleClarityChange}
                  onSpecialChange={handleSpecialChange}
                  onCutChange={handleCutChange}
                  onPolishChange={handlePolishChange}
                  onSymmetryChange={handleSymmetryChange}
                />
                <FluorFilter
                  selectedFluor={selectedFluor}
                  onFluorChange={handleFluorChange}
                />
                <ColorFilter
                  selectedColor={selectedColor}
                  onColorChange={handleColorChange}
                />
                {showFilters && (
                  <>
                    <InclusionFilter
                      inclusions={inclusions}
                      onInclusionChange={setInclusions}
                    />
                    <KeySymbolFilter
                      filters={keySymbolFilters}
                      onFiltersChange={setKeySymbolFilters}
                    />
                    <PriceLocationFilter
                      filters={priceLocationFilters}
                      onFiltersChange={setPriceLocationFilters}
                    />
                    <MeasurementFilter
                      measurements={measurements}
                      onMeasurementChange={setMeasurements}
                    />
                  </>
                )}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="w-full text-xs text-blue-600 hover:text-blue-800 mt-2"
                >
                  {showFilters ? "Hide Advanced Filters" : "Show Advanced Filters"}
                </button>
              </div>
            </div>
          )}

          {/* Right Column - Diamond Display */}
          <div
            className={`${
              mobileFiltersOpen ? "w-1/2" : "w-full"
            } flex-1 min-h-0 overflow-y-auto bg-white`}
          >
            <div>
              {viewMode === "list" ? (
                <div className="w-full overflow-x-auto max-w-full">
                  <DiamondStockTable
                    searchTerm={searchTerm}
                    selectedShape={selectedShape}
                    selectedColor={selectedColor}
                    selectedMinCarat={selectedCaratRanges.length === 1 ? selectedCaratRanges[0].min : ""}
                    selectedMaxCarat={selectedCaratRanges.length === 1 ? selectedCaratRanges[0].max : ""}
                    selectedFluor={selectedFluor}
                    selectedClarity={selectedClarity}
                    selectedCut={selectedCut}
                    selectedPolish={selectedPolish}
                    selectedSymmetry={selectedSymmetry}
                    onSelectionChange={handleSelectionChange}
                    priceFilters={priceLocationFilters}
                    selectedLocations={priceLocationFilters.locations}
                    selectedLabs={priceLocationFilters.labs}
                    keySymbolFilters={keySymbolFilters}
                    inclusionFilters={inclusions}
                    measurementFilters={{
                      length: measurements.length,
                      width: measurements.width,
                      depth: measurements.depth,
                      table: measurements.table,
                      depthPercent: measurements.depthPercent,
                      pavAngle: measurements.pavAngle,
                      pavHeight: measurements.pavHeight,
                      crAngle: measurements.crAngle,
                      crHeight: measurements.crHeight,
                    }}
                    pageSize={10}
                    clearSelectionTrigger={clearSelectionTrigger}
                  />
                </div>
              ) : (
                <DiamondGridView
                  searchTerm={searchTerm}
                  selectedShape={selectedShape}
                  selectedColor={selectedColor}
                  selectedMinCarat={selectedCaratRanges.length === 1 ? selectedCaratRanges[0].min : ""}
                  selectedMaxCarat={selectedCaratRanges.length === 1 ? selectedCaratRanges[0].max : ""}
                  selectedFluor={selectedFluor}
                  selectedClarity={selectedClarity}
                  selectedCut={selectedCut}
                  selectedPolish={selectedPolish}
                  selectedSymmetry={selectedSymmetry}
                  keySymbolFilters={keySymbolFilters}
                  pageSize={10}
                />
              )}
            </div>
          </div>
        </div>

        {/* Comparison Modal - Mobile */}
        {showComparison && (
          <DiamondComparisonPage
            diamonds={compareDiamonds}
            onClose={() => {
              setShowComparison(false);
              setCompareDiamonds([]);
            }}
          />
        )}
      </div>
    </div>
  );
}
