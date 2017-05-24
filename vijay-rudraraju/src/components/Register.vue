<template>
  <div class="account-register">
    <section class="hero is-light is-fullheight">
      <div class="hero-head">
        <header class="nav">
          <div class="container">
            <div class="nav-left">
              <router-link :to="{ name: 'home' }" class="nav-item">
                Trip Planner
              </router-link>
            </div>
          </div>
        </header>
      </div>
      <div class="hero-body">
        <div class="container is-fluid">
          <div class="columns">
            <div class="column is-6 is-offset-3">
              <form class="box">
                <div class="field">
                  <p class="control has-icon">
                    <input class="input" type="text" placeholder="User Name" v-model="userName">
                    <span class="icon is-small">
                      <i class="fa fa-envelope"></i>
                    </span>
                  </p>
                  <p class="help is-danger" v-if="getInvalidUserName">This user name is invalid</p>
                </div>
                <div class="field">
                  <p class="control has-icon is-expanded">
                    <input class="input" type="password" placeholder="Password" v-model="password">
                    <span class="icon">
                      <i class="fa fa-lock"></i>
                    </span>
                  </p>
                  <p class="help is-danger" v-if="getInvalidPassword">This password is invalid</p>
                </div>
                <div class="field">
                  <p class="control has-icon is-expanded">
                    <input class="input" type="password" placeholder="Confirm" v-model="passwordConfirm">
                    <span class="icon">
                      <i class="fa fa-lock"></i>
                    </span>
                  </p>
                  <p class="help is-danger" v-if="!passwordsMatch">The passwords don't match</p>
                </div>
                <div class="field" v-if="admin">
                  <p class="control">
                    <label class="radio">
                      <input type="radio" name="type" value="REGULAR" v-model="type">
                      Regular
                    </label>
                    <label class="radio">
                      <input type="radio" name="type" value="MANAGER" v-model="type">
                      User Manager
                    </label>
                    <label class="radio">
                      <input type="radio" name="type" value="ADMIN" v-model="type">
                      Admin 
                    </label>
                  </p>
                </div>
                <div class="field">
                  <p class="control">
                    <button class="button" @click="submit">Submit</button>
                  </p>
                </div>
              </form>
              <div class="box has-text-centered">
                <router-link :to="{ name: 'login' }" class="button is-dark is-inverted is-fullwidth">
                  Have an account? Log in &gt;
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <sui-footer></sui-footer>
  </div>
</template>

<script>
import SuiFooter from './Footer';

import { mapGetters, mapActions } from 'vuex'

export default {

  components: {
    SuiFooter,
  },

  data () {
    return {
      userName: '',
      password: '',
      passwordConfirm: '',
      admin: false,
      type: 'REGULAR',
    }
  },

  computed: {
    ...mapGetters([
      'getInvalidUserName',
      'getInvalidPassword',
    ]),
    passwordsMatch() {
      return this.password === this.passwordConfirm
    }
  },

  methods: {
    ...mapActions([
      'requestRegistration'
    ]),

    submit () {
      if (this.password === this.passwordConfirm) {
        console.log('Register', 'methods', 'submit', this.userName, this.password, this.type)
        this.requestRegistration({ userName: this.userName, password: this.password, type: this.type, router: this.$router })
      }
    }
  }

}
</script>

<style>
</style>

<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
