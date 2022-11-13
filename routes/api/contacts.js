const express = require("express");
const contacts = require("../../models/contacts.js");

const router = express.Router();

router.get("/", async (req, res, next) => {
  const contactList = await contacts.listContacts();
  res.json({
    status: "success",
    code: 200,
    data: {
      contactList,
    },
  });
});

router.get("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await contacts.getContactById(contactId);

  res.json({
    status: "success",
    code: 200,
    data: { contact },
  });
});

router.post("/", async (req, res, next) => {
  const body = req.body;
  const newContact = await contacts.addContact(body);
  res.status(201).json({
    status: "success",
    code: 201,
    data: { newContact },
  });
});

router.delete("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  const deletedContact = await contacts.removeContact(contactId);
  res.status(204).json(deletedContact);
});

router.put("/:contactId", async (req, res, next) => {
  res.json({ message: "template message" });
});

module.exports = router;
