import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  HttpCode,
  HttpStatus,
  Put,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { TaskQueryDto } from './dto/task-query.dto';
import {
  TaskPostResponse,
  TaskErrorResponseDto,
  TaskGetResponse,
  TaskSingleResponse,
} from './dto/task-response.dto';
import { TaskStatus } from './enums/task-status.enum';
import { AuthenticatedRequest } from 'src/auth/interfaces/authenticated-request.interface';
import { isUUID } from 'class-validator';

@ApiTags('Tasks')
@Controller('tasks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new task',
    description: 'Creates a new task for the authenticated user',
  })
  @ApiResponse({
    status: 201,
    description: 'Task successfully created',
    type: TaskPostResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation errors or title not unique',
    type: TaskErrorResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid or missing token',
    type: TaskErrorResponseDto,
  })
  async createTask(
    @Body() createTaskDto: CreateTaskDto,
    @Request() req: AuthenticatedRequest,
  ): Promise<TaskPostResponse> {
    try {
      const task = await this.tasksService.create(createTaskDto, req.user.id);
      return {
        message: ['Task created successfully'],
        data: task,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message.includes('title must be unique')) {
          throw new BadRequestException({
            status: 400,
            data: null,
            error: ['title must be unique'],
          } as TaskErrorResponseDto);
        }
        throw new BadRequestException({
          status: 400,
          data: null,
          error: [error.message],
        } as TaskErrorResponseDto);
      }

      throw new BadRequestException({
        status: 400,
        data: null,
        error: ['Unexpected error during task creation'],
      } as TaskErrorResponseDto);
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get all tasks',
    description: 'Retrieves all tasks belonging to the authenticated user',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: TaskStatus,
    description: 'Filter tasks by status',
  })
  @ApiResponse({
    status: 200,
    description: 'Tasks retrieved successfully',
    type: TaskGetResponse,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid or missing token',
    type: TaskErrorResponseDto,
  })
  async getTasks(
    @Query() query: TaskQueryDto,
    @Request() req: AuthenticatedRequest,
  ): Promise<TaskGetResponse> {
    try {
      const tasks = await this.tasksService.findAllByUser(
        req.user.id,
        query.status,
      );
      return {
        message: ['Tasks retrieved successfully'],
        data: tasks,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new BadRequestException({
          status: 400,
          data: null,
          error: [error.message],
        } as TaskErrorResponseDto);
      }

      throw new BadRequestException({
        status: 400,
        data: null,
        error: ['Unexpected error during tasks retrieval'],
      } as TaskErrorResponseDto);
    }
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get task by ID',
    description:
      'Retrieves a specific task by ID (only if owned by the authenticated user)',
  })
  @ApiParam({
    name: 'id',
    description: 'Task UUID',
    example: '5fe3df67-72e5-4504-abc7-d2f433cd61ba',
  })
  @ApiResponse({
    status: 200,
    description: 'Task retrieved successfully',
    type: TaskSingleResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid UUID format',
    type: TaskErrorResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid or missing token',
    type: TaskErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Task not found or does not belong to user',
    type: TaskErrorResponseDto,
  })
  async getTaskById(
    @Param('id') id: string,
    @Request() req: AuthenticatedRequest,
  ): Promise<TaskSingleResponse> {
    try {
      if (!isUUID(id)) {
        throw new BadRequestException({
          status: 400,
          data: null,
          error: ['Invalid task ID format'],
        } as TaskErrorResponseDto);
      }

      const task = await this.tasksService.findOneByUser(id, req.user.id);
      if (!task) {
        throw new NotFoundException({
          status: 404,
          data: null,
          error: ['Task not found'],
        } as TaskErrorResponseDto);
      }

      return {
        message: ['Task retrieved successfully'],
        data: task,
      };
    } catch (error: unknown) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      if (error instanceof Error) {
        throw new BadRequestException({
          status: 400,
          data: null,
          error: [error.message],
        } as TaskErrorResponseDto);
      }

      throw new BadRequestException({
        status: 400,
        data: null,
        error: ['Unexpected error during task retrieval'],
      } as TaskErrorResponseDto);
    }
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update task',
    description:
      'Updates a specific task (only if owned by the authenticated user)',
  })
  @ApiParam({
    name: 'id',
    description: 'Task UUID',
    example: '5fe3df67-72e5-4504-abc7-d2f433cd61ba',
  })
  @ApiResponse({
    status: 200,
    description: 'Task updated successfully',
    type: TaskPostResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation errors or title not unique',
    type: TaskErrorResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid or missing token',
    type: TaskErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Task not found or does not belong to user',
    type: TaskErrorResponseDto,
  })
  async updateTask(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Request() req: AuthenticatedRequest,
  ): Promise<TaskPostResponse> {
    try {
      const task = await this.tasksService.update(
        id,
        updateTaskDto,
        req.user.id,
      );
      if (!task) {
        throw new NotFoundException({
          status: 404,
          data: null,
          error: ['Task not found'],
        } as TaskErrorResponseDto);
      }

      return {
        message: ['Task updated successfully'],
        data: task,
      };
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      if (error instanceof Error) {
        if (error.message.includes('title must be unique')) {
          throw new BadRequestException({
            status: 400,
            data: null,
            error: ['title must be unique'],
          } as TaskErrorResponseDto);
        }
        throw new BadRequestException({
          status: 400,
          data: null,
          error: [error.message],
        } as TaskErrorResponseDto);
      }

      throw new BadRequestException({
        status: 400,
        data: null,
        error: ['Unexpected error during task update'],
      } as TaskErrorResponseDto);
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete task',
    description:
      'Deletes a specific task (only if owned by the authenticated user)',
  })
  @ApiParam({
    name: 'id',
    description: 'Task UUID',
    example: '5fe3df67-72e5-4504-abc7-d2f433cd61ba',
  })
  @ApiResponse({
    status: 204,
    description: 'Task deleted successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid UUID format',
    type: TaskErrorResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid or missing token',
    type: TaskErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Task not found or does not belong to user',
    type: TaskErrorResponseDto,
  })
  async deleteTask(
    @Param('id') id: string,
    @Request() req: AuthenticatedRequest,
  ): Promise<void> {
    try {
      if (!isUUID(id)) {
        throw new BadRequestException({
          status: 400,
          data: null,
          error: ['Invalid task ID format'],
        } as TaskErrorResponseDto);
      }

      const deleted = await this.tasksService.remove(id, req.user.id);
      if (!deleted) {
        throw new NotFoundException({
          status: 404,
          data: null,
          error: ['Task not found'],
        } as TaskErrorResponseDto);
      }
    } catch (error: unknown) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      if (error instanceof Error) {
        throw new BadRequestException({
          status: 400,
          data: null,
          error: [error.message],
        } as TaskErrorResponseDto);
      }

      throw new BadRequestException({
        status: 400,
        data: null,
        error: ['Unexpected error during task deletion'],
      } as TaskErrorResponseDto);
    }
  }
}
