import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";

// API base URL
const API_BASE_URL = "http://192.168.69.10:5000";

export const useAuthStore = defineStore("auth", () => {
  const token = ref<string | null>(localStorage.getItem("token"));
  const user = ref<any>(null);
  const router = useRouter();

  // Helper function to set token
  const setToken = (newToken: string) => {
    token.value = newToken;
    localStorage.setItem("token", newToken);
  };

  const clearToken = () => {
    token.value = null;
    localStorage.removeItem("token");
  };

  const login = async (userPhoneNumber: string, password: string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/start/login`, {
        userPhoneNumber,
        password,
      });
      if (response.data.code === 0) {
        setToken(response.data.token);
        await fetchUser();
        router.push("/home");
      } else {
        throw new Error(response.data.message || "登录失败");
      }
    } catch (error) {
      console.error("登录失败", error);
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    clearToken();
    user.value = null;
    router.push("/login");
  };

  // Fetch user function
  const fetchUser = async () => {
    if (!token.value) {
      console.log("没有token");
      throw new Error("没有登录");
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/user/verify`, {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      });

      const userData = response.data.data;
      if (userData.userGender !== undefined) {
        userData.userGender = userData.userGender === 0 ? "0" : "1";
      }
      user.value = userData;
      // console.log(user.value);
    } catch (error) {
      console.error("获取用户信息失败", error);
      logout();
    }
  };

  // Update user function
  const updateUser = async (updatedUserData: any) => {
    if (!token.value) {
      console.log("没有token");
      throw new Error("没有登录");
    }
    try {
      const response = await axios.post(
        `${API_BASE_URL}/user/modify`,
        updatedUserData,
        {
          headers: {
            Authorization: `Bearer ${token.value}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.code === 0) {
        ElMessage.success("修改成功");
      } else {
        throw new Error(response.data.message || "更新失败");
      }
    } catch (error) {
      console.error("更新用户信息失败", error);
      throw error;
    }
  };

  return { token, user, login, logout, fetchUser, updateUser };
});
