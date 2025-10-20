const Jimp = require('jimp');
console.log('--- DEBUG JIMP IMPORT ---'); // <-- ADD THIS
console.log(Jimp); // <-- AND THIS
console.log('--- END DEBUG ---');
const path = require('path');
const fs = require('fs'); // Import 'fs' to check if files exist
const Event = require('../models/Event');
const Registration = require('../models/Registration');

// Helper function to check if a file exists
const fileExists = (filePath) => {
  return fs.promises.access(filePath, fs.constants.F_OK)
    .then(() => true)
    .catch(() => false);
};

const downloadCertificate = async (req, res) => {
  let responseSent = false;
  
  try {
    const eventId = req.params.eventId;
    const userId = req.user._id;

    // --- 1. VERIFY ATTENDANCE ---
    const attended = await Registration.findOne({ 
      event: eventId, 
      user: userId, 
      checkInTime: { $ne: null } 
    }).populate('user', 'name');
    
    if (!attended) {
      responseSent = true;
      return res.status(403).json({ message: 'Not authorized. You did not attend this event.' });
    }

    // --- 2. VERIFY EVENT & TEMPLATE ---
    const event = await Event.findById(eventId);
    if (!event) {
      responseSent = true;
      return res.status(404).json({ message: 'Event not found.' });
    }
    if (!event.certificateTemplateUrl) {
      responseSent = true;
      return res.status(404).json({ message: 'No certificate template uploaded for this event.' });
    }

    // --- 3. VERIFY TEMPLATE FILE EXISTS ---
    const templatePath = path.join(__dirname, '..', event.certificateTemplateUrl);
    if (!await fileExists(templatePath)) {
      console.error(`CRITICAL ERROR: Template file not found at path: ${templatePath}`);
      responseSent = true;
      return res.status(404).json({ message: 'Certificate template file is missing. Please contact admin.' });
    }
    
    const template = await Jimp.read(templatePath);

    // --- 4. LOAD FONTS (Add error handling) ---
    let nameFont, eventFont;
    try {
      nameFont = await Jimp.loadFont(Jimp.FONT_SANS_64_BLACK);
      eventFont = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);
    } catch (fontError) {
      console.error('CRITICAL ERROR: Failed to load Jimp fonts!', fontError);
      throw new Error('Server font files are missing.');
    }

    // --- 5. PRINT TEXT (Add error handling) ---
    // You MUST adjust these X, Y coordinates to match your template
    const textX = 100; // Your X coordinate
    const nameY = 300; // Your Y coordinate for the name
    const eventY = 400; // Your Y coordinate for the event

    // Check if coordinates are safe
    if (nameY > template.bitmap.height || eventY > template.bitmap.height) {
      console.error(`CRITICAL ERROR: Print coordinates are out of bounds. Image height is ${template.bitmap.height}px.`);
      throw new Error('Certificate print coordinates are out of bounds.');
    }

    template.print(nameFont, textX, nameY, attended.user.name);
    template.print(eventFont, textX, eventY, event.title);
    
    // --- 6. SEND IMAGE ---
    const outputBuffer = await template.getBufferAsync(Jimp.MIME_PNG);
    
    const filename = `Certificate-${event.title.replace(/\s/g, '-')}.png`;
    res.set('Content-Type', Jimp.MIME_PNG);
    res.set('Content-Disposition', `attachment; filename=${filename}`);
    
    responseSent = true;
    return res.send(outputBuffer);

  } catch (error) {
    // This will now catch errors from any of the steps above
    console.error('Error generating certificate:', error.message);
    
    if (!responseSent) {
      // Send a more specific error message back
      return res.status(500).json({ message: error.message || 'Error generating certificate.' });
    }
  }
};

module.exports = { downloadCertificate };