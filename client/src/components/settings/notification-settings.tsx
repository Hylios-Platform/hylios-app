import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function NotificationSettings() {
  const { user } = useAuth();
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: async (data: Record<string, boolean>) => {
      const res = await apiRequest("POST", "/api/notifications/settings", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({
        title: "Configurações atualizadas",
        description: "Suas preferências de notificação foram salvas."
      });
    }
  });

  const toggleSetting = (key: string) => {
    const currentSettings = user?.notificationSettings || {};
    mutation.mutate({
      ...currentSettings,
      [key]: !currentSettings[key]
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-blue-500" />
          <CardTitle>Configurações de Notificação</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Novos Trabalhos</Label>
              <p className="text-sm text-muted-foreground">
                Receber notificações sobre novas oportunidades de trabalho
              </p>
            </div>
            <Switch
              checked={user?.notificationSettings?.newJobs}
              onCheckedChange={() => toggleSetting("newJobs")}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Status de Candidatura</Label>
              <p className="text-sm text-muted-foreground">
                Atualizações sobre suas candidaturas
              </p>
            </div>
            <Switch
              checked={user?.notificationSettings?.applicationStatus}
              onCheckedChange={() => toggleSetting("applicationStatus")}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Pagamentos</Label>
              <p className="text-sm text-muted-foreground">
                Notificações sobre pagamentos recebidos
              </p>
            </div>
            <Switch
              checked={user?.notificationSettings?.payments}
              onCheckedChange={() => toggleSetting("payments")}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Mensagens</Label>
              <p className="text-sm text-muted-foreground">
                Notificações de novas mensagens
              </p>
            </div>
            <Switch
              checked={user?.notificationSettings?.messages}
              onCheckedChange={() => toggleSetting("messages")}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
