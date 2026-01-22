import React, { useState } from "react";
import { Clock, Loader2 } from "lucide-react";
import { holdApi, getAuthToken } from "@/lib/api";
import toast from "react-hot-toast";

interface HoldButtonProps {
  selectedCount: number;
  selectedStoneNumbers: string[];
  onAddToHold?: () => void;
  iconOnly?: boolean;
}

const HoldButton: React.FC<HoldButtonProps> = ({
  selectedCount,
  selectedStoneNumbers,
  onAddToHold,
  iconOnly = false,
}) => {
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToHold = async () => {
    // Check authentication first
    const token = getAuthToken();

    if (!token || token.trim() === "") {
      toast.error(
        "Please login to add items to hold. Your session may have expired.",
        {
          duration: 4000,
        },
      );

      // Dispatch unauthorized event to trigger login redirect
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("unauthorized_access"));
      }

      return;
    }

    if (selectedStoneNumbers.length === 0) {
      toast.error("Please select at least one diamond", {
        duration: 3000,
      });
      return;
    }

    try {
      setIsAdding(true);

      // Add all selected diamonds to hold
      const results = await Promise.allSettled(
        selectedStoneNumbers.map((stoneNo) => {
          return holdApi.add(stoneNo);
        }),
      );

      // Analyze results
      const successful = results.filter((r) => {
        if (r.status === "fulfilled") {
          const value = r.value as {
            success?: boolean;
            error?: string;
            message?: string;
          };
          return value?.success === true;
        }
        return false;
      });

      const failed = results.length - successful.length;

      // Collect backend messages
      const backendMessages = results
        .filter((r) => r.status === "fulfilled")
        .map((r) => {
          const value = r.value as { message?: string };
          return value?.message;
        })
        .filter(Boolean);

      // Check if any failures were due to authentication
      const authErrors = results.filter((r) => {
        if (r.status === "rejected") {
          const error = r.reason;
          return (
            error?.response?.status === 401 ||
            error?.message?.includes("Invalid token") ||
            error?.message?.includes("Unauthorized")
          );
        }
        return false;
      });

      if (authErrors.length > 0) {
        toast.error("Session expired. Please login again.", {
          duration: 4000,
        });

        // Clear potentially invalid token
        if (typeof window !== "undefined") {
          localStorage.removeItem("authToken");
          window.dispatchEvent(new CustomEvent("unauthorized_access"));
        }

        return;
      }

      if (successful.length > 0) {
        // Use backend message if available
        const displayMessage =
          backendMessages.length > 0 && backendMessages[0]
            ? backendMessages[0]
            : `${successful.length} diamond${successful.length > 1 ? "s" : ""} added to hold successfully!${failed > 0 ? ` (${failed} failed)` : ""}`;

        toast.success(displayMessage, {
          duration: 4000,
        });
      } else {
        // Get error message from rejected promises or fulfilled but failed responses
        const errorMessage =
          results
            .map((r) => {
              if (r.status === "rejected") {
                const reason = r.reason;
                return (
                  reason?.response?.data?.message ||
                  reason?.response?.data?.error ||
                  reason?.message
                );
              } else if (r.status === "fulfilled") {
                const value = r.value as {
                  success?: boolean;
                  message?: string;
                };
                if (!value?.success && value?.message) {
                  return value.message;
                }
              }
              return null;
            })
            .filter(Boolean)[0] ||
          "Failed to add diamonds to hold. Please try again.";

        toast.error(errorMessage, {
          duration: 3000,
        });
      }
    } catch (error) {
      // Enhanced error handling
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: {
            status?: number;
            data?: { error?: string; message?: string };
          };
        };

        if (axiosError.response?.status === 401) {
          toast.error("Session expired. Please login again.", {
            duration: 4000,
          });

          if (typeof window !== "undefined") {
            localStorage.removeItem("authToken");
            window.dispatchEvent(new CustomEvent("unauthorized_access"));
          }
        } else if (
          axiosError.response?.data?.error?.includes("Invalid token")
        ) {
          toast.error("Invalid session. Please login again.", {
            duration: 4000,
          });

          if (typeof window !== "undefined") {
            localStorage.removeItem("authToken");
            window.dispatchEvent(new CustomEvent("unauthorized_access"));
          }
        } else {
          // Use backend message if available
          const backendMessage =
            axiosError.response?.data?.message ||
            axiosError.response?.data?.error;
          toast.error(
            backendMessage || "An error occurred while adding to hold.",
            {
              duration: 4000,
            },
          );
        }
      } else {
        toast.error("Network error. Please check your connection.", {
          duration: 4000,
        });
      }
    } finally {
      setIsAdding(false);
      
      // Always clear selection after attempting to add, regardless of success/failure
      if (onAddToHold) {
        onAddToHold();
      }
    }
  };

  return (
    <button
      onClick={handleAddToHold}
      disabled={selectedCount === 0 || isAdding}
      className={`flex items-center justify-center cursor-pointer gap-2 text-white text-sm font-medium shadow-sm transition-colors ${
        iconOnly
          ? "rounded-full h-7 w-7 p-0 min-w-0"
          : "rounded-none px-3 py-2 w-[100px]"
      } ${
        selectedCount === 0 || isAdding
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-[#000033] hover:bg-[#000055]"
      }`}
      title={
        selectedCount === 0
          ? "Select diamonds to add to hold"
          : `Add ${selectedCount} diamond${selectedCount > 1 ? "s" : ""} to hold`
      }
    >
      {isAdding ? (
        <>
          <Loader2 className={iconOnly ? "h-3 w-3 animate-spin" : "h-4 w-4 animate-spin"} />
          {!iconOnly && "Adding..."}
        </>
      ) : (
        <>
          <Clock className={iconOnly ? "h-3 w-3" : "h-4 w-4"} />
          {!iconOnly && "Hold"}
        </>
      )}
    </button>
  );
};

export default HoldButton;
