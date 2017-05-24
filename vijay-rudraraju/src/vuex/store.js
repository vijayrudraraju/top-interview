import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  user: {},
  allUsers: [],
  allTrips: [],
  invalidUserName: false,
  invalidPassword: false,
}

const mutations = {
  setUser (state, newUser) {
    let trips = newUser['trips']
    if (trips) {
      let now = Date.now()
      trips.forEach(function(el) {
        console.log(el['start_date'])
        if (el['start_date'] > now) {
          el['days_until'] = Math.round((el['start_date'] - now) / (1000 * 60 * 60 * 24))
        }
      })
    }
    state.user = newUser
  },
  setAllUsers (state, users) {
    state.allUsers = users
  },
  setAllTrips (state, trips) {
    state.allTrips = trips
  },
  setInvalidUserName (state, bool) {
    state.invalidUserName = bool
  },
  setInvalidPassword (state, bool) {
    state.invalidPassword = bool
  }
}

const getters = {
  getUser: (state) => state.user,
  isLoggedIn: (state) => (state.user.user_name && state.user.user_name.length > 0 ? true : false),
  getAllUsers: (state) => state.allUsers,
  getAllTrips: (state) => state.allTrips,
  getInvalidUserName: (state) => state.invalidUserName,
  getInvalidPassword: (state) => state.invalidPassword,
}

