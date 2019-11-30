<template>
  <q-page padding>
    <div class="row">
      <div class="col-md-12">
        <q-card class="bg-white text-black q-pa-lg">
          <q-form @submit="onSubmit">
            <div class="row text-blue-grey-10 justify-between">
              <div class="col-md-6 col-xs-12 q-gutter-y-lg">
                <div class="text-h6 text-weight-light">Input Data Barang</div>
                <q-separator/>
                <q-input label="Nama Barang" v-model="dataSend.namaBarang" filled></q-input>
                <q-select
                  :options="['Pupuk', 'Alat Tani', 'Benih']"
                  label="Pilih Kategori"
                  v-model="dataSend.kategori"
                  filled
                />
                <q-input label="Harga Barang" type="number" prefix="Rp." v-model="dataSend.harga" filled></q-input>
                <q-select
                  :options="['Kg', 'Pcs']"
                  label="Pilih Satuan"
                  v-model="dataSend.satuan"
                  filled
                />
                <q-input label="Stock" type="number" v-model="dataSend.stok" filled></q-input>
                <q-input label="Keterangan" type="textarea" v-model="dataSend.keterangan" filled></q-input>
                <div class="col">
                  <q-input
                    @input="selectFile"
                    filled
                    ref="file"
                    type="file"
                    hint="Upload Gambar Barang"
                  />
                </div>
                <q-btn type="submit" unelevated color="blue-grey-10" no-caps>Simpan</q-btn>
              </div>
              <div class="col-md-5 col-xs-12 q-gutter-y-lg">
                <div class="text-h6 text-weight-light">Input Data Barang</div>
                <q-separator/>
                <q-img v-if="!reseted" :src="linkPreview"></q-img>
                <q-img v-if="!imageChanged" :src="baseURL + dataSend.foto" placeholder-src="statics/default-placeholder-1024x1024-570x321.png" class="rounded"/>
              </div>
            </div>
          </q-form>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'PageIndex',
  data () {
    return {
      dataSend: {
        namaBarang: null,
        kategori: 'Pupuk',
        harga: 0,
        stok: 0,
        satuan: null,
        keterangan: null,
        foto: null
      },
      linkPreview: '',
      foto: '',
      reseted: true,
      baseURL: 'http://testing.kartupetaniberjaya.com/admin/gambar_barang/',
      imageChanged: false
    }
  },
  created () {
    this.getData()
  },
  methods: {
    reset () {
      this.dataSend = {
        namaBarang: null,
        kategori: 'Pupuk',
        harga: 0,
        stok: 0,
        satuan: null,
        keterangan: null,
        foto: null
      }
      this.foto = ''
      this.linkPreview = ''
      this.reseted = true
    },
    getData () {
      try {
        this.$axios.get('barang/' + this.$route.params.id, {
          headers: this.$createToken().token
        })
          .then(res => {
            let data = res.data.result
            this.dataSend.namaBarang = data.namaBarang
            this.dataSend.kategori = data.kategori
            this.dataSend.harga = data.harga
            this.dataSend.stok = data.stok
            this.dataSend.satuan = data.satuan
            this.dataSend.keterangan = data.keterangan
            this.dataSend.foto = data.foto
          })
      } catch (error) {
        console.log(error)
      }
    },
    onSubmit () {
      const formData = new FormData()
      if (this.imageChanged) {
        formData.append('foto', this.foto)
      } else {
        formData.append('foto', true)
      }
      formData.append('data', JSON.stringify(this.dataSend))
      this.$axios.put('barang/' + this.$route.params.id, formData, {
        headers: this.$createToken().token
      })
        .then(res => {
          console.log(res)
          if (res.data.error) {
            this.$showNotif(res.data.message, 'negative')
          } else {
            this.$showNotif(res.data.message, 'positive')
            this.$router.push({ name: 'databarang' })
          }
        })
    },
    selectFile () {
      event.preventDefault()
      const preview = event.target.files[0]
      const url = URL.createObjectURL(preview)
      this.foto = this.$refs.file.$refs.input.files[0]
      this.linkPreview = url
      this.reseted = false
      this.imageChanged = true
    }
  },
  computed: {
    getOptionJenis () {
      let list, label, satuan
      if (this.dataSend.kategori === 'Pupuk') {
        list = ['Pupuk Organik', 'Pupuk Unorganik']
        label = 'Jenis Pupuk'
        satuan = 'Kg'
      } else if (this.dataSend.kategori === 'Alat Tani') {
        list = ['Cangkul', 'Gembor', 'Sabit', 'Arit', 'Bajak', 'Sprayer']
        label = 'Jenis Alat Tani'
        satuan = 'Pcs'
      } else {
        list = ['Bibit Jagung', 'Bibit Padi', 'Bibit Sayuran']
        label = 'Jenis Bibit'
        satuan = 'Kg'
      }
      return {
        list: list,
        label: label,
        satuan: satuan
      }
    }
  }
}
</script>
