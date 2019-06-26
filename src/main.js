import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
// @ts-ignore
import database from './firebaseInit.js'
import firebase from 'firebase'
import './registerServiceWorker'
import vuetify from './plugins/vuetify'

Vue.config.productionTip = false;

// Init the Firestore application (prevents error with the onAuthStateChanged below)
database.app;

let app = null;

firebase.auth().onAuthStateChanged((user) => {
  if (!app) {
    app = new Vue({
      router,
      store,
      vuetify,
      render: h => h(App)
    }).$mount('#app');
  }

  console.log("===== AUTH STATE CHANGE =====");
  console.log("User signed in: " + (user !== null));
  if (user) {
    console.log(user);
  }
  else if (!user) {
    app.$store.dispatch({
      type: 'clearUserAndDetails'
    }).then(() => {
      app.$router.push('/login');
    })
  }
  console.log("=============================");
})


