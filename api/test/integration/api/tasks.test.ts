import { INestApplication } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTaskDto } from 'src/tasks/dto/create-task.dto';
import {
  TaskErrorResponseDto,
  TaskGetResponse,
  TaskPostResponse,
  TaskSingleResponse,
} from 'src/tasks/dto/task-response.dto';
import { UpdateTaskDto } from 'src/tasks/dto/update-task.dto';
import { TaskStatus } from 'src/tasks/enums/task-status.enum';
import * as request from 'supertest';
import { App } from 'supertest/types';

import { TestUserWithToken } from 'test/types/types';
import { createTestUserWithToken } from 'test/utils/createUser';
import { testApp } from 'test/utils/testApp';

describe('Tasks API', () => {
  let app: INestApplication<App>;
  let testUser1: TestUserWithToken;
  let testUser2: TestUserWithToken;
  let prisma: PrismaService;

  beforeAll(async () => {
    app = await testApp();
    prisma = app.get<PrismaService>(PrismaService);

    testUser1 = await createTestUserWithToken(
      {
        email: 'test1@gmail.com',
        name: 'test1',
      },
      prisma,
    );

    testUser2 = await createTestUserWithToken(
      {
        email: 'test2@gmail.com',
        name: 'test2',
      },
      prisma,
    );
  });

  afterEach(async () => {
    await prisma.task.deleteMany();
  });

  afterAll(async () => {
    await prisma.user.deleteMany();
    await app.close();
  });

  describe('POST /tasks', () => {
    it('should create a new task and return 201 when authenticated', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'Implementar autenticação JWT',
        description: 'Adicionar sistema de autenticação com JWT ao projeto',
        status: TaskStatus.PENDING,
      };

      const response = await request(app.getHttpServer())
        .post('/tasks')
        .set('Authorization', `Bearer ${testUser1.token}`)
        .send(createTaskDto);

      expect(response.status).toBe(201);

      const { data: task } = response.body as TaskPostResponse;

      expect(task.id).toBeDefined();
      expect(task.title).toBe(createTaskDto.title);
      expect(task.description).toBe(createTaskDto.description);
      expect(task.status).toBe(createTaskDto.status);
      expect(task.userId).toBe(testUser1.id);
      expect(task.createdAt).toBeDefined();
      expect(task.updatedAt).toBeDefined();

      const dbTask = await prisma.task.findUnique({
        where: { id: task.id },
      });
      expect(dbTask?.id).toBe(task.id);
      expect(dbTask?.userId).toBe(testUser1.id);
    });

    it('should return 401 when no token is provided', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'Tarefa sem autenticação',
        status: TaskStatus.PENDING,
      };

      const response = await request(app.getHttpServer())
        .post('/tasks')
        .send(createTaskDto);

      const body = response.body as TaskPostResponse;

      expect(response.status).toBe(401);
      expect(body.message).toContain('Token not provided');
    });

    it('should return 401 when invalid token is provided', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'Tarefa com token inválido',
        status: TaskStatus.PENDING,
      };

      const response = await request(app.getHttpServer())
        .post('/tasks')
        .set('Authorization', 'Bearer invalid-token')
        .send(createTaskDto);

      expect(response.status).toBe(401);
    });

    it('should return 400 when required fields are missing', async () => {
      const incompleteTaskDto = {
        description: 'Descrição sem título',
      };

      const response = await request(app.getHttpServer())
        .post('/tasks')
        .set('Authorization', `Bearer ${testUser1.token}`)
        .send(incompleteTaskDto);

      expect(response.status).toBe(400);
    });

    it('should return 400 when title is not unique for the user', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'Tarefa Duplicada',
        status: TaskStatus.PENDING,
      };

      await request(app.getHttpServer())
        .post('/tasks')
        .set('Authorization', `Bearer ${testUser1.token}`)
        .send(createTaskDto);

      const response = await request(app.getHttpServer())
        .post('/tasks')
        .set('Authorization', `Bearer ${testUser1.token}`)
        .send(createTaskDto);

      const body = response.body as TaskErrorResponseDto;

      expect(response.status).toBe(400);
      expect(body.error).toContain('title must be unique');
    });

    it('should allow same title for different users', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'Tarefa Comum',
        status: TaskStatus.PENDING,
      };

      const response1 = await request(app.getHttpServer())
        .post('/tasks')
        .set('Authorization', `Bearer ${testUser1.token}`)
        .send(createTaskDto);

      expect(response1.status).toBe(201);

      const response2 = await request(app.getHttpServer())
        .post('/tasks')
        .set('Authorization', `Bearer ${testUser2.token}`)
        .send(createTaskDto);

      expect(response2.status).toBe(201);
    });

    it('should return 400 when status is invalid', async () => {
      const invalidTaskDto = {
        title: 'Tarefa com status inválido',
        status: 'invalid-status',
      };

      const response = await request(app.getHttpServer())
        .post('/tasks')
        .set('Authorization', `Bearer ${testUser1.token}`)
        .send(invalidTaskDto);

      expect(response.status).toBe(400);
    });
  });

  describe('GET /tasks', () => {
    it('should return only tasks from authenticated user', async () => {
      const task1 = await prisma.task.create({
        data: {
          title: 'Tarefa do Usuário 1',
          description: 'Primeira tarefa',
          status: TaskStatus.PENDING,
          userId: testUser1.id,
        },
      });

      const task2 = await prisma.task.create({
        data: {
          title: 'Segunda Tarefa do Usuário 1',
          description: 'Segunda tarefa',
          status: 'in-progress',
          userId: testUser1.id,
        },
      });

      await prisma.task.create({
        data: {
          title: 'Tarefa do Usuário 2',
          description: 'Tarefa do outro usuário',
          status: 'completed',
          userId: testUser2.id,
        },
      });

      const response = await request(app.getHttpServer())
        .get('/tasks')
        .set('Authorization', `Bearer ${testUser1.token}`);

      expect(response.status).toBe(200);

      const { data: tasks } = response.body as TaskGetResponse;

      expect(tasks).toHaveLength(2);
      expect(tasks.find((t) => t.id === task1.id)).toBeDefined();
      expect(tasks.find((t) => t.id === task2.id)).toBeDefined();

      tasks.forEach((task) => {
        expect(task.userId).toBe(testUser1.id);
      });
    });

    it('should return 401 when no token is provided', async () => {
      const response = await request(app.getHttpServer()).get('/tasks');

      expect(response.status).toBe(401);
    });

    it('should return empty array when user has no tasks', async () => {
      const response = await request(app.getHttpServer())
        .get('/tasks')
        .set('Authorization', `Bearer ${testUser1.token}`);

      expect(response.status).toBe(200);

      const { data: tasks } = response.body as TaskGetResponse;

      expect(Array.isArray(tasks)).toBe(true);
      expect(tasks).toHaveLength(0);
    });

    it('should support filtering by status', async () => {
      await prisma.task.create({
        data: {
          title: 'Tarefa Pendente',
          status: TaskStatus.PENDING,
          userId: testUser1.id,
        },
      });

      const completedTask = await prisma.task.create({
        data: {
          title: 'Tarefa Completa',
          status: 'completed',
          userId: testUser1.id,
        },
      });

      const response = await request(app.getHttpServer())
        .get('/tasks?status=completed')
        .set('Authorization', `Bearer ${testUser1.token}`);

      expect(response.status).toBe(200);

      const { data: tasks } = response.body as TaskGetResponse;

      expect(tasks).toHaveLength(1);
      expect(tasks[0].id).toBe(completedTask.id);
      expect(tasks[0].status).toBe('completed');
    });
  });

  describe('GET /tasks/:id', () => {
    it('should return a specific task owned by the user', async () => {
      const createdTask = await prisma.task.create({
        data: {
          title: 'Tarefa Específica',
          description: 'Descrição da tarefa específica',
          status: 'in-progress',
          userId: testUser1.id,
        },
      });

      const response = await request(app.getHttpServer())
        .get(`/tasks/${createdTask.id}`)
        .set('Authorization', `Bearer ${testUser1.token}`);

      expect(response.status).toBe(200);

      const { data: task } = response.body as TaskSingleResponse;

      expect(task.id).toBe(createdTask.id);
      expect(task.title).toBe(createdTask.title);
      expect(task.description).toBe(createdTask.description);
      expect(task.status).toBe(createdTask.status);
      expect(task.userId).toBe(testUser1.id);
    });

    it('should return 404 when task does not exist', async () => {
      const response = await request(app.getHttpServer())
        .get('/tasks/5fe3df67-72e5-4504-abc7-d2f433cd61ba')
        .set('Authorization', `Bearer ${testUser1.token}`);

      expect(response.status).toBe(404);
    });

    it('should return 404 when task belongs to another user', async () => {
      const taskFromAnotherUser = await prisma.task.create({
        data: {
          title: 'Tarefa de Outro Usuário',
          status: TaskStatus.PENDING,
          userId: testUser2.id,
        },
      });

      const response = await request(app.getHttpServer())
        .get(`/tasks/${taskFromAnotherUser.id}`)
        .set('Authorization', `Bearer ${testUser1.token}`);

      expect(response.status).toBe(404);
    });

    it('should return 401 when no token is provided', async () => {
      const response = await request(app.getHttpServer()).get('/tasks/some-id');

      expect(response.status).toBe(401);
    });

    it('should return 400 when id is not a valid UUID', async () => {
      const response = await request(app.getHttpServer())
        .get('/tasks/invalid-id')
        .set('Authorization', `Bearer ${testUser1.token}`);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        status: 400,
        data: null,
        error: ['Invalid task ID format'],
      });
    });
  });

  describe('PUT /tasks/:id', () => {
    it('should update an existing task owned by the user', async () => {
      const createdTask = await prisma.task.create({
        data: {
          title: 'Tarefa Original',
          description: 'Descrição original',
          status: TaskStatus.PENDING,
          userId: testUser1.id,
        },
      });

      const updateTaskDto: UpdateTaskDto = {
        title: 'Tarefa Atualizada',
        status: TaskStatus.IN_PROGRESS,
      };

      const response = await request(app.getHttpServer())
        .put(`/tasks/${createdTask.id}`)
        .set('Authorization', `Bearer ${testUser1.token}`)
        .send(updateTaskDto);

      expect(response.status).toBe(200);

      const { data: task } = response.body as TaskPostResponse;

      expect(task.id).toBe(createdTask.id);
      expect(task.title).toBe(updateTaskDto.title);
      expect(task.description).toBe(createdTask.description);
      expect(task.status).toBe(updateTaskDto.status);
      expect(task.userId).toBe(testUser1.id);
      expect(new Date(task.updatedAt).getTime()).toBeGreaterThan(
        new Date(createdTask.updatedAt).getTime(),
      );
    });

    it('should return 404 when task does not exist', async () => {
      const updateTaskDto: UpdateTaskDto = {
        title: 'Tarefa Inexistente',
      };

      const response = await request(app.getHttpServer())
        .put('/tasks/5fe3df67-72e5-4504-abc7-d2f433cd61be')
        .set('Authorization', `Bearer ${testUser1.token}`)
        .send(updateTaskDto);

      expect(response.status).toBe(404);
    });

    it('should return 404 when trying to update task from another user', async () => {
      const taskFromAnotherUser = await prisma.task.create({
        data: {
          title: 'Tarefa de Outro Usuário',
          status: TaskStatus.PENDING,
          userId: testUser2.id,
        },
      });

      const updateTaskDto: UpdateTaskDto = {
        title: 'Tentativa de Atualização',
      };

      const response = await request(app.getHttpServer())
        .put(`/tasks/${taskFromAnotherUser.id}`)
        .set('Authorization', `Bearer ${testUser1.token}`)
        .send(updateTaskDto);

      expect(response.status).toBe(404);
    });

    it('should return 400 when trying to update with invalid data', async () => {
      const createdTask = await prisma.task.create({
        data: {
          title: 'Tarefa para Atualizar',
          status: TaskStatus.PENDING,
          userId: testUser1.id,
        },
      });

      const invalidUpdateDto = {
        status: 'invalid-status',
      };

      const response = await request(app.getHttpServer())
        .put(`/tasks/${createdTask.id}`)
        .set('Authorization', `Bearer ${testUser1.token}`)
        .send(invalidUpdateDto);

      expect(response.status).toBe(400);
    });

    it('should return 401 when no token is provided', async () => {
      const response = await request(app.getHttpServer())
        .put('/tasks/some-id')
        .send({ title: 'Tentativa' });

      expect(response.status).toBe(401);
    });

    it('should return 400 when trying to update title to one that already exists for the user', async () => {
      await prisma.task.create({
        data: {
          title: 'Título Existente',
          status: TaskStatus.PENDING,
          userId: testUser1.id,
        },
      });

      const secondTask = await prisma.task.create({
        data: {
          title: 'Título Diferente',
          status: TaskStatus.PENDING,
          userId: testUser1.id,
        },
      });

      const updateTaskDto: UpdateTaskDto = {
        title: 'Título Existente',
      };

      const response = await request(app.getHttpServer())
        .put(`/tasks/${secondTask.id}`)
        .set('Authorization', `Bearer ${testUser1.token}`)
        .send(updateTaskDto);

      expect(response.status).toBe(400);

      const body = response.body as TaskErrorResponseDto;
      expect(body.error).toContain('title must be unique');
    });
  });

  describe('DELETE /tasks/:id', () => {
    it('should delete an existing task owned by the user', async () => {
      const createdTask = await prisma.task.create({
        data: {
          title: 'Tarefa para Deletar',
          status: TaskStatus.PENDING,
          userId: testUser1.id,
        },
      });

      const response = await request(app.getHttpServer())
        .delete(`/tasks/${createdTask.id}`)
        .set('Authorization', `Bearer ${testUser1.token}`);

      expect(response.status).toBe(204);

      const deletedTask = await prisma.task.findUnique({
        where: { id: createdTask.id },
      });
      expect(deletedTask).toBeNull();
    });

    it('should return 404 when trying to delete non-existent task', async () => {
      const response = await request(app.getHttpServer())
        .delete('/tasks/5fe3df67-72e5-4504-abc7-d2f433cd61bc')
        .set('Authorization', `Bearer ${testUser1.token}`);

      expect(response.status).toBe(404);
    });

    it('should return 404 when trying to delete task from another user', async () => {
      const taskFromAnotherUser = await prisma.task.create({
        data: {
          title: 'Tarefa de Outro Usuário',
          status: TaskStatus.PENDING,
          userId: testUser2.id,
        },
      });

      const response = await request(app.getHttpServer())
        .delete(`/tasks/${taskFromAnotherUser.id}`)
        .set('Authorization', `Bearer ${testUser1.token}`);

      expect(response.status).toBe(404);

      const taskStillExists = await prisma.task.findUnique({
        where: { id: taskFromAnotherUser.id },
      });
      expect(taskStillExists).not.toBeNull();
    });

    it('should return 401 when no token is provided', async () => {
      const response = await request(app.getHttpServer()).delete(
        '/tasks/some-id',
      );

      expect(response.status).toBe(401);
    });

    it('should return 400 when id is not a valid UUID', async () => {
      const response = await request(app.getHttpServer())
        .delete('/tasks/invalid-id')
        .set('Authorization', `Bearer ${testUser1.token}`);

      expect(response.status).toBe(400);
    });
  });
});
