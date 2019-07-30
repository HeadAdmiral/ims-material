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
                    text
                    @click="alert.active = !alert.active"
                    class="caption"
            >
                Close
            </v-btn>
        </v-snackbar>
        <v-dialog v-model="deleteDialog" persistent max-width="290">
            <template v-slot:activator="{ on }"></template>
            <v-card>
                <v-card-title class="title font-weight-medium">Remove User?</v-card-title>
                <v-card-text>This user will be removed from the store. Any entries they have made will not be removed.</v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="googleBlue600" class="caption" text @click="deleteDialog = false">Cancel</v-btn>
                    <v-btn color="googleBlue600" class="caption" text @click="confirmDelete">Remove</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-container>
            <v-card>
                <v-data-table
                        :headers="headers"
                        :items="users"
                        sort-by="name"
                        class="elevation-1"
                >
                    <template v-slot:top>
                        <v-toolbar flat>
                            <v-toolbar-title>User Management</v-toolbar-title>
                            <v-spacer></v-spacer>
                            <v-slide-x-reverse-transition>
                                <v-flex xs4 xl3 pr-2 d-flex v-if="!isMobile && search">
                                    <v-select
                                            :items="getStores"
                                            label="Select a Store"
                                            solo
                                            color="dpGreen"
                                            v-model="selectedStore"
                                            @change="findUsers"
                                            style="position: relative; top: 15px;"
                                    ></v-select>
                                </v-flex>
                            </v-slide-x-reverse-transition>
                            <v-dialog v-model="search" scrollable v-if="isMobile && search">
                                <v-card>
                                    <v-card-title class="title font-weight-medium">Select a Store</v-card-title>
                                    <v-card-text style="max-height: 300px;">
                                        <v-radio-group v-model="selectedStoreIndex" column @change="selectStore">
                                            <v-radio v-for="(store, i) in getStores" :label="store" color="googleBlue600"></v-radio>
                                        </v-radio-group>
                                    </v-card-text>
                                </v-card>
                            </v-dialog>
                            <v-btn icon v-model="search" @click="search = !search">
                                <v-icon>
                                    search
                                </v-icon>
                            </v-btn>

                            <v-dialog v-model="dialog" max-width="500px">
                                <template v-slot:activator="{ on }">
                                    <v-btn icon class="caption" v-on="on" :disabled="!selectedStore">
                                        <v-icon>
                                            add
                                        </v-icon>
                                    </v-btn>
                                </template>
                                <v-card>
                                    <v-card-title>
                                        <span class="headline">{{ formTitle }}</span>
                                    </v-card-title>

                                    <v-card-text>
                                        <v-container grid-list-md>
                                            <v-layout wrap>
                                                <v-flex xs12>
                                                    <v-text-field
                                                            v-model="editedItem.email"
                                                            label="Email Address"
                                                            prepend-icon="mail_outline"
                                                            :rules="[rules.required, rules.email]"
                                                            :disabled="editedIndex !== -1"
                                                            browser-autocomplete="turnedOff"
                                                    ></v-text-field>
                                                </v-flex>
                                                <v-flex v-if="editedIndex === -1" xs12>
                                                    <v-menu
                                                            v-model="menu"
                                                            :close-on-content-click="false"
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
                                                <v-flex v-if="editedIndex !== -1" xs12 mt-4>
                                                    <v-checkbox v-model="editedItem.isActive" label="Active Employee"></v-checkbox>
                                                </v-flex>
                                            </v-layout>
                                        </v-container>
                                    </v-card-text>

                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn text color="grey" class="caption" @click="close">Cancel</v-btn>
                                        <v-btn color="googleBlue600" class="caption" text @click="save" v-if="editedIndex === -1">Save</v-btn>
                                        <v-btn color="googleBlue600" class="caption" text @click="update" v-else>Update</v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-dialog>
                        </v-toolbar>
                    </template>
                    <template v-slot:item.action="{ item }">
                        <v-icon
                                small
                                class="mr-2"
                                @click="editItem(item)"
                                :disabled="higherAccessLevel(item)"
                        >
                            edit
                        </v-icon>
                        <v-icon
                                small
                                @click="promptDelete(item)"
                                :disabled="higherAccessLevel(item)"
                        >
                            delete
                        </v-icon>
                    </template>
                    <template v-slot:no-data>
                        <v-layout justify-center>
                            <v-flex shrink py-4>
                                <v-card-text>
                                    Press the <v-icon small>search</v-icon> button to search for a store!
                                </v-card-text>
                            </v-flex>
                        </v-layout>
                    </template>
                </v-data-table>
            </v-card>
        </v-container>

    </v-app>
