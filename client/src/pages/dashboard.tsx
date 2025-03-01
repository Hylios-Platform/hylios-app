import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart2, Users, Building2, Wallet } from "lucide-react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const stats = [
    {
      title: "Total de Vagas",
      value: "150+",
      icon: Building2,
      color: "blue"
    },
    {
      title: "Profissionais Ativos",
      value: "2.5k",
      icon: Users,
      color: "violet"
    },
    {
      title: "Taxa de Sucesso",
      value: "95%",
      icon: BarChart2,
      color: "green"
    },
    {
      title: "Volume Negociado",
      value: "₿ 25.8",
      icon: Wallet,
      color: "amber"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <Icon className={`h-4 w-4 text-${stat.color}-500`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Aqui podemos adicionar mais seções como gráficos e tabelas */}
    </div>
  );
}
