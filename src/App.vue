<template>
  <v-app>
    <toolbar></toolbar>
<!--    <navigation></navigation>-->
  </v-app>
</template>

<script>
  import Navigation from '@/components/examples/navigation.vue'
  import Toolbar from '@/components/layout/Toolbar.vue';
  import {mapGetters} from 'vuex'

export default {
  name: 'App',
  components: {
    Toolbar,
    Navigation
  },
  data () {
    return {
      //
    }
  },
  mounted() {
    this.$vuetify.theme.dark = this.isDarkMode;
  },
  computed: {
    ...mapGetters([
        'isDarkMode'
      ])
  }
}
</script>

<style lang="scss">
  html {
    overflow-y: paged-x!important;
  }

  #nav {

    /* Hides the border around list group items in the navigation drawer */
    .v-list__group:after, .v-list__group:before {
      content: none;
      padding-top: 56px!important;
    }

    /* Changes the color of any prepended icons for a v-list-group */
    .v-list__group__header--active .v-list__group__header__prepend-icon .v-icon {
      color: #82BC00!important;
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


  .fade-enter-active, .fade-leave-active {
    transition-property: opacity;
    transition-duration: .25s;
  }

  .fade-enter-active {
    transition-delay: .25s;
  }

  .fade-enter, .fade-leave-active {
    opacity: 0
  }

  .zoom-fade-enter-active,.zoom-fade-leave-active {
    -webkit-transition: opacity .28s ease-in-out, -webkit-transform .35s;
    transition: opacity .28s ease-in-out, -webkit-transform .35s;
    transition: transform .35s,opacity .28s ease-in-out;
    transition: transform .35s,opacity .28s ease-in-out,
    -webkit-transform .35s
  }
  .zoom-fade-enter {
    -webkit-transform: scale(.97);
    transform: scale(.97);
    opacity: 0
  }
  .zoom-fade-leave-to{
    -webkit-transform: scale(1.03);
    transform: scale(1.03);
    opacity: 0
  }

  .slide-fade-enter-active {
    transition: all .3s ease;
  }
  .slide-fade-leave-active {
    transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  .slide-fade-enter, .slide-fade-leave-to
    /* .slide-fade-leave-active below version 2.1.8 */ {
    transform: translateX(10px);
    opacity: 0;
  }

  /* Adjusts the positioning of the appended icon in a v-list-group to be vertically centered */
  .expandLink {
    div {
      .v-list-item__icon.v-list-group__header__append-icon {
        margin-top: 24px!important;
        margin-bottom: 24px!important;
      }
    }
  }

</style>
