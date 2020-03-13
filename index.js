// implement your API here
const express = require("express");
const db = require("./data/db.js");
const server = express();

server.listen(4000, () => {
  console.log("listenning to the port 4000 :~)");
});

server.use(express.json());

server.get("/", (req, res) => {
  res.send(`
        <h1>Lambda Node API 1 Project</h1>
    `);
});

server.post("/api/users", (req, res) => {
  const { name, bio } = req.body;
  !name || !bio
    ? res
        .status(400)
        .json({ errorMessage: "Please provide name and bio for the user." })
    : db
        .insert(req.body)
        .then(user => {
          res.status(201).json(user);
        })
        .catch(err => {
          res.status(500).json({
            errorMessage:
              "There was an error while saving the user to the database",
            err
          });
        });
});
server.get("/api/users", (req, res) => {
  db.find()
    .then(users => {
      res.status(200).json({ users });
    })
    .catch(err => {
      res.status(500).json({
        errorMessage: "The user with the specified ID does not exist.",
        err
      });
    });
});
server.get("/api/users/:id", (req, res) => {
  const { id } = req.params;
  db.findById(id)
    .then(user => {
      user
        ? res.status(200).json(user)
        : res.status(404).json({
            message: "The user with the specified ID does not exist."
          });
    })
    .catch(err => {
      res.status(500).json({
        errorMessage: "The user information could not be retrieved.",
        err
      });
    });
});
server.delete("/api/users/:id", (req, res) => {
  const { id } = req.params;
  db.remove(id)
    .then(user => {
      user
        ? res.status(200).json({
            message: "User has been removed", id
          })
        : res.status(404).json({
            message: "The user with the specified ID does not exist."
          });
    })
    .catch(err => {
      res.status(500).json({
        errorMessage: "The user could not be removed",
        err
      });
    });
});
server.put("/api/users/:id", (req, res) => {
  const { id } = req.params;
  const info = req.body;
  const { name, bio } = req.body;

  !name || !bio
    ? res
        .status(400)
        .json({ errorMessage: "Please provide name and bio for the user." })
    : db
        .update(id, info)
        .then(user => {
          user
            ? res.status(200).json({ user, info })
            : res
                .status(404)
                .json({
                  message: "The user with the specified ID does not exist."
                });
        })
        .catch(err => {
          res.status(500).json({
            errorMessage: "The user information could not be modified.",
            err
          });
        });
});
