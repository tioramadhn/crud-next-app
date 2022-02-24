// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import Warga from "../../models/Warga"
import db from '../../utils/db'

db().then(res => console.log("sukses konek")).catch(err => console.log("gagal konek"))
export default async function handler(req, res) {
  const {
    query: { id },
    method
  } = req;
  // res.status(400).json({ success: false });

  if (id) {
    switch (method) {
      case 'GET':
        try {
          const warga = await Warga.findById(id);

          if (!warga) {
            res.status(400).json({ success: false });
          }

          res.status(200).json({ success: true, data: warga });
        } catch (error) {
          res.status(400).json({ success: false });
        }
        break;
      case 'PUT':
        try {
          const warga = await Warga.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true
          });

          if (!warga) {
            res.status(400).json({ success: false });
          }

          res.status(200).json({ success: true, data: warga });
        } catch (error) {
          res.status(400).json({ success: false });
        }
        break;
      case 'DELETE':
        try {
          const deletedWarga = await Warga.deleteOne({ _id: id });

          if (!deletedWarga) {
            return res.status(400).json({ success: false })
          }

          res.status(200).json({ success: true, data: {} });
        } catch (error) {
          res.status(400).json({ success: false })
        }
        break;
      default:
        res.status(400).json({ success: false })
        break;
    }
  } else {
    switch (method) {
      case 'GET':
        try {
          const warga = await Warga.find({});

          res.status(200).json({ success: true, data: warga })
        } catch (error) {
          res.status(400).json({ success: false });
        }
        break;
      case 'POST':
        try {
          const warga = await Warga.create(req.body);

          res.status(201).json({ success: true, data: warga })
        } catch (error) {
          res.status(400).json({ success: false });
        }
        break;
      default:
        res.status(400).json({ success: false });
        break;
    }

  }
}
