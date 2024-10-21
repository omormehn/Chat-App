import express from "express";

const router = express.Router();

router.get('/test/', (res,req) => {
    req.send('shhhhhhj');
})

export { router as messageRouter };