import axios from "axios";
import { useEffect, useState } from "react";
import { getUsername } from "../helper/helper.jsx";

axios.defaults.baseURL = "http://localhost:3000";

// custom useFetch
export default function useFetch(query) {
  const [getData, setData] = useState({
    isLoading: false,
    apiData: undefined,
    severError: null,
  });
  useEffect(() => {
    if (!query) return;
    const fetcData = async () => {
      try {
        setData((prev) => ({ ...prev, isLoading: true }));

        const { username } = !query ? await getUsername() : "";
        const { data, status } = !query
          ? await axios.get(`/auth/user/${username}`)
          : await axios.get(`/auth/${query}`);

        if (status === 201) {
          setData((prev) => ({ ...prev, isLoading: false }));
          setData((prev) => ({ ...prev, apiData: data, status: status }));
        }
        setData((prev) => ({ ...prev, isLoading: false }));
      } catch (error) {
        setData((prev) => ({ ...prev, severError: error }));
      }
    };
    fetcData();
  }, [query]);
  return [getData, setData];
}
