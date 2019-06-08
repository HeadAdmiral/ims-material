<template>
    <v-app id="user-manager">
        <v-snackbar
                v-model="alert.active"
                top
                :color="alert.color"
                :timeout="0"
        >
            {{ alert.message }}
            <v-btn
                    :color="alert.btnColor"
                    flat
                    @click="alert.active = !alert.active"
            >
                Close
            </v-btn>
        </v-snackbar>
        <v-card>
            <v-toolbar flat color="dpBlack" dark>
                <v-toolbar-title>
                    User Management
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-flex xs4 xl3 d-flex>
                    <v-select
                            :items="getStores"
                            label="Select a Store"
                            solo
                            color="dpGreen"
                            v-model="selectedStore"
                            @change="findUsers"
                    ></v-select>
                </v-flex>
                <v-toolbar-items v-if="isDevelopment">
                    <v-btn flat @click="findUsers">Update Users</v-btn>
                </v-toolbar-items>
            </v-toolbar>
            <v-dialog v-model="dialog" max-width="500px">
                <v-card>
                    <v-card-title>
                        <span class="headline">{{ formTitle }}</span>
                    </v-card-title>

                    <v-card-text>
                        <v-form>
                        <v-container grid-list-md>
                            <v-layout wrap>
                                <v-flex xs12>
                                    <v-text-field
                                            v-model="editedItem.email"
                                            label="Email Address"
                                            prepend-icon="mail_outline"
                                            :rules="[rules.required, rules.email]"
                                            :disabled="this.editedIndex !== -1"
                                    ></v-text-field>
                                </v-flex>
                                <v-flex v-if="editedIndex === -1" xs12>
                                    <v-menu
                                            v-model="menu"
                                            :close-on-content-click="false"
                                            lazy
                                            transition="scale-transition"
                                            offset-y
                                            full-width
                                            max-width="290px"
                                            min-width="290px"
                                    >
                                        <template v-slot:activator="{ on }">
                                            <v-text-field
                                                    v-model="editedItem.createDate"
                                                    label="Date Created"
                                                    hint="MM/DD/YYYY format"
                                                    persistent-hint
                                                    prepend-icon="event"
                                                    readonly
                                                    v-on="on"
                                            ></v-text-field>
                                        </template>
                                        <v-date-picker
                                                v-model="editedItem.createDate"
                                                no-title
                                                @input="menu = false"
                                                :min="currentDate"
                                                :max="currentDate"
                                        ></v-date-picker>
                                    </v-menu>
                                </v-flex>
                                <v-flex xs12>
                                    <v-select
                                            v-model="editedItem.accessLevel"
                                            :items="accessLevels"
                                            item-text="name"
                                            item-disabled="disabled"
                                            menu-props="auto"
                                            label="Access Level"
                                            hide-details
                                            prepend-icon="security"
                                            :rules="[rules.required]"
                                            single-line
                                    ></v-select>
                                </v-flex>
                                <v-flex v-if="editedIndex !== -1" xs12>
                                    <v-checkbox v-model="editedItem.isActive" label="Active Employee"></v-checkbox>
                                </v-flex>
                            </v-layout>
                        </v-container>
                        </v-form>
                    </v-card-text>

                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" flat @click="close">Cancel</v-btn>
                        <v-btn color="blue darken-1" flat @click="save" v-if="editedIndex === -1">Save</v-btn>
                        <v-btn color="blue darken-1" flat @click="update" v-else>Update</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <v-data-table
                    v-model="selected"
                    :headers="headers"
                    :items="users"
                    item-key="email"
                    select-all
                    class="elevation-1"
            >
                <template v-slot:items="props">
                    <td>
                        <v-checkbox
                                v-model="props.selected"
                                primary
                                hide-details
                        ></v-checkbox>
                    </td>
                    <td class="text-xs">{{ props.item.firstName }} {{ props.item.lastName }}</td>
                    <td class="text-xs">{{ parseAccessLevel(props.item) }}</td>
                    <td class="text-xs">{{ props.item.email }}</td>
                    <td class="text-xs">{{ props.item.createdDate.toDate().toLocaleString() }}</td>
                    <td class="text-xs">{{ parseActive(props.item) }}</td>
                </template>
            </v-data-table>
        </v-card>
        <v-layout>
            <v-speed-dial
                    class="mb-5 mr-5"
                    v-model="fab"
                    :top="top"
                    :bottom="bottom"
                    :right="right"
                    :left="left"
                    :direction="direction"
                    :open-on-hover="allowAddOrEdit"
                    :transition="transition"
                    fixed
            >
                <template v-slot:activator>
                    <v-btn v-model="fab" color="dpOrange" fab :dark="allowAddOrEdit" :disabled="!selectedStore">
                        <v-icon color="white">person</v-icon>
                        <v-icon color="white">close</v-icon>
                    </v-btn>
                </template>
                <v-btn fab dark small color="green" @click="dialog = !dialog">
                    <v-icon>add</v-icon>
                </v-btn>
                <v-btn
                        fab
                        dark
                        small
                        color="blue"
                        @click="editItem()"
                        v-if="selected.length === 1"
                >
                    <v-icon>edit</v-icon>
                </v-btn>
                <v-btn
                        fab
                        dark
                        small
                        color="red"
                        @click="deleteItem()"
                        v-if="getAccessLevel === 1 && selected.length > 0"
                >
                    <v-icon>delete</v-icon>
                </v-btn>
            </v-speed-dial>
        </v-layout>
    </v-app>
