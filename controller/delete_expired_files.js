import fs from 'fs';
import path from 'path';
import {config} from './config.js'

// Directory where files are stored
const uploadsDir = config.uploadFolder

// Function to check and delete expired files
function deleteExpiredFiles() {
    const now = Date.now();

    // Read all files in the uploads directory
    fs.readdir(uploadsDir, (err, files) => {
        if (err) {
            console.error('Error reading uploads directory:', err);
            return;
        }

        files.forEach((file) => {
            console.log(file)
            // Extract timestamp and delete-after-days from the file name
            const match = file.match(/-(\d+)-\d+_(\d+)\./);
            const filePath = path.join(uploadsDir, file);
            
            //If file does not have delete-after-days appended, just delete it
            if (!match) {
                fs.unlink(filePath, (unlinkErr) => {
                    if (unlinkErr) {
                        console.error(`Error deleting file with no delete-after-days ${file}:`, unlinkErr);
                    } else {
                        console.log(`Deleted file with no delete-after-days: ${file}`);
                    }
                });
                return
            }

            const timestamp = parseInt(match[1], 10); // File creation timestamp
            const deleteAfterDays = parseInt(match[2], 10); // Delete after days

            // Calculate expiration time
            const expirationTime = timestamp + deleteAfterDays * 24 * 60 * 60 * 1000;

            // If the current time exceeds the expiration time, delete the file
            if (now > expirationTime) {
                //const filePath = path.join(uploadsDir, file);
                fs.unlink(filePath, (unlinkErr) => {
                    if (unlinkErr) {
                        console.error(`Error deleting file ${file}:`, unlinkErr);
                    } else {
                        console.log(`Deleted expired file: ${file}`);
                    }
                });
            }
        });
    });
}

// Function to start the cleanup process
function startFileCleanup(intervalMs) {
    // Run cleanup immediately
    deleteExpiredFiles();

    // Schedule periodic cleanup
    setInterval(deleteExpiredFiles, intervalMs);
}

export {startFileCleanup}
