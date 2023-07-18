const nodemailer = require('nodemailer');
require('dotenv').config()

async function sendMail(email, name, path) {
    var mailTransport = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    })
 
    switch (path) {
        case "patient":
            var details = {
                from: "Vitals <biopythonemail@gmail.com>",
                to: email,
                subject: "Welcome to Vitals",
                text: "Testing first Sender",
                html: `<!DOCTYPE html>
                <html>
                <head>
                <meta charset="UTF-8">
                <title>Welcome to Vitals!</title>
                <style>
                    body {
                    font-family: Arial, sans-serif;
                    background-color: #f5f5f5;
                    margin: 0;
                    padding: 0;
                    }
                
                    .container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    }
                
                    h1 {
                    color: #1565C0;
                    }
                
                    p {
                    color: #555555;
                    line-height: 1.5;
                    }
                
                    .button {
                    display: inline-block;
                    padding: 10px 20px;
                    background-color: #2196F3;
                    color: #ffffff;
                    text-decoration: none;
                    border-radius: 4px;
                    }
                </style>
                </head>
                <body>
                <div class="container">
                    <h1>Welcome to Vitals!</h1>
                    <p>Dear ${name} ,</p>
                    <p>Thank you for joining Vitals, your trusted Decentralized Health Record app. We're excited to have you as a new user and assist you in managing your health information effectively.</p>
                    <p>Vitals provides a secure and convenient way to store and access your health records, track vital signs, schedule appointments, and receive important updates from healthcare professionals.</p>
                    <p>To get started, simply download our app from the App Store or Google Play Store and sign in with your account credentials. If you haven't created an account yet, you can easily register within the app.</p>
                    <p>If you have any questions or need assistance, our support team is always ready to help. Just reach out to us via email at support@vitalsapp.com or give us a call at +234 818 198 2061.</p>
                    <p>Once again, welcome to Vitals! We look forward to being your trusted partner in managing your health.</p>
                    <p>Best regards,</p>
                    <p>The Vitals Team</p>
                    <br>
                    <p><a class="button" href="https://vitalz.vercel.app/">Visit our website</a></p>
                </div>
                </body>
                </html>`
            }
          break;

        case "doctor":
            var details = {
                from: "Vitals <biopythonemail@gmail.com>",
                to: email,
                subject: "Welcome to Vitals",
                text: "Testing first Sender",
                html: `<!DOCTYPE html>
                <html>
                <head>
                <meta charset="UTF-8">
                <title>Welcome to Vitals!</title>
                <style>
                    body {
                    font-family: Arial, sans-serif;
                    background-color: #f5f5f5;
                    margin: 0;
                    padding: 0;
                    }
                
                    .container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    }
                
                    h1 {
                    color: #1565C0;
                    }
                
                    p {
                    color: #555555;
                    line-height: 1.5;
                    }
                
                    .button {
                    display: inline-block;
                    padding: 10px 20px;
                    background-color: #2196F3;
                    color: #ffffff;
                    text-decoration: none;
                    border-radius: 4px;
                    }
                </style>
                </head>
                <body>
                <div class="container">
                    <h1>Welcome to Vitals!</h1>
                    <p>Dear Dr. ${name},</p>
                    <p>Thank you for joining Vitals, your trusted Decentralized Health Record app. We're thrilled to have you as a new member of our healthcare community and look forward to working together to provide the best care for your patients.</p>
                    <p>Vitals offers a comprehensive suite of tools and features designed to streamline your practice, enhance patient care, and improve overall efficiency. Our app allows you to securely access and manage patient records, collaborate with fellow healthcare professionals, schedule appointments, and stay updated on vital patient information.</p>
                    <p>We understand the importance of maintaining patient privacy and data security. Vitals strictly adheres to industry-leading security protocols to ensure the confidentiality of patient information at all times.</p>
                    <p>To get started, please download our app from the App Store or Google Play Store and sign in using your account credentials. If you have any questions or need assistance, our dedicated support team is available to help you. You can reach us via email at support@vitalsapp.com or call us at +234 818 198 2061.</p>
                    <p>Thank you for choosing Vitals. We are committed to empowering you in delivering excellent healthcare services and are excited to embark on this journey together.</p>
                    <p>Best regards,</p>
                    <p>The Vitals Team</p>
                    <br>
                    <p><a class="button" href="https://vitalz.vercel.app/">Visit our website</a></p>
                </div>
                </body>
                </html>`
            }
          break;

        case "hospital":
            var details = {
                from: "Vitals <biopythonemail@gmail.com>",
                to: email,
                subject: "Welcome to Vitals",
                text: "Testing first Sender",
                html:  `<!DOCTYPE html>
                <html>
                <head>
                <meta charset="UTF-8">
                <title>Welcome to Vitals!</title>
                <style>
                    body {
                    font-family: Arial, sans-serif;
                    background-color: #f5f5f5;
                    margin: 0;
                    padding: 0;
                    }
                
                    .container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    }
                
                    h1 {
                    color: #1565C0;
                    }
                
                    p {
                    color: #555555;
                    line-height: 1.5;
                    }
                
                    .button {
                    display: inline-block;
                    padding: 10px 20px;
                    background-color: #2196F3;
                    color: #ffffff;
                    text-decoration: none;
                    border-radius: 4px;
                    }
                </style>
                </head>
                <body>
                <div class="container">
                    <h1>Welcome to Vitals!</h1>
                    <p>Dear ${name},</p>
                    <p>Thank you for choosing Vitals, your trusted decentralized Health Record app. We're delighted to welcome you as a new hospital member and partner in revolutionizing the healthcare industry.</p>
                    <p>Vitals empowers hospitals like yours to securely store and access patient health records in a decentralized manner. Our innovative technology ensures that patient data remains confidential, while also enabling seamless sharing and collaboration across authorized healthcare providers. By joining Vitals, you're joining a global network of hospitals committed to delivering patient-centric and efficient care.</p>
                    <p>We understand that data security and patient privacy are paramount. Vitals leverages state-of-the-art encryption and blockchain technology to safeguard patient information, providing a secure and transparent ecosystem for healthcare data management.</p>
                    <p>To get started, our dedicated implementation team will work closely with your hospital's IT department to integrate Vitals into your existing systems smoothly. We will provide comprehensive training and support to ensure a seamless transition and maximize the benefits of our platform for your hospital and patients.</p>
                    <p>If you have any questions or need assistance, please don't hesitate to reach out to our support team. You can contact us via email at support@vitalsapp.com or call us at +234 818 198 2061.</p>
                    <p>Thank you for embracing decentralized health record management with Vitals. Together, we can drive positive change in healthcare delivery and improve patient outcomes.</p>
                    <p>Best regards,</p>
                    <p>The Vitals Team</p>
                    <br>
                    <p><a class="button" href="https://vitalz.vercel.app/">Visit our website</a></p>
                </div>
                </body>
                </html>`
            }
          break;
        
        case "verification":
            var details = {
                from: "Vitals <biopythonemail@gmail.com>",
                to: email,
                subject: "Vitals Verification",
                text: "Testing first Sender",
                html: `<!DOCTYPE html>
                <html>
                <head>
                    <title>Vitals - Verification</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                        }
                        
                        .logo {
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            margin-bottom: 20px;
                        }
                        
                        .logo img {
                            width: 100px;
                            height: 100px;
                        }
                        
                        .verification-code {
                            font-size: 36px;
                            font-weight: bold;
                            text-align: center;
                        }
                    </style>
                </head>
                <body>
                    <div class="logo">
                        <img src="https://svgshare.com/s/udc" alt="Vitals Brand Logo">
                    </div>
                    
                    <h2 class="verification-code">Your Verification Code:</h2>
                    <p class="verification-code">${name}</p>
                </body>
                </html>`
            }
      }
    
     
    mailTransport.sendMail(details, (err)=>{
        if(err){
            return res.status(401).json({ success: false, message: error.message })
        } else {
            console.log("email has been sent!")
        }
    })
}

module.exports = { sendMail }