import { useProfile } from "./useProfile";

export function useAuth() {
  const { data, isLoading, isError } = useProfile();

  return {
    phoneNumber: data?.phoneNumber || null,
    fullName: data?.fullName || null,
    profilePhotoUrl: data?.profilePhotoUrl || null,
    isLoading,
    isError,
  };
}
