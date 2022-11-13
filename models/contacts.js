const fs = require("fs/promises");
const path = require("path");
const contactsPath = path.resolve("models/contacts.json");

const listContacts = async () => {
  try {
    const response = await fs.readFile(contactsPath);
    const contacts = JSON.parse(response);
    return contacts;
  } catch (error) {
    console.log(error);
  }
};

const getContactById = async (contactId) => {
  try {
    const contacts = await listContacts();
    const findedContact = contacts.find((contact) => contact.id === contactId);
    if (!findedContact) {
      return null;
    }
    return findedContact;
  } catch (error) {
    console.log(error);
  }
};

const removeContact = async (contactId) => {
  try {
    const contacts = await listContacts();
    const deletedContactIndex = contacts.findIndex(
      (contact) => contact.id === contactId
    );

    if (deletedContactIndex === -1) {
      return null;
    }
    const deletedContact = contacts.splice(deletedContactIndex, 1);

    await fs.writeFile(contactsPath, JSON.stringify(contacts));
    return deletedContact;
  } catch (error) {
    console.log(error);
  }
};

const addContact = async (body) => {
  try {
    const contacts = await listContacts();
    const id = contacts.length + 1;
    const newContact = {
      id: `${id}`,
      ...body,
      // name,
      // email,
      // phone: `${phone}`,
    };
    const newContacts = [...contacts, newContact];
    await fs.writeFile(contactsPath, JSON.stringify(newContacts));
    return newContact;
  } catch (error) {
    console.log(error);
  }
};

const updateContact = async (contactId, body) => {};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
