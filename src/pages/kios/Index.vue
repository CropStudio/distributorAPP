<template>
  <q-page padding>
    <q-card flat class="bg-white text-black">
      <q-card-section>
        <div class="row justify-between">
          <div class="col-md-3 col-xs-12 text-blue-grey-14">
            <div class="text-h6">Tabel Data KIOS</div>
          </div>
          <div class="col-md-3 col-xs-12 text-blue-grey-14">
            <q-input borderless v-model="filter" placeholder="Search">
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
        </div>
        <q-table
          :data="data"
          :columns="columns"
          row-key="namaBarang"
          :pagination.sync="pagination"
          :loading="loading"
          :filter="filter"
          flat
          class="bg-white"
          @request="onRequest"
          binary-state-sort
        >
          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td key="namaBarang" :props="props">{{ props.row.namaBarang }}</q-td>
              <q-td key="harga" :props="props">{{ props.row.harga }}</q-td>
              <q-td key="satuan" :props="props">{{ props.row.satuan }}</q-td>
              <q-td key="kategori" :props="props">{{ props.row.kategori }}</q-td>
              <q-td key="stok" :props="props">{{ props.row.stok }}</q-td>
              <q-td key="keterangan" :props="props">{{ props.row.keterangan }}</q-td>
              <q-td key="action" :props="props">
                <q-card-actions align="around" class="row q-col-gutter-md no-wrap">
                  <div class="col">
                    <q-btn round @click="openDetail(props.row)" color="secondary" icon="info">
                      <q-tooltip content-class="bg-blue-grey-14" transition-show="flip-right" transition-hide="flip-left" anchor="top middle" self="bottom middle" :offset="[10, 10]">
                        <div class="text-white text-caption">Lihat Detail</div>
                      </q-tooltip>
                    </q-btn>
                  </div>
                  <div class="col">
                    <q-btn round color="primary" :to="`edit/`+props.row._id" icon="edit">
                      <q-tooltip content-class="bg-blue-grey-14" transition-show="flip-right" transition-hide="flip-left" anchor="top middle" self="bottom middle" :offset="[10, 10]">
                        <div class="text-white text-caption">Edit Data</div>
                      </q-tooltip>
                    </q-btn>
                  </div>
                  <div class="col">
                    <q-btn @click="confirm(props.row._id)" round color="negative" icon="close">
                      <q-tooltip content-class="bg-blue-grey-14" transition-show="flip-right" transition-hide="flip-left" anchor="top middle" self="bottom middle" :offset="[10, 10]">
                        <div class="text-white text-caption">Hapus Data</div>
                      </q-tooltip>
                    </q-btn>
                  </div>
                </q-card-actions>
              </q-td>
            </q-tr>
          </template>

          </q-table>
      </q-card-section>
    </q-card>
    <q-dialog v-model="detailDialog" v-if="detailDialog">
      <q-card style="width: 400px; max-width: 60vw;">
        <q-img :src="baseURL + activeData.foto" placeholder-src="statics/default-placeholder-1024x1024-570x321.png"/>

        <q-card-section>
          <q-btn
            fab
            :to="`edit/` + activeData._id"
            color="primary"
            icon="edit"
            class="absolute"
            style="top: 0; right: 12px; transform: translateY(-50%);"
          />

          <div class="row no-wrap items-center">
            <div class="col text-h6 ellipsis">{{ activeData.namaBarang }}</div>
            <div class="col-auto text-blue-grey-14 q-pt-md">
              Rp {{ activeData.harga }},-
            </div>
          </div>
        </q-card-section>

        <q-card-section>
          <div class="text-subtitle1">{{ activeData.kategori }} ({{ activeData.stok + ' ' + activeData.satuan }})</div>
        </q-card-section>

        <q-card-section>
          <div class="text-captions">{{ activeData.keterangan }}</div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn flat v-close-popup>Close</q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
