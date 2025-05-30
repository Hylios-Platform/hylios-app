import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Job, europeanCountries } from "@shared/schema";
import { JobCard } from "@/components/job-card";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Search, MapPin, Coins, SlidersHorizontal, ArrowUpDown, LayoutGrid, LayoutList, Briefcase } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";

const EXCHANGE_RATES = {
  EUR: { EUR: 1, AED: 3.96 },
  AED: { EUR: 0.25, AED: 1 }
};

type SortOption = "recent" | "oldest" | "priceAsc" | "priceDesc";
type WorkType = "remote" | "onsite" | "hybrid" | "all";
type ViewMode = "list" | "grid";

export default function Jobs() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [currency, setCurrency] = useState<"EUR" | "AED">("EUR");
  const [selectedCountry, setSelectedCountry] = useState<string>("all");
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [workType, setWorkType] = useState<WorkType>("all");
  const [sortBy, setSortBy] = useState<SortOption>("recent");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [userSkills] = useState<string[]>((user?.profileData as any)?.skills || []);
  const [userLocation] = useState<string>((user?.profileData as any)?.location || 'Lisboa, Portugal');
  const [preferredWorkType] = useState<string>((user?.profileData as any)?.preferredWorkType || 'remote');

  const { data: jobs, isLoading } = useQuery<Job[]>({
    queryKey: ["/api/jobs"],
  });

  const applyMutation = useMutation({
    mutationFn: async (jobId: number) => {
      const res = await apiRequest("POST", `/api/jobs/${jobId}/apply`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/jobs"] });
      toast({
        title: "Sucesso",
        description: "Candidatura realizada com sucesso",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const convertCurrency = (amount: string, from: string, to: string) => {
    const value = parseFloat(amount);
    const rate = EXCHANGE_RATES[from as keyof typeof EXCHANGE_RATES][to as keyof typeof EXCHANGE_RATES];
    return (value * rate).toFixed(2);
  };

  const formatCurrency = (amount: string, currency: string) => {
    const value = parseFloat(amount);
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currency
    }).format(value);
  };

  const sortJobs = (jobs: Job[]) => {
    return [...jobs].sort((a, b) => {
      switch (sortBy) {
        case "recent":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "priceAsc":
          return parseFloat(a.amount) - parseFloat(b.amount);
        case "priceDesc":
          return parseFloat(b.amount) - parseFloat(a.amount);
        default:
          return 0;
      }
    });
  };

  const filteredJobs = jobs?.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.description.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = status === "all" || job.status === status;
    const matchesCountry = selectedCountry === "all" || job.country === selectedCountry;
    const matchesCity = selectedCity === "all" || job.city === selectedCity;
    const matchesWorkType = workType === "all" || job.workType === workType;
    const amount = parseFloat(job.amount);
    const matchesPriceRange = amount >= priceRange[0] && amount <= priceRange[1];

    return matchesSearch && matchesStatus && matchesCountry && 
           matchesCity && matchesWorkType && matchesPriceRange;
  })
  .map(job => ({
    ...job,
    displayAmount: formatCurrency(
      convertCurrency(job.amount, job.currency, currency),
      currency
    )
  }));

  const sortedJobs = filteredJobs ? sortJobs(filteredJobs) : [];

  const availableCountries = Object.keys(europeanCountries);
  const availableCities = selectedCountry === "all" ? [] : europeanCountries[selectedCountry as keyof typeof europeanCountries];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
      </div>
    );
  }

  const maxPrice = Math.max(...(jobs?.map(job => parseFloat(job.amount)) || [100000]));

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
              {t('jobs.title')}
            </h1>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode(viewMode === "list" ? "grid" : "list")}
                className="border-blue-100 hover:bg-blue-50"
              >
                {viewMode === "list" ? (
                  <LayoutGrid className="h-4 w-4" />
                ) : (
                  <LayoutList className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="grid gap-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 h-4 w-4" />
                <Input
                  placeholder={t('jobs.searchPlaceholder')}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 border-blue-100 focus:border-blue-200 bg-white text-gray-900"
                />
              </div>

              <Select value={currency} onValueChange={(val: "EUR" | "AED") => setCurrency(val)}>
                <SelectTrigger className="w-full md:w-[120px] border-blue-100 bg-white text-gray-900">
                  <Coins className="mr-2 h-4 w-4" />
                  <SelectValue className="text-gray-900" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EUR" className="text-gray-900">EUR</SelectItem>
                  <SelectItem value="AED" className="text-gray-900">AED</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Card className="border-blue-100 bg-blue-50/10 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-medium text-blue-500 flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4 text-blue-400" />
                  Filtros
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 p-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">{t('jobs.filterByPrice')}</label>
                  <div className="pt-2">
                    <Slider
                      defaultValue={[0, maxPrice]}
                      max={maxPrice}
                      step={100}
                      value={priceRange}
                      onValueChange={(value: [number, number]) => setPriceRange(value)}
                      className="w-full"
                    />
                    <div className="flex justify-between mt-2 text-sm text-gray-600">
                      <span>{formatCurrency(priceRange[0].toString(), currency)}</span>
                      <span>{formatCurrency(priceRange[1].toString(), currency)}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                    <SelectTrigger className="w-full border-gray-200 focus:border-blue-200 bg-white text-gray-900 text-base shadow-sm">
                      <MapPin className="mr-2 h-4 w-4 text-blue-400" />
                      <SelectValue placeholder="Selecione o país" className="text-gray-900" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px] overflow-y-auto bg-white">
                      <SelectItem value="all" className="text-gray-900 font-medium text-base py-2">Todos os países</SelectItem>

                      {/* Europa */}
                      <div className="mt-2 px-3 py-2 text-sm font-semibold text-blue-400 bg-gradient-to-r from-blue-50 to-transparent">Europa</div>
                      <SelectItem value="Portugal" className="text-gray-900 text-base py-2 px-3 hover:bg-blue-50/50">Portugal</SelectItem>
                      <SelectItem value="Espanha" className="text-gray-900 text-base py-2 px-3 hover:bg-blue-50/50">Espanha</SelectItem>
                      <SelectItem value="França" className="text-gray-900 text-base py-2 px-3 hover:bg-blue-50/50">França</SelectItem>
                      <SelectItem value="Alemanha" className="text-gray-900 text-base py-2 px-3 hover:bg-blue-50/50">Alemanha</SelectItem>
                      <SelectItem value="Itália" className="text-gray-900 text-base py-2 px-3 hover:bg-blue-50/50">Itália</SelectItem>
                      <SelectItem value="Reino Unido" className="text-gray-900 text-base py-2 px-3 hover:bg-blue-50/50">Reino Unido</SelectItem>
                      <SelectItem value="Holanda" className="text-gray-900 text-base py-2 px-3 hover:bg-blue-50/50">Holanda</SelectItem>
                      <SelectItem value="Bélgica" className="text-gray-900 text-base py-2 px-3 hover:bg-blue-50/50">Bélgica</SelectItem>
                      <SelectItem value="Suíça" className="text-gray-900 text-base py-2 px-3 hover:bg-blue-50/50">Suíça</SelectItem>
                      <SelectItem value="Irlanda" className="text-gray-900 text-base py-2 px-3 hover:bg-blue-50/50">Irlanda</SelectItem>
                      <SelectItem value="Suécia" className="text-gray-900 text-base py-2 px-3 hover:bg-blue-50/50">Suécia</SelectItem>
                      <SelectItem value="Noruega" className="text-gray-900 text-base py-2 px-3 hover:bg-blue-50/50">Noruega</SelectItem>
                      <SelectItem value="Dinamarca" className="text-gray-900 text-base py-2 px-3 hover:bg-blue-50/50">Dinamarca</SelectItem>
                      <SelectItem value="Finlândia" className="text-gray-900 text-base py-2 px-3 hover:bg-blue-50/50">Finlândia</SelectItem>
                      <SelectItem value="Áustria" className="text-gray-900 text-base py-2 px-3 hover:bg-blue-50/50">Áustria</SelectItem>

                      {/* Ocidente */}
                      <div className="mt-4 px-3 py-2 text-sm font-semibold text-blue-400 bg-gradient-to-r from-blue-50 to-transparent">Ocidente</div>
                      <SelectItem value="Estados Unidos" className="text-gray-900 text-base py-2 px-3 hover:bg-blue-50/50">Estados Unidos</SelectItem>
                      <SelectItem value="Canadá" className="text-gray-900 text-base py-2 px-3 hover:bg-blue-50/50">Canadá</SelectItem>
                      <SelectItem value="Austrália" className="text-gray-900 text-base py-2 px-3 hover:bg-blue-50/50">Austrália</SelectItem>
                      <SelectItem value="Nova Zelândia" className="text-gray-900 text-base py-2 px-3 hover:bg-blue-50/50">Nova Zelândia</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select 
                    value={selectedCity} 
                    onValueChange={setSelectedCity}
                    disabled={selectedCountry === "all"}
                  >
                    <SelectTrigger 
                      className={`w-full border-gray-200 focus:border-blue-200 bg-white text-gray-900 text-base shadow-sm
                        ${selectedCountry === "all" ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      <MapPin className="mr-2 h-4 w-4 text-blue-400" />
                      <SelectValue 
                        placeholder={selectedCountry === "all" 
                          ? "Selecione um país primeiro" 
                          : "Selecione a cidade"} 
                        className="text-gray-900" 
                      />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px] bg-white">
                      <SelectItem value="all" className="text-gray-900 font-medium text-base py-2">Todas as cidades</SelectItem>
                      {availableCities.map((city) => (
                        <SelectItem key={city} value={city} className="text-gray-900 text-base py-2 px-3 hover:bg-blue-50/50">
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={workType} onValueChange={(val: WorkType) => setWorkType(val)}>
                    <SelectTrigger className="w-full border-gray-200 focus:border-blue-200 bg-white text-gray-900 text-base shadow-sm">
                      <Briefcase className="mr-2 h-4 w-4 text-blue-400" />
                      <SelectValue placeholder={t('jobs.filterByType')} className="text-gray-900" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="all" className="text-gray-900 font-medium text-base py-2">Todos os tipos</SelectItem>
                      <SelectItem value="remote" className="text-gray-900 text-base py-2 px-3 hover:bg-blue-50/50">{t('jobs.workType.remote')}</SelectItem>
                      <SelectItem value="onsite" className="text-gray-900 text-base py-2 px-3 hover:bg-blue-50/50">{t('jobs.workType.onsite')}</SelectItem>
                      <SelectItem value="hybrid" className="text-gray-900 text-base py-2 px-3 hover:bg-blue-50/50">{t('jobs.workType.hybrid')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={viewMode}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "space-y-4"}
            >
              {sortedJobs?.length === 0 ? (
                <div className="text-center py-8 text-gray-600 bg-white rounded-lg border border-blue-100 shadow-sm">
                  {t('jobs.noJobs')}
                </div>
              ) : (
                sortedJobs?.map((job) => (
                  <motion.div
                    key={job.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <JobCard
                      job={job}
                      onApply={() => applyMutation.mutate(job.id)}
                      isPending={applyMutation.isPending}
                      userType={user?.userType || ""}
                      kycStatus={user?.kycStatus || ""}
                      displayAmount={job.displayAmount}
                      location={`${job.city}, ${job.country}`}
                      userSkills={userSkills}
                      userLocation={userLocation}
                      preferredWorkType={preferredWorkType}
                    />
                  </motion.div>
                ))
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}