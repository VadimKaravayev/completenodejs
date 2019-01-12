const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');


beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', ()=> {
    it('should create a new todo', (done)=> {
        let text = 'Test todo text';
        
        request(app)
            .post('/todos')
            .set('x-auth', users[0].tokens[0].token)
            .send({text})
            .expect(200)
            .expect((response)=> {
                expect(response.body.text).toBe(text);
            })
            .end((error, response)=> {
                if (error) {
                    return done(error);
                }
                
                Todo.find({text}).then((todos)=> {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((error)=> done(error));
            });
            
    });
    
    it('should not create todo with invalid body data', (done)=> {
        request(app)
            .post('/todos')
            .set('x-auth', users[0].tokens[0].token)
            .send({})
            .expect(400)
            .end((err, res)=> {
                if (err) {
                    return done(err);
                }
                Todo.find().then((todos)=> {
                    expect(todos.length).toBe(2);
                    done();
                }).catch((e)=> {
                    done(e);
                });
            });
    });
});

describe('GET /todos', ()=> {
    it('should get all todos', (done)=> {
        request(app)
            .get('/todos')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((response)=> {
                expect(response.body.todos.length).toBe(1);
            }).end(done);
    });
});

describe('GET /todos/:id', ()=> {
    it('should return todo', (done)=> {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((response)=> {
                expect(response.body.todo.text).toBe(todos[0].text);
            }).end(done);
    });
    
    it('should return 404 if todo not found', (done)=> {
        let id = new ObjectID().toHexString();
        request(app)
            .get('/todos/' + id)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });
    
    it('should return 404 for non-object ids', (done)=> {
        let id = 123;
        request(app)
            .get(`/todos/${id}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });
});

describe('DELETE todos/:id', ()=> {
    it('should remove a todo', (done)=> {
        let id = todos[1]._id.toHexString();
        request(app)
            .delete(`/todos/${id}`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(200)
            .expect((response)=> {
                expect(response.body.todo._id).toBe(id);
            })
            .end((error, response)=> {
                if (error) {
                    return done(error);
                }
                Todo.findById(id).then((todo)=> {
                    expect(todo).toBeFalsy();
                    done();
                }).catch((error)=> done(error));
            });
    });
    
    it('should return 404 if the todo not found', (done)=> {
        let id = new ObjectID().toHexString();
        request(app)
            .delete('/todos/' + id)
            .set('x-auth', users[1].tokens[0].token)
            .expect(404)
            .end(done);
    });
    
    it('should return 404 if the objec id is invalid', (done)=> {
        request(app)
            .delete('/todos/123')
            .set('x-auth', users[1].tokens[0].token)
            .expect(404)
            .end(done);
    });
});

describe('PATCH /todos/:id', ()=> {
    it('should update the todo', (done)=> {
        let id = todos[0]._id.toHexString();
        let text = 'updated the first item';
        let completed = true;
        request(app)
            .patch(`/todos/${id}`)
            .set('x-auth', users[0].tokens[0].token)
            .send({text, completed})
            .expect(200)
            .expect((response)=> {
                expect(response.body.todo.text).toBe(text);
                expect(response.body.todo.completed).toBe(true);
                expect(typeof response.body.todo.completedAt).toBe('number');
            }).end(done);
    });
    
    it('should clear completedAt when todo is not completed', (done)=> {
        let id = todos[1]._id.toHexString();
        let text = 'updated the second item';
        let completed = false;
        request(app)
            .patch(`/todos/${id}`)
            .set('x-auth', users[1].tokens[0].token)
            .send({text, completed})
            .expect(200)
            .expect((response)=> {
                expect(response.body.todo.text).toBe(text);
                expect(response.body.todo.completed).toBe(false);
                expect(response.body.todo.completedAt).toBe(null);
            }).end(done);
    });
});

describe('GET /users/me', ()=> {
    it('should return user if authenticatd', (done)=> {
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((response)=> {
                expect(response.body._id).toBe(users[0]._id.toHexString());
                expect(response.body.email).toBe(users[0].email);
            })
            .end(done);
    });
    
    it('should return 401 if not authenticated', (done)=> {
        request(app)
            .get('/users/me')
            .expect(401)
            .expect((response)=> {
                expect(response.body).toEqual({});
            })
            .end(done);
    });
});

describe('POST /users', ()=> {
    it('should create a user', (done)=> {
        let email = 'example@example.com';
        let password = '123zxc&';
        request(app)
            .post('/users')
            .send({email, password})
            .expect(200)
            .expect((response)=> {
                expect(response.headers['x-auth']).toBeTruthy();
                expect(response.body._id).toBeTruthy();
                expect(response.body.email).toBe(email);
            })
            //instead of .end(done) we can make custom ending for example to check db if all is correct
            .end((err)=> {
                if (err) {
                    return done(err);
                }
                User.findOne({email}).then((user)=> {
                    expect(user).toBeTruthy();
                    expect(user.password).not.toBe(password);
                    done();
                }).catch((err)=> done(err));
            });
    });
    
    it('should return validation errors if request invalid', (done)=> {
        request(app)
            .post('/users')
            .send({
                email: 'and',
                password: '123'
            })
            .expect(400)
            .end(done);
    });
    
    it('should not create a user if email in use', (done)=> {
        request(app)
            .post('/users')
            .send({
                email: 'vadym@cake.ua',
                password: 'abc123!'
            })
            .expect(400)
            .end(done);
    });
});

describe('POST /users/login', ()=> {
    it('should login user and return auth token', (done)=> {
        request(app)
            .post('/users/login')
            .send({
                email: users[1].email,
                password: users[1].password
            })
            .expect(200)
            .expect((response)=> {
                expect(response.headers['x-auth']).toBeTruthy();
            })
            .end((error, response)=> {
                if (error) {
                    return done();
                }
                User.findById(users[1]._id).then((user)=> {
                    expect(user.tokens[1]).toMatchObject({
                        access: 'auth',
                        token: response.headers['x-auth']
                    });
                    done();
                }).catch((error)=>done(error));
            });
    });
    
    it('should reject invalid login', (done)=> {
        request(app)
            .post('/users/login')
            .send({
                email: users[1].email,
                password: users[1].password + '1'
            })
            .expect(400)
            .expect((response)=> {
                expect(response.headers['x-auth']).toBeFalsy();
            })
            .end((error, response)=> {
                if (error) {
                    return done();
                }
                User.findById(users[1]._id).then((user)=> {
                    expect(user.tokens.length).toBe(1);
                    done();
                }).catch((error)=>done(error));
            });
    });
});

describe('DELETE /users/me/token', ()=> {
    it('should remove auth token on logout', (done)=>{
        request(app)
            .delete('/users/me/token')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .end((error, response)=> {
                if (error) {
                    return done(error);
                }
                User.findById(users[0]._id).then((user)=> {
                   expect(user.tokens.length).toBe(0);
                   done();
                }).catch((error)=> done(error));
                
            });
    });
});