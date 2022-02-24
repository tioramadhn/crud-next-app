import mongoose from 'mongoose';

const { Schema } = mongoose;

  const WargaSchema = new Schema({
    nomorStambuk:  String, // String is shorthand for {type: String}
    nama: String,
    nik:   String,
    tempatLahir:   String,
    tanggalLahir:   String,
    tanggalTerdaftar:   String,
    alamat:   String,
    sektor:   String,
    statusPerkawinan:   String,
    pasFoto:   String,
    statusKeaktifan:   String,
    
  });

  const Warga = mongoose.models.Warga || mongoose.model('Warga', WargaSchema);
  export default Warga
