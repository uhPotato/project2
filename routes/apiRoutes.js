var db = require("../models");
require("dotenv").config();
var googleBooks = require("google-books-search");
var API_KEY = process.env.GOOGLE_API_KEY;

var options = {
  key: API_KEY,
  field: "title",
  offset: 0,
  limit: 5,
  type: "books",
  order: "relevance",
  lang: "en"
};

module.exports = function(app) {
  // Get all examples
  app.get("/api/books", function(req, res) {
    db.Book.findAll({}).then(function(dbBook) {
      res.json(dbBook);
    });
  });

  // Create a new book
  app.post("/api/books", function(req, res) {
    db.Book.create(req.body).then(function(dbBook) {
      res.json(dbBook);
    });
  });

  // Delete a book by id
  app.delete("/api/books/:id", function(req, res) {
    db.Book.destroy({ where: { id: req.params.id } }).then(function(dbBook) {
      res.json(dbBook);
    });
  });

  app.get("/api/googlebooks/search/:title", function(req, res) {
    let title = req.params.title;
    googleBooks.search(title, options, function(error, results) {
      if (!error) {
        console.log(results);
      } else {
        console.log(error);
      }
      // We are sending back the result "page" to the client
      res.render("search", {
        googleBooks: results,
        // Overrides which layout to use, instead of the defaul "main" layout.
        layout: "results"
        // partial: function() {
        //   return "bood_card";
        // }
      });
    });
  });
};
