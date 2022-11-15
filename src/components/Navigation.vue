<template>
  <v-navigation-drawer
    permanent
    class="navigation"
  >
    <section class="d-flex flex-column align-center justiy-center px-6 fill-height bg-secondary gap-4 full-width">
      <header class="d-flex flex-column align-center justiy-center flex-wrap full-width">
        <span class="mt-8 font-20--semibold color-black text-center">CRUD - Estudantes</span>
        <v-img class="mt-10" src="https://www.unipe.edu.br/wp-content/uploads/2020/02/logo_unipe_desktop_pos.png"></v-img>
      </header>
      <body class="d-flex gap-4 flex-column flex-grow justify-center">
        <section v-for="(option, index) in options" :key="index" class="px-6 py-3 hover-bg-primary transition-all bra-2 pointer"
                 :class="isSeletected(option.value) ? 'bg-primary' : ''"
                 @click="open(option)">
          <v-icon class="mr-5 color-black" size="18">
            {{ option.icon }}
          </v-icon>
          <span class="font-14--normal">{{ option.name }}</span>
        </section>
      </body>
    </section>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: "Home",
  components: {},
  data() {
    return {
      selected: 'all',
    }
  },
  computed: {
    options() {
      return [{
          name: 'Estudantes', 
          icon: 'fas fa-user-graduate', 
          value: 'all', 
          path: '/'
        },{
          name: 'Aprovados', 
          icon: 'fas fa-thumbs-up', 
          value: 'approved', 
          path: '/?filter=approved'
        },{
          name: 'Em recuperação', 
          icon: 'fas fa-book-reader', 
          value: 'recovery', 
          path: '/?filter=recovery'
        },{
          name: 'Reprovados', 
          icon: 'fas fa-thumbs-down', 
          value: 'disapproved', 
          path: '/?filter=disapproved'
        },
      ]
    }
  },
  watch: {
    '$route.query': {
      handler(newValue) {
        const {filter} = newValue
        this.selected = filter || 'all'
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    isSeletected(value){
      return this.selected === value
    },
    open(option){ 
      const {path} = option
      if(path !== this.$router.currentRoute.fullPath) this.$router.replace(path)
    }
  },
}
</script>

<style lang="scss" scoped>
  .navigation{
    width: 250px !important;
    min-width: 250px !important;
  }
</style>