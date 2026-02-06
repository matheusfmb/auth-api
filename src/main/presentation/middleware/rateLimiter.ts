import rateLimit from 'express-rate-limit'
import { Request, Response } from 'express'

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, 
  max: 10, 
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    res
      .status(429)
      .json({ error: 'Too many requests. Try again in 1 minute.' })
  },
})

export { limiter }
