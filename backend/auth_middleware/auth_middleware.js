const express = require("express");

const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  //Format is of the form: Bearer <token> --> so split by space, take second argument
  const token = req.headers["authorization"].split(" ")[1];
  if (!token) return res.status(401).json({ error: "Access denied" });
  try {
    const decoded = jwt.verify(token, process.env.SECRET_TOKEN);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
}

module.exports = verifyToken;
