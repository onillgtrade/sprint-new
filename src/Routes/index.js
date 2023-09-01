const { log } = require("console");
const { Router } = require("express");
const express = require("express");
const router = Router();
const fs = require("fs");
const { v4: uuidv4 } = require('uuid');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const session = require('express-session');
const PassportLocal = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const { check, validationResult } = require('express-validator');

router.use(express.urlencoded({extended: true}));

const json_prodi = fs.readFileSync('./src/Datajson/data-products.json', 'utf-8');
let prods = JSON.parse(json_prodi);
router.get("/", (req, res) => {
  res.render("index.ejs", {
    prods,
  });
});

//Asi mostramos las rutas con get
router.get("/new-products", (req, res) => {
  res.render("New-products.ejs");
});

router.post("/new-products", (req, res) => {  
  const { title, image, description, price } = req.body;
  if (!title || !image || !description ||!price) {
    res.status(400).send("Entries must have a title products and descriptions");
    return;
  }
  let newProducts = {
    id: uuidv4(),
    title,
    image,
    description,
    price
  };
 
    prods.push(newProducts);
    const json_prods = JSON.stringify(prods);
    console.log(json_prods);
    fs.writeFileSync('./src/Datajson/data-products.json', json_prods, 'utf-8');

  res.redirect('/'); 
  
  console.log(prods);
});

//Metodo de eliminacion de un objeto json
router.get('/delete/:id', (req, res)=>{
    //console.log(req.params);
    prods= prods.filter(prod=> prod.id != req.params.id);
    const json_prods = JSON.stringify(prods);
    fs.writeFileSync('./src/Datajson/data-products.json', json_prods, 'utf-8');
    res.redirect('/');;
});

//-----------------------------------------------------------------------------------
// REGISTRO DE USUARIOS..
const regi = fs.readFileSync('./src/Datajson/data-user-reg.json', 'utf-8');
let regs = JSON.parse(regi);
//Asi mostramos las rutas con get
router.get("/", (req, res) => {
  res.render("index.ejs", {
    regs,
  });
});
//Asi mostramos las rutas con get
router.get("/Register-user", (req, res) => {
  res.render("Register-user.ejs");
});

router.post("/Register-user", (req, res) => {  
  const { name, email, password } = req.body;
  if (!name || !email || !password ) {
    res.status(400).send("Entries must have All Data!");
    return;
  }
  let newUser = {
    name,
    email,
    password
  };
 
  regs.push(newUser);
    const regi = JSON.stringify(regs);
    console.log(regi);
    fs.writeFileSync('./src/Datajson/data-user-reg.json', regi, 'utf-8');

  res.redirect('/Login'); 
  
  console.log(regs);
});

//-----INICIO DE SESSION USUARIOS----------------
// Login route

const json_users = fs.readFileSync('./src/Datajson/data-user-reg.json', 'utf-8');
let users = JSON.parse(json_users);

//Asi mostramos las rutas con get
router.get("/", (req, res) => {
  res.render("login.ejs", {
    users,
  });
});
//Asi mostramos las rutas con get
router.get("/Login", (req, res) => {
  res.render("Login-user.ejs");
});

router.post('/login', [
  check('email').isEmail(),
  check('password').isLength(),
], (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(users);
      return res.status(400).json({ errors: errors.array() });
      
  }

  const { email, password } = req.body;

  // Find the user by email
  const user = users.find(user => user.email === email && user.password === password);

  if (!user) {
      console.log(users);
      return res.status(404).json({ message: 'User not found' });
  }

  // Compare the entered password with the hashed password
  bcrypt.compare(password, users.password, (err, result) => {
      if (err) {
          return res.statusCode = 500;
      }

      if (result) {
          // Authentication successful, set a session or token here
          return  res.statusCode = 200 ({ message: 'Authentication successful' });
      } else {
          return res.statusCode = 401 ({ message: 'Authentication failed' });
      }
      
  });
  res.redirect('/'); 
});

//Asi mostramos las rutas con get
router.get("/Contact", (req, res) => {
  res.render("Contact.ejs");
});
router.get("/About", (req, res) => {
  res.render("About.ejs");
});

module.exports = router;
