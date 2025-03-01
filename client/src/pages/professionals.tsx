import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Filter, Star, Award, Shield } from "lucide-react";
import { Input } from "@/components/ui/input";

const mockProfessionals = [
  {
    id: 1,
    name: "Ana Silva",
    role: "Full Stack Developer",
    rating: 4.8,
    skills: ["React", "Node.js", "TypeScript"],
    verified: true,
    featured: true
  },
  {
    id: 2,
    name: "Carlos Santos",
    role: "UI/UX Designer",
    rating: 4.5,
    skills: ["Figma", "Adobe XD", "User Research"],
    verified: true,
    featured: false
  }
];

export default function Professionals() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
          Profissionais
        </h1>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar profissionais..."
              className="pl-10 w-64"
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockProfessionals.map((professional, index) => (
          <motion.div
            key={professional.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl mb-1">{professional.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{professional.role}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {professional.verified && (
                      <Shield className="h-4 w-4 text-green-500" />
                    )}
                    {professional.featured && (
                      <Award className="h-4 w-4 text-amber-500" />
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(professional.rating)
                          ? "fill-amber-400 text-amber-400"
                          : i < professional.rating
                          ? "fill-amber-400/50 text-amber-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="text-sm text-gray-500 ml-2">
                    ({professional.rating})
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {professional.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <Button className="w-full mt-4" variant="outline">
                  Ver Perfil
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
