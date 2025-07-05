import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";


const useUserRole = () => {
    const { user, loading } = useAuth();
    const axiosSecure = useAxiosSecure();

    const { data: role, isPending, refetch } = useQuery({
        enabled: !loading && !!user?.email,
        queryKey: ['userRole', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/users/role?email=${user?.email}`);
            return res.data.role;
        }
    });

    return { role, roleLoading: loading, isPending, refetch };
};

export default useUserRole;
