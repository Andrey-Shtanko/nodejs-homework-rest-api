const { Contact } = require("../db/contactModel");

const listContacts = async () => {
  try {
    const contacts = await Contact.find({});
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

    // await fs.writeFile(contactsPath, JSON.stringify(contacts));
    return deletedContact;
  } catch (error) {
    console.log(error);
  }
};

const addContact = async ({ name, email, phone }) => {
  try {
    const newContact = new Contact({ name, email, phone });
    await newContact.save();
    // const contacts = await listContacts();
    // const id = contacts.length + 1;
    // const newContact = {
    //   id: `${id}`,
    //   name,
    //   email,
    //   phone: `${phone}`,
    // };
    // const newContacts = [...contacts, newContact];
    // await fs.writeFile(contactsPath, JSON.stringify(newContacts));
    return newContact;
  } catch (error) {
    console.log(error);
  }
};

const updateContact = async (contactId, body) => {
  try {
    const [contactToUpdate] = await removeContact(contactId);
    if (body.name) {
      contactToUpdate.name = body.name;
    }
    if (body.email) {
      contactToUpdate.email = body.email;
    }
    if (body.phone) {
      contactToUpdate.phone = body.phone;
    }
    // const contacts = await listContacts();
    // const newContacts = [...contacts, contactToUpdate];
    // await fs.writeFile(contactsPath, JSON.stringify(newContacts));
    return contactToUpdate;
  } catch (error) {
    console.log(error);
  }
};

const updateStatusContact = async (contactId, body) => {};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};
