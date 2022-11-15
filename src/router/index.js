import Vue from 'vue'
import VueRouter from 'vue-router'

const Student = () => import('../views/Student.vue')

Vue.use(VueRouter)

const routes = [
  { path: '/', name: 'Home', component: Student, meta: {title: 'Estudantes'}},
  { path: '*', redirect: { name: 'Home' } },
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title;
  next();
});

export default router
