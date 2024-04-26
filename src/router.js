import { createRouter, createWebHashHistory } from "vue-router";
import { useAuthStore } from "@/store/auth";

const routes = [
  // CUSTOM PAGES
  //home
  // END CUSTOM PAGES
  // {
  //   path: "/dashboard",
  //   name: "dashboard",
  //   component: () => import("@/views/home/DashboardView.vue"),
  //   meta: {
  //     authRequired: true,
  //     roles: ["System Admin"],
  //     title: "Dashboard",
  //   },
  // },
  // {
  //   path: "/calendario-startup",
  //   name: "calendario-startup",
  //   component: () => import("@/views/home/CalendarView.vue"),
  //   meta: {
  //     authRequired: true,
  //     roles: ["System Admin"],
  //     title: "Calendario startup",
  //   },
  // },
  // {
  //   path: "/campagne",
  //   name: "campagne",
  //   component: () => import("@/views/campaign/CampaignView.vue"),
  //   meta: {
  //     authRequired: true,
  //     roles: ["System Admin"],
  //     title: "Campagne",
  //   },
  // },
  // {
  //   path: "/clienti",
  //   name: "clienti",
  //   component: () => import("@/views/campaign/CustomerView.vue"),
  //   meta: {
  //     authRequired: true,
  //     roles: ["System Admin"],
  //     title: "Clienti",
  //   },
  // },
  // {
  //   path: "/tipo-campagna",
  //   name: "tipo-campagna",
  //   component: () => import("@/views/campaign/CampaignTypeView.vue"),
  //   meta: {
  //     authRequired: true,
  //     roles: ["System Admin"],
  //     title: "Tipo campagna",
  //   },
  // },
  // {
  //   path: "/utenti",
  //   name: "utenti",
  //   component: () => import("@/views/system/UserView.vue"),
  //   meta: {
  //     authRequired: true,
  //     roles: ["System Admin"],
  //     title: "Utenti",
  //   },
  // },
  // {
  //   path: "/task",
  //   name: "task",
  //   component: () => import("@/views/system/TaskView.vue"),
  //   meta: {
  //     authRequired: true,
  //     roles: ["System Admin"],
  //     title: "Esito",
  //   },
  // },
  //far atterrare cliente direttamente su questa pagina appena visita url root
  {
    path: "/",
    name: "home",
    component: () => import("@/views/system/HomeView.vue"),
    meta: {
      authRequired: false,
      roles: [],
      title: "Home",
    },
  },
  // non più su pagina di login che comunque lascio commentato per il futuro potenzialmente
  // {
  //   path: "/",
  //   name: "login",
  //   component: () => import("@/views/auth/LoginView.vue"),
  //   meta: {
  //     authRequired: false,
  //     roles: [],
  //     title: "Login",
  //   },
  // },
  // {
  //   path: "/recupera-password",
  //   name: "recupera-password",
  //   component: () => import("@/views/auth/PasswordRecoveryView.vue"),
  //   meta: {
  //     authRequired: false,
  //     roles: [],
  //     title: "Recupera password",
  //   },
  // },
  // {
  //   path: "/non-autorizzato",
  //   name: "non-autorizzato",
  //   component: () => import("@/views/auth/UnauthorizedView.vue"),
  //   meta: {
  //     authRequired: false,
  //     roles: [],
  //     title: "Non autorizzato",
  //   },
  // },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return {
      top: 0,
      left: 0,
      behavior: "smooth",
    };
  },
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  document.title = "Giornata Del Sostenitore - " + to.meta.title;
  if (to.meta.authRequired === true) {
    if (authStore.isLoggedIn === false) router.push("/");
    if (to.meta.roles.includes(authStore.user.role)) return next();
    router.push("/non-autorizzato");
  } else {
    // in questo progetto entriamo sempre in questo else perchè non è richiesta autenticazione
    return next();
  }
});

export default router;
