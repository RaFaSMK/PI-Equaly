import { Request, Response } from "express";
import prisma from "../../prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

export async function register(req: Request, res: Response) {
  try {
    const { nome, email, senha, tipo, cpf, telefone, cargo, empresaId } =
      req.body;
    if (!email || !senha || !nome || !tipo)
      return res.status(400).json({ error: "Missing fields" });

    const hashed = await bcrypt.hash(senha, 10);
    const usuario = await prisma.usuario.create({
      data: {
        nome,
        email,
        senha: hashed,
        tipo,
        cpf,
        telefone,
        cargo,
        empresaId,
      },
    });

    // Buscar pcdId se o tipo for PCD
    let pcdId = null;
    if (usuario.tipo === "PCD") {
      const pcd = await prisma.pcd.findUnique({
        where: { usuarioId: usuario.id },
      });
      pcdId = pcd?.id ?? null;
    }

    const token = jwt.sign(
      { id: usuario.id, tipo: usuario.tipo, email: usuario.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.json({
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        tipo: usuario.tipo,
        empresaId: usuario.empresaId,
        pcdId,
      },
      token,
    });
  } catch (err) {
    const error = err as { code?: string; message: string };
    if (error.code === "P2002")
      return res.status(400).json({ error: "Registro duplicado" });
    res.status(500).json({ error: (error as Error).message });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, senha } = req.body;
    if (!email || !senha)
      return res.status(400).json({ error: "Missing fields" });

    const usuario = await prisma.usuario.findUnique({ where: { email } });
    if (!usuario) return res.status(401).json({ error: "Invalid credentials" });

    const match = await bcrypt.compare(senha, usuario.senha);
    if (!match) return res.status(401).json({ error: "Invalid credentials" });

    // Buscar pcdId se o tipo for PCD
    let pcdId = null;
    if (usuario.tipo === "PCD") {
      const pcd = await prisma.pcd.findUnique({
        where: { usuarioId: usuario.id },
      });
      pcdId = pcd?.id ?? null;
    }

    const token = jwt.sign(
      { id: usuario.id, tipo: usuario.tipo, email: usuario.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.json({
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        tipo: usuario.tipo,
        empresaId: usuario.empresaId,
        pcdId,
      },
      token,
    });
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: (error as Error).message });
  }
}
