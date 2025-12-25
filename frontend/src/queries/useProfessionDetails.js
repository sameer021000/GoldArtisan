import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const apiBase = process.env.REACT_APP_API_BASE || "http://localhost:7000";

async function fetchProfessionDetails() {
  const token = localStorage.getItem("GoldArtisanToken");
  if (!token) {
    const err = new Error("No token");
    err.status = 401;
    throw err;
  }

  const res = await axios.get(
    `${apiBase}/GATypesOfWorksDetailsGettingPath/getGATypesOfWorksDetails`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (res?.data?.success) {
    return res.data.data;
  }

  throw new Error("Unable to fetch profession details");
}

export function useProfessionDetails(options = {}) {
  const token = typeof window !== "undefined"
    ? localStorage.getItem("GoldArtisanToken")
    : null;

  return useQuery({
    queryKey: ["profession-details"],
    queryFn: fetchProfessionDetails,
    enabled: !!token,
    retry: false,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
}
