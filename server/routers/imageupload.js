const cloudinary = require('cloudinary').v2;
const express = require('express');

cloudinary.config(process.env.CLOUDINARY_URL);

