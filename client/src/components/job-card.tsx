import { Job } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Bitcoin, Calendar, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface JobCardProps {
  job: Job;
  onApply: () => void;
  isPending: boolean;
  userType: string;
  kycStatus: string;
}

export function JobCard({ job, onApply, isPending, userType, kycStatus }: JobCardProps) {
  const canApply = userType === "professional" && 
                   kycStatus === "verified" && 
                   job.status === "open";

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
            <p className="text-muted-foreground whitespace-pre-wrap mb-4">
              {job.description}
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Bitcoin className="h-4 w-4 text-yellow-500" />
                <span>{job.bitcoinAmount} BTC</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Posted {formatDistanceToNow(new Date(job.createdAt))} ago</span>
              </div>
              <div className="capitalize">
                <span className={`px-2 py-1 rounded-full text-xs font-medium
                  ${job.status === 'open' ? 'bg-green-100 text-green-700' : 
                    job.status === 'assigned' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-700'}`}>
                  {job.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      
      {canApply && (
        <CardFooter className="border-t bg-muted/50 flex justify-end p-4">
          <Button 
            onClick={onApply} 
            disabled={isPending}
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Apply Now
          </Button>
        </CardFooter>
      )}
      
      {userType === "professional" && kycStatus !== "verified" && (
        <CardFooter className="border-t bg-muted/50 p-4">
          <p className="text-sm text-muted-foreground">
            Complete KYC verification to apply for jobs
          </p>
        </CardFooter>
      )}
    </Card>
  );
}
