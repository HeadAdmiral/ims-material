<template>
  <v-app id="store-manager">
    <v-card>
      <v-toolbar flat color="dpBlack" dark>
        <v-toolbar-title>
          Store Management
        </v-toolbar-title>
      </v-toolbar>
      <v-dialog v-model="dialog" max-width="500px">
        <v-card>
          <v-card-title>
            <span class="headline">{{ formTitle }}</span>
          </v-card-title>

          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex>
                  <v-text-field
                    v-model="editedItem.storeName"
                    label="Store Name"
                    prepend-icon="store"
                  ></v-text-field>
                </v-flex>
                <v-flex v-if="editedIndex === -1">
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
                <v-flex>
                  <v-select
                    v-model="editedItem.state"
                    :items="states"
                    menu-props="auto"
                    label="State"
                    hide-details
                    prepend-icon="map"
                    single-line
                  ></v-select>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click="close">Cancel</v-btn>
            <v-btn color="blue darken-1" flat @click="save">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-data-table
        v-model="selected"
        :headers="headers"
        :items="stores"
        item-key="storeName"
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
          <td class="text-xs">{{ props.item.storeName }}</td>
          <td class="text-xs">{{ props.item.managers }}</td>
          <td class="text-xs">{{ props.item.employees }}</td>
          <td class="text-xs">{{ props.item.createDate }}</td>
          <td class="text-xs">{{ props.item.state }}</td>
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
        :open-on-hover="hover"
        :transition="transition"
        fixed
      >
        <template v-slot:activator>
          <v-btn v-model="fab" color="dpOrange" dark fab>
            <v-icon>store</v-icon>
            <v-icon>close</v-icon>
          </v-btn>
        </template>
        <v-btn fab dark small color="green" @click="dialog = !dialog">
          <v-icon>add</v-icon>
        </v-btn>
        <v-btn
          fab
          dark
          small
          color="red"
          @click="deleteItem()"
          v-if="selected.length > 0"
        >
          <v-icon>delete</v-icon>
        </v-btn>
      </v-speed-dial>
    </v-layout>
  </v-app>
</template>

<script>
import common from '../../common.js'
import database from '../../firebaseInit.js'

