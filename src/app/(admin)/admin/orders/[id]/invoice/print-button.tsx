"use client";

import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PrintButton() {
  return (
    <Button
      variant="primary"
      size="sm"
      className="gap-2 font-bold"
      onClick={() => window.print()}
    >
      <Printer className="w-4 h-4" />
      طباعة أو حفظ بتنسيق PDF
    </Button>
  );
}
