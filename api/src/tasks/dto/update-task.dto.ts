import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum } from 'class-validator';
import { TaskStatus } from '../enums/task-status.enum';

export class UpdateTaskDto {
  @ApiProperty({
    description: 'Task title',
    example: 'Tarefa Atualizada',
    required: false,
  })
  @IsString({ message: 'Title must be a string' })
  @IsOptional()
  title?: string;

  @ApiProperty({
    description: 'Task description',
    example: 'Descrição atualizada da tarefa',
    required: false,
  })
  @IsString({ message: 'Description must be a string' })
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Task status',
    enum: TaskStatus,
    example: TaskStatus.IN_PROGRESS,
    required: false,
  })
  @IsEnum(TaskStatus, {
    message: 'Status must be pending, in-progress, or completed',
  })
  @IsOptional()
  status?: TaskStatus;
}
