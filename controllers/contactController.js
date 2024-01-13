const asyncHandler = require('express-async-handler');
const Contact = require('../models/contactModel');

// @desc Get all contacts 
// @routes Get /api/contacts
// access private

const getContacts = asyncHandler( async (req,res)=>{
    const contacts = await Contact.find({user_id: req.user.id});
    res.json(contacts);
})


// @desc get contact
// @routes Get /api/contacts/:id
// access private

const getContact = asyncHandler( async (req,res)=>{
    const contact = await Contact.findById(req.params.id);
    if(!contact){
        res.status(404);
        throw new Error('Contacts not found');
    }

    res.json(contact);
})


// @desc create contacts 
// @routes post /api/contacts
// access private

const createContact = asyncHandler( async (req,res)=>{
    const {name,phone,email} = req.body;
    if(!name || !phone ||!email){
        res.status(400);
        throw new Error("all fields are mandatory");
    }

    const contact = await Contact.create({
        name,
        email,
        phone,
        user_id:req.user.id
    });
    res.json(contact);

})


// @desc update contact
// @routes put /api/contacts/:id
// access private

const updateContact = asyncHandler( async (req,res)=>{
    const contact = await Contact.findById(req.params.id);
    if(!contact){
        res.status(404);
        throw new Error('Contacts not found');
    }

    if(contact.user_id.toString() !== req.user.id){
        res.status(403);
        throw new Error("User don't have permission to upadte other user contacts");
    }

    const updatedContact = await Contact.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new: true }
    );
    res.json(updatedContact);
})

// @desc delte contact
// @routes delete /api/contacts/:id
// access private

const deleteContact = asyncHandler( async (req,res)=>{
    const contact = await Contact.findById(req.params.id);
    if(!contact){
        res.status(404);
        throw new Error('Contacts not found');
    }
    if(contact.user_id.toString() !== req.user.id){
        res.status(403);
        throw new Error("User don't have permission to upadte other user contacts");
    }
    await Contact.deleteOne({ _id: req.params.id });
    res.status(200).json(contact);
});

module.exports = {getContacts,getContact,createContact,updateContact,deleteContact};