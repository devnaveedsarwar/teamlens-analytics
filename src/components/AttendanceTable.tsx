import { useState } from "react";
import { AttendanceRecord } from "@/types/timeTracking";
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
import { Progress } from "@/components/ui/progress";

interface AttendanceTableProps {
  records: AttendanceRecord[];
}

export function AttendanceTable({ records }: AttendanceTableProps) {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const toggleRow = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "destructive" | "default" | "secondary" | "outline"> = {
      Absent: "destructive",
      Insufficient: "outline",
      Good: "default",
      Excellent: "secondary",
    };
    return variants[status] || "default";
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      Absent: "bg-red-500",
      Insufficient: "bg-orange-500",
      Good: "bg-blue-500",
      Excellent: "bg-green-500",
    };
    return colors[status] || "bg-gray-500";
  };

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]"></TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Check In</TableHead>
            <TableHead>Check Out</TableHead>
            <TableHead>Total Hours</TableHead>
            <TableHead>Screen Time</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((record) => (
            <>
              <TableRow
                key={record._id}
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => toggleRow(record._id)}
              >
                <TableCell>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    {expandedRow === record._id ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                </TableCell>
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span>{format(new Date(record.date), 'yyyy-MM-dd')}</span>
                    <span className="text-xs text-muted-foreground">{format(new Date(record.date), 'EEEE')}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {record.check_in ? format(new Date(record.check_in), 'hh:mm a') : '---'}
                </TableCell>
                <TableCell>
                  {record.check_out ? format(new Date(record.check_out), 'hh:mm a') : '---'}
                </TableCell>
                <TableCell className="font-semibold">{record.total_hours.toFixed(2)} hrs</TableCell>
                <TableCell className="font-semibold">
                  {record.time_tracking_sessions.reduce((sum, s) => sum + s.duration_hours, 0).toFixed(2)} hrs
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusBadge(record.status)}>
                    {record.status}
                  </Badge>
                </TableCell>
              </TableRow>
              {expandedRow === record._id && record.time_tracking_sessions.length > 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="p-0 bg-muted/30">
                    <div className="p-6 space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Daily Session Timeline ({record.time_tracking_sessions.length} sessions)</h3>
                        <div className="flex gap-4 text-sm">
                          <span className="text-muted-foreground">Total Keystrokes: <span className="font-semibold text-foreground">{record.time_tracking_sessions.reduce((sum, s) => sum + s.total_keystrokes, 0).toLocaleString()}</span></span>
                          <span className="text-muted-foreground">Total Clicks: <span className="font-semibold text-foreground">{record.time_tracking_sessions.reduce((sum, s) => sum + s.total_mouseclicks, 0).toLocaleString()}</span></span>
                        </div>
                      </div>
                      
                      {/* Session Timeline */}
                      <div className="space-y-3">
                        {record.time_tracking_sessions.map((session) => (
                          <div key={session._id} className="flex items-start gap-4 p-4 rounded-lg border bg-card">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <Badge variant="outline" className="font-mono">
                                  {format(new Date(session.start_time), 'hh:mm a')} - {format(new Date(session.end_time), 'hh:mm a')}
                                </Badge>
                                <span className="text-sm font-medium">{session.task_title}</span>
                                <span className="text-sm text-muted-foreground">({session.duration_hours.toFixed(2)} hrs)</span>
                              </div>
                              <div className="flex gap-4 text-xs text-muted-foreground">
                                <span>{session.total_keystrokes.toLocaleString()} keystrokes</span>
                                <span>{session.total_mouseclicks.toLocaleString()} clicks</span>
                                <span>{session.screenshots.length} screenshot{session.screenshots.length !== 1 ? 's' : ''}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Screenshots Section */}
                      {record.time_tracking_sessions.some(s => s.screenshots.length > 0) && (
                        <div className="space-y-3">
                          <h4 className="font-semibold">Screenshots</h4>
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                            {record.time_tracking_sessions.flatMap(session => 
                              session.screenshots.map((screenshot, idx) => (
                                <div key={`${session._id}-${idx}`} className="relative group rounded-lg overflow-hidden border">
                                  <img 
                                    src={screenshot.screenshot_url} 
                                    alt={`Screenshot from ${session.task_title}`}
                                    className="w-full h-32 object-cover"
                                  />
                                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <span className="text-white text-xs">{format(new Date(screenshot.screenshot_taken_time), 'hh:mm a')}</span>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      )}

                      {/* Task Titles Summary */}
                      <div className="space-y-2">
                        <h4 className="font-semibold">Tasks Worked On</h4>
                        <div className="flex flex-wrap gap-2">
                          {[...new Set(record.time_tracking_sessions.map(s => s.task_title))].map((title, idx) => (
                            <Badge key={idx} variant="secondary">{title}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
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
