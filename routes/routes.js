import express from 'express'
import multer from 'multer'
import {fileTypeFromBuffer} from 'file-type';
import fs from 'fs/promises'
import {config} from '../controller/config.js'

const router = express.Router()
const uploads = config.uploadFolder
const uploadSecretValue = config.uploadSecretValue

//Multer custom storage for a proper file name
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploads)
    },
    filename: function (req, file, cb) {
        const parts = file.originalname.split('.')
        const originalFileExtension = parts.length > 1 ? parts[parts.length - 1] : ''; // Handle files without an extension

        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + '.' + originalFileExtension
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
    })

//Set up multer with custom storage
const upload = multer({ storage: storage }) 

//upload.single: Accepts a single file with the name "fieldname". The single file will be stored in req.file.
router.post('/image', upload.single('image'), async function(req,res) {
    try {

        const uploadSecret = req.body['upload-secret']
        if (!uploadSecret || (uploadSecret !== uploadSecretValue)){
            return res.status(401).send("Not authorized")
        }

        const filePath = req.file.path
        const buffer = await fs.readFile(filePath)
        const type = await fileTypeFromBuffer(buffer) // Check file type

        if (!type || !['image/jpeg', 'image/png', 'image/bmp'].includes(type.mime)) {
            await fs.unlink(filePath) // Delete invalid file
            return res.status(400).send('Invalid file type')
        }

        // Return the file name to the user
        const protocol = req.protocol
        const host = req.get('host')
        const originalUrl = `${protocol}://${host}`
        const folder = req.file.destination; 
        const fileName = req.file.filename
        const fullFilePath = `${originalUrl}/${folder}/${fileName}`

        res.send(`File uploaded successfully as a ${fullFilePath}`);

    } catch (error) {
        console.log(error)
        return res.status(500).send("An error occurred during file upload")
    }
})

export {router}