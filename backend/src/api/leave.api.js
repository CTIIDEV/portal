const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const db = require("../database");
const Leave = db.leave;
const User = db.user;

const { validateToken } = require("./auth");

const storage = multer.diskStorage({
  destination: path.join(__dirname + "./../public/images/"),
  filename: function (req, file, cb) {
    cb(
      null,
      file.filename + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
}).single("picture");

router.post("/create", validateToken, upload, (req, res) => {
  const { leaveBegin, leaveEnds, leaveDesc, leaveImage, leaveStatus, userId } =
    req.body;
  Leave.create({
    leaveBegin: leaveBegin,
    leaveEnds: leaveEnds,
    leaveDesc: leaveDesc,
    leaveImage: leaveImage,
    leaveStatus: leaveStatus,
    userId: userId,
  })
    .then((result) => {
      console.log(result);
      const message = "Leave requested. Please wait for approval.";
      res.json({ message });
    })
    .catch((error) => {
      console.log(error);
      const message = "Failed to request leave. Please try again later.";
      res.status(500).json({ error, message });
    });
});

// // VIEW REQUESTED LEAVES BY A USER
router.get("/get-user/:id", validateToken, async (req, res) => {
  const id = req.params.id;

  await Leave.findAll({
    where: { userId: id },
    order: [["createdAt", "ASC"]],
  })
    .then((result) => {
      console.log(result);
      if (result.length === 0) {
        const message =
          "No leave requests found. Fill the form to request leave.";
        res.status(400).json({ message });
      } else {
        res.json(result);
      }
    })
    .catch((error) => {
      const message =
        "Failed to get leave requests information. Please try again later.";
      res.status(500).json({ error, message });
    });
});

// FOR HRA ONLY
router.post("/view-manage", validateToken, async (req, res) => {
  const department = req.body.department;
  if (department === "HR & Admin") {
    await Leave.findAll({
      where: { leaveStatus: "processing" },
      include: {
        model: User,
        as: "users",
      },
      order: [["leaveBegin", "ASC"]],
    })
      .then((result) => {
        // console.log(result);
        res.json(result);
      })
      .catch((error) => {
        const message =
          "Failed to retrieve leave requests. Please try again later.";
        res.status(500).json({ error, message });
      });
  } else {
    const message = "You are unauthorized to access.";
    res.status(401).json({ error, message });
  }
});

router.get("/view/:id", validateToken, async (req, res) => {
  const id = req.params.id;
  console.log(id);
  await Leave.findByPk(id, {
    include: {
      model: User,
      as: "users",
    },
  })
    .then((result) => {
      if (result == null) {
        const message =
          "Failed to retrieve leave request. Please try again later.";
        res.status(404).json({ error, message });
      } else {
        res.json(result);
      }
    })
    .catch((error) => {
      const message =
        "Failed to retrieve leave request. Please try again later.";
      res.status(500).json({ error, message });
    });
});

router.put("/update/:id", validateToken, (req, res) => {
  const id = req.params.id;

  const request = Leave.findByPk(id);

  if (!request) {
    const message = "No leave request found.";
    res.status(404).json({ message });
  } else {
    Leave.update(req.body, {
      where: { id },
    }).then((num) => {
      if (num == 1) {
        const message = "Request successfully updated.";
        res.json({ message });
      } else {
        const message = "Request failed to be updated.";
        res.status(404).json({ message });
      }
    });
  }

  // await Leave.update(req.body, {
  //   where: { userId: id },
  // })
  //   .then((num) => {
  //     if (num == 1) {
  //       const message = "Leave request updated.";
  //       res.json({ message });
  //     } else {
  //       const message = "Failed to update leave request.";
  //       res.status(500).json({ message });
  //     }
  //   })
  //   .catch((error) => {
  //     const message = "Failed to update leave request.";
  //     res.status(500).json({ error, message });
  //   });
});

router.delete("/delete/:id", (req, res) => {
  const id = req.params.id;

  const request = Leave.findByPk(id);

  if (!request) {
    const message = "No leave request found.";
    res.status(404).json({ message });
  } else {
    Leave.destroy({
      where: { id },
    })
      .then((num) => {
        if (num == 1) {
          const message = "Success to remove leave request.";
          res.json({ message });
        } else {
          const message = "Failed to remove leave request.";
          res.status(401).json({ message });
        }
      })
      .catch((error) => {
        const message = "Failed to remove leave request.";
        res.status(500).json({ error, message });
      });
  }
});

module.exports = router;
