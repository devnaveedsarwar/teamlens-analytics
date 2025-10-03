import { useState } from "react";
import { TimeTrackingSession } from "@/types/timeTracking";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { SessionDetailView } from "./SessionDetailView";

interface TimeTrackingTableProps {
  sessions: TimeTrackingSession[];
}

export function TimeTrackingTable({ sessions }: TimeTrackingTableProps) {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const toggleRow = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]"></TableHead>
            <TableHead>Task</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Keystrokes</TableHead>
            <TableHead>Clicks</TableHead>
            <TableHead>Screenshots</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sessions.map((session) => (
            <>
              <TableRow
                key={session._id}
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => toggleRow(session._id)}
              >
                <TableCell>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    {expandedRow === session._id ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                </TableCell>
                <TableCell className="font-medium">{session.task_title}</TableCell>
                <TableCell>{format(new Date(session.date), 'MMM dd, yyyy')}</TableCell>
                <TableCell>{formatDuration(session.duration_minutes)}</TableCell>
                <TableCell>{session.total_keystrokes.toLocaleString()}</TableCell>
                <TableCell>{session.total_mouseclicks.toLocaleString()}</TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {session.screenshots?.length || 0}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={session.is_active ? "default" : "secondary"}>
                    {session.is_active ? "Active" : "Completed"}
                  </Badge>
                </TableCell>
              </TableRow>
              {expandedRow === session._id && (
                <TableRow>
                  <TableCell colSpan={8} className="p-0">
                    <SessionDetailView session={session} />
                  </TableCell>
                </TableRow>
              )}
            </>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
