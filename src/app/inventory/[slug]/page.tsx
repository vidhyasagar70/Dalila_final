"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { diamondApi } from "@/lib/api";
import type { DiamondData } from "@/types/diamond.types";
import DiamondDetailView from "@/components/DiamondDetailView";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Loader2 } from "lucide-react";

export default function DiamondDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [diamond, setDiamond] = useState<DiamondData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const stoneNo = params.slug as string;

  useEffect(() => {
    const fetchDiamond = async () => {
      if (!stoneNo) {
        setError("Invalid diamond ID");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Use search API with searchTerm to find diamond by STONE_NO
        const response = await diamondApi.search({ 
          searchTerm: decodeURIComponent(stoneNo),
          limit: 1 
        });
        
        if (response?.success && response?.data?.diamonds && response.data.diamonds.length > 0) {
          setDiamond(response.data.diamonds[0] as unknown as DiamondData);
          setError(null);
        } else {
          setError("Diamond not found");
        }
      } catch (err) {
        console.error("Error fetching diamond:", err);
        setError("Failed to load diamond details");
      } finally {
        setLoading(false);
      }
    };

    fetchDiamond();
  }, [stoneNo]);

  const handleClose = () => {
    router.push("/inventory");
  };

  if (loading) {
    return (
      <ProtectedRoute requireAuth={true} redirectTo="/login">
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 animate-spin text-[#050C3A]" />
            <p className="text-gray-700 font-medium">Loading diamond details...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error || !diamond) {
    return (
      <ProtectedRoute requireAuth={true} redirectTo="/login">
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 flex flex-col items-center gap-4 max-w-md">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <span className="text-2xl">⚠️</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              {error || "Diamond not found"}
            </h2>
            <p className="text-gray-600 text-center">
              The diamond you&apos;re looking for doesn&apos;t exist or has been removed.
            </p>
            <button
              onClick={handleClose}
              className="mt-4 px-6 py-2 bg-[#050C3A] text-white rounded hover:bg-[#030822] transition-colors"
            >
              Back to Inventory
            </button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requireAuth={true} redirectTo="/login">
      <DiamondDetailView diamond={diamond} onClose={handleClose} />
    </ProtectedRoute>
  );
}
