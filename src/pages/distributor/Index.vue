<template>
  <q-page padding>
    <q-card flat class="bg-white text-black">
      <q-card-section>
        <div class="row justify-between">
          <div class="col-md-3 col-xs-12 text-blue-grey-14">
            <div class="text-h6">Tabel Data RUT</div>
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
              <q-td key="idTransaksi" :props="props">{{ props.row.idtransaksi }}</q-td>
              <q-td key="nik" :props="props">{{ props.row.nik }}</q-td>
              <q-td key="totalItem" :props="props">{{ hitungTotal(props.row.item) }}</q-td>
              <q-td key="action" :props="props">
                <q-card-actions align="around" class="row q-col-gutter-md no-wrap">
                  <div class="col">
                    <q-btn round @click="openDetail(props.row)" color="secondary" icon="info">
                      <q-tooltip content-class="bg-blue-grey-14" transition-show="flip-right" transition-hide="flip-left" anchor="top middle" self="bottom middle" :offset="[10, 10]">
                        <div class="text-white text-caption">Lihat Detail</div>
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
      <q-card style="min-width: 40vw;" class="text-blue-grey-14">
        <q-card-section>
          <div class="text-h6 q-ml-md">Detail Transaksi</div>
        </q-card-section>

        <q-separator />
        <q-card-section>
          <q-list>
            <q-item>
              <q-item-section>
                <div class="text-h6">{{ activeData.idtransaksi }}</div>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
        <q-card-section style="max-height: 70vh" class="scroll">
          <q-list>
              <div v-for="(data, i) in activeData.item" :key="i">
                <q-item>
                  <q-item-section>
                    <q-item-label>{{ data.namaBarang }}</q-item-label>
                    <q-item-label caption>Rp. {{ data.harga }},-</q-item-label>
                    <q-item-label caption>Qty. {{ data.qty }}</q-item-label>
                  </q-item-section>

                  <q-item-section side top>
                    <q-item-label caption>Sub Total</q-item-label>
                    <q-item-label>Rp. {{ hitungSubTotal(data.harga, data.qty) }},-</q-item-label>
                  </q-item-section>

                </q-item>
                <q-separator spaced inset />
              </div>
              <q-item>
                <q-item-section>
                  <q-item-label>Total Keseluruhan</q-item-label>
                  <q-item-label caption>Total Biaya Pada Transaksi Ini</q-item-label>
                </q-item-section>

                <q-item-section side top>
                  <q-item-label caption>Sub Total</q-item-label>
                  <q-item-label>Rp. {{ hitungTotalBiaya(activeData.item) }},-</q-item-label>
                </q-item-section>

              </q-item>
          </q-list>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn class="q-mr-md" unelevated color="blue-grey-10" label="Kirim"/>
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
        { name: 'idTransaksi', align: 'left', label: 'Id Transaksi', field: 'idTransaksi' },
        { name: 'nik', align: 'left', label: 'NIK', field: 'nik' },
        { name: 'totalItem', align: 'left', label: 'Total Item', field: 'totalItem' },
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
    this.getData()
  },
  mounted () {
    this.onRequest({
      pagination: this.pagination,
      filter: undefined
    })
  },
  methods: {
    filterArr (data, id) {
      return data.filter(res => {
        return res.idtransaksi === id
      })
    },
    getData () {
      try {
        this.$axios.get('transaksi/distributor/' + this.$q.localStorage.getItem('dataUser')._id, {
          headers: this.$createToken().token
        })
          .then(res => {
            console.log(res)
            if (res.data.result <= 0 || res.data.result === undefined) {
              this.data = []
              this.$showNotif(res.data.message, 'yellow-10')
            } else {
              let data = res.data.result
              let newData = []

              for (let index = 0; index < data.length; index++) {
                if (this.filterArr(newData, data[index].idtransaksi).length < 1) {
                  data[index].item = [data[index].item]
                  newData.push(data[index])
                } else {
                  for (let i = 0; i < newData.length; i++) {
                    if (newData[i].idtransaksi === data[index].idtransaksi) {
                      newData[i].item.push(data[index].item)
                    }
                  }
                }
              }
              this.original = newData
            }
          }).catch(() => {
            this.$showNotif('Terjadi Kesalahan Pada Server', 'negative')
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
    },
    hitungTotal (data) {
      return data.length
    },
    hitungTotalBiaya (data) {
      let total = 0
      for (let i = 0; i < data.length; i++) {
        total += Number(data[i].harga) * Number(data[i].qty)
      }
      return total
    },
    hitungSubTotal (harga, qty) {
      return Number(harga) * Number(qty)
    }
  }
}
</script>
