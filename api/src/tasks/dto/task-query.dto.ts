import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { TaskStatus } from '../enums/task-status.enum';

export class TaskQueryDto {
  @ApiProperty({
    description: 'Filter tasks by status',
    enum: TaskStatus,
    required: false,
  })
  @IsEnum(TaskStatus, {
    message: 'Status must be pending, in-progress, or completed',
  })
  @IsOptional()
  status?: TaskStatus;
}
