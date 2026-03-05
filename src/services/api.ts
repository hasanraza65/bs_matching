import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

// --- Centralized Axios Client ---
const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: false, // Disabled by default to fix CORS. Re-enable specifically for endpoints that support credentials/cookies.
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Add a request interceptor to attach the token if available
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface Child {
  id?: number;
  child_dob: string;
}

export interface Slot {
  id: number;
  parent_schedule_id: number;
  start_time: string;
  end_time: string;
}

export interface Schedule {
  id: number;
  user_id: number;
  parent_request_id: number;
  schedule_date: string;
  slots: Slot[];
}

export interface Choice {
  id: number;
  user_id: number;
  parent_request_id: number;
  choice_order: number;
  interview_date: string;
  interview_time: string;
  babysitter_first_name: string;
  babysitter_last_name: string;
  babysitter_email: string;
  babysitter_phone: string;
  babysitter_address: string;
}

export interface ParentRequest {
  id: number;
  user_id: number;
  parent_address: string;
  quote_status: number;
  board_status: string;
  board_order: number;
  user: User;
  children: Child[];
  schedules?: Schedule[];
  choices?: Choice[];
  created_at?: string;
  updated_at?: string;
}

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  user_phone: string;
  user_address: string;
  user_role: number;
  children?: Child[];
  parent_requests?: ParentRequest[];
}

export interface RegisterResponse {
  status: boolean;
  message: string;
  data?: {
    user: User;
    parent_request: {
      id: number;
      user_id: number;
      parent_address: string;
      children: Child[];
    };
    token: string | null;
    password?: string | null;
  };
  errors?: Record<string, string[]>;
  code?: number;
}

export interface ParentRequestResponse {
  status: boolean;
  message: string;
  data?: ParentRequest;
  errors?: Record<string, string[]>;
  code?: number;
}

export interface UserResponse {
  status: boolean;
  data?: User;
  message?: string;
}

export interface LogoutResponse {
  status: boolean;
  message: string;
}

export interface BabysitterChoicePayload {
  choice_order?: number;
  babysitter_first_name?: string;
  babysitter_last_name?: string;
  babysitter_email?: string;
  babysitter_phone?: string;
  babysitter_address?: string;
  interview_date?: string;
  interview_time?: string;
}

