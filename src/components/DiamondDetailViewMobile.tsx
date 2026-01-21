"use client";

import React from "react";
import { DiamondData } from "@/types/diamond.types";
import {
    ArrowLeft,
    Video,
    FileText,
    ImageIcon,
    Hand,
    Grip,
    ShoppingCart,
    Clock,
    MessageSquare,
    Loader2,
} from "lucide-react";
import { DiamondMediaViewer } from "./Diamond/DiamondMediaViewer";
import Footer from "./Footer";

interface DiamondDetailViewMobileProps {
    diamond: DiamondData;
    onClose: () => void;
    isLoggedIn: boolean;
    userRole: string | null;
    selectedMediaTab: "image" | "video" | "hand" | "tweezer" | "certificate";
    setSelectedMediaTab: (tab: "image" | "video" | "hand" | "tweezer" | "certificate") => void;
    handleAddToCart: () => Promise<void>;
    handleAddToHold: () => Promise<void>;
    setIsEnquiryOpen: (isOpen: boolean) => void;
    handleLoginRedirect: () => void;
    isAddingToCart: boolean;
    isAddingToHold: boolean;
}

const DiamondDetailViewMobile: React.FC<DiamondDetailViewMobileProps> = ({
    diamond,
    onClose,
    isLoggedIn,
    userRole,
    selectedMediaTab,
    setSelectedMediaTab,
    handleAddToCart,
    handleAddToHold,
    setIsEnquiryOpen,
    handleLoginRedirect,
    isAddingToCart,
    isAddingToHold,
}) => {
    return (
        <div
            className="bg-white shadow-xl w-full h-full overflow-y-auto font-maven-pro"
            onClick={(e) => e.stopPropagation()}
            style={{ scrollbarWidth: "none", msOverflowStyle: "none", paddingTop: "88px" }}
        >
            {/* Mobile Container */}
            <div className="w-full">
                {/* Top Navigation Bar: Back Button + Media Tabs */}
                <div
                    className="flex flex-col gap-2 px-3 py-2 border-b border-[#C89E3A] bg-white"
                >
                    <button
                        onClick={onClose}
                        className="flex items-center gap-2 text-white transition-colors rounded px-3 py-1.5 font-medium bg-[#050C3A] hover:bg-[#030822] text-xs w-fit"
                    >
                        <ArrowLeft size={14} />
                        <span>BACK</span>
                    </button>
                    <div className="flex gap-1 overflow-x-auto pb-1" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
                        <button
                            onClick={() => setSelectedMediaTab("video")}
                            className={`px-3 py-1.5 text-xs font-medium flex items-center justify-center gap-1 border-b-2 transition-colors flex-shrink-0 ${
                                selectedMediaTab === "video"
                                    ? "border-[#050C3A] text-[#050C3A] bg-gray-50"
                                    : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                            }`}
                        >
                            <Video className="w-3.5 h-3.5" />
                            <span>Video</span>
                        </button>
                        <button
                            onClick={() => setSelectedMediaTab("certificate")}
                            className={`px-3 py-1.5 text-xs font-medium flex items-center justify-center gap-1 border-b-2 transition-colors flex-shrink-0 ${
                                selectedMediaTab === "certificate"
                                    ? "border-[#050C3A] text-[#050C3A] bg-gray-50"
                                    : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                            }`}
                        >
                            <FileText className="w-3.5 h-3.5" />
                            <span>Certificate</span>
                        </button>
                        <button
                            onClick={() => setSelectedMediaTab("image")}
                            className={`px-3 py-1.5 text-xs font-medium flex items-center justify-center gap-1 border-b-2 transition-colors flex-shrink-0 ${
                                selectedMediaTab === "image"
                                    ? "border-[#050C3A] text-[#050C3A] bg-gray-50"
                                    : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                            }`}
                        >
                            <ImageIcon className="w-3.5 h-3.5" />
                            <span>Image</span>
                        </button>
                        <button
                            onClick={() => setSelectedMediaTab("hand")}
                            className={`px-3 py-1.5 text-xs font-medium flex items-center justify-center gap-1 border-b-2 transition-colors flex-shrink-0 ${
                                selectedMediaTab === "hand"
                                    ? "border-[#050C3A] text-[#050C3A] bg-gray-50"
                                    : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                            }`}
                        >
                            <Hand className="w-3.5 h-3.5" />
                            <span>Hand</span>
                        </button>
                        <button
                            onClick={() => setSelectedMediaTab("tweezer")}
                            className={`px-3 py-1.5 text-xs font-medium flex items-center justify-center gap-1 border-b-2 transition-colors flex-shrink-0 ${
                                selectedMediaTab === "tweezer"
                                    ? "border-[#050C3A] text-[#050C3A] bg-gray-50"
                                    : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                            }`}
                        >
                            <Grip className="w-3.5 h-3.5" />
                            <span>Tweezer</span>
                        </button>
                    </div>
                </div>

                {/* Content Area - Mobile Single Column */}
                <div className="px-3 py-4">
                    {/* Media Display */}
                    <div className="mb-4">
                        <DiamondMediaViewer
                            selectedMediaTab={selectedMediaTab}
                            diamond={diamond}
                        />
                    </div>

                    {/* Title */}
                    <h1 className="text-base font-semibold text-gray-900 mb-2 leading-tight">
                        {diamond.SHAPE} {diamond.CARATS}ct {diamond.COLOR} {diamond.CLARITY} {diamond.CUT} {diamond.POL} {diamond.SYM} {diamond.TINGE}
                    </h1>

                    {/* Stock ID, Report, Lab */}
                    <div className="text-xs text-gray-600 mb-3">
                        <div>Stock ID: <span className="font-semibold text-gray-900">{diamond.STONE_NO}</span></div>
                        <div>Report #: <span className="font-semibold text-gray-900">{diamond.REPORT_NO}</span></div>
                        <div>Lab: <span className="font-semibold text-gray-900">{diamond.LAB}</span></div>
                    </div>

                    <div className="border-t border-[#C89E3A] mb-3" />

                    {/* Total Price - Only show if logged in */}
                    {isLoggedIn ? (
                        <>
                            <div className="mb-4">
                                <div className="text-xs text-gray-500 mb-1">Total Price</div>
                                <div className="text-2xl font-semibold text-gray-900">
                                    $
                                    {diamond.NET_VALUE
                                        ? diamond.NET_VALUE.toLocaleString("en-US", {
                                              minimumFractionDigits: 2,
                                              maximumFractionDigits: 2,
                                          })
                                        : "N/A"}
                                </div>
                                <div className="text-xs text-gray-600 mt-1">
                                    Rap Price:{" "}
                                    {diamond.RAP_PRICE
                                        ? `$${diamond.RAP_PRICE.toLocaleString("en-US", {
                                              minimumFractionDigits: 2,
                                              maximumFractionDigits: 2,
                                          })}`
                                        : "N/A"}{" "}
                                    | Disc %:{" "}
                                    {diamond.DISC_PER
                                        ? `${Number(diamond.DISC_PER).toFixed(2)}%`
                                        : "N/A"}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            {userRole !== "ADMIN" && userRole !== "SUPER_ADMIN" && (
                                <div className="flex flex-col gap-2 mb-4">
                                    <button
                                        onClick={handleAddToCart}
                                        disabled={isAddingToCart}
                                        className="w-full px-4 py-2.5 bg-[#050C3A] text-white text-sm font-medium rounded hover:bg-[#030822] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {isAddingToCart ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Adding...
                                            </>
                                        ) : (
                                            <>
                                                <ShoppingCart className="w-4 h-4" />
                                                Add to Cart
                                            </>
                                        )}
                                    </button>
                                    <button
                                        onClick={handleAddToHold}
                                        disabled={isAddingToHold}
                                        className="w-full px-5 py-2.5 bg-[#050C3A] text-white text-sm font-medium rounded hover:bg-[#030822] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {isAddingToHold ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Adding...
                                            </>
                                        ) : (
                                            <>
                                                <Clock className="w-4 h-4" />
                                                Add to Hold
                                            </>
                                        )}
                                    </button>
                                    <button
                                        onClick={() => setIsEnquiryOpen(true)}
                                        className="w-full px-4 py-2.5 bg-[#050C3A] text-white text-sm font-medium rounded hover:bg-[#030822] transition-colors flex items-center justify-center gap-2"
                                    >
                                        <MessageSquare className="w-4 h-4" />
                                        Enquiry
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded p-3">
                            <p className="text-xs text-gray-700">
                                Please{" "}
                                <button
                                    onClick={handleLoginRedirect}
                                    className="text-[#050C3A] underline hover:text-[#030822]"
                                >
                                    log in
                                </button>{" "}
                                to view pricing information.
                            </p>
                        </div>
                    )}

                    <div className="border-t border-[#C89E3A] mb-3" />

                    {/* Diamond Specifications */}
                    <div className="mb-4">
                        <h3 className="font-semibold text-sm text-gray-900 mb-3">Diamond Specifications</h3>
                        <div className="grid grid-cols-2 gap-3 text-xs">
                            <div>
                                <div className="text-gray-500 mb-0.5">Shape</div>
                                <div className="font-medium text-gray-900">{diamond.SHAPE || "N/A"}</div>
                            </div>
                            <div>
                                <div className="text-gray-500 mb-0.5">Carat</div>
                                <div className="font-medium text-gray-900">{diamond.CARATS || "N/A"}</div>
                            </div>
                            <div>
                                <div className="text-gray-500 mb-0.5">Color</div>
                                <div className="font-medium text-gray-900">{diamond.COLOR || "N/A"}</div>
                            </div>
                            <div>
                                <div className="text-gray-500 mb-0.5">Clarity</div>
                                <div className="font-medium text-gray-900">{diamond.CLARITY || "N/A"}</div>
                            </div>
                            <div>
                                <div className="text-gray-500 mb-0.5">Cut</div>
                                <div className="font-medium text-gray-900">{diamond.CUT || "N/A"}</div>
                            </div>
                            <div>
                                <div className="text-gray-500 mb-0.5">Polish</div>
                                <div className="font-medium text-gray-900">{diamond.POL || "N/A"}</div>
                            </div>
                            <div>
                                <div className="text-gray-500 mb-0.5">Symmetry</div>
                                <div className="font-medium text-gray-900">{diamond.SYM || "N/A"}</div>
                            </div>
                            <div>
                                <div className="text-gray-500 mb-0.5">Fluorescence</div>
                                <div className="font-medium text-gray-900">
                                    {diamond.FLOUR || "N/A"}
                                </div>
                            </div>
                            <div>
                                <div className="text-gray-500 mb-0.5">Tinge</div>
                                <div className="font-medium text-gray-900">
                                    {diamond.TINGE || "N/A"}
                                </div>
                            </div>
                            <div>
                                <div className="text-gray-500 mb-0.5">Lab</div>
                                <div className="font-medium text-gray-900">
                                    {diamond.LAB || "N/A"}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Measurements - Mobile */}
                    {isLoggedIn && (
                        <>
                            <div className="border-t border-[#C89E3A] mb-3" />
                            <div className="mb-4">
                                <h3 className="font-semibold text-sm text-gray-900 mb-3">Measurements</h3>
                                <div className="grid grid-cols-2 gap-3 text-xs">
                                    <div>
                                        <div className="text-gray-500 mb-0.5">Length</div>
                                        <div className="font-medium text-gray-900">{diamond.LENGTH || "N/A"} mm</div>
                                    </div>
                                    <div>
                                        <div className="text-gray-500 mb-0.5">Width</div>
                                        <div className="font-medium text-gray-900">{diamond.WIDTH || "N/A"} mm</div>
                                    </div>
                                    <div>
                                        <div className="text-gray-500 mb-0.5">Depth</div>
                                        <div className="font-medium text-gray-900">{diamond.DEPTH || "N/A"} mm</div>
                                    </div>
                                    <div>
                                        <div className="text-gray-500 mb-0.5">Crown Height</div>
                                        <div className="font-medium text-gray-900">{diamond.CROWN_HEIGHT || "N/A"}%</div>
                                    </div>
                                    <div>
                                        <div className="text-gray-500 mb-0.5">Pavilion Angle</div>
                                        <div className="font-medium text-gray-900">{diamond.PAVILLION_ANGLE || "N/A"}°</div>
                                    </div>
                                    <div>
                                        <div className="text-gray-500 mb-0.5">Crown Angle</div>
                                        <div className="font-medium text-gray-900">{diamond.CROWN_ANGLE || "N/A"}°</div>
                                    </div>
                                    <div>
                                        <div className="text-gray-500 mb-0.5">Depth %</div>
                                        <div className="font-medium text-gray-900">{diamond.DEPTH_PER || "N/A"}%</div>
                                    </div>
                                    <div>
                                        <div className="text-gray-500 mb-0.5">Pavilion Height</div>
                                        <div className="font-medium text-gray-900">{diamond.PAVILLION_HEIGHT || "N/A"}%</div>
                                    </div>
                                    <div>
                                        <div className="text-gray-500 mb-0.5">Table</div>
                                        <div className="font-medium text-gray-900">{diamond.TABLE_PER || "N/A"}%</div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Inclusion Details - Mobile */}
                    {isLoggedIn && (
                        <>
                            <div className="border-t border-[#C89E3A] mb-3" />
                            <div className="mb-4">
                                <h3 className="font-semibold text-sm text-gray-900 mb-3">Inclusion Details</h3>
                                <div className="grid grid-cols-2 gap-3 text-xs">
                                    <div>
                                        <div className="text-gray-500 mb-0.5">Crown White</div>
                                        <div className="font-medium text-gray-900">{diamond.CW || "N/A"}</div>
                                    </div>
                                    <div>
                                        <div className="text-gray-500 mb-0.5">Center Natts</div>
                                        <div className="font-medium text-gray-900">{diamond.CN || "N/A"}</div>
                                    </div>
                                    <div>
                                        <div className="text-gray-500 mb-0.5">Comments</div>
                                        <div className="font-medium text-gray-900">{diamond.COMMENTS_1 || "N/A"}</div>
                                    </div>
                                    <div>
                                        <div className="text-gray-500 mb-0.5">Side Effect</div>
                                        <div className="font-medium text-gray-900">{diamond.SW || "N/A"}</div>
                                    </div>
                                    <div>
                                        <div className="text-gray-500 mb-0.5">Table Inclusion</div>
                                        <div className="font-medium text-gray-900">{diamond.SN || "N/A"}</div>
                                    </div>
                                    <div>
                                        <div className="text-gray-500 mb-0.5">Shade</div>
                                        <div className="font-medium text-gray-900">{((diamond as DiamondData & { SHADE?: string }).SHADE) || "N/A"}</div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Additional Information - Mobile */}
                    {isLoggedIn && (
                        <>
                            <div className="border-t border-[#C89E3A] mb-3" />
                            <div className="bg-white border border-[#C89E3A] overflow-hidden mb-4">
                                <div className="bg-[#050C3A] text-white px-3 py-2">
                                    <h3 className="font-semibold text-xs">Additional Information</h3>
                                </div>
                                <div className="p-3 space-y-2 text-xs">
                                    <div className="flex justify-between items-center border-b border-[#C89E3A] pb-2">
                                        <span className="text-gray-600">Location</span>
                                        <span className="font-medium text-gray-900">{diamond.LOCATION || "N/A"}</span>
                                    </div>
                                    <div className="flex justify-between items-center border-b border-[#C89E3A] pb-2">
                                        <span className="text-gray-600">Net Rate</span>
                                        <span className="font-medium text-gray-900">
                                            {diamond.NET_RATE || "N/A"}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center border-b border-[#C89E3A] pb-2">
                                        <span className="text-gray-600">Net Value</span>
                                        <span className="font-medium text-gray-900">
                                            {diamond.NET_VALUE
                                                ? `$${diamond.NET_VALUE.toLocaleString("en-US", {
                                                      minimumFractionDigits: 2,
                                                      maximumFractionDigits: 2,
                                                  })}`
                                                : "N/A"}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Stage</span>
                                        <span className="font-medium text-gray-900">
                                            {diamond.STAGE || "N/A"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Footer */}
                <Footer />
            </div>
        </div>
    );
};

export default DiamondDetailViewMobile;
