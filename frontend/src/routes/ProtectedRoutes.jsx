import { Navigate, Outlet } from "react-router-dom"
import { useUserContext } from "../contexts/UserContext"
import PlayerLayout from "../layouts/PlayerLayout"
import AdminLayout from "../layouts/AdminLayout"

function ProtectedRoutes({ role }) {
    const { user, loading } = useUserContext()

    if (loading) {
        return <div>Loading...</div>
    }

    if (!user) {
        return <Navigate to="/login" replace />
    }

    if (user.role !== role) {
        return <Navigate to="/unauthorized" replace />
    }

    if (role === "player") {
        return (
            <PlayerLayout>
                <Outlet />
            </PlayerLayout>
        )
    }

    if (role === "admin") {
        return (
            <AdminLayout>
                <Outlet />
            </AdminLayout>
        )
    }

    return <Navigate to="/unauthorized" replace />
}

export default ProtectedRoutes