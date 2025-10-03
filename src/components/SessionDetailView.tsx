import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TimeTrackingSession } from "@/types/timeTracking";
import { Clock, Mouse, Keyboard, Calendar, Image as ImageIcon } from "lucide-react";
import { format } from "date-fns";

interface SessionDetailViewProps {
  session: TimeTrackingSession;
}

export function SessionDetailView({ session }: SessionDetailViewProps) {
  const formatDuration = (hours: number, minutes: number, seconds: number) => {
    return `${Math.floor(hours)}h ${Math.floor(minutes)}m ${Math.floor(seconds)}s`;
  };

  return (
    <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              Duration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {formatDuration(session.duration_hours, session.duration_minutes, session.duration_seconds)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {format(new Date(session.start_time), 'HH:mm')} - {format(new Date(session.end_time), 'HH:mm')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Keyboard className="h-4 w-4 text-primary" />
              Keystrokes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{session.total_keystrokes.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {(session.total_keystrokes / (session.duration_minutes || 1)).toFixed(1)} per minute
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Mouse className="h-4 w-4 text-primary" />
              Mouse Clicks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{session.total_mouseclicks.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {(session.total_mouseclicks / (session.duration_minutes || 1)).toFixed(1)} per minute
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              Date
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{format(new Date(session.date), 'MMM dd')}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {format(new Date(session.date), 'yyyy')}
            </p>
          </CardContent>
        </Card>
      </div>

      {session.screenshots && session.screenshots.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-primary" />
              Screenshots ({session.screenshots.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {session.screenshots.map((screenshot, index) => (
                <div key={index} className="space-y-2">
                  <div className="relative group overflow-hidden rounded-lg border bg-muted">
                    <img
                      src={screenshot.screenshot_url}
                      alt={`Screenshot ${index + 1}`}
                      className="w-full h-48 object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <a
                        href={screenshot.screenshot_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white text-sm font-medium"
                      >
                        View Full Size
                      </a>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p className="font-medium">
                      {format(new Date(screenshot.screenshot_taken_time), 'HH:mm:ss')}
                    </p>
                    <p>
                      {screenshot.width} × {screenshot.height} • {(screenshot.file_size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Session Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground mb-1">Task Title</p>
              <p className="font-medium">{session.task_title}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Status</p>
              <Badge variant={session.is_active ? "default" : "secondary"}>
                {session.is_active ? "Active" : "Completed"}
              </Badge>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Session ID</p>
              <p className="font-mono text-xs">{session._id}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">User ID</p>
              <p className="font-mono text-xs">{session.user_id}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
