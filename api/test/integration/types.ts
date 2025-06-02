import { TaskGetResponse, TaskPostResponse } from 'src/tasks/types/responses';

type CreateTaskDto = {
  title: string;
  description?: string;
  status: 'pending' | 'in-progress' | 'completed';
};

type UpdateTaskDto = Partial<CreateTaskDto>;

type TaskResponse = TaskPostResponse['data'];

type CreateUserDto = {
  email: string;
  password: string;
  name: string;
};

type LoginDto = {
  email: string;
  password: string;
};
