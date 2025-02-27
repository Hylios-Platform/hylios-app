import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Job } from "@shared/schema";
import { JobCard } from "@/components/job-card";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { KycForm } from "@/components/kyc-form";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Search, MapPin, Coins } from "lucide-react";
import { useTranslation } from "react-i18next";

const EXCHANGE_RATES = {
  EUR: { EUR: 1, AED: 3.96 },
  AED: { EUR: 0.25, AED: 1 }
};

export default function Jobs() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [currency, setCurrency] = useState<"EUR" | "AED">("EUR");
  const [location, setLocation] = useState<string>("all");

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

  const filteredJobs = jobs?.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.description.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = status === "all" || job.status === status;
    const matchesLocation = location === "all" || job.location === location;
    return matchesSearch && matchesStatus && matchesLocation;
  }).map(job => ({
    ...job,
    displayAmount: formatCurrency(
      convertCurrency(job.amount, job.currency, currency),
      currency
    )
  }));

  const locations = jobs?.reduce((acc, job) => {
    if (!acc.includes(job.location)) {
      acc.push(job.location);
    }
    return acc;
  }, ["all"] as string[]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
              {t('jobs.title')}
            </h1>
            {user?.userType === "professional" && user?.kycStatus !== "verified" && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-md">
                    Completar KYC
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg bg-white shadow-lg border-blue-200">
                  <KycForm />
                </DialogContent>
              </Dialog>
            )}
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 h-4 w-4" />
              <Input
                placeholder={t('jobs.searchPlaceholder')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 border-blue-100 focus:border-blue-200 bg-white"
              />
            </div>

            <Select value={currency} onValueChange={(val: "EUR" | "AED") => setCurrency(val)}>
              <SelectTrigger className="w-full md:w-[120px] border-blue-100 bg-white">
                <Coins className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EUR">EUR</SelectItem>
                <SelectItem value="AED">AED</SelectItem>
              </SelectContent>
            </Select>

            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger className="w-full md:w-[180px] border-blue-100 bg-white">
                <MapPin className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Localização" />
              </SelectTrigger>
              <SelectContent>
                {locations?.map((loc) => (
                  <SelectItem key={loc} value={loc}>
                    {loc === "all" ? "Todas localizações" : loc}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-full md:w-[180px] border-blue-100 bg-white">
                <SelectValue placeholder={t('jobs.filterByStatus')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('jobs.allJobs')}</SelectItem>
                <SelectItem value="open">{t('jobs.status.open')}</SelectItem>
                <SelectItem value="assigned">{t('jobs.status.assigned')}</SelectItem>
                <SelectItem value="completed">{t('jobs.status.completed')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            {filteredJobs?.length === 0 ? (
              <div className="text-center py-8 text-blue-400 bg-white rounded-lg border border-blue-100 shadow-sm">
                {t('jobs.noJobs')}
              </div>
            ) : (
              filteredJobs?.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onApply={() => applyMutation.mutate(job.id)}
                  isPending={applyMutation.isPending}
                  userType={user?.userType || ""}
                  kycStatus={user?.kycStatus || ""}
                  displayAmount={job.displayAmount}
                  location={job.location}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}