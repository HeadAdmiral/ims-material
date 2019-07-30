<template>
    <v-app id="login">
        <v-content>
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
        <v-container fill-height grid-list-md fluid class="grey lighten-4">
            <v-layout row wrap justify-center>
                <v-flex xs12 sm6 md5 lg3 xl2 v-if="!isMobile">
                    <v-toolbar color="success" dark extended class="text-xs-center">
                        <v-toolbar-title class="text-xs-center headline mx-auto pt-3">Log in</v-toolbar-title>
                    </v-toolbar>
                    <v-card class="pa-4">
                        <v-form ref="form" v-model="valid" @keyup.native.enter="submit">
                            <v-flex>
                                <v-text-field
                                        v-model="email"
                                        :rules="[rules.required, rules.email]"
                                        label="Email"
                                        color="info"
                                ></v-text-field>
                            </v-flex>
                            <v-flex>
                                <v-text-field
                                        v-model="password"
                                        :rules="[rules.required, rules.min]"
                                        :type="showPass ? 'text' : 'password'"
                                        label="Password"
                                        color="info"
                                ></v-text-field>
                            </v-flex>

                        </v-form>
                        <v-card-text class="text-xs-right px-0 pt-0 pb-5 caption">
                            <a class="text-xs-right grey--text text--darken-2">
                                Forgot <strong>Password?</strong>
                            </a>
                        </v-card-text>
                        <v-card-actions class="pt-3 pr-0">
                            <v-btn color="success" dark @click="submit" :loading="loading" :disabled="loading" class="px-3" rounded>Log In</v-btn>
                            <v-btn text color="secondary" @click="clear">Clear</v-btn>
                            <v-card-text class="text-xs-right pa-0 caption">
                                <router-link to="/register" tag="span">
                                    <v-flex>
                                        <a class="text-xs-right grey--text text--darken-2">
                                            Don't have an account? <strong style="color: #2196F3">Sign up</strong>
                                        </a>
                                    </v-flex>
                                </router-link>
                            </v-card-text>
                        </v-card-actions>
                    </v-card>
                </v-flex>
                <v-flex xs12 sm6 md5 lg3 xl2 v-else style="max-width: 350px">
                    <v-img></v-img>
                    <v-layout style="height: 100%" justify-center column class="pa-4">
                        <v-form ref="form" v-model="valid" @keyup.native.enter="submit">
                            <v-layout justify-center>
                                <svg data-v-b59cc9fe="" id="app-logo" x="0" y="0" height="150" width="125" viewbox="0 0 100 100"><path data-v-b59cc9fe="" fill="#82BC00" d="M89.143,28.296c-3.798-2.095-8.398-3.113-14.063-3.113c-0.784,0-1.543,0.021-2.267,0.052l2.792-21.136  L62.287,8.613c-2.867,0.82-3.515,2.952-3.639,4.207l-2.212,15.068c-2.576,0.841-5.212,1.87-7.863,3.07  c-9.393,4.249-16.77,11.841-19.736,19.752c-1.983,5.29-1.915,10.529,0.197,15.149c3.378,7.39,11.625,11.802,22.062,11.802  c3.963,0,8.026-0.623,12.05-1.846c0.074-0.021-0.989,10.159-0.989,10.159l11.595-3.815c2.866-0.821,3.514-2.953,3.637-4.208  l1.607-12.77c9.488-3.125,17.007-11.534,18.233-20.689C98.159,37.546,95.212,31.642,89.143,28.296z"></path><path data-v-b59cc9fe="" d="M87.191,30.626c-5.947-3.279-13.455-2.812-17.969-2.376l2.389-18.478l-0.293,0.126l-8.684,2.953h0.001  c-0.451,0.175-0.758,0.464-0.953,0.84c-0.004,0.002-0.017,0.037-0.017,0.037c-0.06,0.121-0.106,0.25-0.143,0.386l-0.046,0.02  l-2.27,16.099c-2.918,0.861-5.961,1.994-9.15,3.435C35.875,40.083,27.658,53.34,32.369,63.647  c4.208,9.206,17.152,12.035,29.932,8.156c0.096-0.028,1.271-0.344,1.367-0.375l0.01-0.317l4.709-36.418  c8.101-1.916,14.899-0.909,17.787,2.3c3.839,4.271,0.793,13.261-9.115,16.393l1.852-14.722L76.728,39.4l-4.85,1.605h0.001  c-0.392,0.154-0.664,0.406-0.832,0.735c-0.003,0.002-0.016,0.032-0.016,0.032c-0.101,0.211-0.166,0.446-0.188,0.711l-4.912,37.804  l6.729-2.255c0.991-0.27,1.429-0.769,1.502-1.629l1.824-14.493C91.982,58.037,100.493,37.961,87.191,30.626z M54.405,64.296  c-6.308,0.844-11.712-0.914-13.574-5.396c-2.551-6.138,2.488-13.466,11.108-18.157c2.256-1.227,4.584-2.23,6.138-2.782  L54.405,64.296z"></path></svg>
                            </v-layout>
                            <v-flex>
                                <v-text-field
                                        v-model="email"
                                        :rules="[rules.required, rules.email]"
                                        label="Email"
                                        color="info"
                                ></v-text-field>
                            </v-flex>
                            <v-flex>
                                <v-text-field
                                        v-model="password"
                                        :rules="[rules.required, rules.min]"
                                        :type="showPass ? 'text' : 'password'"
                                        label="Password"
                                        color="info"
                                ></v-text-field>
                            </v-flex>

                        </v-form>
                        <span class="text-xs-right px-0 pt-0 pb-5 caption">
                            <a class="text-xs-right grey--text text--darken-2 float-right">
                                Forgot <strong>Password?</strong>
                            </a>
                        </span>
                        <v-card-actions class="pt-5 pr-0">
                            <v-btn color="success" dark @click="submit" :loading="loading" :disabled="loading" class="px-3" block>Log In</v-btn>
                            <!--                            <v-btn text color="secondary" @click="clear">Clear</v-btn>-->

                        </v-card-actions>

                        <v-card-text class="text-xs-right pa-0 pt-3 caption">
                            <router-link to="/register" tag="span">
                                <v-flex pa-0>
                                    <a class="text-xs-right grey--text text--darken-2">
                                        Don't have an account? <strong style="color: #2196F3">Sign up</strong>
                                    </a>
                                </v-flex>
                            </router-link>
                        </v-card-text>
                    </v-layout>
                </v-flex>
            </v-layout>
        </v-container>
        </v-content>
    </v-app>
