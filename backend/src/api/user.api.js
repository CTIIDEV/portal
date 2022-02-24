const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const db = require("../database");
const User = db.user;

const {
  generateAccessToken,
  generateRefreshToken,
  validateToken,
} = require("./auth");

let refreshTokens = [];

router.post("/refresh", (req, res) => {
  const refreshToken = req.body.token;
  if (!refreshToken) {
    const message = "Not authenticated.";
    res.status(400).json({ message });
  }

  if (!refreshToken.includes(refreshToken)) {
    const message = "Invalid token.";
    res.status(400).json({ message });
  }

  jwt.verify(refreshToken, process.env.KEY_REFRESH, (error, user) => {
    error && console.log(error);

    refreshTokens = refreshTokens.filter((token) => token !== refreshToken);

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    refreshTokens.push(newRefreshToken);

    res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  });
});

router.post("/create", async (req, res) => {
  // const { userId, userFirstName, userLastName, userDept, userEmail, userRole } =
  //   req.body;
  // const password = "Abcd1234";
  // console.log(req.body);
  // const check = await User.findOne({ where: { userId } });

  // if (check) {
  //   const message = "User exists in database.";
  //   res.status(400).json({ message });
  // } else {
  //   bcrypt.hash(password, 10, async (error, hash) => {
  //     await User.create({
  //       userId: userId,
  //       userFirstName: userFirstName,
  //       userLastName: userLastName,
  //       userDept: userDept,
  //       userEmail: userEmail,
  //       userPassword: hash,
  //       userRole: userRole,
  //     })
  //       .then((result) => {
  //         const message = "User successfully registered.";
  //         res.json({ message, result });
  //       })
  //       .catch((error) => {
  //         const message = "Failed to register user. Please try again later.";
  //         res.status(500).json({ error, message });
  //       });
  //   });
  // }

  const { userName, userLoginName, userPassword, userStatus } = req.body;
  await User.create({
    userName,
    userLoginName,
    userPassword,
    userStatus,
  })
    .then((result) => {
      console.log(result);
    })
    .catch((error) => {
      console.log(error);
    });
});

router.post("/users", async (req, res) => {
  const { department, role } = req.body;

  if (role === "Admin" && department === "HR & Admin") {
    User.findAll()
      .then((data) => {
        res.json(data);
      })
      .catch((error) => {
        const message = "Failed to register user. Please try again later.";
        res.status(500).json({ error, message });
      });
  }
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  User.findByPk(id)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || `ERROR RETRIEVING USER ID ${id} DATA`,
      });
    });
});

router.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;
  User.destroy({
    where: { userId: id },
  })
    .then((num) => {
      if (num == 1) {
        const message = "User successfully deleted.";
        res.json({ message });
      } else {
        const message = "User not found.";
        res.json({ message });
      }
    })
    .catch((error) => {
      const message = "User failed to delete.";
      res.status(500).json({ error, message });
    });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { userEmail: email } });

  if (!user) {
    const message = "Email or password is wrong. Please try again.";
    res.status(400).json({ message });
  }

  const dbPassword = user.userPassword;

  bcrypt.compare(password, dbPassword).then((match) => {
    if (!match) {
      const message = "Email or password is wrong. Please try again.";
      res.status(400).json({ message });
    } else {
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);
      refreshTokens.push(refreshToken);
      res.json({
        userId: user.userId,
        userFirstName: user.userFirstName,
        userLastName: user.userLastName,
        userDept: user.userDept,
        userEmail: user.userEmail,
        userRole: user.userRole,
        accessToken,
        refreshToken,
        expires: 30000,
      });
    }
  });
});

router.post("/logout", validateToken, (req, res) => {
  const refreshToken = req.body.token;
  refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
  const message = "Logged out successfully.";
  res.json({ message });
});

router.put("/change-password", validateToken, async (req, res) => {
  const { userId, oldPassword, newPasswordOne, newPasswordTwo } = req.body;
  const user = await User.findOne({ where: { userId } });
  if (!user) {
    const message = "Cannot update password. Please contact IT team.";
    res.status(400).json({ message });
  }

  const dbPassword = user.userPassword;

  bcrypt.compare(oldPassword, dbPassword).then((match) => {
    if (!match) {
      const message = "Password is not matching. Please try again.";
      res.status(400).json({ message });
    } else {
      if (newPasswordOne === newPasswordTwo) {
        bcrypt.hash(newPasswordOne, 10, async (err, hash) => {
          console.log(hash);
          await User.update({ userPassword: hash }, { where: { userId } })
            .then((num) => {
              console.log(num);
              if (num == 1) {
                const message = "Password updated successfuly.";
                res.json({ message });
              } else {
                const message = "Failed to update password. Please try again.";
                res.json({ message });
              }
            })
            .catch((error) => {
              const message = "Failed to update password. Please try again.";
              res.status(500).json({ error, message });
            });
        });
      } else {
        const message = "Password is not matching. Please try again.";
        res.status(400).json({ message });
      }
    }
  });
  // const user = await User.findONe({ where: { userId } });
  // console.log(user);
  // bcrypt.hash(password, 10, async (err, hash) => {
  //   await User.update(
  //     {
  //       password: hash,
  //     },
  //     { where: { id } }
  //   )
  //     .then((num) => {
  //       if (num == 1) {
  //         res.json({
  //           message: "PASSWORD CHANGED!",
  //         });
  //       } else {
  //         res.json({
  //           message: "FAILED TO CHANGE PASSWORD!",
  //         });
  //       }
  //     })
  //     .catch((err) => {
  //       res.json({ message: "ERROR WHILE CHANGING PASSWORD!" });
  //     });
  // });
});

router.put("/edit-profile", validateToken, async (req, res) => {
  // console.log(req.body);
  await User.update(req.body, { where: { id: req.body.id } })
    .then((num) => {
      if (num == 1) {
        res.json({ message: "PROFILE UPDATED!" });
      } else {
        res.json({ message: "PROFILE FAILED TO UPDATE!" });
      }
    })
    .catch((err) => {
      res.json({ message: "ERROR WHILE UPDATING PROFILE!" });
    });
});

module.exports = router;
