import axios, { AxiosRequestConfig } from "axios";
import { Invitation, Room, Entity, User } from "../models";

const API_URL = "http://localhost:3000/api";

function authHeader() {
  const accessToken = localStorage.getItem("accessToken");

  if (accessToken) {
    return { Authorization: "Bearer " + accessToken };
  } else {
    return {};
  }
}

function delay(ms = 1000) {
  if (process.env.NODE_ENV === "development") {
    return new Promise(resolve => setTimeout(resolve, ms));
  } else {
    return Promise.resolve();
  }
}

class ApiService {
  // Auth

  async signIn(emailAddress: string, password: string) {
    await delay();
    const response = await axios.post(`${API_URL}/signin`, {
      emailAddress: emailAddress,
      password: password
    });
    if (response.data.accessToken) {
      localStorage.setItem("accessToken", response.data.accessToken);
    }

    return response.data.user;
  }

  async signUp(data: UserSignUp) {
    await delay();
    const response = await axios.put(`${API_URL}/user`, data);
    return response.data;
  }

  logOut() {
    localStorage.removeItem("accessToken");
  }

  // Invitations

  getInvitation(code: string): Promise<Invitation> {
    return this.get(`/invitation?code=${code}`);
  }

  sendInvitations(invitations: Invitation[]) {
    return this.put("/invitation", invitations);
  }

  // Users

  users(): Promise<[User]> {
    return this.get("/user");
  }

  // Rooms

  rooms(): Promise<Entity<Room>[]> {
    return this.get("/room");
  }

  updateRooms(updates: Entity<Room>[], inserts: Room[]): Promise<[string]> {
    return this.post("/room", {
      inserts: inserts,
      updates: updates
    });
  }

  joinRoom(roomId: string): Promise<string> {
    return this.post(`/room/${roomId}/join`);
  }

  // Request

  async post(
    path: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<any> {
    await delay();
    const response = await axios.post(`${API_URL}${path}`, data, {
      headers: authHeader(),
      ...config
    });
    return response.data;
  }

  async get(path: string, config?: AxiosRequestConfig): Promise<any> {
    await delay();
    const response = await axios.get(`${API_URL}${path}`, {
      headers: authHeader(),
      ...config
    });
    return response.data;
  }

  async put(
    path: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<any> {
    await delay();
    const response = await axios.put(`${API_URL}${path}`, data, {
      headers: authHeader(),
      ...config
    });
    return response.data;
  }
}

export interface UserSignUp {
  invitationCode: string;
  user: {
    emailAddress: string;
    password: string;
    fullName: string;
    displayName: string;
    affiliation: string;
  };
}

export default new ApiService();