export const api = {
  getToken: () => localStorage.getItem("auth_token"),
  setToken: (token: string) => localStorage.setItem("auth_token", token),
  removeToken: () => localStorage.removeItem("auth_token"),

  register: async (
    data: {
      first_name: string;
      last_name: string;
      email: string;
      user_phone: string;
      user_address: string;
      children: { child_dob: string }[];
      board_status?: string;
    },
    parentRequestId?: number,
  ): Promise<RegisterResponse> => {
    const params = parentRequestId
      ? { parent_request_id: parentRequestId }
      : {};
    const response = await apiClient.post("/auth/register", data, { params });
    return {
      ...response.data,
      code: response.status,
    };
  },

  login: async (data: {
    email: string;
    password?: string;
  }): Promise<RegisterResponse> => {
    const response = await apiClient.post("/auth/login", data);
    return response.data;
  },

  checkEmail: async (
    email: string,
  ): Promise<{ status: boolean; message: string }> => {
    const response = await apiClient.post("/auth/check-email", { email });
    return response.data;
  },

  verifyOtp: async (data: {
    email: string;
    otp: string;
  }): Promise<RegisterResponse> => {
    const response = await apiClient.post("/auth/verify-otp", data);
    return response.data;
  },

  getUser: async (): Promise<UserResponse> => {
    try {
      const response = await apiClient.get("/auth/user");
      return response.data;
    } catch (error) {
      return { status: false, message: "Request failed" };
    }
  },

  logout: async (): Promise<LogoutResponse> => {
    const response = await apiClient.post("/auth/logout");
    if (response.data.status) {
      api.removeToken();
    }
    return response.data;
  },

  updateParentRequest: async (
    id: number,
    data: {
      first_name: string;
      last_name: string;
      parent_address: string;
      children: { id?: number; child_dob: string }[];
      choices?: BabysitterChoicePayload[];
      _method?: string;
    },
  ): Promise<ParentRequestResponse> => {
    const response = await apiClient.post(`/parent-requests/${id}`, {
      ...data,
      _method: "put",
    });
    return {
      ...response.data,
      code: response.status,
    };
  },

  updateBoardStatus: async (data: {
    parent_request_id: number;
    board_status: string;
    board_order: number;
  }): Promise<{ status: boolean; message: string }> => {
    const response = await apiClient.post("/update-board-status", data);
    return response.data;
  },

  createParentRequest: async (data: {
    first_name: string;
    last_name: string;
    email: string;
    parent_address: string;
    children: { child_dob: string }[];
    schedules: any[];
    board_status?: string;
  }): Promise<ParentRequestResponse> => {
    const response = await apiClient.post("/parent-requests", data);
    return {
      ...response.data,
      code: response.status,
    };
  },

  getSingleParentRequest: async (id: number): Promise<ParentRequest> => {
    const response = await apiClient.get(`/parent-requests/${id}`);
    return response.data;
  },

  getParentSchedules: async (
    parentRequestId: number,
  ): Promise<{ status: boolean; data: any[] }> => {
    const response = await apiClient.get("/parent-schedules", {
      params: { parent_request_id: parentRequestId },
    });
    return response.data;
  },

  createParentSchedules: async (data: {
    parent_request_id: number;
    schedules: {
      date: string;
      slots: { start_time: string; end_time: string }[];
    }[];
  }): Promise<{ status: boolean; message: string }> => {
    const response = await apiClient.post("/parent-schedules", data);
    return response.data;
  },

  updateParentSchedule: async (
    scheduleId: number,
    data: {
      date: string;
      slots: { id?: number; start_time: string; end_time: string }[];
    },
  ): Promise<{ status: boolean; message: string; data?: any }> => {
    const response = await apiClient.put(
      `/parent-schedules/${scheduleId}`,
      data,
    );
    return response.data;
  },

  getParentBabysitterChoices: async (
    parentRequestId: number,
  ): Promise<{ status: boolean; data: any[] }> => {
    const response = await apiClient.get("/parent-babysitter-choices", {
      params: { parent_request_id: parentRequestId },
    });
    return response.data;
  },

  getExternalBabysitters: async (
    page: number = 1,
    filters: Record<string, any> = {},
  ): Promise<any> => {
    const response = await axios.get(
      "https://bloom-buddies.fr/api/all-bs-for-api",
      {
        params: { page, ...filters },
      },
    );
    return response.data;
  },

  createBabysitterChoices: async (data: {
    parent_request_id: number;
    choices: BabysitterChoicePayload[];
  }): Promise<{ status: boolean; message: string }> => {
    const response = await apiClient.post("/parent-babysitter-choices", data);
    return response.data;
  },

  updateBabysitterChoice: async (
    choiceId: number,
    data: BabysitterChoicePayload,
  ): Promise<{ status: boolean; message: string; data?: any }> => {
    const response = await apiClient.put(
      `/parent-babysitter-choices/${choiceId}`,
      data,
    );
    return response.data;
  },

  getParentRequests: async (): Promise<{
    status: boolean;
    data: ParentRequest[];
  }> => {
    const response = await apiClient.get("/parent-requests");
    const data = response.data;
    return {
      status: response.status >= 200 && response.status < 300,
      data: Array.isArray(data) ? data : [],
    };
  },

  acceptPriceQuote: async (
    id: number,
  ): Promise<{ status: boolean; message: string }> => {
    const response = await apiClient.post(`/accept-price-quote/${id}`);
    return response.data;
  },
};
