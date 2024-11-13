// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import ForgotPassword from "../views/ForgotPassword.vue";
import Dashboard from "../views/Dashboard.vue";
import ItemDetails from "../views/ItemDetails.vue";
import SplitBill from "../views/SplitBill.vue";
import NotFoundComponent from "../views/NotFoundComponent.vue";

const routes = [
  {
    path: "/",
    redirect: "/login",
  },
  { path: "/login", name: "Login", component: Login },
  { path: "/register", name: "Register", component: Register },
  {
    path: "/:catchAll(.*)",
    component: NotFoundComponent,
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: "/forgot-password",
    name: "ForgotPassword",
    component: ForgotPassword,
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
    meta: { requiresAuth: true },
  },
  {
    path: "/items/:id",
    name: "ItemDetails",
    component: ItemDetails,
    meta: { requiresAuth: true },
  },
  {
    path: "/items/:id/split",
    name: "SplitBill",
    component: SplitBill,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem("token");
  if (to.meta.requiresAuth && !isAuthenticated) {
    next("/login");
  } else {
    next();
  }
});

export default router;
