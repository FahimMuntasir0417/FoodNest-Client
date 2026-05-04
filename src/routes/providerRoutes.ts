import { Route } from "@/types/route/routes.type";

export const providerRoutes: Route[] = [
  {
    title: "Main",
    items: [
      {
        title: "Home",
        url: "/",
      },
      {
        title: "Overview",
        url: "/provider-dashboard",
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
    title: "Meal",
    items: [
      { title: "Add Meal", url: "/provider-dashboard/add-meal" },
      { title: "Categories", url: "/provider-dashboard/category" },
    ],
  },

  {
    title: "Order",
    items: [{ title: "All Order", url: "/provider-dashboard/provider-order" }],
  },
];
