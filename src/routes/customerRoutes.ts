import { Route } from "@/types/route/routes.type";

export const customerRoutes: Route[] = [
  {
    title: "Home",
    items: [
      {
        title: "Home",
        url: "/",
      },
    ],
  },
  {
    title: "Profile",
    items: [
      {
        title: "My profile",
        url: "/dashboard-profile",
      },
    ],
  },

  {
    title: "Order",
    items: [{ title: "My Order", url: "/customer-dashboard/customer-order" }],
  },
];
