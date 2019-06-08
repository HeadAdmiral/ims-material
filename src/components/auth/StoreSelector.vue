<template>
    <v-app id="store-selector">
        <v-layout row>
            <v-expansion-panel-content
            <v-flex xs12 sm6 offset-sm3>
                <v-card>
                    <v-toolbar color="secondary" dark>
                        <v-toolbar-title>Select a Store</v-toolbar-title>
                    </v-toolbar>
                    <v-list two-line>
                            <v-list-tile
                                    v-for="(store, index) in stores"
                                    :key="store.storeName"
                                    avatar
                                    @click="setStore(store)"
                            >
                                <v-list-tile-avatar :color="getColor(index)">
                                    <v-icon color="white">store</v-icon>
                                </v-list-tile-avatar>

                                <v-list-tile-content>
                                    <v-list-tile-title>{{ store.storeName }}</v-list-tile-title>
                                </v-list-tile-content>
                            </v-list-tile>
                            <v-list-tile v-if="stores.length === 0">
                                <v-list-tile-avatar color="error">
                                    <v-icon color="white">error</v-icon>
                                </v-list-tile-avatar>
                                <v-list-tile-content>
                                    <v-list-tile-title>No stores were found for this user.</v-list-tile-title>
                                    <v-list-tile-sub-title>Has your manager approved your account?</v-list-tile-sub-title>
                                </v-list-tile-content>
                            </v-list-tile>
                    </v-list>
                </v-card>
            </v-flex>
        </v-layout>
    </v-app>
</template>

<script>
    import database from '../../firebaseInit.js'
    import {mapGetters} from 'vuex'

    export default {
        name: "StoreSelector",
        data() {
            return {
                stores: []
            }
        },
        methods: {
            setStore(store) {
                let storeName = store.storeName;
                let storeId = storeName.substring(storeName.indexOf("of") + 3).toLowerCase().replace(/\s/g, '');

                this.$store.commit('setStore', {
                    storeId: storeId,
                    storeName: storeName
                });

                this.$store.dispatch('setAccessLevel');

                this.$router.push('/' + this.getStoreId + '/dashboard');


            },
            getColor(index) {
                return index % 2 === 0 ? 'dpGreen' : 'dpOrange';
            }
        },
        created() {
            let self = this;
            this.stores = [];

            database.collection('users').where('user_id', '==', self.getUserId).onSnapshot(snapshot => {
                snapshot.docChanges().forEach(function (change) {
                    let userDetails = change.doc.data();

                    // Add new elements to the array
                    if (change.type === "added" || change.type === "modified") {

                        userDetails.stores.forEach((store) => {
                            if (store.isApproved) {
                                self.stores.push(store);
                            }
                        });

                        self.$store.dispatch({
                            type: 'setAllUserDetails',
                            payload: userDetails
                        })
                    }
                });
            });
        },
        computed: {
            // Maps specified getter functions from the VueX store as computed methods in this component
            ...mapGetters([
                'getUser',
                'getAccessLevel',
                'getUserId',
                'getStoreName',
                'getStoreId',
                'getStores'
            ]),
        }
    }
</script>

<style scoped>

</style>
