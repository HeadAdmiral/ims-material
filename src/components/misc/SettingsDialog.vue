<template>
    <v-app>
        <v-container>
            <v-layout justify-center>
                <v-flex shrink>
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
                                @click="saveSettings"
                                class="caption"
                        >
                            Apply
                        </v-btn>
                    </v-snackbar>
                </v-flex>
            </v-layout>
            <v-subheader>People</v-subheader>
            <v-card>
                <v-list>
                    <v-list-item>
                        <v-list-item-avatar color="grey">
                            <v-icon dark class="mx-auto">person</v-icon>
                        </v-list-item-avatar>

                        <v-list-item-content>
                            <v-list-item-title>{{ getUserDetails.firstName }} {{ getUserDetails.lastName }}
                            </v-list-item-title>
                            <v-list-item-subtitle>{{ getUserDetails.email }}</v-list-item-subtitle>
                        </v-list-item-content>

                        <v-spacer></v-spacer>
                        <v-divider inset vertical class="mx-3"></v-divider>


                        <v-dialog v-model="dialog" max-width="600px">
                            <template v-slot:activator="{ on }">
                                <v-btn class="caption" color="googleBlue600" dark @click="dialog = !dialog" v-on="on">
                                    Edit
                                </v-btn>
                            </template>
                            <v-card>
                                <v-card-title>
                                    <span class="headline">User Profile</span>
                                </v-card-title>
                                <v-card-text>
                                    <v-container>
                                        <v-layout wrap>
                                            <v-flex xs12>
                                                <v-text-field label="First Name" required browser-autocomplete="no"
                                                              v-model="firstName"></v-text-field>
                                            </v-flex>
                                            <v-flex xs12>
                                                <v-text-field label="Last Name" required browser-autocomplete="no"
                                                              v-model="lastName"></v-text-field>
                                            </v-flex>
                                        </v-layout>
                                    </v-container>
                                </v-card-text>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn color="blue darken-1" text @click="normalizeDialog" class="caption">Cancel</v-btn>
                                    <v-btn color="blue darken-1" text @click="updateUser" class="caption">Update</v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>
                    </v-list-item>
                </v-list>
            </v-card>

            <br>

            <v-subheader>Appearance</v-subheader>
            <v-card>
                <v-list subheader class="pb-0" two-line>
                    <v-list-item>
                        <v-list-item-content>
                            <v-list-item-title>Theme</v-list-item-title>
                            <v-list-item-subtitle>Customize color palette</v-list-item-subtitle>

                        </v-list-item-content>
                        <v-spacer></v-spacer>
                        <v-btn icon>
                            <v-icon color="grey">open_in_new</v-icon>
                        </v-btn>

                    </v-list-item>

                    <v-divider></v-divider>

                    <v-list-item>
                        <v-flex xs12>
                            <v-list-item-content>
                                <v-list-item-title>Dark mode</v-list-item-title>
                                <v-list-item-subtitle>Toggle dark mode for various elements</v-list-item-subtitle>
                            </v-list-item-content>
                        </v-flex>
                        <v-switch color="googleBlue600" v-model="getSettings.themes.darkMode" @change="toggleDarkMode"></v-switch>
                    </v-list-item>

                    <v-divider></v-divider>

                    <v-list-group :ripple="false" color="undefined" append-icon="expand_more" class="expandLink">
                        <template v-slot:activator>
                            <v-list-item-content>
                                <v-list-item-title>Navigation Styling</v-list-item-title>
                                <v-list-item-subtitle>Adjust styling for navigation drawer</v-list-item-subtitle>
                            </v-list-item-content>
                        </template>
                        <v-list-item>
                            <v-layout row wrap justify-space-around>
                                <v-switch v-model="getNavOptions.dense" class="mx-2"
                                          label="Dense spacing" color="googleBlue600"
                                          @change="updateSettings('dense')"></v-switch>
                                <v-switch v-model="getNavOptions.shaped" class="mx-2"
                                          label="Shaped items" color="googleBlue600"
                                          @change="updateSettings('shaped')"></v-switch>
                                <v-switch v-model="getNavOptions.nav" class="mx-2"
                                          label="Padded items" color="googleBlue600"
                                          @change="updateSettings('nav')"></v-switch>
                                <v-switch v-model="getNavOptions.rounded" class="mx-2"
                                          label="Rounded items" color="googleBlue600"
                                          @change="updateSettings('rounded')"></v-switch>
                            </v-layout>
                        </v-list-item>
                    </v-list-group>
                </v-list>
            </v-card>
        </v-container>
    </v-app>
