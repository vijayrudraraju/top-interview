<template>
  <div class="home">

    <nav class="nav has-shadow">
      <div class="container">
        <div class="nav-left">
          <a class="nav-item">
            Trip Planner 
          </a>
        </div>

        <div class="nav-center" v-if="!isLoggedIn">
          <span class="nav-item">
            <router-link :to="{ name: 'login' }" class="button is-primary is-outlined">
              <span>Login</span>
              <span class="icon is-small">
                <i class="fa fa-sign-in"></i>
              </span>
            </router-link>
          </span>
          <span class="nav-item">
            <router-link :to="{ name: 'register' }" class="button is-primary">
              <span>Register</span>
            </router-link>
          </span>
        </div>
        <div class="nav-center" v-else>
          <span class="nav-item">
            Hi, {{ getUser.user_name }}
          </span>
          <span class="nav-item">
            <button class="button is-primary" @click="printContents">
              <span>Print</span>
            </button>
          </span>
          <span class="nav-item">
            <button class="button is-primary is-outlined" @click="requestLogout">
              <span>Logout</span>
            </button>
          </span>
        </div>
      </div>
    </nav>

    <section class="hero is-primary is-medium" v-if="!isLoggedIn">
      <div class="hero-body">
        <div class="container has-text-centered">
          <h1 class="title">
            Trip Planner
          </h1>
          <h2 class="subtitle">
            View, Edit, and Print your Travel Plans  
          </h2>
        </div>
      </div>
    </section>

    <section class="section tile is-ancestor" v-else>
      <div class="tile is-parent is-vertical">

        <div class="tile is-child">
          <h3 class="title is-3">My Trips</h3>
          <div class="columns">
            <div class="column">
              <label class="label">Destination</label>
              <p class="control">
                <input class="input" type="text" v-model="destination">
              </p>
            </div>
            <div class="column">
              <label class="label">Start Date</label>
              <p class="control">
                <datepicker v-model="startDate"></datepicker>
              </p>
            </div>
            <div class="column">
              <label class="label">End Date</label>
              <p class="control">
                <datepicker v-model="endDate"></datepicker>
              </p>
            </div>
            <div class="column">
              <label class="label">Comment</label>
              <p class="control">
                <input class="input" type="text" v-model="comment">
              </p>
            </div>
          </div>
          <p class="control">
            <div v-if="!selected">
              <a class="button is-primary" @click='createNewTrip'>Add New Trip</a>
            </div>
            <div v-else>
              <a class="button is-dark" @click='updateTrip'>Update Trip</a>
              <a class="button is-danger" @click='deleteTrip'>Delete Trip</a>
              <a class="button" @click='clearSelection'>Clear</a>
            </div>
          </p>
        </div>

        <div class="tile is-child">
          <div class="field">
            <label class="label">Filter</label>
            <p class="control">
              <input class="input" type="text" v-model="filterStr">
            </p>
          </div>

          <b-table
            :data="getTrips"
            :bordered=false
            :striped=false
            :narrowed=false
            :selectable=false
            :checkable=false
            :mobile-cards=false
            :paginated=false
            :pagination-simple=false
            render-html
            @click="clicked">

            <b-table-column field="destination" label="Destination" width="200" sortable></b-table-column>
            <b-table-column field="start_date" label="Start Date" sortable :format="formatDate"></b-table-column>
            <b-table-column field="end_date" label="End Date" sortable :format="formatDate"></b-table-column>
            <b-table-column field="comment" label="Comment"></b-table-column>
            <b-table-column field="days_until" label="Days Until" sortable numeric></b-table-column>
          </b-table>
        </div>

        <div class="tile is-child" v-if="getAllUsers.length > 0">
          <h3 class="title is-3">Manager (All Users)</h3>
          <div class="columns" v-if="userSelected">
            <div class="column">
              <label class="label">User Name</label>
              <p class="control">
                <input class="input" type="text" v-model="managerUserName">
              </p>
            </div>
            <div class="column" v-if="!isUser">
              <label class="label">User Type</label>
              <p class="control">
                <select v-model="managerUserType">
                  <option value="REGULAR">REGULAR</option>
                  <option value="MANAGER">MANAGER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </p>
            </div>
          </div>
          <p class="control" v-if="userSelected">
            <a class="button is-dark" @click='updateUser'>Update User</a>
            <a class="button is-danger" @click='deleteUser'>Delete User</a>
            <a class="button" @click='clearSelection'>Clear</a>
          </p>
        </div>

        <div class="tile is-child" v-if="getAllUsers.length > 0">
          <b-table
            :data="getAllUsers"
            :bordered=false
            :striped=false
            :narrowed=false
            :selectable=false
            :checkable=false
            :mobile-cards=false
            :paginated=false
            :pagination-simple=false
            render-html
            @click="userClicked">

            <b-table-column field="id" label="Id" width="200" sortable></b-table-column>
            <b-table-column field="user_name" label="User Name" sortable></b-table-column>
            <b-table-column field="type" label="Type" sortable></b-table-column>
          </b-table>
        </div>

        <div class="tile is-child" v-if="getAllTrips.length > 0">
          <h3 class="title is-3">Admin (All Trips)</h3>
          <div class="columns" v-if="tripSelected">
            <div class="column">
              <label class="label">Destination</label>
              <p class="control">
                <input class="input" type="text" v-model="adminDestination">
              </p>
            </div>
            <div class="column">
              <label class="label">Start Date</label>
              <p class="control">
                <datepicker v-model="adminStartDate"></datepicker>
              </p>
            </div>
            <div class="column">
              <label class="label">End Date</label>
              <p class="control">
                <datepicker v-model="adminEndDate"></datepicker>
              </p>
            </div>
            <div class="column">
              <label class="label">Comment</label>
              <p class="control">
                <input class="input" type="text" v-model="adminComment">
              </p>
            </div>
          </div>
          <p class="control" v-if="tripSelected">
            <a class="button is-dark" @click='updateTrip'>Update Trip</a>
            <a class="button is-danger" @click='deleteTrip'>Delete Trip</a>
            <a class="button" @click='clearSelection'>Clear</a>
          </p>
        </div>

        <div class="tile is-child" v-if="getAllTrips.length > 0">
          <b-table
            :data="getAllTrips"
            :bordered=false
            :striped=false
            :narrowed=false
            :selectable=false
            :checkable=false
            :mobile-cards=false
            :paginated=false
            :pagination-simple=false
            render-html
            @click="tripClicked">

            <b-table-column field="destination" label="Destination" width="200" sortable></b-table-column>
            <b-table-column field="start_date" label="Start Date" sortable :format="formatDate"></b-table-column>
            <b-table-column field="end_date" label="End Date" sortable :format="formatDate"></b-table-column>
            <b-table-column field="comment" label="Comment"></b-table-column>
          </b-table>
        </div>

      </div>
    </section>

    <div id="printContents" style="display:none">
      <table>
        <thead>
          <th>Destination</th>
          <th>Start Date</th>
          <th>End Date</th>
          <th>Comment</th>
        </thead>
        <tbody>
          <tr v-for="entry in getMonthTrips">
            <td>{{ entry['destination'] }}</td>
            <td>{{ new Date(entry['start_date']).toLocaleDateString() }}</td>
            <td>{{ new Date(entry['end_date']).toLocaleDateString() }}</td>
            <td>{{ entry['comment'] }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <sui-footer></sui-footer>
  </div>
</template>

<script>
import SuiFooter from './Footer';

import { mapGetters, mapActions } from 'vuex'

import Datepicker from './Datepicker'

export default {

  components: {
    SuiFooter,
    Datepicker
  },

  data () {
    return {
      destination: '',
      startDate: '',
      endDate: '',
      comment: '',
      selected: false,
      selectedId: '',
      filterStr: '',
      managerUserName: '',
      managerUserType: '',
      selectedUserId: '',
      userSelected: false,
      adminDestination: '',
      adminStartDate: '',
      adminEndDate: '',
      adminComment: '',
      selectedTripId: '',
      tripSelected: false,
    }
  },

  computed: {
    ...mapGetters([
      'isLoggedIn',
      'getUser',
      'getAllUsers',
      'getAllTrips'
    ]),
    getTrips () {
      if (this.filterStr.length > 0) {
        return this.getUser.trips.filter((row) => {
          return row['destination'].indexOf(this.filterStr) > -1
        })
      } else {
        return this.getUser.trips
      }
    },
    getMonthTrips () {
      return this.getUser.trips && this.getUser.trips.filter((row) => {
        return row['start_date'] < Date.now() + (30 * 24 * 60 * 60 * 1000) && row['end_date'] > Date.now()
      })
    },
    isUser () {
      return this.getUser.id === this.selectedUserId
    }
  },

  methods: {
    ...mapActions([
      'requestTrips',
      'requestLogout',
      'requestNewTrip',
      'requestDeleteTrip',
      'requestUpdateTrip',
      'printContents',
      'requestUsers',
      'requestDeleteUser',
      'requestUpdateUser',
    ]),
    selected () {
    },
    formatDate (value, row) {
      return `<span class="tag is-primary">
        ${new Date(value).toLocaleDateString()}
      </span>`
    },
    createNewTrip () {
      console.log('Home', 'methods', 'createNewTrip', this.destination.length, this.startDate, this.endDate, this.comment)

        if (this.destination.length > 0 &&  
            this.startDate.getTime &&
            this.endDate.getTime &&
            this.startDate.getTime() > 1000000 && 
            this.endDate.getTime() > 1000000) {
          this.requestNewTrip({
            destination: this.destination,
            startDate: this.startDate.getTime(),
            endDate: this.endDate.getTime(),
            comment: this.comment,
          })

          this.clearSelection()
        }
    },
    clicked (row) {
      console.log('Home', 'methods', 'clicked', row)

      this.destination = row['destination']
      this.startDate = new Date(row['start_date'])
      this.endDate = new Date(row['end_date'])
      this.comment = row['comment']

      this.selected = true
      this.selectedId = row['id']
    },
    userClicked (row) {
      console.log('Home', 'methods', 'userClicked', row)

      this.managerUserName = row['user_name']
      this.managerUserType = row['type']

      this.userSelected = true
      this.selectedUserId = row['id']
    },
    tripClicked (row) {
      console.log('Home', 'methods', 'tripClicked', row)

      this.adminDestination = row['destination']
      this.adminStartDate = new Date(row['start_date'])
      this.adminEndDate = new Date(row['end_date'])
      this.adminComment = row['comment']

      this.tripSelected = true
      this.selectedTripId = row['id']
    },
    clearSelection () {
      this.destination = ''
      this.startDate = ''
      this.endDate = ''
      this.comment = ''

      this.selected = false
      this.selectedId = ''

      this.userSelected = false
      this.selectedUserId = ''

      this.tripSelected = false
      this.selectedTripId = ''
    },
    deleteTrip () {
      console.log('Home', 'methods', 'deleteTrip', 'selectedId', this.selectedId)

      this.requestDeleteTrip({ 
        id: this.selectedId,
        cb: () => {
          this.clearSelection()
        }
      })
    },
    updateTrip () {
      console.log('Home', 'methods', 'updateTrip', 'selectedId', this.selectedId, this.selectedId > 0)

      if (this.selectedTripId > 0 && this.adminDestination.length > 0 && this.adminStartDate.getTime() > 1000000 && this.adminEndDate.getTime() > 1000000) {
        this.requestUpdateTrip({ 
          id: this.selectedTripId,
          destination: this.adminDestination,
          startDate: this.adminStartDate.getTime(),
          endDate: this.adminEndDate.getTime(),
          comment: this.adminComment,
          cb: () => {
            this.clearSelection()
          }
        })
      } else if (this.selectedId > 0 && this.destination.length > 0 && this.startDate.getTime() > 1000000 && this.endDate.getTime() > 1000000) {
        this.requestUpdateTrip({ 
          id: this.selectedId,
          destination: this.destination,
          startDate: this.startDate.getTime(),
          endDate: this.endDate.getTime(),
          comment: this.comment,
          cb: () => {
            this.clearSelection()
          }
        })
      }
    },
    deleteUser () {
      console.log('Home', 'methods', 'deleteUser', 'selectedUserId', this.selectedUserId)

      this.requestDeleteUser({ 
        id: this.selectedUserId,
        cb: () => {
          this.clearSelection()
        }
      })
    },
    updateUser () {
      console.log('Home', 'methods', 'updateUser', 'selectedUserId', this.selectedUserId, this.selectedUserId > 0)

      if (this.selectedUserId > 0 && this.managerUserName.length > 0) {
        this.requestUpdateUser({ 
          id: this.selectedUserId,
          userName: this.managerUserName,
          type: this.managerUserType,
          cb: () => {
            this.clearSelection()
          }
        })
      }

    }
  },

  created () {
    console.log('Home', 'created')

    this.requestTrips()
    this.requestUsers()
  },

  updated () {
    console.log('Home', 'updated')
  }
  
}
</script>

<style src="buefy/lib/buefy.css"></style>
<style>
input {
  width: 100% !important;
  height: 30px !important;
  font-size: 18px;
}
</style>
