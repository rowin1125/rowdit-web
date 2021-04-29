import { useRouter } from "next/router";

export const useGetIntId = () => {
  const { query } = useRouter();
  return typeof query.id === "string" ? parseInt(query.id) : -1;
};
