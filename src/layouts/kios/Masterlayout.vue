<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar class="bg-white" style="max-height: 7.5vh;">
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          aria-label="Menu"
        >
          <q-icon color="blue-grey-14" name="menu" />
        </q-btn>
        <q-toolbar-title>
          <q-btn flat class="absolute-right">
            <q-avatar>
              <q-icon name="far fa-user" color="blue-grey-14"/>
            </q-avatar>
            <q-menu
              transition-show="flip-up"
              transition-hide="flip-left"
              auto-close>
                <q-list style="min-width: 100px">
                  <q-item clickable @click="logout()" active-class="text-secondary">
                    <q-item-section avatar>
                      <q-icon name="fas fa-sign-out-alt" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>Logout</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
            </q-menu>
          </q-btn>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      content-class="bg-blue-grey-10"
    >
      <q-list class="text-white">
        <q-item-label header class="bg-white">
          <!-- <q-img src="statics/title-icon.png" style="width: 40%;"></q-img> -->
          Kios
        </q-item-label>
        <q-item-label class="text-white" header>Menu</q-item-label>
        <q-item clickable :to="{ name: 'dashboard' }" exact>
          <q-item-section avatar>
            <q-icon name="fas fa-tachometer-alt" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Dashboard</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable :to="{ name: 'databarang' }" exact>
          <q-item-section avatar>
            <q-icon name="fas fa-table" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Data Barang</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable :to="{ name: 'formbarang' }" exact>
          <q-item-section avatar>
            <q-icon name="fas fa-plus-circle" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Tambah Barang</q-item-label>
          </q-item-section>
        </q-item>
        <q-expansion-item
          expand-separator
          class="q-pt-md q-pb-md"
          icon="fas fa-history"
          label="Riwayat Barang">
          <q-item class="q-pt-md q-pb-md" dense clickable exact to="/">
            <q-item-section avatar>
              <q-icon name="fas fa-table" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Semua Data</q-item-label>
            </q-item-section>
          </q-item>
          <q-item class="q-pt-md q-pb-md" dense clickable to="/insert">
            <q-item-section avatar>
              <q-icon name="fas fa-plus-circle" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Tambah Data</q-item-label>
            </q-item-section>
          </q-item>
        </q-expansion-item>
      </q-list>
    </q-drawer>

    <q-page-container class="bg-blue-grey-1">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { openURL } from 'quasar'

export default {
  name: 'MyLayout',
  data () {
    return {
      leftDrawerOpen: this.$q.platform.is.desktop
    }
  },
  methods: {
    openURL,
    logout () {
      this.$q.localStorage.clear('user')
      this.$router.push('/login')
    }
  }
}
</script>

<style>
</style>
