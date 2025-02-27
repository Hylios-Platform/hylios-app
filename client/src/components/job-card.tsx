import { Job } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bitcoin, Calendar, Loader2, MapPin, Coins, Briefcase, Tags } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useTranslation } from "react-i18next";

interface JobCardProps {
  job: Job;
  onApply: () => void;
  isPending: boolean;
  userType: string;
  kycStatus: string;
  displayAmount: string;
  location: string;
}

export function JobCard({ job, onApply, isPending, userType, kycStatus, displayAmount, location }: JobCardProps) {
  const { t } = useTranslation();

  const canApply = userType === "professional" && 
                   kycStatus === "verified" && 
                   job.status === "open";

  const workTypeColors = {
    remote: "bg-green-100 text-green-800",
    onsite: "bg-blue-100 text-blue-800",
    hybrid: "bg-purple-100 text-purple-800"
  };

  return (
    <Card className="border-blue-100 bg-white shadow-md hover:shadow-lg transition-shadow">
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
              <Badge 
                variant="secondary"
                className={`${workTypeColors[job.workType as keyof typeof workTypeColors]}`}
              >
                {t(`jobs.workType.${job.workType}`)}
              </Badge>
            </div>

            <p className="text-gray-600 whitespace-pre-wrap mb-4">
              {job.description}
            </p>

            {job.requiredSkills && (
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="flex items-center text-sm text-gray-500">
                  <Tags className="h-4 w-4 mr-1" />
                  {t('jobs.requiredSkills')}:
                </span>
                {job.requiredSkills.map((skill, index) => (
                  <Badge key={index} variant="outline" className="bg-gray-50">
                    {skill}
                  </Badge>
                ))}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Coins className="h-4 w-4 text-amber-400" />
                <span className="text-gray-700 font-medium">{displayAmount}</span>
              </div>
              <div className="flex items-center gap-1">
                <Briefcase className="h-4 w-4 text-blue-400" />
                <span className="text-gray-700">{t(`jobs.workType.${job.workType}`)}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4 text-blue-400" />
                <span className="text-gray-700">{location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4 text-blue-400" />
                <span className="text-gray-700">
                  {t('jobs.postedAgo', { time: formatDistanceToNow(new Date(job.createdAt)) })}
                </span>
              </div>
              <div className="capitalize">
                <span className={`px-2 py-1 rounded-full text-xs font-medium
                  ${job.status === 'open' ? 'bg-emerald-50 text-emerald-600' : 
                    job.status === 'assigned' ? 'bg-blue-50 text-blue-600' :
                    job.status === 'completed' ? 'bg-purple-50 text-purple-600' :
                    'bg-gray-50 text-gray-600'}`}>
                  {t(`jobs.status.${job.status}`)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      {canApply && (
        <CardFooter className="border-t border-blue-100 bg-blue-50/50 flex justify-end p-4">
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
          <p className="text-sm text-gray-600">
            {t('jobs.completeKyc')}
          </p>
        </CardFooter>
      )}
    </Card>
  );
}