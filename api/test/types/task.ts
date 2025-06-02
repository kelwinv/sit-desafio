export interface UpdateTaskDto {
  title?: string;
  description?: string;
  status?: 'pending' | 'in-progress' | 'completed';
}
