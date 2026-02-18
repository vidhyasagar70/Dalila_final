/**
 * User Types ,Types for user data and authentication
 */

// User interface
export interface User {
  _id?: string;
  id: string;
  username?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  isVerified?: boolean;
  kycStatus?: string;
  status?: string;
  role?: string;
  customerData?: CustomerData;
  [key: string]: unknown;
}

// Customer data for KYC
export interface CustomerData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  countryCode: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  businessInfo: {
    companyName: string;
    businessType: string;
    vatNumber: string;
    websiteUrl?: string;
  };
  submittedAt?: string;
}

// Login credentials
export interface LoginCredentials {
  email: string;
  password: string;
}

// Registration data
export interface RegistrationData {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

// Auth response
export interface AuthResponse {
  success: boolean;
  data?: {
    user: User;
    token: string;
  };
  message?: string;
  error?: string;
}

// Cart item
export interface CartItem {
  stoneNo: string;
  diamond?: unknown;
  addedAt?: string;
  _id?: string;
  [key: string]: unknown;
}

// Cart response
export interface CartResponse {
  cart: {
    items: Array<{
      stoneNo: string;
      diamond: unknown;
      addedAt: string;
      _id: string;
    }>;
    _id: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
  };
  totalItems: number;
}

// Quotation
export interface Quotation {
  id: string;
  stoneNumbers: string[];
  message: string;
  urgency?: string;
  status?: string;
  [key: string]: unknown;
}

// Blog
export interface Blog {
  _id: string;
  title: string; // H1 Title - Blog Title
  h2Subtitle?: string; // H2 Subtitle - Blog Subtitle
  customSlug?: string; // Custom slug (optional - auto-generated from title if empty)
  featuredImage?: string; // Featured image URL
  description: string; // Kept for backward compatibility
  content?: string; // Rich text content
  metaTitle?: string; // Meta title (optional)
  metaDescription?: string; // Meta description (optional)
  authorId: string;
  authorName: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Blog pagination
export interface BlogPaginationData {
  data: Blog[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalRecords: number;
    recordsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}


