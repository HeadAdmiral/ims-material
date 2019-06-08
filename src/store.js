import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase'
import database from './firebaseInit.js'
import createPersistedState from 'vuex-persistedstate'
import common from './common.js'

Vue.use(Vuex)


export default new Vuex.Store({
  state: {
    accessLevel: 5,
    storeId: "",
    storeName: "",
    user: {},
    userDetails: {
      stores: []
    },
  },
  plugins: [createPersistedState()],
  getters: {
    getUserId: state => state.user.uid,
    getUser: state => state.user,
    getAccessLevel: state => state.accessLevel,
    getSingleStoreId: state => state.userDetails.stores[0].storeId,
    getSingleStoreName: state => state.userDetails.stores[0].storeName,
    getStoreId: state => state.storeId,
    getStores: state => state.userDetails.stores,
    getStoreCount: state => state.userDetails.stores.length,
    getStoreName: state => state.storeName,
    getUserDetails: function (state) {
      return state.userDetails;
    },
    drawerToggleable: state => state.user && state.storeId ? true : false,
    multipleStores: state => {
      // If user details is defined and has a stores property
      if (state.userDetails && state.userDetails.hasOwnProperty("stores")) {
        common.log("User details has stores");
        if (state.userDetails.stores.length > 1) {
          common.log("User is a part of multiple stores");
          return true;
        }
      }
      common.log("User is only part of 1 store");
      return false;
    }
  },
  mutations: {
    setUser: (state, payload) => {
      state.user = payload.user;
    },
    setUserDetails: (state, payload) => {
      state.userDetails = payload.userDetails.payload;
    },
    setStore: (state, payload) => {
      state.storeId = payload.storeId;
      state.storeName = payload.storeName;
    },
    setAccessLevel: (state, payload) => {
      state.accessLevel = payload.accessLevel;
    },
    clearUserAndDetails: state => {
      state.accessLevel = 5;
      state.storeId = '';
      state.storeName = '';
      state.user = {};
      state.userDetails = {
        stores: []
      };
      common.log("All stored information cleared!");
    }
  },
  actions: {
    login: (context, payload) => {
      // Set currentUser to the current authenticated user
      context.dispatch({
        type: 'setUser'
      })
      // Get and set userDetails, then redirect to corresponding route based on store count
          .then(() => {
            context.dispatch({
              type: 'getUserDetailsAndReroute'
            });
          })
    },
    setUser: context => {
      context.commit({
        type: 'setUser',
        user: firebase.auth().currentUser
      });
    },
    getUserDetailsAndReroute: context => {
      database.collection('users').where("user_id", "==", context.getters.getUserId).get()
          .then(snapshot => {
            let doc = snapshot.docs[0];

            if (doc.exists) {
              common.log("Found user in database!");

              context.dispatch({
                type: 'setAllUserDetails',
                payload: doc.data()
              })

            } else {
              common.log("User details not found for this user");
            }
          })
          .then(() => {
            // check if the user is employed at multiple stores, or has no stores
            if (context.getters.multipleStores || context.getters.getStoreCount === 0) {
              // then go to store selection page
              // I tried literally every combination possible to get Vue Router working here, but I could not.
              document.location = document.location.origin + '/store-selector'
            }
            // set the store to the user's only store
            else {
              context.dispatch({
                type: 'setStore'
              }).then(() => {
                // I tried literally every combination possible to get Vue Router working here, but I could not.
                document.location = document.location.origin + '/' + context.getters.getSingleStoreId + '/dashboard';
              });
            }
          })
    },
    setAccessLevel: context => {
      let currentStore = context.state.userDetails.stores.filter(store => store.storeId === context.state.storeId)[0];

      context.commit({
        type: 'setAccessLevel',
        accessLevel: currentStore.accessLevel
      })
    },
    clearUserAndDetails: context => {
      context.commit({
        type: 'clearUserAndDetails'
      })
    },
    setStore: context => {
      context.commit({
        type: 'setStore',
        storeId: context.getters.getSingleStoreId,
        storeName: context.getters.getSingleStoreName
      })
    },
    setUserDetails: (context, payload) => {
      context.commit({
        type: 'setUserDetails',
        userDetails: payload.payload
      })
    },
    setAllUserDetails: (context, payload) => {
      context.dispatch({
        type: 'setUserDetails',
        payload: payload
      }).then(() => {
        context.dispatch({
          type: 'setAccessLevel'
        })
      })

    }
  }
})
