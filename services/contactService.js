const Contact = require('../models/contactModel');
const mongoose = require('mongoose');

exports.processContact = async (email, phoneNumber) => {
    if (!email && !phoneNumber) {
        throw new Error('Email or phone number is required');
    }

    // Find all existing contacts that match either email or phone
    const existingContacts = await Contact.find({
        $or: [
            { email: email || null },
            { phoneNumber: phoneNumber || null }
        ]
    }).sort({ createdAt: 1 }); // Sort by creation time to ensure consistent primary selection

    // If no contacts exist, create a new primary contact
    if (existingContacts.length === 0) {
        const newContact = new Contact({
            email,
            phoneNumber,
            linkPrecedence: 'primary',
            createdAt: new Date(),
            updatedAt: new Date()
        });
        await newContact.save();
        
        return {
            contact: {
                primaryContactId: newContact._id,
                emails: email ? [email] : [],
                phoneNumbers: phoneNumber ? [phoneNumber] : [],
                secondaryContactIds: []
            }
        };
    }

    // Get the oldest contact as primary
    let primaryContact = existingContacts[0];
    let secondaryContactIds = [];

    // Process other contacts and convert them to secondary if needed
    for (let i = 1; i < existingContacts.length; i++) {
        const contact = existingContacts[i];
        if (contact.linkPrecedence === 'primary') {
            contact.linkPrecedence = 'secondary';
            contact.linkedId = primaryContact._id;
            contact.updatedAt = new Date();
            await contact.save();
        }
        secondaryContactIds.push(contact._id);
    }

    // Update primary contact with any new information
    if (email && !primaryContact.email) {
        primaryContact.email = email;
        primaryContact.updatedAt = new Date();
        await primaryContact.save();
    }
    if (phoneNumber && !primaryContact.phoneNumber) {
        primaryContact.phoneNumber = phoneNumber;
        primaryContact.updatedAt = new Date();
        await primaryContact.save();
    }

    // Collect all unique emails and phone numbers
    const allEmails = new Set();
    const allPhoneNumbers = new Set();

    existingContacts.forEach(contact => {
        if (contact.email) allEmails.add(contact.email);
        if (contact.phoneNumber) allPhoneNumbers.add(contact.phoneNumber);
    });

    // Add the new contact information if not already present
    if (email) allEmails.add(email);
    if (phoneNumber) allPhoneNumbers.add(phoneNumber);

    return {
        contact: {
            primaryContactId: primaryContact._id,
            emails: Array.from(allEmails),
            phoneNumbers: Array.from(allPhoneNumbers),
            secondaryContactIds: secondaryContactIds
        }
    };
};