import rateLimit from "express-rate-limit";
 
 const limiter = rateLimit({
     windowMs: 15 * 60 * 1000,
     max: 100,
     message: {
         success: false,
         msg: "Se han realizado demasiadas peticiones desde esta IP, porfavor intentelo denuevo mas tarde"
     }
 });
 
 export default limiter;