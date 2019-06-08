<template>
    <v-app id="register">
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
        <v-container grid-list-md text-xs fluid>
            <v-layout row wrap justify-center>
                <v-flex xs4 xl3>
                    <v-toolbar color="info" dark extended class="text-xs-center">
                        <v-toolbar-title class="text-xs-center headline mx-auto pt-3">Sign Up</v-toolbar-title>
                    </v-toolbar>
                    <v-card class="pa-4">
                        <v-form ref="form" v-model="valid">
                            <v-flex>
                                <v-text-field
                                        v-model="firstName"
                                        :rules="[rules.required, rules.name]"
                                        label="First Name"
                                        color="success"
                                ></v-text-field>
                            </v-flex>
                            <v-flex>
                                <v-text-field
                                        v-model="lastName"
                                        :rules="[rules.required, rules.name]"
                                        label="Last Name"
                                        color="success"
                                ></v-text-field>
                            </v-flex>
                            <v-flex>
                                <v-text-field
                                        v-model="email"
                                        :rules="[rules.required, rules.email]"
                                        label="Email"
                                        color="success"
                                ></v-text-field>
                            </v-flex>
                            <v-flex>
                                <v-text-field
                                        v-model="password"
                                        :append-icon="showPass ? 'visibility' : 'visibility_off'"
                                        :rules="[rules.required, rules.min]"
                                        :type="showPass ? 'text' : 'password'"
                                        label="Password"
                                        hint="At least 6 characters"
                                        counter
                                        color="success"
                                        @click:append="showPass = !showPass"
                                ></v-text-field>
                            </v-flex>
                            <v-flex>
                                <v-text-field
                                        :append-icon="showPass ? 'visibility' : 'visibility_off'"
                                        :type="showPass ? 'text' : 'password'"
                                        :rules="[rules.required, rules.passwordMatch]"
                                        label="Confirm password"
                                        hint="At least 6 characters"
                                        color="success"
                                        @click:append="showPass = !showPass"
                                ></v-text-field>
                            </v-flex>
                        </v-form>
                        <v-card-actions>
                            <v-btn color="info" @click="submit" :loading="loading" :disabled="loading" round block>Sign Up</v-btn>
                            <v-card-text class="text-xs-right pa-0 caption">
                                <router-link to="/login" tag="span">
                                    <a class="grey--text text--darken-2" @click="">
                                        Have an account? <strong style="color: #4CAF50">Log in</strong>
                                    </a>
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

    export default {
        name: "Register",
        data() {
            return {
                firstName: "",
                lastName: "",
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
                    },
                    name: value => {
                        const pattern = /^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/
                        return pattern.test(value) || 'Invalid input.'
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
            submit() {
                let valid = this.$refs.form.validate();
                let self = this;

                if (valid) {
                    self.loading = true;
                    database.collection('users').where("email", "==", this.email).get()
                        .then(doc => {
                            if (doc.exists) {
                                self.loading = false;
                                self.snackbar("warning", "A user with this e-mail address already exists!", 2.5);
                            }
                            else {
                                firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
                                    .then(cred => {
                                        self.log(cred.user);
                                        database.collection('users').doc(cred.user.uid).set({
                                            firstName: self.firstName,
                                            lastName: self.lastName,
                                            user_id: cred.user.uid,
                                            email: self.email,
                                            createdDate: new Date(),
                                            stores: [],
                                            settings: {}
                                        }).then(() => {
                                            self.loading = false;
                                            self.snackbar("success", "Your account was created successfully!", 2.5);
                                            self.$store.dispatch({
                                                type: 'login',
                                            })
                                        }).catch(err => {
                                            self.loading = false;
                                            self.snackbar("error", "An error occurred! Could not successfully write to the database!", 2.5);
                                            self.log(err);
                                        })
                                    })
                                    .catch(err => {
                                        self.loading = false;
                                        self.log(err);
                                        let message = null;

                                        switch (err.code) {
                                            case "auth/email-already-in-use":
                                                message = "This e-mail address is already in use by another account!";
                                                break;
                                            case "auth/weak-password":
                                                message = "Your password must be at least 6 characters!";
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
                                                message = "An unknown error has occurred!";
                                                break;
                                        }
                                        self.snackbar("error", message, 2.5);
                                    })
                            }
                        })

                }
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
                }

                setTimeout(() => {
                    this.alert.active = false;
                }, msg.duration * 1000);
            })
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
