import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Download } from "lucide-react";
import { useProfile } from "@/queries/useProfile";

export function ProfileSection() {
  const profile = useProfile();
  return (
    <Card className="bg-gradient-to-r from-blue-700 to-blue-800 text-white">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-xl font-semibold mb-1">
              {profile.data?.payload.result.name}
            </h3>
            <p className="text-slate-300 text-sm mb-4">
              {profile.data?.payload.result.email}
            </p>

            <div className="flex items-center gap-4 mb-2">
              <span className="text-sm">1/4 Steps</span>
              <div className="flex-1">
                <Progress value={25} className="h-2" />
              </div>
              <span className="text-sm font-medium">25% Completed</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
