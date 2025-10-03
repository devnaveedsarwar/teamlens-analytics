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
                  {format(new Date(record.date), 'yyyy-MM-dd')}
                </TableCell>
                <TableCell>
                  {record.check_in ? format(new Date(record.check_in), 'hh:mm a') : '---'}
                </TableCell>
                <TableCell>
                  {record.check_out ? format(new Date(record.check_out), 'hh:mm a') : '---'}
                </TableCell>
                <TableCell className="font-semibold">{record.total_hours.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge variant={getStatusBadge(record.status)}>
                    {record.status}
                  </Badge>
                </TableCell>
              </TableRow>
              {expandedRow === record._id && record.time_tracking_sessions.length > 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="p-0 bg-muted/30">
                    <div className="p-4 space-y-4">
                      <h3 className="text-lg font-semibold">Time Tracking Sessions ({record.time_tracking_sessions.length})</h3>
                      {record.time_tracking_sessions.map((session) => (
                        <SessionDetailView key={session._id} session={session} />
                      ))}
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
