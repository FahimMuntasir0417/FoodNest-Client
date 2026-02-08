import { Route } from "@/types/route/routes.type";

export const adminRoutes: Route[] = [
  {
    title: "Profile",
    items: [
      {
        title: "My Profile",
        url: "/dashboard-profile",
      },
    ],
  },

  {
    title: "User",
    items: [
      {
        title: "All Users",
        url: "/admin-dashboard/admin-users",
      },
    ],
  },
  {
    title: "Meals",
    items: [
      { title: "Add Catrgory", url: "/admin-dashboard/create-Category" },
      { title: "Add Meal", url: "/admin-dashboard/category" },
      { title: "All Meal", url: "/admin-dashboard/all-meal" },
    ],
  },

  {
    title: "Orders",
    items: [
      {
        title: "All Orders",
        url: "/admin-dashboard/all-orders",
      },
    ],
  },
];
