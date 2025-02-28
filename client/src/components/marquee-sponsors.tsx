import { Building2 } from "lucide-react";

export function MarqueeSponsors() {
  return (
    <div className="w-full bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 py-3">
      <div className="flex items-center justify-center gap-4">
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
          <Building2 className="h-5 w-5 text-blue-500" />
          <span className="font-medium text-blue-700">GoblueDigital</span>
          <span className="text-blue-500">- Parceiro Oficial de Transformação Digital</span>
        </div>
        <div className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white px-4 py-2 rounded-full">
          50% de desconto na primeira contratação!
        </div>
      </div>
    </div>
  );
}