const actions = {
  requestLogin ({ commit, state }, userParams) {

    commit('setInvalidUserName', false)
    commit('setInvalidPassword', false)

    let userName = userParams['userName']
    let password = userParams['password']

    console.log('vuex', 'actions', 'requestLogin', 'userName', userName, 'password', password)

    let xhr = new XMLHttpRequest()

    xhr.open('POST', '/api/login')
    xhr.onload = function() {

      let respObj = JSON.parse(xhr.responseText)
      console.log('vuex', 'actions', 'requestLogin', 'xhr.onload', 'respObj', respObj)

      if (respObj['message'] === 'SUCCESS') {
        commit('setUser', respObj['data'])
        commit('setAllUsers', [])
        commit('setAllTrips', [])

        userParams['router'].push({ name: 'home' })
      } else {
        if (respObj['invalidUserName']) {
          commit('setInvalidUserName', true)
        }
        if (respObj['invalidPassword']) {
          commit('setInvalidPassword', true)
        }
      }

    }
    xhr.setRequestHeader('Content-Type', 'application/json')

    let requestObj = { username: userName, password: password } 
    let serialObj = JSON.stringify(requestObj)

    console.log('vuex', 'actions', 'requestLogin', 'serialObj', serialObj)

    xhr.send(serialObj)

  },
  requestLogout ({ commit, state }, userParams) {

    console.log('vuex', 'actions', 'requestLogout')

    let xhr = new XMLHttpRequest()

    xhr.open('GET', '/api/logout')
    xhr.onload = function() {
      let respObj = JSON.parse(xhr.responseText)

      if (respObj['message'] === 'SUCCESS') {
        commit('setUser', {})
      }
    }
    xhr.setRequestHeader('Content-Type', 'application/json')

    xhr.send()

  },
  requestTrips ({ commit, state }, userParams) {

    console.log('vuex', 'actions', 'requestTrips', 'userId', state.user.id)

    let xhr = new XMLHttpRequest()

    xhr.open('GET', '/api/trips')
    xhr.onload = function() {
      let respObj = JSON.parse(xhr.responseText)

      console.log('vuex', 'store', 'requestTrips', 'respObj', respObj)

      if (respObj['message'] === 'SUCCESS') {
        commit('setUser', respObj['data'])
        if (respObj['moreData']) {
          commit('setAllTrips', respObj['moreData'])
        } else {
          commit('setAllTrips', [])
        }
      }
    }
    xhr.setRequestHeader('Content-Type', 'application/json')

    xhr.send()
      
  },
  requestNewTrip ({ commit, state }, tripParams) {

    let xhr = new XMLHttpRequest()

    xhr.open('POST', '/api/trips')
    xhr.onload = function() {
      let respObj = JSON.parse(xhr.responseText)

      console.log('vuex', 'store', 'requestNewTrip', 'respObj', respObj)

      if (respObj['message'] === 'SUCCESS') {
        commit('setUser', respObj['data'])

        actions.requestTrips({ commit, state })
      }
    }
    xhr.setRequestHeader('Content-Type', 'application/json')

    let requestObj = { 
      destination: tripParams['destination'], 
      startDate: tripParams['startDate'], 
      endDate: tripParams['endDate'], 
      comment: tripParams['comment']
    } 
    let serialObj = JSON.stringify(requestObj)

    console.log('vuex', 'actions', 'requestNewTrip', 'serialObj', serialObj)

    xhr.send(serialObj)

  },
  requestDeleteTrip ({ commit, state }, tripParams) {

    console.log('vuex', 'store', 'requestDeleteTrip', 'tripParams', tripParams)

    let xhr = new XMLHttpRequest()

    xhr.open('DELETE', '/api/trips/'+tripParams['id'])
    xhr.onload = function() {
      let respObj = JSON.parse(xhr.responseText)

      console.log('vuex', 'store', 'requestDeleteTrip', 'respObj', respObj)
      if (respObj['message'] === 'SUCCESS') {
        commit('setUser', respObj['data'])

        tripParams['cb']()
      }
    }
    xhr.send()

  },
  requestUpdateTrip ({ commit, state }, tripParams) {

    let xhr = new XMLHttpRequest()

    xhr.open('PUT', '/api/trips/'+tripParams['id'])
    xhr.onload = function() {
      let respObj = JSON.parse(xhr.responseText)

      console.log('vuex', 'store', 'requestUpdateTrip', 'respObj', respObj)
      if (respObj['message'] === 'SUCCESS') {
        commit('setUser', respObj['data'])
        commit('setAllTrips', respObj['moreData'])

        tripParams['cb']()
      }
    }
    xhr.setRequestHeader('Content-Type', 'application/json')

    let requestObj = { 
      destination: tripParams['destination'], 
      startDate: tripParams['startDate'], 
      endDate: tripParams['endDate'], 
      comment: tripParams['comment']
    } 
    let serialObj = JSON.stringify(requestObj)

    console.log('vuex', 'actions', 'requestUpdateTrip', 'serialObj', serialObj)
    xhr.send(serialObj)

  },
  printContents ({ commit, state }) {
    var content = document.getElementById('printContents').innerHTML

    var mywindow = window.open('', 'Print', 'height=600,width=800');

    mywindow.document.write('<html><head><title>Print</title> ');
    mywindow.document.write('</head><body>');
    mywindow.document.write(content);
    mywindow.document.write('</body></html>');

    mywindow.document.close();
    mywindow.focus()
    mywindow.print();
    mywindow.close();
  },
  requestRegistration ({ commit, state }, userParams) {

    commit('setInvalidUserName', false)
    commit('setInvalidPassword', false)

    let userName = userParams['userName']
    let password = userParams['password']
    let type = userParams['type']

    console.log('vuex', 'actions', 'requestRegistration', 'userName', userName, 'password', password, 'type', type)

    let xhr = new XMLHttpRequest()

    xhr.open('POST', '/api/users')
    xhr.onload = function() {

      let respObj = JSON.parse(xhr.responseText)
      console.log('vuex', 'actions', 'requestRegistration', 'xhr.onload', 'respObj', respObj)

      if (respObj['message'] === 'SUCCESS') {
        commit('setUser', {})

        let type = respObj['data']['type']
        if (type !== 'ADMIN' && type !== 'MANAGER') {
          commit('setAllUsers', [])
        } else if (type !== 'ADMIN') {
          commit('setAllTrips', [])
        }

        userParams['router'].push({ name: 'login' })
      } else {
        if (respObj['invalidUserName']) {
          commit('setInvalidUserName', true)
        }
        if (respObj['invalidPassword']) {
          commit('setInvalidPassword', true)
        }
      }

    }
    xhr.setRequestHeader('Content-Type', 'application/json')

    let requestObj = { userName: userName, password: password, type: type } 
    let serialObj = JSON.stringify(requestObj)

    console.log('vuex', 'actions', 'requestRegistration', 'serialObj', serialObj)

    xhr.send(serialObj)
    
  },

  requestUsers ({ commit, state }, userParams) {

    console.log('vuex', 'actions', 'requestUsers', 'userId', state.user.id)

    let xhr = new XMLHttpRequest()

    xhr.open('GET', '/api/users')
    xhr.onload = function() {
      let respObj = JSON.parse(xhr.responseText)

      console.log('vuex', 'store', 'requestUsers', 'respObj', respObj)

      if (respObj['message'] === 'SUCCESS') {
        commit('setAllUsers', respObj['data'])
      }
    }
    xhr.setRequestHeader('Content-Type', 'application/json')

    xhr.send()
      
  },

  requestDeleteUser ({ commit, state }, params) {

    console.log('vuex', 'store', 'requestDeleteUser', 'params', params)

    let xhr = new XMLHttpRequest()

    xhr.open('DELETE', '/api/users/'+params['id'])
    xhr.onload = function() {
      let respObj = JSON.parse(xhr.responseText)

      console.log('vuex', 'store', 'requestDeleteUser', 'respObj', respObj)
      if (respObj['message'] === 'SUCCESS') {
        commit('setAllUsers', respObj['data'])

        params['cb']()
      }
    }
    xhr.send()

  },

  requestUpdateUser ({ commit, state }, params) {

    let xhr = new XMLHttpRequest()

    xhr.open('PUT', '/api/users/'+params['id'])
    xhr.onload = function() {
      let respObj = JSON.parse(xhr.responseText)

      console.log('vuex', 'store', 'requestUpdateUser', 'respObj', respObj)
      if (respObj['message'] === 'SUCCESS') {
        commit('setAllUsers', respObj['data'])

        params['cb']()
      }
    }
    xhr.setRequestHeader('Content-Type', 'application/json')

    let requestObj = { 
      userName: params['userName'], 
      type: params['type'], 
    } 
    let serialObj = JSON.stringify(requestObj)

    console.log('vuex', 'actions', 'requestUpdateUser', 'serialObj', serialObj)
    xhr.send(serialObj)

  }

}

const store = new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})

export default store
