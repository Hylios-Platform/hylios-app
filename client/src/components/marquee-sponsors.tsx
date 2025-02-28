import { Building2 } from "lucide-react";

export function MarqueeSponsors() {
  return (
    <div className="w-full bg-blue-50/50 py-2">
      <div className="flex items-center justify-center space-x-2">
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-blue-500" />
          <span className="text-sm font-medium text-blue-700">GoblueDigital</span>
        </div>
        <span className="text-sm text-blue-500">•</span>
        <span className="text-sm text-blue-600">50% off na primeira contratação</span>
      </div>
    </div>
  );
}