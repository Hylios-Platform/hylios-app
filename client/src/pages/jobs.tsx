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
import { Loader2, Search } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Jobs() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("all");

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

  const filteredJobs = jobs?.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.description.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = status === "all" || job.status === status;
    return matchesSearch && matchesStatus;
  });

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
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
              {t('jobs.title')}
            </h1>
            {user?.userType === "professional" && user?.kycStatus !== "verified" && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-blue-400 hover:bg-blue-500 text-white">
                    Completar KYC
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <KycForm />
                </DialogContent>
              </Dialog>
            )}
          </div>

          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 h-4 w-4" />
              <Input
                placeholder={t('jobs.searchPlaceholder')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 border-blue-100 focus:border-blue-200"
              />
            </div>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-[180px] border-blue-100 bg-white">
                <SelectValue placeholder={t('jobs.filterByStatus')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('jobs.allJobs')}</SelectItem>
                <SelectItem value="open">{t('jobs.open')}</SelectItem>
                <SelectItem value="assigned">{t('jobs.assigned')}</SelectItem>
                <SelectItem value="completed">{t('jobs.completed')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            {filteredJobs?.length === 0 ? (
              <div className="text-center py-8 text-blue-400">
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
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}