</template>

<script>
    import common from '../../common.js'
    import database from '../../firebaseInit.js'
    import {mapGetters} from 'vuex'

    export default {
        name: "SettingsDialog",
        data() {
            return {
                alert: {
                    active: false,
                    messsage: '',
                    color: undefined,
                    btnColor: undefined,
                    timeout: 0
                },
                dialog: false,
                firstName: '',
                lastName: '',
                settings: {
                    themes: {
                        darkMode: false,
                        light: {},
                        dark: {}
                    },
                    navOptions: {
                        dense: true,
                        shaped: false,
                        nav: true,
                        rounded: false,
                    }
                },
                originalSettings: {
                    themes: {
                        darkMode: false,
                        light: {},
                        dark: {}
                    },
                    navOptions: {
                        dense: true,
                        shaped: false,
                        nav: true,
                        rounded: false,
                    }
                }
            }
        },
        mounted() {
            this.firstName = this.getUserDetails.firstName;
            this.lastName = this.getUserDetails.lastName;

            this.routeTo = common.routeTo;
            this.log = common.log;
            this.snackbar = common.snackbar;

            this.$on('openSnackbar', (msg) => {
                this.alert = {
                    active: true,
                    color: msg.color,
                    message: msg.alertMessage,
                    timeout: 0
                };

                // setTimeout(() => {
                //     this.alert.active = false;
                // }, msg.duration * 1000);
            })
        },
        created() {
            this.originalSettings = this.getCleanSettings.settings;
            this.settings = this.getSettings;
        },
        methods: {
            saveSettings() {
                let self = this;
                database.collection('users').doc(self.getUserId).update({
                    settings: self.settings
                }).then(() => {
                    console.log("Settings saved successfully.");
                    self.$store.dispatch({
                        type: 'setSettings',
                        payload: self.settings
                    }).then(() => {
                        console.log("Updated stored settings");
                    })
                }).catch((err) => {
                    console.log(err);
                });

                this.alert.active = false;
            },
            toggleDarkMode() {
                this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
                // this.settings.themes.theme = this.$vuetify.theme.dark ? 'dark' : 'light';
            },
            updateSettings(val) {
                switch (val) {
                    case 'dense':
                        this.settings.navOptions.dense = this.getNavOptions.dense;
                        break;
                    case 'shaped':
                        this.settings.navOptions.shaped = this.getNavOptions.shaped;
                        break;
                    case 'nav':
                        this.settings.navOptions.nav = this.getNavOptions.nav;
                        break;
                    case 'rounded':
                        this.settings.navOptions.rounded = this.getNavOptions.rounded;
                        break;
                }
            },
            normalizeDialog() {
                this.dialog = false;
                this.firstName = this.getUserDetails.firstName;
                this.lastName = this.getUserDetails.lastName;
            },
            updateUser() {
                let self = this;
                database.collection('users').doc(self.getUserId).update({
                    firstName: self.firstName,
                    lastName: self.lastName
                }).then(() => {
                    console.log("Update successful!");
                    self.$store.dispatch({
                        type: 'setName',
                        payload: {
                            firstName: self.firstName,
                            lastName: self.lastName
                        }
                    }).then(() => {
                        self.normalizeDialog();
                    })
                }).catch((err) => {
                    console.log(err);
                })
            },
        },
        watch: {
            settings: {
                handler: function () {
                    switch (this.changes) {
                        case 0:
                            this.alert.active = false;
                            break;
                        case 1:
                            this.snackbar('warning', 'There is ' + this.changes + ' unapplied change.');
                            break;
                        default:
                            this.snackbar('warning', 'There are ' + this.changes + ' unapplied changes.');
                    }
                },
                deep: true
            },
        },
        computed: {
            ...mapGetters([
                'getUserDetails',
                'getUserId',
                'getNavOptions',
                'getSettings',
                'getCleanSettings'
            ]),
            changes() {
                let changes = 0;
                let self = this;

                // Iterate through each item in settings
                Object.keys(this.settings).forEach(function (key) {
                    let settings = self.settings[key];
                    let originalSettings = self.originalSettings[key];

                    // Iterate through each item in settings[key]
                    Object.keys(settings).forEach(function (subKey) {
                        // Check if the key does not match it's original value (aka it has been changed)
                        if (typeof settings[subKey] !== "object" && settings[subKey] !== originalSettings[subKey]) {
                            changes++;
                        }
                    })
                });
                return changes;
            }
        },
    }
</script>

<style scoped>

</style>