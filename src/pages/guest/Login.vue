<template>
  <q-layout class="bg-blue-grey-2" view="lHh Lpr lFf">
    <q-page-container>
      <q-page padding class="items-center justify-center">
        <div class="row absolute-center full-width">
          <div class="col-md-8 offset-md-2 col-xs-12 q-pb-lg q-pl-md q-pr-md q-pt-sm">
            <q-card class="my-card bg-white text-black">
              <div class="row">
                <div class="col-md-6 col-xs-12 bg-blue-grey-10">
                  <div class="row q-pt-lg">
                    <div class="col-md-8 offset-2 col-xs-8">
                      <q-img src="statics/img/logistic.png"></q-img>
                      <div class="text-white text-weight-regular q-pb-md text-h6 text-center">DISTRIBUTOR PUPUK</div>
                    </div>
                  </div>
                </div>
                <div class="col-md-6 text-blue-grey-10 col-xs-12">
                  <q-card-section>
                    <div class="text-h4 text-weight-bold">LOGIN</div>
                    <div class="text-caption">Sign In to your Account</div>
                  </q-card-section>
                  <q-card-section>
                    <q-input filled v-model="username" label="Username">
                      <template v-slot:append>
                        <q-icon name="person" />
                      </template>
                    </q-input>
                    <q-input filled v-on:keyup.enter="login()" type="password" class="q-pt-lg" v-model="password" label="Password">
                      <template v-slot:append>
                        <q-icon name="lock" />
                      </template>
                    </q-input>
                  </q-card-section>
                  <q-card-section>
                    <div class="row q-col-gutter-xs">
                      <div class="col-md-3 col-xs-12 col-sm-12">
                        <q-btn class="full-width" :loading="loading" color="blue-grey-10" unelevated @click="login()" label="Login" />
                      </div>
                    </div>
                  </q-card-section>
                </div>
              </div>
            </q-card>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<style>
</style>

<script>
export default {
  name: 'PageIndex',
  data () {
    return {
      loading: false,
      username: '',
      password: ''
    }
  },
  methods: {
    reset () {
      this.username = ''
      this.email = ''
      this.password = ''
      this.nama = ''
      this.alamat = ''
      this.noTelp = ''
      this.register = false
    },
    login () {
      if (this.username === '' || this.password === '') {
        this.showNotif('Username/Password Tidak Boleh Kosong', 'negative')
        return
      }
      let basicAuth = 'Basic ' + window.btoa(this.username + ':' + this.password)
      this.$axios.defaults.headers.common['Authorization'] = basicAuth
      this.$axios
        .post('users/signin')
        .then(res => {
          if (!res.data.status) {
            this.$showNotif(res.data.message, 'negative')
          } else {
            let data = res.data.result
            let dataUser = {
              _id: data._id,
              nama: data.nama
            }
            this.$q.localStorage.set('user', res.data.result.token)
            this.$q.localStorage.set('username', this.username)
            this.$q.localStorage.set('dataUser', dataUser)
            if (data.role === 'kios') {
              this.$q.localStorage.set('role', 'kios')
              this.$router.push({ name: 'Dashboard Kios' })
            } else {
              this.$q.localStorage.set('role', 'distributor')
              this.$router.push({ name: 'Dashboard Distributor' })
            }
          }
        })
        .catch((err) => {
          this.$showNotif(err.toString(), 'negative')
        })
    },
    simulateProgress () {
      this.loading = true
      setTimeout(() => {
        this.loading = false
      }, 3000)
    }
  }
}
</script>
