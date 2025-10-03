export interface Screenshot {
  screenshot_url: string;
  screenshot_taken_time: string;
  cloudinary_public_id: string;
  width: number;
  height: number;
  format: string;
  file_size: number;
}

export interface TimeTrackingSession {
  _id: string;
  user_id: string;
  project_id: string;
  task_title: string;
  start_time: string;
  end_time: string;
  total_keystrokes: number;
  total_mouseclicks: number;
  date: string;
  screenshots: Screenshot[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
  duration_hours: number;
  duration_minutes: number;
  duration_seconds: number;
}
