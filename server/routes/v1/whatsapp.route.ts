import { Router } from "express";
import { use } from "../../errorHandler";
import { WhatsAppStatusController } from "../../controller";

const router = Router();
const whatsAppStatusController = new WhatsAppStatusController();

// GET /api/v1/whatsapp/status -- { status: "disabled"|"connecting"|"waiting_for_scan"|"connected"|"disconnected" }
// Behind TokenVerifyMiddleware (see index.ts) so the logged-in admin UI can poll this
// to render a "WhatsApp: Connected/Not Connected" badge and a "Connect WhatsApp" button.
router.get("/status", use(whatsAppStatusController.status.controller));

export default router;
