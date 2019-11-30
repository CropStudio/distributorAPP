<template>
  <q-page padding>
    <div class="row">
      <div class="col-md-12">
        <q-card class="bg-white text-black q-pa-lg">
          <q-form @submit="onSubmit">
            <div class="row text-blue-grey-10">
              <div class="col-md-6 col-xs-12 q-gutter-y-lg">
                <div class="text-h6 text-weight-light">Input Data Barang</div>
                <q-separator/>
                <q-input :rules="[ val => val !== null || 'Mohon Isi Nama barang']" label="Nama Barang" v-model="dataSend.namaBarang" filled></q-input>
                <q-select
                  :options="['Pupuk', 'Alat Tani', 'Benih']"
                  label="Pilih Kategori"
                  v-model="dataSend.kategori"
                  :rules="[ val => val !== null || 'Mohon Pilih Kategori']"
                  filled
                />
                <q-input :rules="[ val => val !== null || 'Mohon Isi Harga Barang']" label="Harga Barang" type="number" prefix="Rp." v-model="dataSend.harga" filled></q-input>
                <q-select
                  :options="['Kg', 'Pcs']"
                  label="Pilih Satuan"
                  :rules="[ val => val !== null || 'Mohon Pilih Satuan']"
                  v-model="dataSend.satuan"
                  filled
                />
                <q-input label="Stock" type="number" v-model="dataSend.stok" filled></q-input>
                <q-input label="Keterangan" type="textarea" v-model="dataSend.keterangan" filled></q-input>
                <div class="col">
                  <q-input
                    @input="selectFile()"
                    filled
                    ref="file"
                    type="file"
                    hint="Upload Gambar Barang"
                    error-message="Mohon Upload Gambar"
                    :error="imageError"
                    :autofocus="imageError"
                  />
                  <q-img v-if="!reseted" :src="linkPreview"></q-img>
                </div>
                <q-btn type="submit" unelevated color="blue-grey-10" no-caps>Simpan</q-btn>
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
        satuan: null,
        stok: 0,
        keterangan: null
      },
      linkPreview: '',
      foto: '',
      reseted: true,
      imageError: false
    }
  },
  methods: {
    reset () {
      this.dataSend = {
        namaBarang: null,
        kategori: 'Pupuk',
        harga: 0,
        satuan: null,
        stock: 0,
        keterangan: null
      }
      this.foto = ''
      this.linkPreview = ''
      this.reseted = true
    },
    onSubmit () {
      if (this.foto === '') {
        this.imageError = true
      } else {
        const formData = new FormData()
        formData.append('foto', this.foto)
        formData.append('data', JSON.stringify(Object.assign(this.dataSend, this.$createToken().distributor)))
        this.$axios.post('barang', formData, {
          headers: this.$createToken().token
        })
          .then(res => {
            if (res.data.error) {
              this.$showNotif(res.data.message, 'negative')
            } else {
              this.$showNotif(res.data.message, 'positive')
              this.$router.push({ name: 'databarang' })
            }
          })
      }
    },
    selectFile () {
      event.preventDefault()
      const preview = event.target.files[0]
      const url = URL.createObjectURL(preview)
      this.foto = this.$refs.file.$refs.input.files[0]
      this.linkPreview = url
      this.reseted = false
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
