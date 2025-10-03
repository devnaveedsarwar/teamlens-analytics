import { StatsCard } from "@/components/StatsCard";
import { AttendanceTable } from "@/components/AttendanceTable";
import { mockAttendanceData } from "@/data/mockSessions";
import { Clock, Calendar, TrendingUp, UserCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const Index = () => {
  // Get user info from first record
  const userName = mockAttendanceData[0]?.user_name || "Employee";
  const employeeId = mockAttendanceData[0]?.employee_id || "N/A";
  
  // Calculate stats for last 7 days
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const last7DaysRecords = mockAttendanceData.filter(
    r => new Date(r.date) >= sevenDaysAgo
  );
  const last7DaysHours = last7DaysRecords.reduce((acc, r) => acc + r.total_hours, 0);

  // Calculate stats for last 30 days
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const last30DaysRecords = mockAttendanceData.filter(
    r => new Date(r.date) >= thirtyDaysAgo
  );
  const last30DaysHours = last30DaysRecords.reduce((acc, r) => acc + r.total_hours, 0);

  // Calculate attendance rate
  const presentDays = last30DaysRecords.filter(r => r.status !== "Absent").length;
  const totalDays = last30DaysRecords.length;
  const attendanceRate = totalDays > 0 ? (presentDays / totalDays) * 100 : 0;
  const holidaysCount = totalDays - presentDays;

  // Calculate average hours per day
  const workingDays = last30DaysRecords.filter(r => r.total_hours > 0).length;
  const avgHoursPerDay = workingDays > 0 ? last30DaysHours / workingDays : 0;

  const getAvgHoursStatus = (hours: number) => {
    if (hours >= 8) return { label: "Excellent", color: "text-green-500" };
    if (hours >= 7) return { label: "Good", color: "text-blue-500" };
    if (hours >= 6) return { label: "Fair", color: "text-orange-500" };
    return { label: "Low", color: "text-red-500" };
  };

  const avgStatus = getAvgHoursStatus(avgHoursPerDay);

  // Calculate screen time stats
  const totalSessions = mockAttendanceData.reduce((acc, r) => acc + r.time_tracking_sessions.length, 0);
  const totalScreenTimeHours = mockAttendanceData.reduce((acc, r) => 
    acc + r.time_tracking_sessions.reduce((sum, s) => sum + s.duration_hours, 0), 0
  );
  const avgSessionDuration = totalSessions > 0 ? (totalScreenTimeHours / totalSessions) * 60 : 0; // in minutes
  const totalKeystrokes = mockAttendanceData.reduce((acc, r) => 
    acc + r.time_tracking_sessions.reduce((sum, s) => sum + s.total_keystrokes, 0), 0
  );
  const totalMouseClicks = mockAttendanceData.reduce((acc, r) => 
    acc + r.time_tracking_sessions.reduce((sum, s) => sum + s.total_mouseclicks, 0), 0
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2 pb-4 border-b">
          <h1 className="text-3xl font-bold tracking-tight">Monthly Attendance Report</h1>
          <h2 className="text-2xl font-semibold">{userName}</h2>
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <UserCheck className="h-4 w-4" />
            <span>{employeeId}</span>
          </div>
        </div>

        {/* Machine Attendance Stats */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-muted-foreground">Machine Attendance</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-6 space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Last 7 Days Total Hours</span>
            </div>
            <div className="space-y-2">
              <p className="text-4xl font-bold">{last7DaysHours.toFixed(2)} <span className="text-base font-normal text-muted-foreground">hrs</span></p>
              <Progress value={(last7DaysHours / 56) * 100} className="h-2" />
            </div>
          </Card>

          <Card className="p-6 space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Last 30 Days Total Hours</span>
            </div>
            <div className="space-y-2">
              <p className="text-4xl font-bold">{last30DaysHours.toFixed(2)} <span className="text-base font-normal text-muted-foreground">hrs</span></p>
              <Progress value={(last30DaysHours / 240) * 100} className="h-2" />
            </div>
          </Card>

          <Card className="p-6 space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <UserCheck className="h-4 w-4" />
              <span>Attendance Rate (monthly)</span>
            </div>
            <div className="space-y-2">
              <p className="text-4xl font-bold">{attendanceRate.toFixed(1)} <span className="text-base font-normal text-muted-foreground">%</span></p>
              <p className="text-xs text-muted-foreground">
                {presentDays} present ({holidaysCount} holidays)
              </p>
              <Progress value={attendanceRate} className="h-2" />
            </div>
          </Card>

          <Card className="p-6 space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span>Avg Hours/Day</span>
            </div>
            <div className="space-y-2">
              <p className={`text-4xl font-bold ${avgStatus.color}`}>
                {avgHoursPerDay.toFixed(2)} <span className="text-base font-normal text-muted-foreground">hrs</span>
              </p>
              <p className={`text-sm font-medium ${avgStatus.color}`}>{avgStatus.label}</p>
              <p className="text-xs text-muted-foreground">
                {last30DaysHours.toFixed(2)}h / {(workingDays * 8).toFixed(0)}h ({workingDays} working days)
              </p>
              <Progress value={(avgHoursPerDay / 8) * 100} className="h-2" />
            </div>
          </Card>
          </div>
        </div>

        {/* Screen Time Stats */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-muted-foreground">Screen Time Tracking</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-6 space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Total Sessions</span>
              </div>
              <div className="space-y-2">
                <p className="text-4xl font-bold">{totalSessions} <span className="text-base font-normal text-muted-foreground">sessions</span></p>
                <p className="text-xs text-muted-foreground">Across all working days</p>
              </div>
            </Card>

            <Card className="p-6 space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <TrendingUp className="h-4 w-4" />
                <span>Total Screen Time</span>
              </div>
              <div className="space-y-2">
                <p className="text-4xl font-bold">{totalScreenTimeHours.toFixed(2)} <span className="text-base font-normal text-muted-foreground">hrs</span></p>
                <Progress value={(totalScreenTimeHours / 240) * 100} className="h-2" />
              </div>
            </Card>

            <Card className="p-6 space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Avg Session Duration</span>
              </div>
              <div className="space-y-2">
                <p className="text-4xl font-bold">{avgSessionDuration.toFixed(0)} <span className="text-base font-normal text-muted-foreground">min</span></p>
                <p className="text-xs text-muted-foreground">Per session average</p>
              </div>
            </Card>

            <Card className="p-6 space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <UserCheck className="h-4 w-4" />
                <span>Activity Stats</span>
              </div>
              <div className="space-y-2">
                <p className="text-xl font-bold">{totalKeystrokes.toLocaleString()} <span className="text-sm font-normal text-muted-foreground">keystrokes</span></p>
                <p className="text-xl font-bold">{totalMouseClicks.toLocaleString()} <span className="text-sm font-normal text-muted-foreground">clicks</span></p>
              </div>
            </Card>
          </div>
        </div>

        {/* Attendance Records Table */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">All Attendance Records</h2>
            <Badge variant="secondary">{mockAttendanceData.length} records</Badge>
          </div>
          <AttendanceTable records={mockAttendanceData} />
        </div>
      </div>
    </div>
  );
};

export default Index;
