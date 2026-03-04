const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

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
    const token = api.getToken();
    const url = new URL(`${BASE_URL}/auth/register`);
    if (parentRequestId) {
      url.searchParams.append("parent_request_id", parentRequestId.toString());
    }

    const response = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    return {
      ...result,
      code: response.status,
    };
  },

  login: async (data: {
    email: string;
    password?: string;
  }): Promise<RegisterResponse> => {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  checkEmail: async (
    email: string,
  ): Promise<{ status: boolean; message: string }> => {
    const response = await fetch(`${BASE_URL}/auth/check-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ email }),
    });
    return response.json();
  },

  verifyOtp: async (data: {
    email: string;
    otp: string;
  }): Promise<RegisterResponse> => {
    const response = await fetch(`${BASE_URL}/auth/verify-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  getUser: async (): Promise<UserResponse> => {
    const token = api.getToken();
    if (!token) return { status: false, message: "No token found" };

    const response = await fetch(`${BASE_URL}/auth/user`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });
    return response.json();
  },

  logout: async (): Promise<LogoutResponse> => {
    const token = api.getToken();
    if (!token) return { status: true, message: "Already logged out" };

    const response = await fetch(`${BASE_URL}/auth/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });
    const result = await response.json();
    if (result.status) {
      api.removeToken();
    }
    return result;
  },

  updateParentRequest: async (
    id: number,
    data: {
      first_name: string;
      last_name: string;
      parent_address: string;
      children: { id?: number; child_dob: string }[];
    },
  ): Promise<ParentRequestResponse> => {
    const token = api.getToken();
    const response = await fetch(`${BASE_URL}/parent-requests/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    return {
      ...result,
      code: response.status,
    };
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
    const token = api.getToken();
    const response = await fetch(`${BASE_URL}/parent-requests`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    return {
      ...result,
      code: response.status,
    };
  },

  getParentSchedules: async (
    parentRequestId: number,
  ): Promise<{ status: boolean; data: any[] }> => {
    const token = api.getToken();
    const response = await fetch(
      `${BASE_URL}/parent-schedules?parent_request_id=${parentRequestId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      },
    );
    return response.json();
  },

  createParentSchedules: async (data: {
    parent_request_id: number;
    schedules: {
      date: string;
      slots: { start_time: string; end_time: string }[];
    }[];
  }): Promise<{ status: boolean; message: string }> => {
    const token = api.getToken();
    const response = await fetch(`${BASE_URL}/parent-schedules`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  updateParentSchedule: async (
    scheduleId: number,
    data: {
      date: string;
      slots: { id?: number; start_time: string; end_time: string }[];
    },
  ): Promise<{ status: boolean; message: string; data?: any }> => {
    const token = api.getToken();
    const response = await fetch(`${BASE_URL}/parent-schedules/${scheduleId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  getParentBabysitterChoices: async (
    parentRequestId: number,
  ): Promise<{ status: boolean; data: any[] }> => {
    const token = api.getToken();
    const response = await fetch(
      `${BASE_URL}/parent-babysitter-choices?parent_request_id=${parentRequestId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      },
    );
    return response.json();
  },

  getExternalBabysitters: async (
    page: number = 1,
    filters: Record<string, any> = {},
  ): Promise<any> => {
    const url = new URL("https://bloom-buddies.fr/api/all-bs-for-api");
    url.searchParams.append("page", page.toString());

    Object.entries(filters).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => {
          if (v) url.searchParams.append(`${key}[]`, v.toString());
        });
      } else if (value) {
        url.searchParams.append(key, value.toString());
      }
    });

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });
    return response.json();
  },

  createBabysitterChoices: async (data: {
    parent_request_id: number;
    choices: BabysitterChoicePayload[];
  }): Promise<{ status: boolean; message: string }> => {
    const token = api.getToken();
    const response = await fetch(`${BASE_URL}/parent-babysitter-choices`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  updateBabysitterChoice: async (
    choiceId: number,
    data: BabysitterChoicePayload,
  ): Promise<{ status: boolean; message: string; data?: any }> => {
    const token = api.getToken();
    const response = await fetch(
      `${BASE_URL}/parent-babysitter-choices/${choiceId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      },
    );
    return response.json();
  },

  /**
   * Fetch all parent requests for the admin dashboard.
   * The endpoint returns a plain array which is normalised into { status, data }.
   */
  getParentRequests: async (): Promise<{
    status: boolean;
    data: ParentRequest[];
  }> => {
    const token = api.getToken();
    const response = await fetch(`${BASE_URL}/parent-requests`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });
    const json = await response.json();
    return {
      status: response.ok,
      data: Array.isArray(json) ? json : [],
    };
  },
};
