require("../config/passport");
const userModel = require("../models/user");
const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const _ = require("lodash");

const create = data => userModel.create(data);
const updateOne = (id, data) => userModel.updateOne({ _id: id }, data);
const deleteOneUser = id => userModel.findByIdAndRemove(id);
const getAll = () => userModel.find();
const getOne = id =>
  userModel
    .findById({ _id: id })
    .populate("lessons")
    .populate("enrolledCourses")
    .populate({ path: "enrolledCourses", populate: { path: "teacher" } });

const addLesson = (id, lessonId) =>
  userModel.updateOne({ _id: id }, { $push: { lessons: lessonId } });

router.get("/", (req, res) => {
  getAll()
    .then(dbRes => res.status(200).send(dbRes))
    .catch(dbErr => res.status(500).send({ message: "Db error", dbErr }));
});

router.get("/:id", (req, res) => {
  getOne(req.params.id)
    .then(dbRes => res.status(200).send(dbRes))
    .catch(dbErr =>
      res.status(500).send({ message: "Something went wrong", dbErr })
    );
});

router.patch("/:id", (req, res) => {
  updateOne(req.params.id, req.body)
    .then(dbRes => res.status(200).send(dbRes))
    .catch(dbErr => res.status(500).send({ message: "Db Error", dbErr }));
});

router.get("/public/:id", (req, res) => {
  getOne(req.params.id)
    .then(dbRes => {
      const user = _.pick(dbRes, [
        "userName",
        "lastName",
        "firstName",
        "avatar",
        "lessons",
        "enrolledCourses",
        "finishedCourses",
        "description"
      ]);
      res.status(200).send(user);
    })
    .catch(dbErr => res.status(500).send(dbRess));
});

router.patch("/user-enrolls/:userId", (req, res) => {
  console.log(req.params, req.body);
});

router.delete("/:id", (req, res) => {
  console.log("here");
  deleteOneUser(req.params.id)
    .then(dbRes => {
      console.log("Erased fine!");
      res.status(200).send(dbRes);
    })
    .catch(dbErr => {
      console.log("Erased NOT fine!");
      res.status(500).send({ message: "Db error TRTR", dbErr });
    });
});

module.exports = {
  router,
  deleteOneUser,
  updateOne,
  create,
  getAll,
  addLesson
};
