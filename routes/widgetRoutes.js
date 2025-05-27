import express from 'express';
import { generateScript, widgetScript } from '../controllers/widgetController.js';

const router = express.Router();

router.post('/generate-script', generateScript);
router.post('/widget-script',widgetScript);

export default router;
