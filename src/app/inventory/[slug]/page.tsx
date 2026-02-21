"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function InventorySlugPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to inventory page since diamond details are shown in modal
    router.replace("/inventory");
  }, [router]);

  return null;
}
