import { ApiProperty } from '@nestjs/swagger';
import { TaskStatus } from '../enums/task-status.enum';

export class TaskResponseDto {
  @ApiProperty({ description: 'Task unique identifier' })
  id: string;

  @ApiProperty({ description: 'Task title' })
  title: string;

  @ApiProperty({ description: 'Task description' })
  description: string | null;

  @ApiProperty({ description: 'Task status', enum: TaskStatus })
  status: string;

  @ApiProperty({ description: 'User ID who owns the task' })
  userId: string;

  @ApiProperty({ description: 'Task creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Task last update timestamp' })
  updatedAt: Date;
}

export class TaskPostResponse {
  @ApiProperty({ description: 'Response message' })
  message: string[];

  @ApiProperty({ description: 'Task data', type: TaskResponseDto })
  data: TaskResponseDto;
}

export class TaskGetResponse {
  @ApiProperty({ description: 'Response message' })
  message: string[];

  @ApiProperty({ description: 'Tasks array', type: [TaskResponseDto] })
  data: TaskResponseDto[];
}

export class TaskSingleResponse {
  @ApiProperty({ description: 'Response message' })
  message: string[];

  @ApiProperty({ description: 'Task data', type: TaskResponseDto })
  data: TaskResponseDto;
}

export class TaskErrorResponseDto {
  @ApiProperty({ description: 'HTTP status code' })
  status: number;

  @ApiProperty({ description: 'Data (null for errors)' })
  data: null;

  @ApiProperty({ description: 'Error messages', type: [String] })
  error: string[];
}
