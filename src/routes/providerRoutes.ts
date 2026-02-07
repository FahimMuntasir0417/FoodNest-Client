import { Route } from "@/types/route/routes.type";

export const providerRoutes: Route[] = [
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
    items: [{ title: "Add Meal", url: "/provider-dashboard/add-meal" }],
  },

  {
    title: "Order",
    items: [{ title: "All Order", url: "/provider-dashboard/provider-order" }],
  },
];
