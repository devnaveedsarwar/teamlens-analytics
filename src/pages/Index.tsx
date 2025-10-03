import { StatsCard } from "@/components/StatsCard";
import { TimeTrackingTable } from "@/components/TimeTrackingTable";
import { mockSessions } from "@/data/mockSessions";
import { Clock, Users, Activity, TrendingUp } from "lucide-react";

const Index = () => {
  // Calculate stats from mock data
  const totalSessions = mockSessions.length;
  const totalHours = mockSessions.reduce((acc, session) => acc + session.duration_hours, 0);
  const totalKeystrokes = mockSessions.reduce((acc, session) => acc + session.total_keystrokes, 0);
  const avgProductivity = (totalKeystrokes / totalSessions / 100).toFixed(1);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Team Time Tracking Analytics</h1>
          <p className="text-muted-foreground">
            Monitor and manage your team's productivity with detailed session tracking
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Sessions"
            value={totalSessions}
            icon={Activity}
            description="Active tracking sessions"
          />
          <StatsCard
            title="Total Hours"
            value={totalHours.toFixed(1)}
            icon={Clock}
            description="Across all team members"
          />
          <StatsCard
            title="Team Members"
            value={new Set(mockSessions.map(s => s.user_id)).size}
            icon={Users}
            description="Active contributors"
          />
          <StatsCard
            title="Avg Productivity"
            value={avgProductivity}
            icon={TrendingUp}
            description="Keystrokes per session (×100)"
          />
        </div>

        {/* Sessions Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold tracking-tight">Time Tracking Sessions</h2>
            <p className="text-sm text-muted-foreground">
              Click on any row to view detailed information
            </p>
          </div>
          <TimeTrackingTable sessions={mockSessions} />
        </div>
      </div>
    </div>
  );
};

export default Index;
