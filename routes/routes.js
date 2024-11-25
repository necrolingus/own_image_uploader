import express from 'express'
import multer from 'multer'
import {fileTypeFromBuffer} from 'file-type';
import fs from 'fs/promises'
import {config} from '../controller/config.js'

const router = express.Router()
const uploads = config.uploadFolder
const uploadSecretValue = config.uploadSecretValue
const deleteAfterDaysValue = config.deleteAfterDays
const deleteAfterDaysMaxValue = config.deleteAfterDaysMax

//Multer custom storage for a proper file name
//The order in which you send your fields from your HTML is super imporant!
//Multer will stop processing once it gets a file, so file must always be submitted last in your form
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploads)
    },
    filename: function (req, file, cb) {
        //handle delete-after-days
        let deleteAfterDays = req.body['delete-after-days'] || deleteAfterDaysValue
        if (!Number.isInteger(Number(deleteAfterDays))) {
            deleteAfterDays = deleteAfterDaysValue
        }
        if (deleteAfterDays < 1){
            deleteAfterDays = deleteAfterDaysValue
        }
        if (deleteAfterDays > deleteAfterDaysMaxValue){
            deleteAfterDays = deleteAfterDaysMaxValue
        }

        const parts = file.originalname.split('.')
        const originalFileExtension = parts.length > 1 ? parts[parts.length - 1] : ''; // Handle files without an extension
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + '_' + deleteAfterDays + '.' + originalFileExtension
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
})

//Set up multer with custom storage
const upload = multer({ storage: storage })

//upload.single: Accepts a single file with the name "fieldname". The single file will be stored in req.file.
router.post('/store-image', upload.single('image'), async function(req,res) {
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

        res.send(`${fullFilePath}`);

    } catch (error) {
        console.log(error)
        return res.status(500).send("An error occurred during file upload")
    }
})

export {router}