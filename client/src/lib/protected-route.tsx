import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Route } from "wouter";

export function ProtectedRoute({
  path,
  component: Component,
}: {
  path: string;
  component: () => React.JSX.Element;
}) {
  // Durante o desenvolvimento, permitir acesso direto
  return (
    <Route path={path}>
      <Component />
    </Route>
  );
}