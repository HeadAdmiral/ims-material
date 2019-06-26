<template>
    <v-app id="login">
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
        <v-container grid-list-md text-xs fluid class="grey lighten-4">
            <v-layout row wrap justify-center>
                <v-flex xs12 sm6 md5 lg4 xl3>
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
<!--                            <v-btn flat color="secondary" @click="clear">Clear</v-btn>-->
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
            </v-layout>
        </v-container>
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
