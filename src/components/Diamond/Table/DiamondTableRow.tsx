import React from "react";
import { formatPrice, formatPercentage } from "@/utils/formatting";
import type { DiamondData } from "@/types/diamond.types";

interface DiamondTableRowProps {
    diamond: DiamondData;
    index: number;
    isSelected: boolean;
    stickyOffsets: {
        checkbox: number;
        stockId: number;
        loc: number;
        status: number;
        shape: number;
        carat: number;
        color: number;
        clarity: number;
    };
    onCheckboxChange: (id: string, checked: boolean) => void;
    onStockIdClick: (e: React.MouseEvent, diamond: DiamondData) => void;
    isPublicApi?: boolean;
}

/**
 * DiamondTableRow Component
 * Renders a single row in the diamond table
 * Handles checkbox selection, sticky columns, and click events
 */
export const DiamondTableRow: React.FC<DiamondTableRowProps> = ({
    diamond,
    index,
    isSelected,
    stickyOffsets,
    onCheckboxChange,
    onStockIdClick,
    isPublicApi = false,
}) => {
    // Determine background color for alternating rows
    const backgroundColor = index % 2 === 1 ? "#faf6eb" : "white";
    const backgroundStyle =
        index % 2 === 1
            ? "linear-gradient(to right, #faf6eb 0%, #faf6eb 100%)"
            : "white";

    return (
        <tr
            style={{ background: backgroundStyle, border: "none" }}
            className="transition-opacity"
        >
            {/* Checkbox Column - Sticky */}
            {!isPublicApi && (
                <td
                    className="text-center"
                    style={{
                        position: "sticky",
                        left: stickyOffsets.checkbox,
                        zIndex: 20,
                        backgroundColor,
                        minWidth: "48px",
                        width: "48px",
                        maxWidth: "48px",
                        border: "none",
                        margin: 0,
                        padding: "4px 8px",
                    }}
                >
                    <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => {
                            e.stopPropagation();
                            onCheckboxChange(diamond._id, e.target.checked);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="w-4 h-4 cursor-pointer [accent-color:#050C3A]"
                    />
                </td>
            )}

            {/* Stock ID Column - Sticky */}
            <td
                className="text-[14px] text-gray-700 font-medium cursor-pointer hover:text-blue-600 hover:underline"
                onClick={(e) => onStockIdClick(e, diamond)}
                style={{
                    position: "sticky",
                    left: isPublicApi ? 0 : stickyOffsets.stockId,
                    zIndex: 20,
                    backgroundColor,
                    minWidth: "100px",
                    width: "100px",
                    maxWidth: "100px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    border: "none",
                    margin: 0,
                    padding: "4px 8px",
                }}
            >
                {diamond.STONE_NO}
            </td>

            {/* Location Column - Sticky */}
            {!isPublicApi && (
                <td
                    className="text-[14px] text-gray-700 text-center"
                    style={{
                        position: "sticky",
                        left: stickyOffsets.loc,
                        zIndex: 20,
                        backgroundColor,
                        minWidth: "50px",
                        width: "50px",
                        maxWidth: "50px",
                        whiteSpace: "nowrap",
                        border: "none",
                        margin: 0,
                        padding: "4px 8px",
                    }}
                >
                    {diamond.LOCATION}
                </td>
            )}

            {/* Status Column - Sticky */}
            {!isPublicApi && (
                <td
                    className="text-[14px] text-gray-700"
                    style={{
                        position: "sticky",
                        left: stickyOffsets.status,
                        zIndex: 20,
                        backgroundColor,
                        minWidth: "60px",
                        width: "60px",
                        maxWidth: "60px",
                        whiteSpace: "nowrap",
                        border: "none",
                        margin: 0,
                        padding: "4px 8px",
                    }}
                >
                    {diamond.STAGE}
                </td>
            )}

            {/* Shape Column - Sticky */}
            <td
                className="text-[14px] text-gray-700"
                style={{
                    position: "sticky",
                    left: isPublicApi ? 100 : stickyOffsets.shape,
                    zIndex: 20,
                    backgroundColor,
                    minWidth: "75px",
                    width: "75px",
                    maxWidth: "75px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    border: "none",
                    margin: 0,
                    padding: "4px 8px",
                }}
            >
                {diamond.SHAPE}
            </td>

            {/* Carat Column - Sticky */}
            <td
                className="text-[14px] text-gray-700"
                style={{
                    position: "sticky",
                    left: isPublicApi ? 175 : stickyOffsets.carat,
                    zIndex: 20,
                    backgroundColor,
                    minWidth: "64px",
                    width: "64px",
                    maxWidth: "64px",
                    whiteSpace: "nowrap",
                    border: "none",
                    margin: 0,
                    padding: "4px 8px",
                }}
            >
                {diamond.CARATS}
            </td>

            {/* Color Column - Sticky */}
            <td
                className="text-[14px] text-gray-700"
                style={{
                    position: "sticky",
                    left: isPublicApi ? 239 : stickyOffsets.color,
                    zIndex: 20,
                    backgroundColor,
                    minWidth: "64px",
                    width: "64px",
                    maxWidth: "64px",
                    whiteSpace: "nowrap",
                    border: "none",
                    margin: 0,
                    padding: "4px 8px",
                }}
            >
                {diamond.COLOR}
            </td>

            {/* Clarity Column - Sticky */}
            <td
                className="text-[14px] text-gray-700"
                style={{
                    position: "sticky",
                    left: isPublicApi ? 303 : stickyOffsets.clarity,
                    zIndex: 20,
                    backgroundColor,
                    minWidth: "100px",
                    width: "100px",
                    maxWidth: "100px",
                    whiteSpace: "nowrap",
                    border: "none",
                    margin: 0,
                    padding: "4px 8px",
                }}
            >
                {diamond.CLARITY}
            </td>

            {/* Regular Columns (Non-sticky) */}
            <td
                className="text-[14px] text-gray-700"
                style={{
                    width: "60px",
                    minWidth: "60px",
                    maxWidth: "60px",
                    whiteSpace: "nowrap",
                    border: "none",
                    margin: 0,
                    padding: "4px 8px",
                }}
            >
                {diamond.CUT || "N/A"}
            </td>
            <td
                className="text-[14px] text-gray-700"
                style={{
                    width: "100px",
                    minWidth: "100px",
                    maxWidth: "100px",
                    whiteSpace: "nowrap",
                    border: "none",
                    margin: 0,
                    padding: "4px 8px",
                }}
            >
                {diamond.POL || "N/A"}
            </td>
            <td
                className="text-[14px] text-gray-700"
                style={{
                    width: "60px",
                    minWidth: "60px",
                    maxWidth: "60px",
                    whiteSpace: "nowrap",
                    border: "none",
                    margin: 0,
                    padding: "4px 8px",
                }}
            >
                {diamond.SYM || "N/A"}
            </td>
            <td
                className="text-[14px] text-gray-700"
                style={{
                    width: "60px",
                    minWidth: "60px",
                    maxWidth: "60px",
                    whiteSpace: "nowrap",
                    border: "none",
                    margin: 0,
                    padding: "4px 8px",
                }}
            >
                {diamond.FLOUR || "N/A"}
            </td>
            <td
                className="text-[14px] text-gray-700"
                style={{
                    width: "60px",
                    minWidth: "60px",
                    maxWidth: "60px",
                    whiteSpace: "nowrap",
                    border: "none",
                    margin: 0,
                    padding: "4px 8px",
                }}
            >
                {diamond.LAB}
            </td>

            {/* Price Columns */}
            {!isPublicApi && (
                <>
                    <td
                        className="text-[14px] text-gray-700"
                        style={{
                            width: "90px",
                            minWidth: "90px",
                            maxWidth: "90px",
                            whiteSpace: "nowrap",
                            border: "none",
                            margin: 0,
                            padding: "4px 8px",
                        }}
                    >
                        {formatPrice(diamond.RAP_PRICE ?? 0)}
                    </td>
                    <td
                        className="text-[14px] font-semibold text-red-600"
                        style={{
                            width: "75px",
                            minWidth: "75px",
                            maxWidth: "75px",
                            whiteSpace: "nowrap",
                            border: "none",
                            margin: 0,
                            padding: "4px 8px",
                        }}
                    >
                        {formatPercentage(diamond.DISC_PER ?? 0)}
                    </td>
                    <td
                        className="text-[14px] text-gray-700"
                        style={{
                            width: "90px",
                            minWidth: "90px",
                            maxWidth: "90px",
                            whiteSpace: "nowrap",
                            border: "none",
                            margin: 0,
                            padding: "4px 8px",
                        }}
                    >
                        {formatPrice(diamond.NET_RATE ?? 0)}
                    </td>
                    <td
                        className="text-[14px] text-gray-700 font-medium"
                        style={{
                            width: "100px",
                            minWidth: "100px",
                            maxWidth: "100px",
                            whiteSpace: "nowrap",
                            border: "none",
                            margin: 0,
                            padding: "4px 8px",
                        }}
                    >
                        {formatPrice(diamond.NET_VALUE ?? 0)}
                    </td>
                </>
            )}

            {/* Additional Details Columns */}
            <td
                className="text-[14px] text-gray-700"
                style={{
                    width: "200px",
                    minWidth: "200px",
                    maxWidth: "200px",
                    border: "none",
                    margin: 0,
                    padding: "4px 8px",
                }}
                title={diamond.COMMENTS_1}
            >
                <div
                    style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                    }}
                >
                    {diamond.COMMENTS_1 || "N/A"}
                </div>
            </td>
            <td
                className="text-[14px] text-gray-700"
                style={{
                    width: "100px",
                    minWidth: "100px",
                    maxWidth: "100px",
                    whiteSpace: "nowrap",
                    border: "none",
                    margin: 0,
                    padding: "4px 8px",
                }}
            >
                {diamond.DEPTH_PER || "N/A"}
            </td>
            <td
                className="text-[14px] text-gray-700"
                style={{
                    width: "100px",
                    minWidth: "100px",
                    maxWidth: "100px",
                    whiteSpace: "nowrap",
                    border: "none",
                    margin: 0,
                    padding: "4px 8px",
                }}
            >
                {diamond.TABLE_PER || "N/A"}
            </td>
            <td
                className="text-[14px] text-gray-700"
                style={{
                    width: "100px",
                    minWidth: "100px",
                    maxWidth: "100px",
                    whiteSpace: "nowrap",
                    border: "none",
                    margin: 0,
                    padding: "4px 8px",
                }}
            >
                {diamond.LENGTH || "N/A"}
            </td>
            <td
                className="text-[14px] text-gray-700"
                style={{
                    width: "100px",
                    minWidth: "100px",
                    maxWidth: "100px",
                    whiteSpace: "nowrap",
                    border: "none",
                    margin: 0,
                    padding: "4px 8px",
                }}
            >
                {diamond.WIDTH || "N/A"}
            </td>
            <td
                className="text-[14px] text-gray-700"
                style={{
                    width: "100px",
                    minWidth: "100px",
                    maxWidth: "100px",
                    whiteSpace: "nowrap",
                    border: "none",
                    margin: 0,
                    padding: "4px 8px",
                }}
            >
                {diamond.DEPTH || "N/A"}
            </td>
            {!isPublicApi && (
                <td
                    className="text-[14px] text-gray-700"
                    style={{
                        width: "140px",
                        minWidth: "140px",
                        maxWidth: "140px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        border: "none",
                        margin: 0,
                        padding: "4px 8px",
                    }}
                >
                    {diamond.KEY_TO_SYMBOLS || "N/A"}
                </td>
            )}
            {!isPublicApi && (
                <td
                    className="text-[14px] text-gray-700"
                    style={{
                        width: "200px",
                        minWidth: "200px",
                        maxWidth: "200px",
                        border: "none",
                        margin: 0,
                        padding: "4px 8px",
                    }}
                    title={diamond.REPORT_COMMENTS}
                >
                    <div
                        style={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                        }}
                    >
                        {diamond.REPORT_COMMENTS || "N/A"}
                    </div>
                </td>
            )}
            <td
                className="text-[14px] text-gray-700"
                style={{
                    width: "110px",
                    minWidth: "110px",
                    maxWidth: "110px",
                    whiteSpace: "nowrap",
                    border: "none",
                    margin: 0,
                    padding: "4px 8px",
                }}
            >
                {diamond.CROWN_ANGLE || "N/A"}
            </td>
            <td
                className="text-[14px] text-gray-700"
                style={{
                    width: "120px",
                    minWidth: "120px",
                    maxWidth: "120px",
                    whiteSpace: "nowrap",
                    border: "none",
                    margin: 0,
                    padding: "4px 8px",
                }}
            >
                {diamond.CROWN_HEIGHT || "N/A"}
            </td>
            <td
                className="text-[14px] text-gray-700"
                style={{
                    width: "130px",
                    minWidth: "130px",
                    maxWidth: "130px",
                    whiteSpace: "nowrap",
                    border: "none",
                    margin: 0,
                    padding: "4px 8px",
                }}
            >
                {diamond.PAVILLION_ANGLE || "N/A"}
            </td>
            <td
                className="text-[14px] text-gray-700"
                style={{
                    width: "140px",
                    minWidth: "140px",
                    maxWidth: "140px",
                    whiteSpace: "nowrap",
                    border: "none",
                    margin: 0,
                    padding: "4px 8px",
                }}
            >
                {diamond.PAVILLION_HEIGHT || "N/A"}
            </td>
            {!isPublicApi && (
                <>
                    <td
                        className="text-[14px] text-gray-700"
                        style={{
                            width: "100px",
                            minWidth: "100px",
                            maxWidth: "100px",
                            whiteSpace: "nowrap",
                            border: "none",
                            margin: 0,
                            padding: "4px 8px",
                        }}
                    >
                        {diamond.CN || "N/A"}
                    </td>
                    <td
                        className="text-[14px] text-gray-700"
                        style={{
                            width: "100px",
                            minWidth: "100px",
                            maxWidth: "100px",
                            whiteSpace: "nowrap",
                            border: "none",
                            margin: 0,
                            padding: "4px 8px",
                        }}
                    >
                        {diamond.CW || "N/A"}
                    </td>
                    <td
                        className="text-[14px] text-gray-700"
                        style={{
                            width: "100px",
                            minWidth: "100px",
                            maxWidth: "100px",
                            whiteSpace: "nowrap",
                            border: "none",
                            margin: 0,
                            padding: "4px 8px",
                        }}
                    >
                        {diamond.SN || "N/A"}
                    </td>
                    <td
                        className="text-[14px] text-gray-700"
                        style={{
                            width: "100px",
                            minWidth: "100px",
                            maxWidth: "100px",
                            whiteSpace: "nowrap",
                            border: "none",
                            margin: 0,
                            padding: "4px 8px",
                        }}
                    >
                        {diamond.SW || "N/A"}
                    </td>
                    <td
                        className="text-[14px] text-gray-700"
                        style={{
                            width: "160px",
                            minWidth: "160px",
                            maxWidth: "160px",
                            whiteSpace: "normal",
                            wordBreak: "break-all",
                            border: "none",
                            margin: 0,
                            padding: "4px 8px",
                        }}
                    >
                        {diamond.REPORT_NO}
                    </td>
                </>
            )}
            <td
                className="text-[14px] text-gray-700"
                style={{
                    width: "110px",
                    minWidth: "110px",
                    maxWidth: "110px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    border: "none",
                    margin: 0,
                    padding: "4px 8px",
                }}
            >
                {diamond.REPORT_DATE
                    ? new Date(diamond.REPORT_DATE).toLocaleDateString()
                    : "N/A"}
            </td>
            {!isPublicApi && (
                <td
                    className="text-[14px] text-gray-700"
                    style={{
                        width: "110px",
                        minWidth: "110px",
                        maxWidth: "110px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        border: "none",
                        margin: 0,
                        padding: "4px 8px",
                    }}
                >
                    {diamond.TINGE || "N/A"}
                </td>
            )}
        </tr>
    );
};
