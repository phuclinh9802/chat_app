// create an array of list of users
const c_users = [];

// function to add user to a specific chatroom
function joinUser(id, username, room) {
    const p_user = { id, username, room };
    c_users.push(p_user);
    console.log(c_users, "users");

    return p_user;
}


console.log("user out", c_users);

// get user by id
function getUser(id) {
    return c_users.find((p_user) => p_user.id === id);
}

// splice/delete when user leaves the chat
function userDisconnect(id) {
    const index = c_users.findIndex((p_user) => p_user.id === id);

    if (index !== -1) {
        return c_users.splice(index, 1)[0]
    }
}

module.exports = {
    joinUser,
    getUser,
    userDisconnect
}