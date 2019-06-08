<template>
  <div>
    <toolbar></toolbar>

  </div>
</template>

<script>
  import Toolbar from '@/components/layout/Toolbar.vue';

export default {
  name: 'App',
  components: {
    Toolbar
  },
  data () {
    return {
      //
    }
  },
}
</script>

<style lang="scss">
  html {
    overflow-y: paged-x!important;
  }

  #nav {

    /* Hides the border around list group items in the navigation drawer */
    .v-list__group:after, .v-list__group:before {
      /*content: none;*/
      /*padding-top: 56px!important;*/
    }

  }


  /* total width */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
    border-radius: 8px;
  }

  /* background of the scrollbar except button or resizer */
  ::-webkit-scrollbar-track {
    background: #e1e1e1;
  }

  /* scrollbar itself */
  ::-webkit-scrollbar-thumb {
    background: #757575;
    border-radius: 8px;
  }

  /* set button(top and bottom of the scrollbar) */
  ::-webkit-scrollbar-button {display:none}

</style>
