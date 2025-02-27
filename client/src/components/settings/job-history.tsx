import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Job } from "@shared/schema";

export function JobHistory() {
  const { user } = useAuth();

  const { data: jobs, isLoading } = useQuery<Job[]>({
    queryKey: ["/api/jobs/history"],
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-blue-500" />
          <CardTitle>Histórico de Trabalhos</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-4">Carregando...</div>
        ) : jobs?.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            Nenhum trabalho encontrado no histórico.
          </div>
        ) : (
          <div className="space-y-4">
            {jobs?.map((job) => (
              <div
                key={job.id}
                className="border rounded-lg p-4 space-y-2"
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-medium">{job.title}</h3>
                  <span className="text-sm px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                    {job.status}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{job.description}</p>
                <div className="flex justify-between text-sm">
                  <span>Valor: {job.amount} {job.currency}</span>
                  <span>Data: {new Date(job.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
