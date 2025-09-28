"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Database,
  Shield,
  Zap,
  HardDrive,
  Radio,
  Cpu,
  BarChart3,
} from "lucide-react";

const services = [
  {
    title: "Postgres Database",
    description:
      "Every project is a full Postgres database, the world's most trusted relational database.",
    icon: Database,
    features: ["100% portable", "Built-in Auth with RLS", "Easy to extend"],
    color: "bg-green-500/10 text-green-400",
  },
  {
    title: "Authentication",
    description:
      "Add user sign ups and logins, securing your data with Row Level Security.",
    icon: Shield,
    color: "bg-blue-500/10 text-blue-400",
  },
  {
    title: "Edge Functions",
    description:
      "Easily write custom code without deploying or scaling servers.",
    icon: Zap,
    color: "bg-purple-500/10 text-purple-400",
  },
  {
    title: "Storage",
    description:
      "Store, organize, and serve large files, from videos to images.",
    icon: HardDrive,
    color: "bg-orange-500/10 text-orange-400",
  },
  {
    title: "Realtime",
    description:
      "Build multiplayer experiences with real-time data synchronization.",
    icon: Radio,
    color: "bg-pink-500/10 text-pink-400",
  },
  {
    title: "Vector",
    description:
      "Integrate your favorite ML-models to store, index and search vector embeddings.",
    icon: Cpu,
    color: "bg-cyan-500/10 text-cyan-400",
  },
  {
    title: "Data APIs",
    description: "Instant ready-to-use Restful APIs.",
    icon: BarChart3,
    color: "bg-yellow-500/10 text-yellow-400",
  },
];

export function ServiceCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {services.map((service) => (
        <Card
          key={service.title}
          className="relative overflow-hidden border-border/50 hover:border-border transition-colors"
        >
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${service.color}`}>
                <service.icon className="h-5 w-5" />
              </div>
              <CardTitle className="text-base font-medium">
                {service.title}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <CardDescription className="text-sm text-muted-foreground leading-relaxed">
              {service.description}
            </CardDescription>
            {service.features && (
              <div className="space-y-1">
                {service.features.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center gap-2 text-xs text-muted-foreground"
                  >
                    <div className="h-1 w-1 rounded-full bg-success" />
                    {feature}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
