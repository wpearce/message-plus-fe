const { createProxyMiddleware } = require('http-proxy-middleware');

const BE_TARGET = process.env.BE_TARGET || 'http://localhost:8080';
const STATIC_TOKEN = process.env.API_TOKEN || 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjMzNzY4NjI4MzYyNTI3NDAzMSIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL21lc3NhZ2VwbHVzLThpdmRncS51czEueml0YWRlbC5jbG91ZCIsInN1YiI6IjMzNzY4NjI4MzA1NTM3Mjk3NSIsImF1ZCI6WyIzMzc2ODY3MDY0Mjc4Mjg5MTEiLCIzMzc2OTE2MTQ4NzA4MzY4MzgiLCIzMzc2ODY2MDg0OTkyMTkxMTkiXSwiZXhwIjoxNzU5Njg5NDY0LCJpYXQiOjE3NTkyNTc0NjQsIm5iZiI6MTc1OTI1NzQ2NCwiY2xpZW50X2lkIjoiMzM3NjkxNjE0ODcwODM2ODM4IiwianRpIjoiVjJfMzQwMTc3Mjg4NjcyODY5MDgwLWF0XzM0MDE3NzI4ODY3MjkzNDYxNiJ9.Sz8QZqSIkrbD4JniYsqLkBzer6A2GtFVZ7EIDCSnv_ZSXogSGnFbNloYU5L6L5o1YiPvuZUQEUH5rvgX4oXTRCGa3fSAzHGOSGH18cYuRmcED5wwR7HkzrBwZeg4p3C44Rx2mnbrMPNKFiccafqhjgJsGPIbx5wI_xWHNI7ZNCUYFQpxHTrEhg-VAcRPp7OdWxYQfm5Ws-iqATiIBx5hdifAY6b0uPhuauNnziTz3pNoM7O3-oFe_rjcrf3Jc8OAZjA5htTRq1uEFdZKxbQ40gSfaSaC2fL8FymukxQCScDBo0Pmh8lGFjUfZX45AcQ31gjuxU_HyEYKFc-U6U3jkw';

module.exports = [
  {
    context: ['/api'],
    target: BE_TARGET,
    changeOrigin: true,
    logLevel: 'info',
    secure: false,
    // onProxyReq: (proxyReq) => {
    //   proxyReq.setHeader('Authorization', `Bearer ${STATIC_TOKEN}`);
    // },
  },
];
