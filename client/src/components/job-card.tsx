import { Job } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bitcoin, Calendar, Loader2, MapPin, Coins, Briefcase, Tags, CheckCircle2, Trophy, Star, ThumbsUp, Scale } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useTranslation } from "react-i18next";
import { MatchMenu } from "./matching/match-menu";
import { calculateMatchScore } from "@/lib/matching-service";
import { motion } from 'framer-motion';

interface JobCardProps {
  job: Job;
  onApply: () => void;
  isPending: boolean;
  userType: string;
  kycStatus: string;
  displayAmount: string;
  location: string;
  userSkills?: string[];
  userLocation?: string;
  preferredWorkType?: string;
}

interface SkillBadgeProps {
  skill: string;
  isMatched: boolean;
}

function SkillBadge({ skill, isMatched }: SkillBadgeProps) {
  return (
    <motion.span
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`px-2 py-1 rounded-full text-sm font-medium transition-colors
        ${isMatched 
          ? 'bg-green-100 text-green-700 border border-green-200' 
          : 'bg-gray-100 text-gray-600 border border-gray-200'}`}
    >
      {skill}
      {isMatched && (
        <CheckCircle2 className="inline-block ml-1 h-3 w-3 text-green-500" />
      )}
    </motion.span>
  );
}

export function JobCard({ 
  job, 
  onApply, 
  isPending, 
  userType, 
  kycStatus, 
  displayAmount, 
  location,
  userSkills = [],
  userLocation = "",
  preferredWorkType = "remote"
}: JobCardProps) {
  const { t } = useTranslation();
  const matchScore = userType === "professional" 
    ? calculateMatchScore(job, userSkills, userLocation, preferredWorkType)
    : 0;

  const matchedSkills = job.requiredSkills?.filter(skill => 
    userSkills.includes(skill)
  ) || [];

  const getMatchColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50';
    if (score >= 75) return 'text-blue-600 bg-blue-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-gray-600 bg-gray-50';
  };

  const getMatchIcon = (score: number) => {
    if (score >= 90) return <Trophy className="h-4 w-4" />;
    if (score >= 75) return <Star className="h-4 w-4" />;
    if (score >= 60) return <ThumbsUp className="h-4 w-4" />;
    return <Scale className="h-4 w-4" />;
  };

  const workTypeColors = {
    remote: "bg-green-100 text-green-800",
    onsite: "bg-blue-100 text-blue-800",
    hybrid: "bg-purple-100 text-purple-800"
  };

  const canApply = userType === "professional" && 
                   kycStatus === "verified" && 
                   job.status === "open";

  return (
    <Card className="border-blue-100 bg-white shadow-md hover:shadow-lg transition-shadow">
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
              {userType === "professional" && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className={`px-3 py-1 rounded-full flex items-center gap-1 ${getMatchColor(matchScore)}`}
                >
                  {getMatchIcon(matchScore)}
                  <span className="font-medium">{matchScore}% Match</span>
                </motion.div>
              )}
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
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Tags className="h-4 w-4" />
                  <span>{t('jobs.requiredSkills')}:</span>
                  <span className="text-green-600">
                    {matchedSkills.length}/{job.requiredSkills.length} {t('jobs.skillsMatch')}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {job.requiredSkills.map((skill) => (
                    <SkillBadge
                      key={skill}
                      skill={skill}
                      isMatched={userSkills.includes(skill)}
                    />
                  ))}
                </div>
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
        {userType === "professional" && (
          <div className="mt-6">
            <MatchMenu
              job={job}
              userSkills={userSkills}
              userLocation={userLocation}
              matchScore={matchScore}
            />
          </div>
        )}
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