export default {
    name: "StoreManagement",
    data() {
        return {
            dialog: false,
            direction: 'top',
            fab: false,
            fling: false,
            hover: true,
            tabs: null,
            top: false,
            right: true,
            bottom: true,
            left: false,
            menu: false,
            transition: 'slide-y-reverse-transition',
            editedIndex: -1,
            editedItem: {
                storeName: 'Device Pitstop of ',
                createDate: '',
                state: ''
            },
            defaultItem: {
                storeName: 'Device Pitstop of ',
                createDate: '',
                state: ''
            },
            headers: [
                { text: 'Store Name', value: 'storeName' },
                { text: 'Manager(s)', value: 'managers' },
                { text: 'No. of Employees', value: 'employees' },
                { text: 'Date Created', value: 'createDate' },
                { text: 'State', value: 'state' },
                ],
            stores: [
                // { storeName: 'Device Pitstop of Maple Grove',
                //   managers: ['Seth Uscensky'],
                //   employees: 0,
                //   createDate: new Date().toLocaleString(),
                //   state: 'MN',
                // },
                // { storeName: 'Device Pitstop of Minnetonka',
                //     managers: ['Graham Reeder'],
                //     employees: 0,
                //     createDate: new Date(),
                //     state: 'MN',
                // },
            ],
            pagination: {},
            selected: [],
            states: [
                'Alabama', 'Alaska', 'American Samoa', 'Arizona',
                'Arkansas', 'California', 'Colorado', 'Connecticut',
                'Delaware', 'District of Columbia', 'Federated States of Micronesia',
                'Florida', 'Georgia', 'Guam', 'Hawaii', 'Idaho',
                'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
                'Louisiana', 'Maine', 'Marshall Islands', 'Maryland',
                'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
                'Missouri', 'Montana', 'Nebraska', 'Nevada',
                'New Hampshire', 'New Jersey', 'New Mexico', 'New York',
                'North Carolina', 'North Dakota', 'Northern Mariana Islands', 'Ohio',
                'Oklahoma', 'Oregon', 'Palau', 'Pennsylvania', 'Puerto Rico',
                'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee',
                'Texas', 'Utah', 'Vermont', 'Virgin Island', 'Virginia',
                'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
            ],
            maxDate: this.currentDate
        }
    },
    methods: {
        editItem() {
            this.editedIndex = this.stores.indexOf(this.selected[0]);
            this.editedItem = Object.assign({}, this.selected[0]);
            this.dialog = true
        },

        deleteItem() {
            let index;
            let docId;

            // Do a batch delete and then remove
            this.selected.forEach((item) => {

                index = this.stores.indexOf(item);
                docId = this.createDocId(item.state, item.storeName)
                if (confirm('Are you sure you want to delete ' + item.storeName + '?')) {
                    database.collection('stores').doc(docId).delete()
                        .then(() => {
                            common.log("Document removed with ID: ", docId);
                        })
                        .catch((error) => {
                            common.error("Error removing document: ", error);

                            self.$root.$emit('openModal', {
                                closed: false,
                                text: 'An error occurred while saving to the database.',
                                type: 'error'
                            });
                        });

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

        save() {
            let newStore = {
                storeName: this.editedItem.storeName,
                createDate: new Date(),
                state: this.editedItem.state
            };

            let docId = this.createDocId(newStore.state, newStore.storeName);

            database.collection('stores').doc(docId).get()
                .then(docSnapshot => {
                    if (docSnapshot.exists) {
                        database.collection('stores').doc(docId).update(newStore)
                            .then(() => {
                                common.log("Document updated with ID: ", docId);
                            })
                            .catch((error) => {
                                common.error("Error adding document: ", error);

                                self.$root.$emit('openModal', {
                                    closed: false,
                                    text: 'An error occurred while saving to the database.',
                                    type: 'error'
                                });
                            });
                    }
                    else {
                        database.collection('stores').doc(docId).set(newStore)
                            .then(() => {
                                common.log("Document written with ID: ", docId);
                            })
                            .catch((error) => {
                                common.error("Error adding document: ", error);

                                self.$root.$emit('openModal', {
                                    closed: false,
                                    text: 'An error occurred while saving to the database.',
                                    type: 'error'
                                });
                            });
                    }
                })

            this.close()
        },
        createDocId(state, storeName) {
            return state.toLowerCase().replace(/\s/g, '') + "-" + storeName.substring(storeName.indexOf("of") + 3).toLowerCase().replace(/\s/g, '');
        }
    },
    computed: {
        formTitle () {
            return this.editedIndex === -1 ? 'New Store' : 'Edit Store'
        },
        currentDate() {
            let date = new Date();
            return new Date().toLocaleString("en-ca", { year: "numeric", month: "2-digit", day: "2-digit" })
        }
    },

    watch: {
        dialog (val) {
            val || this.close()
        }
    },
    mounted() {

    },
    created() {
        let self = this;

        database.collection('stores').onSnapshot(snapshot => {
            snapshot.docChanges().forEach(function(change) {
                let doc = change.doc.data();

                // Add new elements to the array
                if (change.type === "added") {
                    self.stores.push({
                        storeName: doc.storeName,
                        managers: doc.managers.map(manager => manager.firstName + " " + manager.lastName).join(', '),
                        employees: doc.employees,
                        createDate: doc.createDate.toDate().toLocaleString(),
                        state: doc.state
                    });
                }

                // Remove elements from the array
                if (change.type === "removed") {
                    self.stores = self.stores.filter(e => e.storeName !== doc.storeName)
                }
            });
        })
    }
}
</script>

<style scoped></style>
