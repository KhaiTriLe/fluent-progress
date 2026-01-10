import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  description?: string;
}

export default function StatCard({ title, value, icon, description }: StatCardProps) {
  return (
    <Card className="flex flex-col justify-between shadow-md transition-shadow hover:shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="h-6 w-6">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold text-primary font-headline">{value}</div>
        {description && <p className="text-xs text-muted-foreground pt-2">{description}</p>}
      </CardContent>
    </Card>
  );
}
