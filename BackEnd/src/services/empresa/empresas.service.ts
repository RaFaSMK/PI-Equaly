import { EmpresasRepo } from "../../repositories/empresa/empresa.repo";
import { hash } from "bcryptjs"; // se estiver usando autenticação
import { UsuariosRepo } from "../../repositories/usuario/usuario.repo"; // exemplo de repositório do responsável

export const EmpresasService = {
  async criarEmpresa(dados: {
    razaoSocial: string;
    nomeFantasia: string;
    cnpj: string;
    inscricaoEstadual?: string;
    porteEmpresa: string;
    setorAtuacao: string;
    sobre: string;
    site?: string;
    cep: string;
    estado: string;
    cidade: string;
    endereco: string;
    numero: string;
    bairro: string;
    complemento?: string;
    responsavel: {
      nomeCompleto: string;
      cargo: string;
      cpf: string;
      telefone: string;
      email: string;
      senha: string;
      confirmarSenha: string;
    };
  }) {
    // === Validações ===
    if (!dados.razaoSocial?.trim()) throw new Error("Razão Social é obrigatória");
    if (!dados.nomeFantasia?.trim()) throw new Error("Nome Fantasia é obrigatório");
    if (!dados.cnpj?.trim()) throw new Error("CNPJ é obrigatório");

    // CNPJ duplicado
    const existeCnpj = await EmpresasRepo.findByCnpj(dados.cnpj);
    if (existeCnpj) throw new Error("CNPJ já cadastrado");

    // Senha
    if (dados.responsavel.senha !== dados.responsavel.confirmarSenha) {
      throw new Error("As senhas não coincidem");
    }

    // === Criação ===
    const senhaHash = await hash(dados.responsavel.senha, 10);

    // Cria empresa
    const empresa = await EmpresasRepo.create({
      razaoSocial: dados.razaoSocial.trim(),
      nomeFantasia: dados.nomeFantasia.trim(),
      cnpj: dados.cnpj.trim(),
      inscricaoEstadual: dados.inscricaoEstadual?.trim() || null,
      porteEmpresa: dados.porteEmpresa,
      setorAtuacao: dados.setorAtuacao,
      sobre: dados.sobre,
      site: dados.site?.trim() || null,
      cep: dados.cep,
      estado: dados.estado,
      cidade: dados.cidade,
      endereco: dados.endereco,
      numero: dados.numero,
      bairro: dados.bairro,
      complemento: dados.complemento || null,
    });

    // Cria responsável vinculado à empresa
    const responsavel = await UsuariosRepo.create({
      nome: dados.responsavel.nomeCompleto.trim(),
      cargo: dados.responsavel.cargo.trim(),
      cpf: dados.responsavel.cpf.trim(),
      telefone: dados.responsavel.telefone.trim(),
      email: dados.responsavel.email.trim(),
      senha: senhaHash,
      empresaId: empresa.id,
      tipo: "responsavel_empresa",
    });

    return {
      mensagem: "Empresa cadastrada com sucesso",
      empresa,
      responsavel,
    };
  },
};
