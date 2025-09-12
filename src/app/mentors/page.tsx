"use client";

import { FollowButton } from '@/components/FollowButton';
import { useSocket } from '@/components/SocketProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const mentorsDemo = [
  { id: 1, name: "John Doe", role: "Senior Developer", avatar: "👨‍💻" },
  { id: 2, name: "Jane Smith", role: "UI/UX Designer", avatar: "👩‍🎨" },
  { id: 3, name: "Bob Johnson", role: "Data Scientist", avatar: "👨‍🔬" },
  { id: 4, name: "Alice Brown", role: "Product Manager", avatar: "👩‍💼" },
];

export default function MentorPage() {
  const { isConnected } = useSocket();

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Find Your Mentors</h1>
        <div className="flex items-center gap-2 text-sm">
          <span>Socket Status:</span>
          <span className={`px-2 py-1 rounded-full text-xs ${
            isConnected 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {mentorsDemo.map((mentor) => (
          <Card key={mentor.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="text-6xl mb-2">{mentor.avatar}</div>
              <CardTitle className="text-lg">{mentor.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{mentor.role}</p>
            </CardHeader>
            <CardContent className="text-center">
              <FollowButton 
                targetUserId={mentor.id}
                className="w-full"
              />
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="mt-8 p-4 bg-muted rounded-lg">
        <h3 className="font-semibold mb-2">Test Follow Functionality:</h3>
        <ul className="text-sm space-y-1">
          <li>• Click follow/unfollow buttons to test real-time functionality</li>
          <li>• Check browser console for socket event logs</li>
          <li>• Open multiple tabs to see real-time updates</li>
          <li>• Socket connection status is shown above</li>
        </ul>
      </div>
    </div>
  );
}
