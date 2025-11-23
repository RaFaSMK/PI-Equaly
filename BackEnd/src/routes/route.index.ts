import { Router } from "express";
import authRoutes from "../routes/auth/auth.routes";
import empresaRoutes from "../routes/empresa/empresas.routes";
import vagaRoutes from "./desenvolvimento/vaga.routes";
import pcdRoutes from "../routes/pcd/pcd.routes";
import candidaturaRoutes from "./candidatura/candidatura.routes";

// Novos routers de desenvolvimento
import acessibilidadesRoutes from "../routes/desenvolvimento/acessibilidades.routes";
import barreirasRoutes from "../routes/desenvolvimento/barreiras.routes";
import barreiraAcessibilidadeRoutes from "../routes/desenvolvimento/barreiraAcessibilidade.routes";
import tiposRoutes from "../routes/desenvolvimento/tipos.routes";
import subtiposRoutes from "../routes/desenvolvimento/subtipos.routes";
import vinculosRoutes from "../routes/desenvolvimento/vinculos.routes";

// Rota de currículos
import curriculosRoutes from "../routes/curriculo.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/empresas", empresaRoutes);
router.use("/vagas", vagaRoutes);
router.use("/pcd", pcdRoutes);
router.use("/candidaturas", candidaturaRoutes);

// Novos endpoints de desenvolvimento
router.use("/acessibilidades", acessibilidadesRoutes);
router.use("/barreiras", barreirasRoutes);
router.use("/barreira-acessibilidade", barreiraAcessibilidadeRoutes);
router.use("/tipos", tiposRoutes);
router.use("/subtipos", subtiposRoutes);
router.use("/vinculos", vinculosRoutes);

// Endpoint para listar currículos
router.use("/curriculos", curriculosRoutes);

export default router;
