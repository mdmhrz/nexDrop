import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout";
import Home from "../pages/Home/Home/Home";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../pages/Authentication/Login";
import Register from "../pages/Authentication/Register";
import Coverage from "../pages/Coverage/Coverage";
import PrivateRoute from "../routes/PrivateRoute";
import SendParcel from "../pages/SendParcel/SendParcel";
import DashboardLayout from "../layouts/DashboardLayout";
import MyParcels from "../pages/Dashboard/MyParcels/MyParcels";
import Payment from "../pages/Dashboard/Payment/Payment";
import PaymentHistory from "../pages/Dashboard/PaymentHistory/PaymentHistory";
import TrackParcel from "../pages/Dashboard/TrackParcel/TrackParcel";
import BeARider from "../pages/Dashboard/BeARider/BeARider";
import PendingRiders from "../pages/Dashboard/PendingRiders/PendingRiders";
import ActiveRiders from "../pages/Dashboard/ActiveRiders/ActiveRiders";
import MakeAdmin from "../pages/Dashboard/MakeAdmin/MakeAdmin";
import Forbidden from "../pages/Fobidden/Forbidden";
import AdminRoutes from "../routes/AdminRoutes";
import AssignRider from "../pages/Dashboard/AssignRider/AssignRider";
import RiderRoutes from "../routes/RiderRoutes";
import PendingDeliveries from "../pages/Dashboard/PendingDeliveries/PendingDeliveries";
import CompletedDeliveries from "../pages/Dashboard/CompletedDeliveries/CompletedDeliveries";
import MyEarnings from "../pages/Dashboard/MyEarnings/MyEarnings";
import DashboardHome from "../pages/Dashboard/DashboardHome/DashboardHome";

export const router = createBrowserRouter([
    {
        path: "/",
        Component: RootLayout,
        children: [
            {
                index: true,
                Component: Home
            },
            {
                path: 'coverage',
                Component: Coverage
            },
            {
                path: 'beARider',
                element: <PrivateRoute><BeARider></BeARider></PrivateRoute>
            },
            {
                path: 'sendParcel',
                element: <PrivateRoute><SendParcel></SendParcel></PrivateRoute>,
            },
            {
                path: 'forbidden',
                Component: Forbidden
            }
        ]
    },
    {
        path: "/",
        Component: AuthLayout,
        children: [
            {
                path: 'login',
                Component: Login
            },
            {
                path: 'register',
                Component: Register
            },
        ]
    },
    {
        path: '/dashboard',
        element: <PrivateRoute><DashboardLayout></DashboardLayout></PrivateRoute>,
        children: [
            {
                index: true,
                Component: DashboardHome
            },
            {
                path: 'myParcels',
                Component: MyParcels
            },
            {
                path: 'payment/:parcelId',
                Component: Payment
            },
            {
                path: 'paymentHistory',
                Component: PaymentHistory
            },
            {
                path: 'track',
                Component: TrackParcel
            },

            //Admin only routes
            {
                path: 'assignRider',
                element: <AdminRoutes><AssignRider></AssignRider></AdminRoutes>
            },
            {
                path: 'pendingRiders',
                element: <AdminRoutes><PendingRiders></PendingRiders></AdminRoutes>
            },
            {
                path: 'activeRiders',
                element: <AdminRoutes><ActiveRiders></ActiveRiders></AdminRoutes>
            },
            {
                path: 'makeAdmin',
                element: <AdminRoutes><MakeAdmin></MakeAdmin></AdminRoutes>
            },

            // Rider only routes
            {
                path: 'pendingDeliveries',
                element: <RiderRoutes><PendingDeliveries></PendingDeliveries></RiderRoutes>
            },
            {
                path: 'completedDeliveries',
                element: <RiderRoutes><CompletedDeliveries></CompletedDeliveries></RiderRoutes>
            },
            {
                path: 'myEarnings',
                element: <RiderRoutes><MyEarnings></MyEarnings></RiderRoutes>
            },

        ]
    }
]);