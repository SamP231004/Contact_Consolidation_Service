const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    phoneNumber: {
        type: String,
        sparse: true,
    },
    email: {
        type: String,
        sparse: true,
    },
    linkedId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contact',
        default: null,
        sparse: true,
    },
    linkPrecedence: {
        type: String,
        enum: ['primary', 'secondary'],
        default: 'primary',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    deletedAt: {
        type: Date,
        default: null,
        sparse: true,
    }
});

// Create indexes for better query performance
contactSchema.index({ email: 1 }, { sparse: true });
contactSchema.index({ phoneNumber: 1 }, { sparse: true });
contactSchema.index({ linkedId: 1 }, { sparse: true });

// Add timestamps handling
contactSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;