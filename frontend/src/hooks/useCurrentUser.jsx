import { useEffect } from 'react';
import api from '../utils/axios';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/user.slice';

function useCurrentUser() {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("zen_session");
      if (!token) return;

      try {
        const { data } = await api.get("/api/me");
        const user = data?.user || data?.data?.user;
        if (user) {
          dispatch(setUserData(user));
        }
      } catch (error) {
        if (error.response?.status === 401) {
          localStorage.removeItem("zen_session");
          dispatch(setUserData(null));
        }
      }
    };
    fetchUser();
  }, [dispatch]);
}

export default useCurrentUser;
