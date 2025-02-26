import { Job } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Bitcoin, Calendar, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useTranslation } from "react-i18next";

interface JobCardProps {
  job: Job;
  onApply: () => void;
  isPending: boolean;
  userType: string;
  kycStatus: string;
}

export function JobCard({ job, onApply, isPending, userType, kycStatus }: JobCardProps) {
  const { t } = useTranslation();

  const canApply = userType === "professional" && 
                   kycStatus === "verified" && 
                   job.status === "open";

  return (
    <Card className="border-blue-100 bg-white shadow-md hover:shadow-lg transition-shadow">
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-xl font-semibold mb-2 text-gray-700">{job.title}</h3>
            <p className="text-blue-400 whitespace-pre-wrap mb-4">
              {job.description}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Bitcoin className="h-4 w-4 text-amber-400" />
                <span className="text-blue-400">{job.bitcoinAmount} BTC</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4 text-blue-400" />
                <span className="text-blue-400">
                  {t('jobs.postedAgo', { time: formatDistanceToNow(new Date(job.createdAt)) })}
                </span>
              </div>
              <div className="capitalize">
                <span className={`px-2 py-1 rounded-full text-xs font-medium
                  ${job.status === 'open' ? 'bg-emerald-50 text-emerald-400' : 
                    job.status === 'assigned' ? 'bg-blue-50 text-blue-400' :
                    'bg-gray-50 text-gray-400'}`}>
                  {t(`jobs.status.${job.status}`)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      {canApply && (
        <CardFooter className="border-t border-blue-200 bg-blue-50/50 flex justify-end p-4">
          <Button 
            onClick={onApply} 
            disabled={isPending}
            className="bg-blue-600 hover:bg-blue-700 text-white w-full md:w-auto shadow-md"
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t('jobs.applyNow')}
          </Button>
        </CardFooter>
      )}

      {userType === "professional" && kycStatus !== "verified" && (
        <CardFooter className="border-t border-blue-100 bg-blue-50/50 p-4">
          <p className="text-sm text-blue-400">
            {t('jobs.completeKyc')}
          </p>
        </CardFooter>
      )}
    </Card>
  );
}