const express = require("express");
const router = express.Router();

const db = require("../database");
const Overtime = db.overtime;
const User = db.user;

const { validateToken } = require("./auth");

router.post("/create", validateToken, (req, res) => {
  const {
    overtimeDateReq,
    overtimeBegin,
    overtimeEnds,
    overtimeDesc,
    overtimeStatus,
    userId,
  } = req.body;

  Overtime.create({
    overtimeDateReq,
    overtimeBegin,
    overtimeEnds,
    overtimeDesc,
    overtimeStatus,
    userId,
  })
    .then((result) => {
      // console.log(result);
      const message = "Overtime requested. Please wait for approval.";
      res.json({ message });
    })
    .catch((error) => {
      // console.log(error);
      const message = "Failed to request overtime. Please try again later.";
      res.status(500).json({ error, message });
    });
});

router.get("/get-user/:id", validateToken, async (req, res) => {
  const id = req.params.id;

  await Overtime.findAll({
    where: { userId: id },
    order: [["overtimeDateReq", "ASC"]],
  })
    .then((result) => {
      if (result.length === 0) {
        const message =
          "No overtime requests found. Fill the form to request overtime.";
        res.status(400).json({ message });
      } else {
        res.json(result);
      }
    })
    .catch((error) => {
      const message =
        "Failed to get overtime requests information. Please try again later.";
      res.status(500).json({ error, message });
    });
});

router.get("/view/:id", validateToken, async (req, res) => {
  const id = req.params.id;
  const result = await Overtime.findByPk(id);

  if (!result) {
    res.json({ message: "NO OVERTIME REQUESTED!" });
  } else {
    const result = await Overtime.findAll({
      where: { id },
      include: { model: User, as: "users" },
    })
      .then((result) => {
        res.json(result);
      })
      .catch((err) => {
        console.log(err);
      });
    console.log(result);
  }
});

router.post("/view-manage", validateToken, (req, res) => {
  const department = req.body.department;
  console.log(department);
  if (department === "HR & Admin") {
    Overtime.findAll({
      where: { overtimeStatus: "processing" },
      include: { model: User, as: "users" },
    })
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        res.json({ message: "ERROR RETRIEVING OVERTIME REQUESTS!", err });
      });
  } else {
    res.json({ message: "NOT AUTHORIZED TO ACCESS!" });
  }
});

router.put("/update/:id", validateToken, (req, res) => {
  const id = req.params.id;
  const request = Overtime.findByPk(id);
  if (!request) {
    res.json({ message: "NO OVERTIME REQUEST!" });
  } else {
    Overtime.update(req.body, {
      where: { id },
    }).then((num) => {
      if (num == 1) {
        const message = "Overtime request updated successfully.";
        res.json({ message });
      } else {
        const message =
          "Overtime request failed to update. Please try again later.";
        res.status(500).json({ message });
      }
    });
  }
});

router.delete("/delete/:id", (req, res) => {
  const id = req.params.id;

  const request = Overtime.findByPk(id);
  if (!request) {
    const message = "Overtime request not found.";
    res.status(404).json({ message });
  } else {
    Overtime.destroy({
      where: { id },
    })
      .then((num) => {
        if (num == 1) {
          const message = "Success to remove overtime request.";
          res.json({ message });
        } else {
          const message = " Failed to remove overtime request.";
          res.status(401).json({ message });
        }
      })
      .catch((error) => {
        const message = "Failed to remove overtime request.";
        res.status(500).json({ error, message });
      });
  }
});

module.exports = router;
