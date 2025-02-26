import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Bitcoin, Building2, UserCheck } from "lucide-react";

export default function HomePage() {
  const { user } = useAuth();

  if (user.userType === "company") {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to Hylios</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Find skilled professionals and pay them instantly in Bitcoin
          </p>
          <Link href="/post-job">
            <Button size="lg" className="w-full md:w-auto">
              Post a New Job
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Welcome to Hylios</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Complete your profile and start earning in Bitcoin
        </p>

        <div className="grid gap-6">
          <div className="flex items-start gap-4 p-4 border rounded-lg">
            <UserCheck className="h-6 w-6 text-green-500 mt-1" />
            <div>
              <h2 className="text-lg font-semibold mb-2">Complete KYC</h2>
              <p className="text-muted-foreground mb-4">
                Verify your identity to start accepting jobs
              </p>
              <Button variant="outline">Start Verification</Button>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 border rounded-lg">
            <Building2 className="h-6 w-6 text-blue-500 mt-1" />
            <div>
              <h2 className="text-lg font-semibold mb-2">Browse Jobs</h2>
              <p className="text-muted-foreground mb-4">
                Find opportunities that match your skills
              </p>
              <Link href="/jobs">
                <Button variant="outline">View Jobs</Button>
              </Link>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 border rounded-lg">
            <Bitcoin className="h-6 w-6 text-yellow-500 mt-1" />
            <div>
              <h2 className="text-lg font-semibold mb-2">Get Paid in Bitcoin</h2>
              <p className="text-muted-foreground">
                Complete tasks and receive instant payments
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