export default {
  name: 'PageIndex',
  data () {
    return {
      filter: '',
      loading: false,
      pagination: {
        sortBy: 'namaBarang',
        descending: false,
        page: 1,
        rowsPerPage: 5,
        rowsNumber: 10
      },
      columns: [
        { name: 'namaBarang', align: 'center', label: 'Nama Barang', field: 'namaBarang' },
        { name: 'harga', align: 'center', label: 'Harga', field: 'harga' },
        { name: 'satuan', align: 'center', label: 'Satuan', field: 'satuan' },
        { name: 'kategori', align: 'center', label: 'Kategori', field: 'kategori' },
        { name: 'stok', align: 'center', label: 'Stok', field: 'stok' },
        { name: 'keterangan', align: 'center', label: 'Keterangan', field: 'keterangan' },
        { name: 'action', align: 'center', label: 'Action', field: 'action' }
      ],
      data: [],
      original: [],
      detailDialog: false,
      activeData: null,
      baseURL: 'http://testing.kartupetaniberjaya.com/admin/gambar_barang/'
    }
  },
  created () {
    // this.getData()
  },
  mounted () {
    this.onRequest({
      pagination: this.pagination,
      filter: undefined
    })
  },
  methods: {
    getData () {
      try {
        this.$axios.get('barang', {
          headers: this.$createToken().token
        })
          .then(res => {
            this.original = res.data.result
          }).catch(error => {
            console.log(error)
          })
      } catch (error) {
        console.log(error)
      }
    },
    onRequest (props) {
      let { page, rowsPerPage, rowsNumber, sortBy, descending } = props.pagination
      let filter = props.filter

      this.loading = true

      // emulate server
      setTimeout(() => {
        // update rowsCount with appropriate value
        this.pagination.rowsNumber = this.getRowsNumberCount(filter)

        // get all rows if "All" (0) is selected
        let fetchCount = rowsPerPage === 0 ? rowsNumber : rowsPerPage

        // calculate starting row of data
        let startRow = (page - 1) * rowsPerPage

        // fetch data from "server"
        let returnedData = this.fetchFromServer(startRow, fetchCount, filter, sortBy, descending)

        // clear out existing data and add new
        this.data.splice(0, this.data.length, ...returnedData)

        // don't forget to update local pagination object
        this.pagination.page = page
        this.pagination.rowsPerPage = rowsPerPage
        this.pagination.sortBy = sortBy
        this.pagination.descending = descending

        // ...and turn of loading indicator
        this.loading = false
      }, 1500)
    },

    // emulate ajax call
    // SELECT * FROM ... WHERE...LIMIT...
    fetchFromServer (startRow, count, filter, sortBy, descending) {
      let data = []

      if (!filter) {
        data = this.original.slice(startRow, startRow + count)
      } else {
        let found = 0
        for (let index = startRow, items = 0; index < this.original.length && items < count; ++index) {
          let row = this.original[index]
          // match filter?
          if (!row['namaBarang'].includes(filter)) {
            // get a different row, until one is found
            continue
          }
          ++found
          if (found >= startRow) {
            data.push(row)
            ++items
          }
        }
      }

      // handle sortBy
      if (sortBy) {
        data.sort((a, b) => {
          let x = descending ? b : a
          let y = descending ? a : b
          if (sortBy === 'desc') {
            // string sort
            return x[sortBy] > y[sortBy] ? 1 : x[sortBy] < y[sortBy] ? -1 : 0
          } else {
            // numeric sort
            return parseFloat(x[sortBy]) - parseFloat(y[sortBy])
          }
        })
      }

      return data
    },

    // emulate 'SELECT count(*) FROM ...WHERE...'
    getRowsNumberCount (filter) {
      if (!filter) {
        return this.original.length
      }
      let count = 0
      this.original.forEach((treat) => {
        if (treat['namaBarang'].includes(filter)) {
          ++count
        }
      })
      return count
    },
    openDetail (data) {
      this.activeData = data
      this.detailDialog = true
    },
    confirm (id) {
      this.$q.dialog({
        title: 'Konfirmasi',
        message: 'Apakah Anda Yakin ?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        try {
          this.$axios.delete('barang/' + id, {
            headers: this.$createToken().token
          })
            .then(res => {
              if (res.data.status) {
                this.$showNotif(res.data.message, 'positive')
                this.getData()
                this.onRequest({
                  pagination: this.pagination,
                  filter: undefined
                })
              } else {
                this.$showNotif(res.data.message, 'negative')
              }
            })
        } catch (error) {
          console.log(error)
        }
      })
        .onCancel(() => {
          console.log('>>>> Cancel')
        })
    }
  }
}
</script>
