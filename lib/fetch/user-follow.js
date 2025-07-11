export async function fetchFollowers() {
  const userId = getUserId();
  const token = getAuthToken();
  if (!userId) throw new Error("Usuario no autenticado");
  const response = await axios.get(`${API_BASE_URL}/followers/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}
import axios from "axios";
import { API_BASE_URL, getUserId} from "../global";
import { getAuthToken } from "../global";

export async function followUser(userId) {
  const token = getAuthToken();
  const response = await axios.post(
    `${API_BASE_URL}/follow/${userId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
}

export async function unfollowUser(userId) {
  const token = getAuthToken();
  const myUserId = getUserId();
  const response = await axios.post(
    `${API_BASE_URL}/unfollow/${userId}`,
    { user: myUserId},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
}

export async function fetchFollowing() {
  const userId = getUserId();
  const token = getAuthToken();
  if (!userId) throw new Error("Usuario no autenticado");
  const response = await axios.get(`${API_BASE_URL}/following/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}