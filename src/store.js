import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase'
import database from './firebaseInit.js'
import createPersistedState from 'vuex-persistedstate'
import common from './common.js'
import router from './router'

Vue.use(Vuex)


export default new Vuex.Store({
    state: {
        accessLevel: 5,
        user: {},
        userDetails: {
            stores: [],
            settings: {
                themes: {
                    darkMode: false,
                    light: {},
                    dark: {}
                },
                navOptions: {
                    dense: false,
                    shaped: false,
                    nav: false,
                    rounded: false,
                }
            }
        },
        storeDetails: {
            storeId: '',
            storeName: '',
            state: '',
            employees: '',
            createDate: '',
            storeStock: [],
            transactions: [],
            returns: [],
            users: {}
        },
        cleanSettings: {
            settings: {
                themes: {
                    darkMode: false,
                    light: {},
                    dark: {}
                },
                navOptions: {
                    dense: false,
                    shaped: false,
                    nav: false,
                    rounded: false,
                }
            }
        },
    },
    plugins: [createPersistedState()],
    getters: {
        isDarkMode: state => state.userDetails.settings.themes.darkMode,
        getNavOptions: state => state.userDetails.settings.navOptions,
        getUserId: state => state.user.uid,
        getUser: state => state.user,
        getEmail: state => state.user.email,
        getName: state => state.userDetails.firstName + " " + state.userDetails.lastName,
        getAccessLevel: state => state.accessLevel,
        getSettings: state => state.userDetails.settings,
        getCleanSettings: state => state.cleanSettings,
        getSingleStoreId: state => state.userDetails.stores[0].storeId,
        getSingleStoreName: state => state.userDetails.stores[0].storeName,
        getStoreId: state => state.storeDetails.storeId,
        getStores: state => state.userDetails.stores,
        getStoreCount: state => state.userDetails.stores.length,
        getStoreName: state => state.storeDetails.storeName,
        getStoreDetails: state => state.storeDetails,
        getCachedUsers: state => state.storeDetails.users,
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
        setCachedUsers: (state, payload) => {
            console.log(payload.payload);
            state.storeDetails.users = payload.payload;
        },
        setUser: (state, payload) => {
            state.user = payload.user;
        },
        setUserDetails: (state, payload) => {
            state.userDetails = payload.userDetails.payload;
            state.cleanSettings.settings = payload.userDetails.payload.settings;
        },
        setName: (state, payload) => {
            state.userDetails.firstName = payload.payload.payload.firstName;
            state.userDetails.lastName = payload.payload.payload.lastName;
        },
        setStoreDetails: (state, payload) => {
            let users = state.storeDetails.users;

            state.storeDetails = payload.payload;
            state.storeDetails.users = users;

            let storeName = payload.payload.storeName;
            state.storeDetails.storeId = storeName.substring(storeName.indexOf("of") + 3).toLowerCase().replace(/\s/g, '');

        },
        setAccessLevel: (state, payload) => {
            state.accessLevel = payload.accessLevel;
        },
        setSettings: (state, payload) => {
            state.userDetails.settings = payload.payload.payload;
            state.cleanSettings.settings = payload.payload.payload;
        },
        clearUserAndDetails: state => {
            state.accessLevel = 5;
            state.storeId = '';
            state.storeName = '';
            state.user = {};
            state.userDetails = {
                stores: [],
                settings: {
                    themes: {
                        darkMode: false,
                        light: {},
                        dark: {}
                    },
                    navOptions: {
                        dense: false,
                        shaped: false,
                        nav: false,
                        rounded: false,
                    }
                }
            };
            state.cleanSettings = {
                settings: {
                    themes: {
                        darkMode: false,
                        light: {},
                        dark: {}
                    },
                    navOptions: {
                        dense: false,
                            shaped: false,
                            nav: false,
                            rounded: false,
                    }
                }
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

                    if (doc && doc.exists) {
                        common.log("Found user in database!");

                        context.dispatch({
                            type: 'setAllUserDetails',
                            payload: doc.data()
                        })

                    } else {
                        return Promise.reject(new Error("User details not found for this user. This is likely because a user account exists without details for the user."))
                    }
                })
                .catch(err => {
                    return Promise.reject(err);
                })
                .then(() => {
                    // check if the user is employed at multiple stores, or has no stores
                    if (context.getters.multipleStores || context.getters.getStoreCount === 0) {
                        // then go to store selection page
                        // I tried literally every combination possible to get Vue Router working here, but I could not.
                        // router.push('/store-selector');
                    }
                    // set the store to the user's only store
                    else {
                        context.dispatch({
                            type: 'setStoreDetails',
                        }).then(() => {
                            // I tried literally every combination possible to get Vue Router working here, but I could not.
                            router.push('/' + context.getters.getSingleStoreId + '/dashboard');
                        });
                    }
                })
                .catch(err => {
                    console.error(err);
                    firebase.auth().signOut();
                })
        },
        setAccessLevel: context => {
            let currentStore;

            if (context.getters.getStoreCount === 1) {
                currentStore = context.state.userDetails.stores[0];
            }
            else if (context.getters.getStoreCount > 1){
                currentStore = context.state.userDetails.stores.filter(store => store.storeId === context.state.storeId)[0];
            }

            if (currentStore) {
                context.commit({
                    type: 'setAccessLevel',
                    accessLevel: currentStore.accessLevel
                })
            }
        },
        clearUserAndDetails: context => {
            context.commit({
                type: 'clearUserAndDetails'
            })
        },
        setStoreDetails: (context, payload='') => {
            // If there was no store provided to us, we must figure it out.
            if (Object.keys(payload).length === 1) {
                database.collection('stores').where('storeName', '==', context.getters.getSingleStoreName).get()
                    .then((snapshot) => {
                        if (!snapshot.empty) {
                            let doc = snapshot.docs[0].data();

                            context.commit({
                                type: 'setStoreDetails',
                                payload: doc
                            })
                        }
                    })
                    .catch((error) => {
                        console.error(error);
                    })
            }
            else {
                alert('There is no implementation for setting store details for multiple stores');
                console.log(payload);
            }
        },
        setName: (context, payload) => {
            context.commit({
                type: 'setName',
                payload: payload
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
        },
        setSettings: (context, payload) => {
            context.commit({
                type: 'setSettings',
                payload: payload
            })
        },
        setCachedUsers: (context, payload) => {
            context.commit({
                type: 'setCachedUsers',
                payload: payload
            })
        }
    }
})
