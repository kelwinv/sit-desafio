interface LoginResponse {
  token: string;
  data: {
    id: string;
    name: string;
    email: string;
  };
}

interface RegisterResponse {
  token: string;
  data: {
    id: string;
    name: string;
    email: string;
  };
}

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333";

    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("taskmanager_token");
    }
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== "undefined") {
      localStorage.setItem("taskmanager_token", token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("taskmanager_token");
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers["authorization"] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      if (options.method === "DELETE") {
        return {} as T;
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    return this.request<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  async register(
    name: string,
    email: string,
    password: string
  ): Promise<RegisterResponse> {
    return this.request<RegisterResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
  }

  async getTasks(): Promise<Task[]> {
    const { data: task } = await this.request<{ data: Task[] }>("/tasks");

    return task;
  }

  async getTask(id: string): Promise<Task> {
    const { data: task } = await this.request<{ data: Task }>(`/tasks/${id}`);
    return task;
  }

  async createTask(
    task: Omit<Task, "id" | "createdAt" | "updatedAt">
  ): Promise<Task> {
    const { data } = await this.request<{ data: Task }>("/tasks", {
      method: "POST",
      body: JSON.stringify(task),
    });

    return data;
  }

  async updateTask(
    id: string,
    task: Partial<Omit<Task, "id" | "createdAt" | "updatedAt">>
  ): Promise<Task> {
    const { data } = await this.request<{ data: Task }>(`/tasks/${id}`, {
      method: "PUT",
      body: JSON.stringify(task),
    });

    return data;
  }

  async deleteTask(id: string): Promise<void> {
    await this.request<void>(`/tasks/${id}`, {
      method: "DELETE",
    });
  }

  async healthCheck(): Promise<{ status: string }> {
    return this.request<{ status: string }>("/health");
  }
}

export const apiClient = new ApiClient();

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: "pending" | "in-progress" | "completed";
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}
