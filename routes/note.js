const express = require("express");
const fetchuser = require("../middleware/fetchuser");
const Note = require("../models/Notes");
const router = express.Router();
const { body, validationResult } = require("express-validator");

// Learning CRUD OPERATIONS

// ROUTE 1: Get all the notes using: GET "/api/notes/fetchallnotes". No login required
// READ Operation
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("some error occured");
  }
});

// ROUTE 2: Add a new note using: POST "/api/notes/addnote". No login required
// CREATE Opertaion
router.post(
  "/addnote",
  fetchuser,
  [
    body("title", "Title must be atleast 3 character").isLength({ min: 3 }),
    body("description", "Description must be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      // If there are errors, return Bad request and the errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const note = new Note({
        title,
        description,
        tag,
        user: req.user.id,
      });

      const savedNote = await note.save();

      res.json(savedNote);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("some error occured");
    }
  }
);

// ROUTE 3: Update a new note using: PUT "/api/notes/updatenote". Login required
// UPDATE Operation
router.put("/updatenote/:id", fetchuser, async (req, res) => {
  try {
    const { title, description, tag } = req.body;
    // Create a newNote object
    const newNote = {};
    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    if (tag) {
      newNote.tag = tag;
    }

    // Find the note to be updated and update it
    let note = await Note.findById(req.params.id);
    if (!note) {
      res.status(404).send("Not Found");
    }

    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }

    note = await Note.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );

    res.json({ note: note, "Success": "Note has been updated successfully" });

  } catch (error) {
    console.error(error.message);
    res.status(500).send("some error occured");
  }
});

// ROUTE 4: DELETE an existing note using: DELETE "/api/notes/deletenote". Login required
// DELETE Operation
router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  try {
    const { title, description, tag } = req.body;

    // Find the note to be deleted and delete it
    let note = await Note.findById(req.params.id);
    if (!note) {
      res.status(404).send("Not Found");
    }

    // Allow deletion only if user owns this Note.
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }

    note = await Note.findByIdAndDelete(req.params.id);
    res.json({ "Success": "Note has been deleted successfully", note: note });

  } catch (error) {
    console.error(error.message);
    res.status(500).send("some error occured");
  }

});

module.exports = router;