</template>

<script>
    import common from '../../common.js'
    import database from '../../firebaseInit.js'
    import firebase from 'firebase'
    import {mapGetters, mapActions} from 'vuex'

    export default {
        name: "Login",
        data() {
            return {
                email: "",
                password: "",
                showPass: false,
                valid: false,
                loading: false,
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
            isMobile() {
                return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            },
            submit() {
                let self = this;
                let valid = this.$refs.form.validate();
                let persistenceType;

                if (valid) {
                    self.loading = true;

                    if (this.isMobile) {
                        persistenceType = firebase.auth.Auth.Persistence.LOCAL;
                    }
                    else {
                        persistenceType = firebase.auth.Auth.Persistence.SESSION;
                    }

                    firebase.auth().setPersistence(persistenceType)
                        .then(() => {
                            return firebase.auth().signInWithEmailAndPassword(this.email, this.password)
                                .then(() => {
                                    self.loading = false;

                                    self.$store.dispatch({
                                        type: 'login',
                                    })
                                })
                                .catch(err => {
                                    self.loading = false;
                                    let message = null;

                                    switch (err.code) {
                                        case "auth/user-not-found":
                                            message = "No user exists with this e-mail address!";
                                            break;
                                        case "auth/wrong-password":
                                            message = "The password you entered was incorrect!";
                                            break;
                                        case "auth/user-disabled":
                                            message = "This user has been disabled!";
                                            break;
                                        case "auth/too-many-requests":
                                            message = "Whoa! Slow down there! You're sending too many requests!";
                                            break;
                                        case "auth/app-not-authorized":
                                            message = "This application is not authorized to use Firebase Authentication!";
                                            break;
                                        default:
                                            if (err.code) {
                                                message = "An unknown error has occurred!";
                                            }
                                            else {
                                                console.error(err);
                                                return;
                                            }
                                            break;
                                    }

                                    self.snackbar("error", message, 2.5)
                                })
                        })

                }
                else {
                    this.snackbar("error", "Please fill out all fields!", 2.5);
                }
            },
            clear() {
                this.$refs.form.reset();
            }
        },
        mounted() {
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
        },
        computed: {
            ...mapGetters([

            ])
        }
    }
</script>

<style scoped lang="scss">
    span {
        a {
            text-decoration: none;
        }
    }
</style>
