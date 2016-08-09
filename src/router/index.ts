import { Router, Request, Response } from 'express';
const router = Router();

router.get('/', async function(req: Request, res: Response) {
  let result = await sayWelcome();
  res.json(result);
});

function sayWelcome() {
  return new Promise(resolve => setTimeout(resolve, 300)).then(() => {return {"message": 'welcome'}});
}

export = router;