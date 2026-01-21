// @/types/Diamondtable.ts
import { type InclusionFilters } from "../components/Filters/InclusionFilter";
import { type PriceLocationFilters } from "../components/Filters/PriceAndLocationFilter";

export interface DiamondData {
  _id: string;
  STONE_NO: string;
  SHAPE: string;
  CARATS: number;
  COLOR: string;
  MP4?: string;
  HA?: string;
  CLARITY: string;
  CUT?: string;
  POL?: string;
  SYM?: string;
  FLOUR?: string;
  LAB: string;
  REPORT_NO: string;
  REPORT_DATE?: string;
  MEASUREMENTS?: string;
  TABLE_PER?: number;
  DEPTH_PER?: number;
  CROWN_ANGLE?: number;
  CROWN_HEIGHT?: number;
  PAVILLION_ANGLE?: number;
  PAVILLION_HEIGHT?: number;
  RAP_PRICE: number;
  DISC_PER: number;
    // ...existing fields...
    CERTI_PDF?: string;
    NET_RATE?: string;
  NET_VALUE: number;
  LOCATION: string;
  STAGE: string;
  TINGE?: string;
  CN?: string;
  CW?: string;
  SN?: string;
  SW?: string;
  RATIO?: number | string;
  KEY_TO_SYMBOLS?: string;
  COMMENTS_1?: string;
  REPORT_COMMENTS?: string;
  REAL_IMAGE?: string;
  SIZE?: number;
  EY_CLN?: string;
  H_AND_A?: string;
  priceFilters?: string;
  LENGTH?: string;
  WIDTH?: string;
  DEPTH?: string;
}

export interface FilterParams {
    lengthMin?: number;
    lengthMax?: number;
    widthMin?: number;
    widthMax?: number;
    depthMin?: number;
    depthMax?: number;
  shape?: string;
  color?: string;
  limit?: number;
  page?: number;
  minCarats?: number;
  maxCarats?: number;
  fluorescence?: string;
  clarity?: string;
  cut?: string;
  polish?: string;
  symmetry?: string;
  searchTerm?: string;
  lab?: string;
  location?: string;
  priceLocationFilters?: string;
  CN?: string;
  CW?: string;
  SN?: string;
  SW?: string;
  keyToSymbols?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";

  netRateMin?: number;
  netRateMax?: number;
  netValueMin?: number;
  netValueMax?: number;
  discPerMin?: number;
  discPerMax?: number;
  
  tablePerMin?: number;
  tablePerMax?: number;
  pavillionAngleMin?: number;
  pavillionAngleMax?: number;
  pavillionHeightMin?: number;
  pavillionHeightMax?: number;
  depthPerMin?: number;
  depthPerMax?: number;
  crownAngleMin?: number;
  crownAngleMax?: number;
  crownHeightMin?: number;
  crownHeightMax?: number;
}

// For DiamondStockTable component
export interface TableProps {
  pageSize?: number;
  onRowClick?: (diamond: DiamondData) => void;
  searchTerm?: string;
  selectedShape?: string[];
  selectedColor?: string[];
  selectedMinCarat?: string;
  selectedMaxCarat?: string;
  selectedFluor?: string[];
  selectedClarity?: string[];
  selectedCut?: string;
  selectedPolish?: string;
  selectedSymmetry?: string;
  onSelectionChange?: (selectedIds: string[], diamonds: DiamondData[]) => void;
  inclusionFilters?: InclusionFilters;
  priceLocationFilters?: PriceLocationFilters;
  selectedLocations?: string[];
  selectedLabs?: string[];
  keySymbolFilters?: KeySymbolFilters;
  priceFilters?: {
    pricePerCarat: { from: string; to: string };
    discount: { from: string; to: string };
    totalPrice: { from: string; to: string };
  };
  measurementFilters?: {
    length: { from: string; to: string };
    width: { from: string; to: string };
    depth: { from: string; to: string };
    table: { from: string; to: string };
    depthPercent: { from: string; to: string };
    crAngle: { from: string; to: string };
    pavAngle: { from: string; to: string };
    crHeight: { from: string; to: string };
    pavHeight: { from: string; to: string };
  };
  clearSelectionTrigger?: number;
}
export interface KeySymbolFilters {
  keyToSymbol: string[];
}

// For DiamondGridView component
export interface GridViewProps {
  pageSize?: number;
  onRowClick?: (diamond: DiamondData) => void;
  searchTerm?: string;
  selectedShape?: string[];
  selectedColor?: string[];
  selectedMinCarat?: string;
  selectedMaxCarat?: string;
  selectedFluor?: string[];
  selectedClarity?: string[];
  selectedCut?: string;
  selectedPolish?: string;
  selectedSymmetry?: string;
  inclusions?: InclusionFilters;
  selectedLocations?: string[];
  selectedLabs?: string[];
  keySymbolFilters?: {
    keyToSymbol: string[];
  };
  inclusionFilters?: {
    centerBlack: string[];
    centerWhite: string[];
    sideBlack: string[];
    sideWhite: string[];
  };
  priceFilters?: {
    pricePerCarat: { from: string; to: string };
    discount: { from: string; to: string };
    totalPrice: { from: string; to: string };
  };
}

// API Response types
export interface DiamondApiResponse {
  success: boolean;
  data?: DiamondData[] | { diamonds: DiamondData[] };
  message?: string;
}

export interface CartApiResponse {
  success: boolean;
  message?: string;
  data?: {
    [key: string]: unknown;
  };
}

export interface MeasurementFilters {
  length: { from: string; to: string };
  width: { from: string; to: string };
  depth: { from: string; to: string };
  table: { from: string; to: string };
  depthPercent: { from: string; to: string };
  crAngle: { from: string; to: string };
  pavAngle: { from: string; to: string };
  crHeight: { from: string; to: string };
  pavHeight: { from: string; to: string };
}