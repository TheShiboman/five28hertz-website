import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Star } from "lucide-react";

export default function PlayersPage() {
  const { data: users } = useQuery({
    queryKey: ["/api/users"],
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Players Rankings</h1>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users?.map((user: any) => (
          <Card key={user.id}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" />
                <CardTitle>{user.fullName}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="text-lg font-semibold">Rating: {user.rating || 1500}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Member since {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
