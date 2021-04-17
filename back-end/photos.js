const mongoose = require('mongoose');
const express = require("express");
const router = express.Router();

// Configure multer so that it will upload to '/public/images'
const multer = require('multer')
const upload = multer({
  dest: '../front-end/public/images/',
  limits: {
    fileSize: 50000000
  }
});

const users = require("./users.js");
const User = users.model;
const validUser = users.valid;

const photoSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  path: String,
  title: String,
  description: String,
  created: {
    type: Date,
    default: Date.now
  },
});

const Photo = mongoose.model('Photo', photoSchema);

const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  photo: {
    type: mongoose.Schema.ObjectId,
    ref: 'Photo'
  },
  description: String,
  created: {
    type: Date,
    default: Date.now
  },
});
const Comment = mongoose.model('Comment', commentSchema);

const symptomSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  photo: {
    type: mongoose.Schema.ObjectId,
    ref: 'Photo'
  },
text: String,
})
const Symptom = mongoose.model("Symptom", symptomSchema);

// upload photo
router.post("/", validUser, upload.single('photo'), async (req, res) => {
  // check parameters
  if (!req.file)
    return res.status(400).send({
      message: "Must upload a file."
    });

  const photo = new Photo({
    user: req.user,
    path: "/images/" + req.file.filename,
    title: req.body.title,
    description: req.body.description,
  });
  try {
    await photo.save();
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// get my photos
router.get("/", validUser, async (req, res) => {
  // return photos
  try {
    let photos = await Photo.find({
      user: req.user
    }).sort({
      created: -1
    }).populate('user');
    return res.send(photos);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// get all photos
router.get("/all", async (req, res) => {
  try {
    let photos = await Photo.find().sort({
      created: -1
    }).populate('user');
    return res.send(photos);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

router.get('/:photoID', async (req, res) => {
  try {
      let photo = await Photo.findOne({
        _id: req.params.photoID,
      }).populate('user');
      if (!photo) {
          res.sendStatus(404);
          return;
      }
      res.send(photo);
  } catch (error) {
      console.log(error);
      res.sendStatus(500);
  }
});
router.delete('/:id', async (req, res) => {
  try {
    
    await Photo.deleteOne({
      _id: req.params.id
    });
    await delete('/:photoID/comments/');
    
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});
router.delete('/:photoID/comments/', async (req, res) => {
  try {
      let comments = await Comment.find({photo: req.params.photoID});
      if (!comments) {
          res.sendStatus(404);
          return;
      }
      await comments.delete();
      res.sendStatus(200);
  } catch (error) {
      console.log(error);
      res.sendStatus(500);
  }
});
router.delete('/:photoID/symptoms/', async (req, res) => {
  try {
      let symptoms = await Symptom.find({photo: req.params.photoID});
      if (!symptoms) {
          res.sendStatus(404);
          return;
      }
      for(let symptom of symptoms){
        await symptom.delete();
      }
      res.sendStatus(200);
  } catch (error) {
      console.log(error);
      res.sendStatus(500);
  }
});

//comments
router.post("/:photoID/comments", validUser, async (req, res) => {
  // check parameters
  let photo = await Photo.findOne({
    _id: req.params.photoID});
  const comment = new Comment({
    description: req.body.description,
    user: req.user,
    photo: photo,
  });
  try {
    await comment.save();
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// get comments
router.get("/:photoID/comments", async (req, res) => {
  // return comments
  try {
    let photo = await Photo.findOne({
      _id: req.params.photoID});
    let comments = await Comment.find({
      photo: photo,
    }).sort({
      created: -1
    }).populate('user');
    return res.send(comments);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});
router.delete('/:photoID/comments/:commentID', async (req, res) => {
  try {
      let comment = await Comment.findOne({_id:req.params.commentID, photo: req.params.photoID});
      if (!comment) {
          res.sendStatus(404);
          return;
      }
      await comment.delete();
      res.sendStatus(200);
  } catch (error) {
      console.log(error);
      res.sendStatus(500);
  }
});


//symptoms
router.put('/:id', async (req, res) => {
  
  try {
    const photo = await Photo.findOne({
      _id: req.params.id,
    });
    photo.title = req.body.title;
    photo.description = req.body.description;
    await photo.save();
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});
router.delete('/:id/symptoms/:symptomID', async (req, res) => {
  try {
      let symptom = await Symptom.findOne({_id:req.params.symptomID, photo: req.params.id});
      if (!symptom) {
          res.sendStatus(404);
          return;
      }
      await symptom.delete();
      res.sendStatus(200);
  } catch (error) {
      console.log(error);
      res.sendStatus(500);
  }
});
router.get('/:id/symptoms', async (req, res) => {
  try {
      let photo = await Photo.findOne({_id: req.params.id});
      if (!photo) {
          res.sendStatus(404);
          return;
      }
      let symptoms = await Symptom.find({photo:photo}).populate('photo');
      res.send(symptoms);
  } catch (error) {
      console.log(error);
      res.sendStatus(500);
  }
});
router.post('/:id/symptoms', async (req, res) => {
  try {
      let photo = await Photo.findOne({_id: req.params.id});
      if (!photo) {
          res.sendStatus(404);
          return;
      }
      let symptom = new Symptom({
          photo: photo,
          text: req.body.text,
      });
      await symptom.save();
      res.sendStatus(200);
  } catch (error) {
      console.log(error);
      res.sendStatus(500);
  }
});

module.exports = {
  model: Photo,
  routes: router,
}
