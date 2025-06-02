import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskResponseDto } from './dto/task-response.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskStatus } from './enums/task-status.enum';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createTaskDto: CreateTaskDto,
    userId: string,
  ): Promise<TaskResponseDto> {
    const existingTask = await this.prisma.task.findFirst({
      where: {
        title: createTaskDto.title,
        userId: userId,
      },
    });

    if (existingTask) {
      throw new Error('title must be unique');
    }

    const task = await this.prisma.task.create({
      data: {
        ...createTaskDto,
        userId: userId,
      },
    });

    return task;
  }

  async findAllByUser(
    userId: string,
    status?: TaskStatus,
  ): Promise<TaskResponseDto[]> {
    const where: { userId: string; status?: TaskStatus } = { userId };

    if (status) {
      where.status = status;
    }

    const tasks = await this.prisma.task.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return tasks;
  }

  async findOneByUser(
    id: string,
    userId: string,
  ): Promise<TaskResponseDto | null> {
    const task = await this.prisma.task.findFirst({
      where: {
        id: id,
        userId: userId,
      },
    });

    return task;
  }

  async update(
    id: string,
    updateTaskDto: UpdateTaskDto,
    userId: string,
  ): Promise<TaskResponseDto | null> {
    const existingTask = await this.findOneByUser(id, userId);
    if (!existingTask) {
      return null;
    }

    if (updateTaskDto.title && updateTaskDto.title !== existingTask.title) {
      const duplicateTask = await this.prisma.task.findFirst({
        where: {
          title: updateTaskDto.title,
          userId: userId,
          id: { not: id },
        },
      });

      if (duplicateTask) {
        throw new Error('title must be unique');
      }
    }

    const updatedTask = await this.prisma.task.update({
      where: { id },
      data: updateTaskDto,
    });

    return updatedTask;
  }

  async remove(id: string, userId: string): Promise<boolean> {
    const existingTask = await this.findOneByUser(id, userId);
    if (!existingTask) {
      return false;
    }

    await this.prisma.task.delete({
      where: { id },
    });

    return true;
  }
}