</template>
<script>
    import common from '../../common.js'
    import firebase from 'firebase'
    import database from '../../firebaseInit.js'
    import {mapGetters} from 'vuex'

    export default {
        name: "UserManagement",
        data() {
            return {
                dialog: false,
                direction: 'top',
                fab: false,
                fling: false,
                tabs: null,
                top: false,
                right: true,
                bottom: true,
                left: false,
                menu: false,
                selectedStore: '',
                transition: 'slide-y-reverse-transition',
                editedIndex: -1,
                editedItem: {
                    email: '',
                    createDate: '',
                    accessLevel: '',
                    isActive: ''
                },
                defaultItem: {
                    email: '',
                    createDate: '',
                    accessLevel: '',
                    isActive: true
                },
                headers: [
                    {text: 'Name', value: 'name'},
                    {text: 'Access Level', value: 'accessLevel'},
                    {text: 'Email Address', value: 'email'},
                    {text: 'Date Created', value: 'createDate'},
                    {text: 'Active', value: 'isActive'},
                ],
                users: [],
                pagination: {},
                selected: [],
                accessLevels: [
                    { name: '1 (Administrator)', disabled: this.isNotAdmin },
                    { name: '2 (Store Manager)', disabled: false },
                    { name: '3 (Assistant Manager)', disabled: false },
                    { name: '4 (Employee)', disabled: false },
                    { name: '5 (Read-only)', disabled: false },
                ],
                rules: {
                    required: value => !!value || 'Required.',
                    min: function(v) {
                        if (v) {
                            return v.length >= 6 || 'Password must be at least 6 characters';
                        }
                        return false;
                    },
                    passwordMatch: value => {
                        return value === this.password ||  ('The passwords you entered don\'t match')
                    },
                    email: value => {
                        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                        return pattern.test(value) || 'Invalid e-mail.'
                    }
                },
                maxDate: this.currentDate,
                alert: {
                    active: false,
                    messsage: '',
                    color: undefined,
                    btnColor: undefined,
                    timeout: 0
                },
            }
        },
        methods: {
            parseAccessLevel(user) {
                // Gets an array containing the accessLevel of a store with a store name equal to the current store name
                return user.stores.map(store => {
                    if (store.storeName === this.selectedStore)
                        return (store.accessLevel);
                }).filter(Boolean).toString(); // Then filters out null values and returns the array converted to a string

            },
            parseActive(user) {
                // Gets an array containing whether or not a user is active in a store with a store name equal to the current store name
                return user.stores.map(store => {
                    if (store.storeName === this.selectedStore)
                        return (store.isActive);
                }).filter(Boolean).toString() === 'true' ? "Yes" : "No"; // Then filters out null values and returns the array converted to a string
            },
            parseRole(user) {
                let accessLevel = this.parseAccessLevel(user);

                switch (accessLevel) {
                    case 1:
                        return '1 (Administrator)';
                    case 2:
                        return '2 (Store Manager)';
                    case 3:
                        return '3 (Assistant Manager)';
                    case 4:
                        return '4 (Employee)';
                    case 5:
                        return '5 (Read-only)';
                    default:
                        return ''
                }
            },
            editItem() {
                this.editedIndex = this.users.indexOf(this.selected[0]);
                this.editedItem = Object.assign({}, this.selected[0]);
                this.editedItem.accessLevel = this.parseRole(this.editedItem); // this works, but does not actually populate the v-select with an option
                this.editedItem.isActive = this.parseActive(this.editedItem);
                this.dialog = true
            },

            deleteItem() {
                let index;
                let docId;

                // // Do a batch delete and then remove
                // this.selected.forEach((item) => {
                //
                //     index = this.stores.indexOf(item);
                //     docId = this.createDocId(item.state, item.storeName)
                //     if (confirm('Are you sure you want to delete ' + item.storeName + '?')) {
                //         database.collection('stores').doc(docId).delete()
                //             .then(() => {
                //                 common.log("Document removed with ID: ", docId);
                //             })
                //             .catch((error) => {
                //                 common.error("Error removing document: ", error);
                //
                //                 self.$root.$emit('openModal', {
                //                     closed: false,
                //                     text: 'An error occurred while saving to the database.',
                //                     type: 'error'
                //                 });
                //             });
                //
                //     }
                //
                // })
            },

            close() {
                this.dialog = false;
                setTimeout(() => {
                    this.editedItem = Object.assign({}, this.defaultItem);
                    this.editedIndex = -1;
                }, 300)
            },

            update() {
                this.close();

                let self = this;
                let editedUser = {
                    email: this.editedItem.email,
                    createDate: new Date(),
                    accessLevel: Number(this.editedItem.accessLevel.substring(0, 1)),
                    isActive: true
                };

                database.collection('users').where('email', '==', editedUser.email).get()
                    .then(doc => {
                        if (doc.size === 1) {
                            let user = doc.docs[0].data();

                            let storeIndex = Number(user.stores.map(store => {
                                if (store.storeName === self.getStoreName) {
                                    return user.stores.indexOf(store).toString();
                                }
                            }));

                            user.stores = user.stores.filter(store => store !== user.stores[storeIndex])

                            user.stores.push({
                                storeName: self.getStoreName,
                                storeId: self.getStoreId,
                                buys: doc.docs[0].data().stores[storeIndex].buys,
                                sales: doc.docs[0].data().stores[storeIndex].sales,
                                returns: doc.docs[0].data().stores[storeIndex].returns,
                                storeStocks: doc.docs[0].data().stores[storeIndex].storeStocks,
                                lastFive: doc.docs[0].data().stores[storeIndex].lastFive,
                                accessLevel: editedUser.accessLevel,
                                isApproved: true,
                                isActive: editedUser.isActive
                            });

                            database.collection('users').doc(user.user_id).update({
                                stores: user.stores
                            }).then(() => {
                                console.log("Update successful!");
                            }).catch((err) => {
                                console.log(err);
                            })

                        }
                        else {
                            self.snackbar('error', 'No user exists with that email address!', 2.5);
                        }
                    })
                    .catch(err => {
                        self.log(err);
                    });
            },
            save() {
                this.close();

                let self = this;
                let newUser = {
                    email: this.editedItem.email,
                    createDate: new Date(),
                    accessLevel: Number(this.editedItem.accessLevel.substring(0, 1)),
                    isActive: true
                };

                database.collection('users').where('email', '==', newUser.email).get()
                    .then(doc => {
                        if (doc.size === 1) {
                            let user = doc.docs[0].data();
                            user.stores.push({
                                storeName: self.getStoreName,
                                storeId: self.getStoreId,
                                buys: 0,
                                sales: 0,
                                returns: 0,
                                storeStocks: 0,
                                lastFive: [],
                                accessLevel: newUser.accessLevel,
                                isApproved: true,
                                isActive: newUser.isActive
                            });

                            console.log(user.stores);

                            database.collection('users').doc(user.user_id).update({
                                stores: user.stores
                            }).then(() => {
                                console.log("Update successful!");
                            }).catch((err) => {
                                console.log(err);
                            })

                        }
                        else {
                            self.snackbar('error', 'No user exists with that email address!', 2.5);
                        }
                    })
                    .catch(err => {
                        self.log(err);
                    });

                // let docId = this.createDocId(newStore.state, newStore.storeName);
                //
                // database.collection('stores').doc(docId).get()
                //     .then(docSnapshot => {
                //         if (docSnapshot.exists) {
                //             database.collection('stores').doc(docId).update(newStore)
                //                 .then(() => {
                //                     common.log("Document updated with ID: ", docId);
                //                 })
                //                 .catch((error) => {
                //                     common.error("Error adding document: ", error);
                //
                //                     self.$root.$emit('openModal', {
                //                         closed: false,
                //                         text: 'An error occurred while saving to the database.',
                //                         type: 'error'
                //                     });
                //                 });
                //         }
                //         else {
                //             database.collection('stores').doc(docId).set(newStore)
                //                 .then(() => {
                //                     common.log("Document written with ID: ", docId);
                //                 })
                //                 .catch((error) => {
                //                     common.error("Error adding document: ", error);
                //
                //                     self.$root.$emit('openModal', {
                //                         closed: false,
                //                         text: 'An error occurred while saving to the database.',
                //                         type: 'error'
                //                     });
                //                 });
                //         }
                //     })
                //
                // this.close()
            },
            createDocId(state, storeName) {
                return state.toLowerCase().replace(/\s/g, '') + "-" + storeName.substring(storeName.indexOf("of") + 3).toLowerCase().replace(/\s/g, '');
            },
            findUsers() {
                let self = this;
                self.users = [];

                database.collection('users').onSnapshot(snapshot => {
                    snapshot.docChanges().forEach(function (change) {
                        let doc = change.doc.data();

                        // Add new elements to the array
                        if (change.type === "added") {
                            doc.stores.forEach((store) => {
                                if (store.storeName === self.selectedStore) {
                                    self.users.push(doc);
                                }
                            })
                        }

                        // Remove elements from the array
                        if (change.type === "removed") {
                            self.users = self.users.filter(e => e.email !== doc.email)
                        }
                    });
                })
            }
        },
        computed: {
            allowAddOrEdit() {
                return !!this.selectedStore;
            },
            formTitle() {
                return this.editedIndex === -1 ? 'New User' : 'Edit User'
            },
            currentDate() {
                return new Date().toLocaleString("en-ca", {year: "numeric", month: "2-digit", day: "2-digit"})
            },
            getStores() {
                return this.$store.getters.getStores.map(store => store.storeName)
            },
            ...mapGetters([
                'getStoreName',
                'getStoreId',
                'getUserDetails',
                'getAccessLevel'
            ]),
            isNotAdmin() {
                return this.parseAccessLevel(this.getUserDetails) === 1
            },
            isDevelopment() {
                return process.env.NODE_ENV === 'development'
            }
        },

        watch: {
            dialog(val) {
                val || this.close()
            }
        },
        mounted() {
            let self = this;


            this.routeTo = common.routeTo;
            this.log = common.log;
            this.snackbar = common.snackbar;

            this.$on('openAlert', (msg) => {
                this.alert = {
                    active: true,
                    color: msg.color,
                    message: msg.alertMessage,
                    timeout: 0
                }

                setTimeout(() => {
                    this.alert.active = false;
                }, msg.duration * 1000);
            })

            database.collection('users').onSnapshot(snapshot => {
                snapshot.docChanges().forEach(function (change) {
                    let doc = change.doc.data();

                    // Add new elements to the array
                    if (change.type === "added" || change.type === "modified") {
                        doc.stores.forEach((store) => {
                            if (store.storeName === self.selectedStore) {
                                self.users.push(doc);
                            }
                        })
                    }

                    else if (change.type === "modified") {
                        console.log("Modified");
                        doc.stores.forEach((store) => {
                            if (store.storeName === self.selectedStore) {
                                self.users = self.users.map(user => {
                                    console.log(user.user_id);
                                    console.log(doc.user_id);
                                    user.user_id !== doc.user_id
                                })
                            }
                        })
                    }

                    // Remove elements from the array
                    else if (change.type === "removed") {
                        self.users = self.users.filter(e => e.email !== doc.email)
                    }
                });
            })
        },
        created() {
            // this.findUsers();
        }
    }
</script>


<style scoped></style>
