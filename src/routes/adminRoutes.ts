import { Route } from "@/types/route/routes.type";

export const adminRoutes: Route[] = [
  {
    title: "Main",
    items: [
      {
        title: "Home",
        url: "/",
      },
      {
        title: "Overview",
        url: "/admin-dashboard",
      },
    ],
  },

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
      { title: "Add Category", url: "/admin-dashboard/create-Category" },
      { title: "All Meals", url: "/admin-dashboard/all-meal" },
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
