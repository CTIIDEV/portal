const cusers = [];

const joinUser = (id, username, room) => {
  const puser = { id, username, room };
  cusers.push(puser);

  console.log(cusers, "users");
  return p_user;
};

console.log("User Out", cusers);

const getCurrentuser = (id) => {
  return cusers.find((puser) => {
    puser.id === id;
  });
};

const index = cusers.findIndex((puser) => puser.id === id);

if (index !== -1) {
  return cusers.splice(index, 1)[0];
}

module.exports = {
  joinUser,
  getCurrentuser,
  userDisconnect,
};
