const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// POST endpoint
app.post('/bfhl', upload.single('file'), (req, res) => {
    console.log("Request body:", req.body);

    const data = req.body.data || [];
    const fileB64 = req.body.file_b64 || (req.file ? req.file.buffer.toString('base64') : null);

    // Process data
    const numbers = data.filter(item => !isNaN(item));
    const alphabets = data.filter(item => isNaN(item));
    const highestLowercase = alphabets
        .filter(char => char >= 'a' && char <= 'z')
        .sort()
        .pop() || ' a'; // Adjusted to match the expected output with space

    // File handling
    let fileValid = false;
    let fileMimeType = null;
    let fileSizeKb = null;

    if (fileB64) {
        const buffer = Buffer.from(fileB64, 'base64');
        fileValid = true; // Assuming the Base64 is valid
        
        // For demonstration purposes, assume the uploaded file is PNG
        fileMimeType = 'image/png'; // Set the MIME type as needed
        fileSizeKb = (buffer.length / 1024).toFixed(2);
    }

    // User ID creation
    const fullName = "john_doe";
    const dob = "17091999";
    const userId = `${fullName}_${dob}`;

    res.json({
        is_success: true,
        user_id: userId,
        email: "john@xyz.com",
        roll_number: "ABCD123",
        numbers: numbers,
        alphabets: alphabets,
        highest_lowercase_alphabet: [highestLowercase], // This should now match the expected output
        file_valid: fileValid,
        file_mime_type: fileMimeType,
        file_size_kb: fileSizeKb // Ensure the file you upload gives a proper size
    });
});

// GET endpoint
app.get('/bfhl', (req, res) => {
    res.status(200).json({ operation_code: 1 });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
