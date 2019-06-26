<template>
    <v-app id="nav">
        <v-navigation-drawer
                v-model="drawer"
                fixed
                clipped
                :class="{ 'grey lighten-4' : $vuetify.theme.dark === false }"
                app
        >
            <v-list :dense="getNavOptions.dense" :nav="getNavOptions.nav" :shaped="getNavOptions.shaped" :rounded="getNavOptions.rounded" class="py-1">
                <v-flex py-3>
                    <v-list-item>
                        <v-flex d-block>
                            <v-list-item-title class="title">IMS</v-list-item-title>
                            <v-list-item-subtitle class="pt-1">{{ getEmail }}</v-list-item-subtitle>
                        </v-flex>
                    </v-list-item>
                </v-flex>
                <v-divider class="pb-2"></v-divider>

                <v-list-item-group>
                    <template v-for="(item, i) in items">
                        <v-subheader v-if="item.heading" :key="`heading-${i}`">{{ item.heading }}</v-subheader>

                        <v-divider v-else-if="item.divider" :key="`divider-${i}`" class="mt-2 pb-2"></v-divider>

                        <v-list-group
                                :prepend-icon="item.icon"
                                append-icon="arrow_drop_down"
                                :value="false"
                                v-else-if="item.list && item.accessLevel >= getAccessLevel"
                                color="dpGreen"
                                active-class="orange--text text--accent-4"
                        >
                            <template v-slot:activator>
                                <v-list-item-title>
                                    {{ item.text }}
                                </v-list-item-title>
                            </template>
                            <v-list-group
                                    no-action
                                    sub-group
                                    value="false"
                                    prepend-icon="arrow_drop_down"
                                    v-for="(option, j) in item.options"
                                    active-class="orange--text text--accent-4"
                            >
                                <template v-slot:activator>
                                    <v-list-item-title>{{ option.text }}</v-list-item-title>
                                </template>

                                <v-list-item
                                        v-for="(nestedOption, k) in option.options"
                                        :key="k"
                                        @click="routeTo('/' + getStoreId + nestedOption.route, nestedOption.name)"
                                        active-class="orange--text text--accent-4"
                                >
                                    <v-list-item-title>{{ nestedOption.text }}</v-list-item-title>
                                    <v-list-item-action>
                                        <v-icon>{{ nestedOption.icon }}</v-icon>
                                    </v-list-item-action>
                                </v-list-item>
                            </v-list-group>
                        </v-list-group>

                        <v-list-item v-else @click="routeTo('/' + getStoreId + item.route, item.name)" :key="i" active-class="orange--text text--accent-4">
                            <v-list-item-icon v-if="item.icon">
                                <v-icon v-if="!isMobile">{{ item.icon }}</v-icon>
                                <v-icon v-else>{{ item.mobileIcon }}</v-icon>
                            </v-list-item-icon>

                            <v-list-item-content v-if="item.text">
                                <v-list-item-title>{{ item.text }}</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                    </template>
                </v-list-item-group>
            </v-list>
        </v-navigation-drawer>
        <v-app-bar dark app :color="navbarColor" clipped-left :scroll-off-screen=false>
            <v-app-bar-nav-icon @click="toggleDrawer">
                <v-icon>
                    menu
                </v-icon>
            </v-app-bar-nav-icon>
            <v-flex shrink>
                <span class="ml-3 mr-5">
