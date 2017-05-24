<template>
  <div class="account-login">
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
            <div class="column is-4 is-offset-4">
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
                  <p class="control has-addons has-icon">
                    <input class="input is-expanded" type="password" placeholder="Password" v-model="password">
                    <span class="icon is-small">
                      <i class="fa fa-lock"></i>
                    </span>
                  </p>
                  <p class="help is-danger" v-if="getInvalidPassword">This password is invalid</p>
                </div>
                <div class="field">
                  <p class="control">
                    <button class="button" @click="submit">Submit</button>
                  </p>
                </div>
              </form>
              <div class="box has-text-centered">
                <router-link :to="{ name: 'register' }" class="button is-dark is-inverted is-fullwidth">
                  Register an account &gt;
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
      password: ''
    }
  },

  computed: {
    ...mapGetters([
      'getInvalidUserName',
      'getInvalidPassword',
    ]),
  },

  methods: {
    ...mapActions([
      'requestLogin'
    ]),

    submit () {
      console.log('Login', 'methods', 'submit', this.userName, this.password)
      this.requestLogin({ userName: this.userName, password: this.password, router: this.$router })
    }
  }

}
</script>

<style>
</style>
