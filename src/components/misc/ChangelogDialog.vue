<template>
    <v-app>
        <v-container justify-center pb-5>
            <v-layout justify-center>
                <v-flex xs8 pb-5>
                    <div class="pb-5">
                        <h1 class="display-3">What's new</h1>
                        <br>
                        <p class="subheading">Learn about new additions, features, and tools that have appeared in the IMS</p>
                    </div>
                </v-flex>
            </v-layout>
            <v-divider></v-divider>
            <v-layout justify-center>
                <v-flex xs8 pt-5>
                    <v-flex class="pb-5">
                        <h1 class="display-3">Versions</h1>
                        <p class="subheading text--lighten-3">New updates and additions that have been developed in each new version</p>
                        <v-subheader v-if="isDevelopment">Versioning Schema: Version.MajorUpdate.ChangeCount <i>(change count measured in tens)</i></v-subheader>
                    </v-flex>

                    <v-flex pb-5>
                        <h1 class="display-1">3.0.0</h1>
                        <v-chip dark color="googleBlue600" class="mr-2">Current Release</v-chip>
                        <v-chip>Version Update</v-chip>
                        <br>
                        <v-flex grow xs12 sm12 md6 pt-3 pr-5 style="display: inline-flex">
                            <div>
                                <div class="pb-4">
                                    <h2 class="title font-weight-regular">Administration</h2>
                                    <br>
                                    <ul class="subheading">
                                        <li :class="{ 'grey--text text--darken-2' : !isDarkMode }">
                                            Added <strong :class="{ 'grey--text text--darken-4' : !isDarkMode }">management tools</strong> to improve ease of access when working with stores and users
                                        </li>
                                    </ul>
                                </div>
                                <div class="pb-4">
                                    <h2 class="title font-weight-regular">Persistence</h2>
                                    <br>
                                    <ul class="subheading">
                                        <li :class="{ 'grey--text text--darken-2' : !isDarkMode }">
                                            Incorporated <strong :class="{ 'grey--text text--darken-4' : !isDarkMode }">persistent storage of user information</strong> to allow seamless functionality across sessions
                                        </li>
                                    </ul>
                                </div>
                                <div class="pb-4">
                                    <h2 class="title font-weight-regular">PWA</h2>
                                    <br>
                                    <ul class="subheading">
                                        <li :class="{ 'grey--text text--darken-2' : !isDarkMode }">
                                            Implemented <strong :class="{ 'grey--text text--darken-4' : !isDarkMode }">service workers</strong> to provide <strong :class="{ 'grey--text text--darken-4' : !isDarkMode }">progressive web app functionality</strong> to mobile users
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </v-flex>
                        <v-flex grow xs12 sm12 md6 pr-5 style="display: inline-flex">
                            <div>
                                <div class="pb-4">
                                    <h2 class="title font-weight-regular" :class="{ 'grey--text text--darken-4' : !isDarkMode }">Authentication</h2>
                                    <br>
                                    <ul class="subheading">
                                        <li :class="{ 'grey--text text--darken-2' : !isDarkMode }">
                                            Integrated user accounts to <strong :class="{ 'grey--text text--darken-4' : !isDarkMode }">ensure reliability and consistency</strong> of data entry
                                        </li>
                                        <li :class="{ 'grey--text text--darken-2' : !isDarkMode }">
                                            Security <strong :class="{ 'grey--text text--darken-4' : !isDarkMode }">permissions</strong> provide safeguards to protect and limit data access
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <h2 class="title font-weight-regular" :class="{ 'grey--text text--darken-4' : !isDarkMode }">RepairTree</h2>
                                    <br>
                                    <ul class="subheading">
                                        <li :class="{ 'grey--text text--darken-2' : !isDarkMode }">
                                            <strong :class="{ 'grey--text text--darken-4' : !isDarkMode }">Troubleshooting tool</strong> aimed at providing logical steps to repair a device
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </v-flex>
                    </v-flex>

                    <v-divider></v-divider>

                    <v-flex py-5>
                        <h1 class="display-1">2.1.3</h1>
                        <br>
                        <v-flex grow xs12 sm12 md6 pr-5 style="display: inline-flex">
                            <div class="pb-4">
                                <h2 class="title font-weight-regular">Consistency</h2>
                                <br>
                                <ul class="subheading">
                                    <li :class="{ 'grey--text text--darken-2' : !isDarkMode }">
                                        Modified form fields to ensure <strong :class="{ 'grey--text text--darken-4' : !isDarkMode }">syntax consistency</strong> across all platform tools
                                    </li>
                                    <li :class="{ 'grey--text text--darken-2' : !isDarkMode }">
                                        Populated <strong :class="{ 'grey--text text--darken-4' : !isDarkMode }">autocomplete fields with technician names</strong> to establish complete consistency in data entry
                                    </li>
                                    <li :class="{ 'grey--text text--darken-2' : !isDarkMode }">
                                        <strong :class="{ 'grey--text text--darken-4' : !isDarkMode }">Redesigned dropdown menus</strong> to better coincide with the styles of other elements
                                    </li>
                                </ul>
                            </div>
                        </v-flex>
                        <v-flex grow xs6 pr-5 style="display: inline-flex">
                            <div>
                                <h2 class="title font-weight-regular">User Management</h2>
                                <br>
                                <ul class="subheading">
                                    <li :class="{ 'grey--text text--darken-2' : !isDarkMode }">
                                        Added functionality to <strong :class="{ 'grey--text text--darken-4' : !isDarkMode }">add, edit, and view technician information</strong> from a central dashboard
                                    </li>
                                </ul>
                            </div>
                        </v-flex>
                    </v-flex>
                    <v-flex pb-5>
                        <h1 class="display-1">2.1.2</h1>
                        <v-chip dark color="red">Bug Fixes</v-chip>
                        <br>
                        <v-flex grow xs12 sm12 md6 pr-5 pt-3 style="display: inline-flex">
                            <div>
                                <div class="pb-4">
                                    <h2 class="title font-weight-regular">User Profiles</h2>
                                    <br>
                                    <ul class="subheading">
                                        <li :class="{ 'grey--text text--darken-2' : !isDarkMode }">
                                            Profiles for each technician providing <strong :class="{ 'grey--text text--darken-4' : !isDarkMode }">statistics</strong> on number of buys, sales, returns, as well as the total number of repairs completed
                                        </li>
                                    </ul>
                                </div>
                                <div class="pb-4">
                                    <h2 class="title font-weight-regular">Date Fixes</h2>
                                    <br>
                                    <ul class="subheading">
                                        <li :class="{ 'grey--text text--darken-2' : !isDarkMode }">
                                            Adjusted and <strong :class="{ 'grey--text text--darken-4' : !isDarkMode }">corrected functionality of timestamps</strong> within all tools statistics
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </v-flex>
                        <v-flex grow xs12 sm12 md6 pr-5 style="display: inline-flex">
                            <div>
                                <h2 class="title font-weight-regular">Sign Prompts</h2>
                                <br>
                                <ul class="subheading">
                                    <li :class="{ 'grey--text text--darken-2' : !isDarkMode }">
                                        Technician is <strong :class="{ 'grey--text text--darken-4' : !isDarkMode }">prompted to create signage</strong> upon entry of a device into the Store Stock Tracker.
                                    </li>
                                </ul>
                            </div>
                        </v-flex>
                    </v-flex>
                    <v-flex pb-5>
                        <h1 class="display-1">2.1.1</h1>
                        <v-chip dark color="red">Bug Fixes</v-chip>
                        <br>
                        <v-flex grow xs12 sm12 md6 pr-5 pt-3 style="display: inline-flex">
                            <div class="pb-4">
                                <h2 class="title font-weight-regular">Garbage Collection</h2>
                                <br>
                                <ul class="subheading">
                                    <li :class="{ 'grey--text text--darken-2' : !isDarkMode }">
                                        Devices marked as <i>Ready for Floor</i> in excess of 100 will have their <strong :class="{ 'grey--text text--darken-4' : !isDarkMode }">status automatically removed</strong>
                                    </li>
                                </ul>
                            </div>
                        </v-flex>
                        <v-flex grow xs12 sm12 md6 pr-5 pt-3 style="display: inline-flex">
                            <div>
                                <h2 class="title font-weight-regular">Large Sign Fixes</h2>
                                <br>
                                <ul class="subheading">
                                    <li :class="{ 'grey--text text--darken-2' : !isDarkMode }">
                                        Resolved an issue where <strong :class="{ 'grey--text text--darken-4' : !isDarkMode }">hard drive size and memory were incorrectly displayed</strong> on large signs in the print queue
                                    </li>
                                </ul>
                            </div>
                        </v-flex>
                    </v-flex>
                    <v-flex pb-5>
                        <h1 class="display-1">2.1.0</h1>
                        <v-chip>Major Release</v-chip>
                        <br>
                        <v-flex grow xs12 sm12 md6 pr-5 pt-3 style="display: inline-flex">
                            <div class="pb-4">
                                <h2 class="title font-weight-regular">Large Sign Maker</h2>
                                <br>
                                <ul class="subheading">
                                    <li :class="{ 'grey--text text--darken-2' : !isDarkMode }">
                                        Expanded the Sign Maker to allow for <strong :class="{ 'grey--text text--darken-4' : !isDarkMode }">functionality to create signs</strong> for larger devices like laptops
                                    </li>
                                </ul>
                            </div>
                        </v-flex>
                    </v-flex>

                    <v-divider></v-divider>

                    <v-flex py-5>
                        <h1 class="display-1">2.0.2</h1>
                        <br>
                        <v-flex grow xs12 sm12 md6 pr-5 style="display: inline-flex">
                            <div class="pb-4">
                                <h2 class="title font-weight-regular">Reactive Forms</h2>
                                <br>
                                <ul class="subheading">
                                    <li :class="{ 'grey--text text--darken-2' : !isDarkMode }">
                                        Modified dropdowns to <strong :class="{ 'grey--text text--darken-4' : !isDarkMode }">adjust available options</strong> based on user input
                                    </li>
                                </ul>
                            </div>
                        </v-flex>
                        <v-flex grow xs12 sm12 md6 pr-5 style="display: inline-flex">
                            <div>
                                <h2 class="title font-weight-regular">Tooltips</h2>
                                <br>
                                <ul class="subheading">
                                    <li :class="{ 'grey--text text--darken-2' : !isDarkMode }">
                                        Added <strong :class="{ 'grey--text text--darken-4' : !isDarkMode }">tooltips</strong> that appear over the Changelog and Support icons in the banner
                                    </li>
                                </ul>
                            </div>
                        </v-flex>
                    </v-flex>
                    <v-flex pb-5>
                        <h1 class="display-1">2.0.1</h1>
                        <v-chip dark color="red">Bug Fixes</v-chip>
                        <br>
                        <v-flex grow xs12 sm12 md6 pr-5 pt-3 style="display: inline-flex">
                            <div>
                            <div class="pb-4">
                                <h2 class="title font-weight-regular">Viewport Adjustments</h2>
                                <br>
                                <ul class="subheading">
                                    <li :class="{ 'grey--text text--darken-2' : !isDarkMode }">
                                        Modified styling and sizing of various elements to <strong :class="{ 'grey--text text--darken-4' : !isDarkMode }">accommodate more display types</strong> and sizes
                                    </li>
                                </ul>
                            </div>
                            <div class="pb-4">
                                <h2 class="title font-weight-regular">Changelog</h2>
                                <br>
                                <ul class="subheading">
                                    <li :class="{ 'grey--text text--darken-2' : !isDarkMode }">
                                        Added a <strong :class="{ 'grey--text text--darken-4' : !isDarkMode }">changelog</strong> detailing new additions and features to the banner
                                    </li>
                                </ul>
                            </div>
                                <div class="pb-4">
                                    <h2 class="title font-weight-regular">Advanced Search Tweaks</h2>
                                    <br>
                                    <ul class="subheading">
                                        <li :class="{ 'grey--text text--darken-2' : !isDarkMode }">
                                            Resolved an issue where certain <strong :class="{ 'grey--text text--darken-4' : !isDarkMode }">database entries would not appear</strong> in the Advanced Search <strong :class="{ 'grey--text text--darken-4' : !isDarkMode }">due to lexicographical order</strong>
                                        </li>
                                        <li :class="{ 'grey--text text--darken-2' : !isDarkMode }">
                                            Included <strong :class="{ 'grey--text text--darken-4' : !isDarkMode }">result quantity</strong> alongside search query in the subheading
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </v-flex>
                        <v-flex grow xs12 sm12 md6 pr-5 style="display: inline-flex">
                            <div>
                            <div class="pb-4">
                                <h2 class="title font-weight-regular">Optimized Workflow</h2>
                                <br>
                                <ul class="subheading">
                                    <li :class="{ 'grey--text text--darken-2' : !isDarkMode }">
                                        Added <strong :class="{ 'grey--text text--darken-4' : !isDarkMode }">quick-add</strong> buttons to Store Stock, Buys & Sales, and Returns tabs <strong :class="{ 'grey--text text--darken-4' : !isDarkMode }">to speed up adding entries</strong>
                                    </li>
                                </ul>
                            </div>
                            <div class="pb-4">
                                <h2 class="title font-weight-regular">Support</h2>
                                <br>
                                <ul class="subheading">
                                    <li :class="{ 'grey--text text--darken-2' : !isDarkMode }">
                                        Implemented a <strong :class="{ 'grey--text text--darken-4' : !isDarkMode }">support ticket system</strong> for logging and documenting bugs and or feature requests
                                    </li>
                                </ul>
                            </div>
                            </div>
                        </v-flex>
                        <v-flex py-5>
                            <h1 class="display-1">2.0.0</h1>
                            <v-chip>Version Update</v-chip>
                            <br>
                            <v-flex grow xs12 sm12 md6 pr-5 pt-3 style="display: inline-flex">
                                <div>
                                    <div class="pb-4">
                                        <h2 class="title font-weight-regular">Reusable Components</h2>
                                        <br>
                                        <ul class="subheading">
                                            <li :class="{ 'grey--text text--darken-2' : !isDarkMode }">
                                                <strong :class="{ 'grey--text text--darken-4' : !isDarkMode }">Complete rebuild of the IMS</strong> from scratch using a frontend framework to componentize elements and vastly improve application performance
                                            </li>
                                        </ul>
                                    </div>
                                    <div class="pb-4">
                                        <h2 class="title font-weight-regular">Reliable Backend</h2>
                                        <br>
                                        <ul class="subheading">
                                            <li :class="{ 'grey--text text--darken-2' : !isDarkMode }">
                                                Deployed application using a real backend that offers <strong :class="{ 'grey--text text--darken-4' : !isDarkMode }">improved deployment time and reliability</strong>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </v-flex>
                            <v-flex grow xs12 sm12 md6 pr-5 pt-3 style="display: inline-flex">
                                <div>
                                    <div class="pb-4">
                                        <h2 class="title font-weight-regular">Reduced Load Times</h2>
                                        <br>
                                        <ul class="subheading">
                                            <li :class="{ 'grey--text text--darken-2' : !isDarkMode }">
                                                Properly <strong :class="{ 'grey--text text--darken-4' : !isDarkMode }">implemented Promises and eliminated bad practices</strong> of waiting for set intervals of time to pass before attempting to access data
                                            </li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h2 class="title font-weight-regular">Sign Tweaks</h2>
                                        <br>
                                        <ul class="subheading">
                                            <li :class="{ 'grey--text text--darken-2' : !isDarkMode }">
                                                <strong :class="{ 'grey--text text--darken-4' : !isDarkMode }">Modified styling</strong> and general aesthetic of signs made in the sign maker <strong :class="{ 'grey--text text--darken-4' : !isDarkMode }">to better display product information</strong>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </v-flex>
                        </v-flex>
                        <v-divider></v-divider>

                        <v-flex py-5>
                            <h1 class="display-1">1.1.0</h1>
                            <v-chip>Major Release</v-chip>
                            <br>
                            <v-flex grow xs12 sm12 md6 pr-5 pt-3 style="display: inline-flex">
                                <div>
                                    <h2 class="title font-weight-regular">Sign Maker</h2>
                                    <br>
                                    <ul class="subheading">
                                        <li :class="{ 'grey--text text--darken-2' : !isDarkMode }">
                                            Integrated <strong :class="{ 'grey--text text--darken-4' : !isDarkMode }">digital sign maker</strong> which provided customizable inputs, signage preview, as well as a fully-modifiable print queue
                                        </li>
                                    </ul>
                                </div>
                            </v-flex>
                        </v-flex>
                        <v-flex pb-5>
                            <h1 class="display-1">1.0.0</h1>
                            <v-chip>Version Update</v-chip>
                            <br>
                            <v-flex grow xs12 sm12 md6 pr-5 pt-3 style="display: inline-flex">
                                <div>
                                    <div class="pb-4">
                                        <h2 class="title font-weight-regular">Store Stock Tracker</h2>
                                        <br>
                                        <ul class="subheading">
                                            <li :class="{ 'grey--text text--darken-2' : !isDarkMode }">
                                                Organized <strong :class="{ 'grey--text text--darken-4' : !isDarkMode }">management and collection tool</strong> for capture of information about <strong :class="{ 'grey--text text--darken-4' : !isDarkMode }">store-owned devices</strong>
                                            </li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h2 class="title font-weight-regular">Returns Tracker</h2>
                                        <br>
                                        <ul class="subheading">
                                            <li :class="{ 'grey--text text--darken-2' : !isDarkMode }">
                                                Simple <strong :class="{ 'grey--text text--darken-4' : !isDarkMode }">tool for tracking returned devices</strong> and pertaining cause for return
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                            </v-flex>
                            <v-flex grow xs12 sm12 md6 pr-5 pt-3 style="display: inline-flex">
                                <div>
                                    <h2 class="title font-weight-regular">Buy & Sale Tracker</h2>
                                    <br>
                                    <ul class="subheading">
                                        <li :class="{ 'grey--text text--darken-2' : !isDarkMode }">
                                            Straightforward <strong :class="{ 'grey--text text--darken-4' : !isDarkMode }">column-based tracking tool</strong> for managing purchase and sale of both <strong :class="{ 'grey--text text--darken-4' : !isDarkMode }">customer and store-owned devices</strong>
                                        </li>
                                    </ul>
                                </div>
                            </v-flex>
                        </v-flex>
                    </v-flex>
                </v-flex>
            </v-layout>
        </v-container>
    </v-app>
</template>

<script>
    import {mapGetters} from 'vuex'
    export default {
        name: "ChangelogDialog",

        computed: {
            ...mapGetters([
                'isDarkMode'
            ]),
            isDevelopment() {
                return process.env.NODE_ENV === 'development'
            }
        }
    }
</script>

<style scoped>
    h1.display-3 {
        font-size: 60px!important;
    }

    li {
        line-height: 1.8;
    }

</style>