<!--                    <svg class="hidden-xs-only" data-v-b59cc9fe="" id="site-logo" x="0px" y="0px" width="200px" height="50px" viewBox="0 0 342 90"><path data-v-b59cc9fe="" fill="#82BC00" d="M89.143,28.296c-3.798-2.095-8.398-3.113-14.063-3.113c-0.784,0-1.543,0.021-2.267,0.052l2.792-21.136  L62.287,8.613c-2.867,0.82-3.515,2.952-3.639,4.207l-2.212,15.068c-2.576,0.841-5.212,1.87-7.863,3.07  c-9.393,4.249-16.77,11.841-19.736,19.752c-1.983,5.29-1.915,10.529,0.197,15.149c3.378,7.39,11.625,11.802,22.062,11.802  c3.963,0,8.026-0.623,12.05-1.846c0.074-0.021-0.989,10.159-0.989,10.159l11.595-3.815c2.866-0.821,3.514-2.953,3.637-4.208  l1.607-12.77c9.488-3.125,17.007-11.534,18.233-20.689C98.159,37.546,95.212,31.642,89.143,28.296z"></path><path data-v-b59cc9fe="" d="M87.191,30.626c-5.947-3.279-13.455-2.812-17.969-2.376l2.389-18.478l-0.293,0.126l-8.684,2.953h0.001  c-0.451,0.175-0.758,0.464-0.953,0.84c-0.004,0.002-0.017,0.037-0.017,0.037c-0.06,0.121-0.106,0.25-0.143,0.386l-0.046,0.02  l-2.27,16.099c-2.918,0.861-5.961,1.994-9.15,3.435C35.875,40.083,27.658,53.34,32.369,63.647  c4.208,9.206,17.152,12.035,29.932,8.156c0.096-0.028,1.271-0.344,1.367-0.375l0.01-0.317l4.709-36.418  c8.101-1.916,14.899-0.909,17.787,2.3c3.839,4.271,0.793,13.261-9.115,16.393l1.852-14.722L76.728,39.4l-4.85,1.605h0.001  c-0.392,0.154-0.664,0.406-0.832,0.735c-0.003,0.002-0.016,0.032-0.016,0.032c-0.101,0.211-0.166,0.446-0.188,0.711l-4.912,37.804  l6.729-2.255c0.991-0.27,1.429-0.769,1.502-1.629l1.824-14.493C91.982,58.037,100.493,37.961,87.191,30.626z M54.405,64.296  c-6.308,0.844-11.712-0.914-13.574-5.396c-2.551-6.138,2.488-13.466,11.108-18.157c2.256-1.227,4.584-2.23,6.138-2.782  L54.405,64.296z"></path><g class="hidden-sm-and-down" data-v-b59cc9fe=""><path data-v-b59cc9fe="" :fill="logoFill" stroke-miterlimit="10" d="M111.28,42.058h7.6c6.157,0,11.26,3.3,11.26,9.844c0,6.354-5.131,9.57-11.01,9.57   h-7.85V42.058z M116.272,57.368h2.579c3.716,0,5.769-2.053,5.769-5.466c0-3.41-2.053-5.74-5.769-5.74h-2.579V57.368z"></path><path data-v-b59cc9fe="" :fill="logoFill" stroke-miterlimit="10" d="M137.958,53.762v3.578h9.179v4.133h-14.171V42.058h13.59v4.132h-8.597v3.439   h6.711v4.132H137.958z"></path><path data-v-b59cc9fe="" :fill="logoFill" stroke-miterlimit="10" d="M157.315,54.955l3.993-12.897h5.047l-6.849,19.415h-4.299l-6.878-19.415h5.048   L157.315,54.955z"></path><path data-v-b59cc9fe="" :fill="logoFill" stroke-miterlimit="10" d="M173.398,61.473h-5.047V42.058h5.047V61.473z"></path><path data-v-b59cc9fe="" :fill="logoFill" stroke-miterlimit="10" d="M191.426,42.696V47.3c-1.139-0.638-2.413-1.054-4.3-1.054   c-4.076,0-5.657,2.773-5.657,5.547c0,2.801,1.607,5.629,5.657,5.629c1.887,0,3.051-0.165,4.3-0.72v4.41   c-1.498,0.47-3.218,0.638-4.632,0.638c-5.604,0-10.539-2.969-10.539-9.901c0-6.934,4.798-9.929,10.372-9.929   C188.707,41.92,189.845,42.225,191.426,42.696z"></path><path data-v-b59cc9fe="" :fill="logoFill" stroke-miterlimit="10" d="M199.799,53.762v3.578h9.181v4.133h-14.172V42.058h13.59v4.132h-8.599v3.439   h6.712v4.132H199.799z"></path><path data-v-b59cc9fe="" fill="#82BC00" d="M217.964,42.058h5.657c3.162,0,7.044,1.276,7.044,6.074c0,4.854-3.882,6.211-6.823,6.211h-2.745v7.13   h-3.133V42.058z M221.097,51.57h2.774c1.636,0,3.521-0.693,3.521-3.438c0-2.718-1.886-3.355-3.521-3.355h-2.774V51.57z"></path><path data-v-b59cc9fe="" fill="#82BC00" d="M236.267,61.473h-3.161V42.058h3.161V61.473z"></path><path data-v-b59cc9fe="" fill="#82BC00" d="M246.75,61.473h-3.079V44.638h-5.354v-2.58h13.783v2.58h-5.351V61.473z"></path><path data-v-b59cc9fe="" fill="#82BC00" d="M259.339,61.75c-2.163,0-4.604-0.389-6.241-0.999v-2.662c1.305,0.444,3.827,1.025,5.991,1.025   c2.329,0,3.966-0.777,3.966-2.856c0-2.412-2.302-2.828-4.687-3.494c-2.44-0.693-4.881-1.747-4.881-5.491   c0-4.437,3.161-5.353,6.322-5.353c2.552,0,4.188,0.332,5.687,0.776l-0.028,2.69c-1.442-0.499-3.273-0.831-4.936-0.831   c-1.777,0-3.911,0.443-3.911,2.607c0,2.107,1.941,2.551,4.104,3.133c2.606,0.722,5.436,1.691,5.436,5.77   C266.161,60.668,262.693,61.75,259.339,61.75z"></path><path data-v-b59cc9fe="" fill="#82BC00" d="M275.591,61.473h-3.079V44.638h-5.354v-2.58h13.784v2.58h-5.351V61.473z"></path><path data-v-b59cc9fe="" fill="#82BC00" d="M290.787,41.92c5.797,0,10.067,3.854,10.067,9.9c0,6.047-4.271,9.93-10.067,9.93   c-5.796,0-10.066-3.883-10.066-9.93C280.721,45.774,284.991,41.92,290.787,41.92z M290.787,58.92c3.827,0,6.796-2.744,6.796-7.1   c0-4.354-2.969-7.072-6.796-7.072c-3.828,0-6.794,2.718-6.794,7.072C283.993,56.176,286.959,58.92,290.787,58.92z"></path><path data-v-b59cc9fe="" fill="#82BC00" d="M303.46,42.058h5.657c3.162,0,7.044,1.276,7.044,6.074c0,4.854-3.882,6.211-6.822,6.211h-2.745v7.13h-3.134   V42.058z M306.594,51.57h2.772c1.637,0,3.522-0.693,3.522-3.438c0-2.718-1.886-3.355-3.522-3.355h-2.772V51.57z"></path></g></svg>-->
                    <svg class="hidden-xs-only" data-v-b59cc9fe="" id="site-logo" x="0px" y="0px" width="200px" height="50px" viewBox="0 0 342 90"><path data-v-b59cc9fe="" fill="#82BC00" d="M89.143,28.296c-3.798-2.095-8.398-3.113-14.063-3.113c-0.784,0-1.543,0.021-2.267,0.052l2.792-21.136  L62.287,8.613c-2.867,0.82-3.515,2.952-3.639,4.207l-2.212,15.068c-2.576,0.841-5.212,1.87-7.863,3.07  c-9.393,4.249-16.77,11.841-19.736,19.752c-1.983,5.29-1.915,10.529,0.197,15.149c3.378,7.39,11.625,11.802,22.062,11.802  c3.963,0,8.026-0.623,12.05-1.846c0.074-0.021-0.989,10.159-0.989,10.159l11.595-3.815c2.866-0.821,3.514-2.953,3.637-4.208  l1.607-12.77c9.488-3.125,17.007-11.534,18.233-20.689C98.159,37.546,95.212,31.642,89.143,28.296z"></path><path data-v-b59cc9fe="" d="M87.191,30.626c-5.947-3.279-13.455-2.812-17.969-2.376l2.389-18.478l-0.293,0.126l-8.684,2.953h0.001  c-0.451,0.175-0.758,0.464-0.953,0.84c-0.004,0.002-0.017,0.037-0.017,0.037c-0.06,0.121-0.106,0.25-0.143,0.386l-0.046,0.02  l-2.27,16.099c-2.918,0.861-5.961,1.994-9.15,3.435C35.875,40.083,27.658,53.34,32.369,63.647  c4.208,9.206,17.152,12.035,29.932,8.156c0.096-0.028,1.271-0.344,1.367-0.375l0.01-0.317l4.709-36.418  c8.101-1.916,14.899-0.909,17.787,2.3c3.839,4.271,0.793,13.261-9.115,16.393l1.852-14.722L76.728,39.4l-4.85,1.605h0.001  c-0.392,0.154-0.664,0.406-0.832,0.735c-0.003,0.002-0.016,0.032-0.016,0.032c-0.101,0.211-0.166,0.446-0.188,0.711l-4.912,37.804  l6.729-2.255c0.991-0.27,1.429-0.769,1.502-1.629l1.824-14.493C91.982,58.037,100.493,37.961,87.191,30.626z M54.405,64.296  c-6.308,0.844-11.712-0.914-13.574-5.396c-2.551-6.138,2.488-13.466,11.108-18.157c2.256-1.227,4.584-2.23,6.138-2.782  L54.405,64.296z"></path><g class="hidden-sm-and-down" data-v-b59cc9fe=""><path data-v-b59cc9fe="" :fill="logoFill" stroke-miterlimit="10" d="M111.28,42.058h7.6c6.157,0,11.26,3.3,11.26,9.844c0,6.354-5.131,9.57-11.01,9.57   h-7.85V42.058z M116.272,57.368h2.579c3.716,0,5.769-2.053,5.769-5.466c0-3.41-2.053-5.74-5.769-5.74h-2.579V57.368z"></path><path data-v-b59cc9fe="" :fill="logoFill" stroke-miterlimit="10" d="M137.958,53.762v3.578h9.179v4.133h-14.171V42.058h13.59v4.132h-8.597v3.439   h6.711v4.132H137.958z"></path><path data-v-b59cc9fe="" :fill="logoFill" stroke-miterlimit="10" d="M157.315,54.955l3.993-12.897h5.047l-6.849,19.415h-4.299l-6.878-19.415h5.048   L157.315,54.955z"></path><path data-v-b59cc9fe="" :fill="logoFill" stroke-miterlimit="10" d="M173.398,61.473h-5.047V42.058h5.047V61.473z"></path><path data-v-b59cc9fe="" :fill="logoFill" stroke-miterlimit="10" d="M191.426,42.696V47.3c-1.139-0.638-2.413-1.054-4.3-1.054   c-4.076,0-5.657,2.773-5.657,5.547c0,2.801,1.607,5.629,5.657,5.629c1.887,0,3.051-0.165,4.3-0.72v4.41   c-1.498,0.47-3.218,0.638-4.632,0.638c-5.604,0-10.539-2.969-10.539-9.901c0-6.934,4.798-9.929,10.372-9.929   C188.707,41.92,189.845,42.225,191.426,42.696z"></path><path data-v-b59cc9fe="" :fill="logoFill" stroke-miterlimit="10" d="M199.799,53.762v3.578h9.181v4.133h-14.172V42.058h13.59v4.132h-8.599v3.439   h6.712v4.132H199.799z"></path><path data-v-b59cc9fe="" fill="#82BC00" d="M217.964,42.058h5.657c3.162,0,7.044,1.276,7.044,6.074c0,4.854-3.882,6.211-6.823,6.211h-2.745v7.13   h-3.133V42.058z M221.097,51.57h2.774c1.636,0,3.521-0.693,3.521-3.438c0-2.718-1.886-3.355-3.521-3.355h-2.774V51.57z"></path><path data-v-b59cc9fe="" fill="#82BC00" d="M236.267,61.473h-3.161V42.058h3.161V61.473z"></path><path data-v-b59cc9fe="" fill="#82BC00" d="M246.75,61.473h-3.079V44.638h-5.354v-2.58h13.783v2.58h-5.351V61.473z"></path><path data-v-b59cc9fe="" fill="#82BC00" d="M259.339,61.75c-2.163,0-4.604-0.389-6.241-0.999v-2.662c1.305,0.444,3.827,1.025,5.991,1.025   c2.329,0,3.966-0.777,3.966-2.856c0-2.412-2.302-2.828-4.687-3.494c-2.44-0.693-4.881-1.747-4.881-5.491   c0-4.437,3.161-5.353,6.322-5.353c2.552,0,4.188,0.332,5.687,0.776l-0.028,2.69c-1.442-0.499-3.273-0.831-4.936-0.831   c-1.777,0-3.911,0.443-3.911,2.607c0,2.107,1.941,2.551,4.104,3.133c2.606,0.722,5.436,1.691,5.436,5.77   C266.161,60.668,262.693,61.75,259.339,61.75z"></path><path data-v-b59cc9fe="" fill="#82BC00" d="M275.591,61.473h-3.079V44.638h-5.354v-2.58h13.784v2.58h-5.351V61.473z"></path><path data-v-b59cc9fe="" fill="#82BC00" d="M290.787,41.92c5.797,0,10.067,3.854,10.067,9.9c0,6.047-4.271,9.93-10.067,9.93   c-5.796,0-10.066-3.883-10.066-9.93C280.721,45.774,284.991,41.92,290.787,41.92z M290.787,58.92c3.827,0,6.796-2.744,6.796-7.1   c0-4.354-2.969-7.072-6.796-7.072c-3.828,0-6.794,2.718-6.794,7.072C283.993,56.176,286.959,58.92,290.787,58.92z"></path><path data-v-b59cc9fe="" fill="#82BC00" d="M303.46,42.058h5.657c3.162,0,7.044,1.276,7.044,6.074c0,4.854-3.882,6.211-6.822,6.211h-2.745v7.13h-3.134   V42.058z M306.594,51.57h2.772c1.637,0,3.522-0.693,3.522-3.438c0-2.718-1.886-3.355-3.522-3.355h-2.772V51.57z"></path></g></svg>
                </span>
            </v-flex>
            <v-text-field
                    class="hidden-sm-and-down"
                    solo-inverted
                    flat
                    hide-details
                    label="Search"
                    prepend-inner-icon="search"
            ></v-text-field>
            <v-spacer></v-spacer>
            <v-toolbar-items>
                <v-btn text v-if="getUser.hasOwnProperty('email')" @click="signOut" class="caption">Sign Out</v-btn>
                <v-btn text v-if="!getUser.hasOwnProperty('email')" @click="routeTo('/login', 'Login')" class="caption">Login</v-btn>
                <v-btn text v-if="isDevelopment" @click="function(){ log(getUser); log(getUserDetails); log($store.state.cleanSettings)}" class="caption">Get User</v-btn>
                <v-btn text v-if="isDevelopment" @click="clearUserAndDetails" class="caption">Clear User</v-btn>
                <v-btn text v-if="isDevelopment" @click="setAccessLevel" class="caption">Access Level</v-btn>
            </v-toolbar-items>
        </v-app-bar>
        <v-content>
            <transition name="zoom-fade" mode="out-in">
                <router-view></router-view>
            </transition>
            <v-container fluid shrink>
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
                                    @click="alert.active = !alert.active"
                                    class="caption"
                            >
                                Close
                            </v-btn>
                        </v-snackbar>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-content>
    </v-app>
