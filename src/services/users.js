const bcryptjs = require('bcryptjs');
const MySQL = require('../lib/MySQL');
const auth = require('../auth/authJWT');

class UserServces {
    constructor() {
        this.table = 'persons';
        this.condiion = 'id';
    }

    GetUser(person_id, callback) {
        MySQL.Get('contacts', 'person_id', person_id, (contacts) => {
            callback(contacts);
        });
    }

    GetUsers(callback) {
        MySQL.GetAll(this.table, (users) => {
            callback(users);
        });
    }

    CreateUser(data, callback) {
        MySQL.Create(this.table, data, (userCreated) => {
            callback(userCreated);
        });
    }

    UpdateUser(id, data, callback) {
        MySQL.Update(this.table, this.condiion, data, id, (userUpdated) => {
            callback(userUpdated)
        });
    }

    DeleteUser(id, callback) {
        MySQL.Delete(this.table, this.condiion, id, (userDeleted) => {
            callback(userDeleted);
        })
    }

    LogIn(username, password, callback) {

        MySQL.Get(this.table, 'username', username, async (user) => {
            if(user.length) {
                if(await bcryptjs.compare(password, user[0].password)) {

                    const payload = {
                        id: user[0].id.toString(),
                        rol: user[0].rol
                    }

                    auth.sign(payload, (token)  => {
                        callback(token, 'succes');
                    });
                } else {
                    callback({}, 'contraseña invalida')
                }
            } else {
                callback({}, 'no se encontró un usuario');
            }
        });
    }
}

const userService = new UserServces();

module.exports = userService;