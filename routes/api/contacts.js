const express = require("express");
const contacts = require("../../models/contacts.js");
const Joi = require("joi");
const { auth } = require("../../middlewares/auth.js");

const contactCreateSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
});
const contactUpdateSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string(),
  phone: Joi.string(),
}).min(1);

const router = express.Router();

router.get("/", auth, async (req, res, next) => {
  const { page = 1, limit = 5 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);
  const { _id } = req.user;
  const limitToNumber = Number(limit);
  const contactList = await contacts.listContacts(_id, skip, limitToNumber );
  res.json({
    status: "success",
    code: 200,
    data: {
      contactList,
    },
  });
});

router.get("/:contactId", auth, async (req, res, next) => {
  const { contactId } = req.params;
  const { _id } = req.user;
  const contact = await contacts.getContactById(contactId, _id);
  if (!contact) {
    return res.status(404).json({ message: "Not found" });
  }

  res.json({
    status: "success",
    code: 200,
    data: { contact },
  });
});

router.post("/", auth, async (req, res, next) => {
  const { error } = contactCreateSchema.validate(req.body);
  const { name, email, phone, favorite = false } = req.body;
  const { _id } = req.user;

  if (error) {
    return res.status(400).json({ message: "missing required name field" });
  }
  const body = {
    name,
    email,
    phone,
    favorite,
    owner: _id
  };
  const newContact = await contacts.addContact(body);
  res.status(201).json({
    status: "success",
    code: 201,
    data: { newContact },
  });
});

router.delete("/:contactId",auth, async (req, res, next) => {
  const { contactId } = req.params;
  const deletedContact = await contacts.removeContact(contactId);
  if (!deletedContact) {
    return res.status(404).json({ message: "Not found" });
  }
  res.status(200).json({ message: "contact deleted" });
});

router.put("/:contactId", auth, async (req, res, next) => {
  const { error } = contactUpdateSchema.validate(req.body);
  const { contactId } = req.params;
  const { name, email, phone } = req.body;
  const body = {
    name,
    email,
    phone,
  };
  if (error) {
    return res.status(400).json({ message: "missing fields" });
  }
  const updatedContact = await contacts.updateContact(contactId, body);
  if (!updatedContact) {
    return res.status(404).json({ message: "Not found" });
  }
  res.json({
    status: "success",
    code: 200,
    data: { updatedContact },
  });
});
router.patch("/:contactId/favorite", auth, async (req, res, next) => {
  const { contactId } = req.params;
  const { favorite: body } = req.body;

  if (body === null) {
    return res.status(400).json({ message: "missing field favorite" });
  }
  const updatedStatus = await contacts.updateStatusContact(contactId, body);
  if (!updatedStatus) {
    return res.status(404).json({ message: "Not found" });
  }
  res.json({
    status: "success",
    code: 200,
    data: { updatedStatus },
  });
});

module.exports = router;
