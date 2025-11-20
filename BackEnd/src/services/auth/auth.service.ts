import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UsuariosRepo } from "../../repositories/usuario/usuario.repo";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

export const AuthService = {
  async loginEmpresa(email: string, senha: string) {
    const user = await UsuariosRepo.findByEmail(email);
    if (!user || user.tipo !== "responsavel_empresa") return null;

    const match = await bcrypt.compare(senha, user.senha);
    if (!match) return null;

    const token = jwt.sign({ id: user.id, empresaId: user.empresaId, role: "empresa" }, JWT_SECRET, {
      expiresIn: "7d",
    });

    return {
      token,
      user: {
        id: user.id,
        nome: user.nome,
        cargo: user.cargo,
        email: user.email,
        empresaId: user.empresaId,
      },
    };
  },
};
