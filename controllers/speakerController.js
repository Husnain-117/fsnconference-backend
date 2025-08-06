import fs from 'fs';
import path from 'path';

// Resolve the path relative to the current working directory of the Node.js process
const dataPath = path.resolve(process.cwd(), 'data/speakers.json');

const getSpeakers = (req, res) => {
    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') { // File doesn't exist
                return res.json([]);
            }
            console.error(err);
            return res.status(500).json({ message: 'Error reading speaker data.' });
        }
        try {
            res.json(JSON.parse(data));
        } catch (parseErr) {
            console.error(parseErr);
            res.status(500).json({ message: 'Error parsing speaker data.' });
        }
    });
};

const addSpeaker = (req, res) => {
    const {
        name,
        title,
        type,
        company,
        bio,
        expertise,
        social,
        featured,
        talkTitle,
        talkDescription
    } = req.body;
    const photo = req.file;

    if (!name) {
        return res.status(400).json({ message: 'Speaker name is required.' });
    }

    const newSpeaker = {
        id: Date.now(),
        name,
        title: title || '',
        type: type || 'Invited', // Default to 'Invited'
        company: company || '',
        bio: bio || '',
        // Assuming expertise is a comma-separated string from the form
        expertise: expertise ? expertise.split(',').map(e => e.trim()) : [],
        // Assuming social is a JSON string from the form
        social: social ? JSON.parse(social) : {},
        featured: featured === 'true' || featured === true,
        talkTitle: talkTitle || '',
        talkDescription: talkDescription || '',
        // The backend saves the relative path for the image
        image: photo ? `/uploads/speakers/${photo.filename}` : ''
    };


    fs.readFile(dataPath, 'utf8', (err, data) => {
        let speakers = [];
        if (err && err.code !== 'ENOENT') { // Handle errors other than file not found
            console.error(err);
            return res.status(500).json({ message: 'Error reading speaker data.' });
        }

        if (data) {
            try {
                speakers = JSON.parse(data);
            } catch (parseErr) {
                console.error(parseErr);
                return res.status(500).json({ message: 'Error parsing speaker data.' });
            }
        }

        speakers.push(newSpeaker);

        fs.writeFile(dataPath, JSON.stringify(speakers, null, 2), (writeErr) => {
            if (writeErr) {
                console.error(writeErr);
                return res.status(500).json({ message: 'Error saving speaker data.' });
            }
            res.status(201).json(newSpeaker);
        });
    });
};

const deleteSpeaker = (req, res) => {
    const { id } = req.params;

    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error reading speaker data.' });
        }

        let speakers = [];
        try {
            speakers = JSON.parse(data);
        } catch (parseErr) {
            console.error(parseErr);
            return res.status(500).json({ message: 'Error parsing speaker data.' });
        }

        const speakerExists = speakers.some(speaker => speaker.id == id);
        if (!speakerExists) {
            return res.status(404).json({ message: 'Speaker not found.' });
        }

        const updatedSpeakers = speakers.filter(speaker => speaker.id != id);

        fs.writeFile(dataPath, JSON.stringify(updatedSpeakers, null, 2), (writeErr) => {
            if (writeErr) {
                console.error(writeErr);
                return res.status(500).json({ message: 'Error saving speaker data.' });
            }
            res.status(200).json({ message: 'Speaker deleted successfully.' });
        });
    });
};

export { getSpeakers, addSpeaker, deleteSpeaker };