</template>
<script>
    import common from '../../common.js'
    import firebase from 'firebase'
    import database from '../../firebaseInit.js'
    import {mapActions, mapGetters} from 'vuex'

    export default {
        name: "UserManagement",
        data() {
            return {
                deleteDialog: false,
                deleteUser: {},
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
                tooltips: false,
                tooltipsDisabled: false,
                selectedStore: '',
                selectedStoreIndex: -1,
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
                    {text: 'Date Created', value: 'createdDate'},
                    {text: 'Active', value: 'isActive'},
                    {text: 'Actions', value: 'action', sortable: false}
                ],
                users: [],
                pagination: {},
                selected: [],

                rules: {
                    required: value => !!value || 'Required.',
                    min: function (v) {
                        if (v) {
                            return v.length >= 6 || 'Password must be at least 6 characters';
                        }
                        return false;
                    },
                    passwordMatch: value => {
                        return value === this.password || ('The passwords you entered don\'t match')
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
                search: false
            }
        },
        methods: {
            ...mapActions([
                'setCachedUsers'
            ]),
            selectStore() {
                this.selectedStore = this.getStores[this.selectedStoreIndex];
                this.search = !this.search;
                this.findUsers();
            },
            higherAccessLevel(item) {
                // You cannot edit or delete a user who has a higher access level than you.
                return this.getAccessLevel === 1 ? false : item.accessLevel >= this.getAccessLevel;
            },
            promptDelete(item) {
                this.deleteDialog = true;
                this.deleteUser = item;
            },
            confirmDelete() {
                this.deleteDialog = false;
                this.deleteItem(this.deleteUser)
            },
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
            editItem(item) {
                this.editedIndex = this.users.indexOf(item);
                this.editedItem = Object.assign({}, item);
                this.editedItem.accessLevel = this.parseRole(item); // this works, but does not actually populate the v-select with an option
                this.editedItem.isActive = this.parseActive(item);
                this.dialog = true
            },
            removeItem() {
                let batch = database.batch();
                let self = this;

                // Do a batch delete and then remove
                this.selected.forEach((item) => {
                    if (confirm('Are you sure you want to delete ' + item.firstName + " " + item.lastName + '?')) {

                        database.collection('users').where('email', '==', item.email).get()
                            .then(doc => {
                                if (doc.size === 1) {
                                    let user = doc.docs[0].data();

                                    let storeIndex = Number(user.stores.map(store => {
                                        if (store.storeName === self.getStoreName) {
                                            return user.stores.indexOf(store).toString();
                                        }
                                    }));

                                    user.stores = user.stores.filter(store => store !== user.stores[storeIndex])

                                    database.collection('users').doc(user.user_id).update({
                                        stores: user.stores
                                    }).then(() => {
                                        console.log("User removed successfully!");
                                        //region Update the employee count and managers in the stores collection
                                        database.collection('stores').where('storeName', '==', self.getStoreName).get()
                                            .then((snapshot) => {
                                                database.collection('stores').doc(snapshot.docs[0].ref.id).update({
                                                    employees: self.users.length,
                                                    managers: self.getManagers()
                                                }).then(() => {
                                                    console.log("Store updated successfully.");
                                                }).catch((error) => {
                                                    console.log(error);
                                                })
                                            })
                                            .catch((error) => {
                                                console.log(error);
                                            })
                                        //endregion
                                    }).catch((err) => {
                                        console.log(err);
                                    })

                                } else {
                                    self.snackbar('error', item.firstName + " " + item.lastName + " was not found in the database!", 2.5);
                                }
                            })
                            .catch(err => {
                                self.log(err);
                            });


                        // batch.delete(database.collection('users').doc(item.user_id));
                    }

                })

                let batchLength = batch._mutations.length;

                batch.commit().then(() => {
                    if (batchLength > 1) {
                        self.snackbar('success', 'Successfully deleted ' + batchLength + ' users.');
                    } else if (batchLength === 1) {
                        self.snackbar('success', 'Successfully deleted ' + batchLength + ' user.');
                    } else {
                        self.snackbar('warning', 'Deleted ' + batchLength + 'users');
                    }
                })
            },
            deleteItem(item) {
                let batch = database.batch();
                let self = this;

                // Do a batch delete and then remove
                batch.delete(database.collection('users').doc(item.user_id));

                let batchLength = batch._mutations.length;

                batch.commit().then(() => {
                    if (batchLength > 1) {
                        self.snackbar('success', 'Successfully deleted ' + batchLength + ' users.');
                    } else if (batchLength === 1) {
                        self.snackbar('success', 'Successfully deleted ' + batchLength + ' user.');
                    } else {
                        self.snackbar('warning', 'Deleted ' + batchLength + 'users');
                    }
                })
            },

            close() {
                this.dialog = false;
                setTimeout(() => {
                    this.editedItem = Object.assign({}, this.defaultItem);
                    this.editedIndex = -1;
                }, 300)
            },
            getStoreIndex(user) {
                let self = this;
                for (let i = 0; i < user.stores.length; i++) {
                    if (user.stores[i].storeName === self.getStoreName) {
                        return user.stores.indexOf(user.stores[i]);
                    }
                }
                return -1;
            },
            getManagers() {
                let managers = [];

                for (let i = 0; i < this.users.length; i++) {
                    let user = this.users[i];
                    let storeIndex = this.getStoreIndex(user);
                    let accessLevel = user.stores[storeIndex].accessLevel

                    if (accessLevel === 2 || accessLevel === 3) {
                        managers.push(user);
                    }
                }
                return managers;
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

                            let storeIndex = this.getStoreIndex(user);

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
                                //region Update the employee count and managers in the stores collection
                                database.collection('stores').where('storeName', '==', self.getStoreName).get()
                                    .then((snapshot) => {
                                        database.collection('stores').doc(snapshot.docs[0].ref.id).update({
                                            employees: self.users.length,
                                            managers: self.getManagers()
                                        }).then(() => {
                                            console.log("Store updated successfully.");
                                        }).catch((error) => {
                                            console.log(error);
                                        })
                                    })
                                    .catch((error) => {
                                        console.log(error);
                                    })
                                //endregion
                            }).catch((err) => {
                                console.log(err);
                            })

                        } else {
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
                        // If user exists in database and does not exist on the client side already
                        if (doc.size === 1 && self.getStoreIndex(doc.docs[0].data()) === -1) {
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

                            database.collection('users').doc(user.user_id).update({
                                stores: user.stores
                            }).then(() => {
                                console.log("Update successful!");

                                //region Update the employee count and managers in the stores collection
                                database.collection('stores').where('storeName', '==', self.getStoreName).get()
                                    .then((snapshot) => {
                                        database.collection('stores').doc(snapshot.docs[0].ref.id).update({
                                            employees: self.users.length,
                                            managers: self.getManagers()
                                        }).then(() => {
                                            console.log("Store updated successfully.");
                                        }).catch((error) => {
                                            console.log(error);
                                        })
                                    })
                                    .catch((error) => {
                                        console.log(error);
                                    })
                                //endregion
                            }).catch((err) => {
                                console.log(err);
                            })

                        } else if (self.getStoreIndex(doc.docs[0].data()) !== -1) {
                            self.snackbar('error', 'This user already exists in the table!', 2.5)
                        } else {
                            self.snackbar('error', 'No user exists with that email address!', 2.5);
                        }
                    })
                    .catch(err => {
                        self.log(err);
                    });
            },
            createDocId(storeName) {
                return storeName.substring(storeName.indexOf("of") + 3).toLowerCase().replace(/\s/g, '');
            },
            findUsers() {
                let self = this;

                database.collection('users').onSnapshot(snapshot => {
                    snapshot.docChanges().forEach(function(change) {
                        let doc = change.doc.data();

                        if (self.getStoreIndex(doc) !== -1) {
                            // Add new elements to the array
                            if (change.type === "added") {
                                self.users.push(doc);

                                let user = self.users[self.users.indexOf(doc)];
                                user.name = user.firstName + " " + user.lastName;
                                user.createdDate = doc.createdDate.toDate().toLocaleString();
                                user.accessLevel = self.parseAccessLevel(user);
                                user.isActive = self.parseActive(user);
                            }

                            // Update elements in the array
                            else if (change.type === "modified") {
                                let modification = false;

                                doc.stores.forEach((store) => {
                                    if (store.storeName === self.selectedStore) {
                                        self.users = self.users.filter(user => user.user_id !== doc.user_id)
                                        self.users.push(doc);
                                    }
                                    modification = true;
                                });

                                if (modification === false) {
                                    self.users = self.users.filter(user => user.user_id !== doc.user_id);
                                }
                            }

                            // Remove elements from the array
                            else if (change.type === "removed") {
                                self.users = self.users.filter(e => e.email !== doc.email)
                            }
                        }

                    });
                })
            }
        },
        computed: {
            isMobile() {
                return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            },
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
                'getAccessLevel',
                'getCachedUsers'
            ]),
            isNotAdmin() {
                return this.parseAccessLevel(this.getUserDetails) === 1
            },
            isDevelopment() {
                return process.env.NODE_ENV === 'development'
            },
            accessLevels() {
                let accessLevels = [];

                // Current user may create any users up to their access level, but no higher.
                switch (this.getAccessLevel) {
                    case 1:
                        accessLevels.push({name: '1 (Administrator)'});
                    case 2:
                        accessLevels.push({name: '2 (Store Manager)'});
                    case 3:
                        accessLevels.push({name: '3 (Assistant Manager)'});
                    case 4:
                        accessLevels.push({name: '4 (Employee)'});
                    case 5:
                        accessLevels.push({name: '5 (Read-only)'});
                        break;
                    default:
                        break;
                }
                return accessLevels;
            }
        },

        watch: {
            dialog(val) {
                val || this.close()
            },
        },
        mounted() {
            let self = this;

            this.routeTo = common.routeTo;
            this.log = common.log;
            this.snackbar = common.snackbar;

            this.$on('openSnackbar', (msg) => {
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
        }
    }
</script>


<style scoped></style>
