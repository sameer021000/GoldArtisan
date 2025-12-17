import { useProfile } from "./useProfile";

export function reactQueryArtisanData() {
  const { data, isLoading, isError } = useProfile();

  return {
    phoneNumber: data?.phoneNumber || null,
    fullName: data?.fullName || null,
    profilePhotoUrl: data?.profilePhotoUrl || null,
    isLoading,
    isError,
  };
}
