import { useEffect } from 'react';
import api from '../utils/axios';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/user.slice';

function useCurrentUser() {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await api.get("/api/me");
        const user = data?.user || data?.data?.user;
        if (user) {
          dispatch(setUserData(user));
        }
      } catch (error) {
        // Unauthenticated initial state is expected before login
        if (error.response?.status !== 401) {
          console.warn("User session check notice:", error.message);
        }
      }
    };
    fetchUser();
  }, [dispatch]);
}

export default useCurrentUser;