</template>

<script>
    import common from '../../common.js'
    import firebase from 'firebase'
    import {mapGetters, mapActions} from 'vuex'

    export default {
        name: "Toolbar",
        data() {
            return {
                alert: {
                    active: false,
                    messsage: '',
                    color: undefined,
                    btnColor: undefined,
                    timeout: 0
                },
                drawer: null,
                items: [
                    // { heading: 'Administration', accessLevel: 2 },
                    { icon: 'person', mobileIcon: 'people_outline', text: 'Users', route: '/management/user', name: 'User Management', accessLevel: 2 },
                    { icon: 'store', mobileIcon: 'store', text: 'Stores', route: '/management/store', name: 'Store Management', accessLevel: 1 },
                    { divider: true, accessLevel: 2 },
                    { icon: 'dashboard', mobileIcon: 'dashboard', text: 'Dashboard', route: '/dashboard', name: 'Dashboard', accessLevel: 4 },
                    { icon: 'folder_shared', mobileIcon: 'folder_shared', text:  'Resources', route: "/helpful-resources", accessLevel: 4 },
                    { divider: true, accessLevel: 4 },
                    // { heading: 'Dashboard', accessLevel: 4 },

                    // { divider: true, accessLevel: 4 },
                    // { heading: 'Inventory', accessLevel: 4 },
                    { icon: 'devices_other', mobileIcon: 'devices_other', addable: true, text: 'Store Stock', route: "/storestock", name: 'Store Stock', accessLevel: 4 },
                    { icon: 'shopping_basket', mobileIcon: 'shopping_basket', addable: true, text: 'Buys & Sales', route: "/buys-and-sales", accessLevel: 4 },
                    { icon: 'swap_horiz', mobileIcon: 'swap_horiz',  addable: true, text:  'Returns', route: "/returns", accessLevel: 4 },
                    { icon: 'devices', mobileIcon: 'devices', text: 'Products', route: "/product-management", accessLevel: 4 },
                    // { divider: true, accessLevel: 4 },
                    { heading: 'Tools', accessLevel: 4 },
                    { list: true, accessLevel: 4, icon: 'ballot', text: 'Sign Maker', options: [
                            { text: 'New Sign', options: [
                                    {
                                        icon: 'smartphone',
                                        text: 'Small Devices',
                                        route: "/signmaker/new-sign/small",
                                        name: 'Small Sign Maker'
                                    },
                                    {
                                        icon: 'laptop',
                                        text: 'Large Devices',
                                        route: "/signmaker/new-sign/large"
                                    }
                                ]},
                            { text: 'Print Queue', options: [
                                    {
                                        icon: 'smartphone',
                                        text: 'Small Devices',
                                        route: "/print-queue/small"
                                    },
                                    {
                                        icon: 'laptop',
                                        text: 'Large Devices',
                                        route: "/print-queue/large"
                                    }
                                ]},
                        ] },
                    { icon: 'memory', mobileIcon: 'memory', accessLevel: 4, text: 'Repair Tree', route: "/repair-tree" },
                    { divider: true, accessLevel: 4 },
                    // { heading: 'Miscellaneous', accessLevel: 5 },
                    { icon: 'settings', mobileIcon: 'phonelink_setup', text: 'Settings', route: "/settings", name: "Settings", accessLevel: 5 },
                    { icon: 'help_outline', mobileIcon: 'help_outline', text: 'Help', route: "/help", accessLevel: 5 },
                    { icon: 'new_releases', mobileIcon: 'new_releases', text: 'What\'s New', route: "/changelog", name: "Changelog", accessLevel: 5 },
                ]
            }
        },
        methods: {
            // Maps specified mutations from the VueX store as computed methods in this component
            ...mapActions([
                'clearUserAndDetails',
                'setAccessLevel'
            ]),
            toggleDrawer() {
                if (firebase.auth().currentUser) {
                    this.drawer = !this.drawer;
                }
                else {
                    this.drawer = false;
                }
            },
            signOut() {
                firebase.auth().signOut();
            },
        },
        mounted() {
            this.routeTo = common.routeTo;
            this.log = common.log;
            this.snackbar = common.snackbar;

            this.$on('openAlert', (msg) => {
                this.alert = {
                    active: true,
                    color: msg.color,
                    message: msg.alertMessage,
                    timeout: 0
                };

                setTimeout(() => {
                    this.alert.active = false;
                }, msg.duration * 1000);
            })

            firebase.auth().onAuthStateChanged((user) => {
                if (!user) {
                    this.drawer = false;
                }
            });
        },
        created() {
            firebase.auth().onAuthStateChanged((user) => {
                if (!user) {
                    this.drawer = false;
                }
            });
        },
        watch: {
        },
        computed: {
            // Maps specified getter functions from the VueX store as computed methods in this component
            ...mapGetters([
                'getUser',
                'getUserDetails',
                'getEmail',
                'getName',
                'getNavOptions',
                'getAccessLevel',
                'getStoreId',
                'drawerToggleable',
            ]),
            isDevelopment() {
                return true;
                // return process.env.NODE_ENV === 'development'
            },
            navbarColor() {
                return "#212121"
            },
            logoFill() {
                return "#fff";
            },
            isMobile() {
                return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            }
        }
    }
</script>

<style scoped>
    .lightbox {
        box-shadow: 0 0 20px inset rgba(0, 0, 0, 0.2);
        background-image: linear-gradient(to top, rgba(0, 0, 0, 0.4) 0%, transparent 72px);
    }
</style>
