import { hash } from "bcryptjs";
import { PcdRepository } from "../../repositories/pcd/pcd.repo";
import { UsuariosRepo } from "../../repositories/usuario/usuario.repo";

type CreatePcdDTO = {
  nomeCompleto: string;
  cpf: string;
  email: string;
  telefone: string;
  dataNasc: string;
  escolaridade?: string;
  endereco: {
    cep: string;
    estado: string;
    cidade: string;
    endereco: string;
    numero: string;
    bairro: string;
    complemento?: string;
  };
  senha: string;
  confirmarSenha: string;
  curriculoUrl?: string;
  subtipoIds?: number[];
};

const PcdService = {
  async listarTodos() {
    return PcdRepository.findAll();
  },

  async criarPcd(dados: CreatePcdDTO) {
    if (!dados.nomeCompleto?.trim())
      throw new Error("Nome completo é obrigatório");
    if (!dados.cpf?.trim()) throw new Error("CPF é obrigatório");
    if (!dados.email?.trim()) throw new Error("E-mail é obrigatório");
    if (!dados.telefone?.trim()) throw new Error("Telefone é obrigatório");
    if (!dados.dataNasc) throw new Error("Data de nascimento é obrigatória");
    if (!dados.senha) throw new Error("Senha é obrigatória");
    if (dados.senha !== dados.confirmarSenha)
      throw new Error("As senhas não coincidem");

    const existePcdCpf = await PcdRepository.findByCpf(dados.cpf);
    if (existePcdCpf) throw new Error("CPF já cadastrado");

    const existePcdEmail = await PcdRepository.findByEmail(dados.email);
    if (existePcdEmail) throw new Error("E-mail já cadastrado");

    const existeUsuarioEmail = await UsuariosRepo.findByEmail(dados.email);
    if (existeUsuarioEmail)
      throw new Error("E-mail já cadastrado como usuário");

    const existeUsuarioCpf = await UsuariosRepo.findByCpf(dados.cpf);
    if (existeUsuarioCpf) throw new Error("CPF já cadastrado como usuário");

    const endereco = await PcdRepository.createEndereco({
      rua: dados.endereco.endereco,
      numero: dados.endereco.numero,
      bairro: dados.endereco.bairro,
      cidade: dados.endereco.cidade,
      estado: dados.endereco.estado,
      cep: dados.endereco.cep,
      complemento: dados.endereco.complemento ?? undefined,
    });

    const senhaHash = await hash(dados.senha, 10);

    const pcd = await PcdRepository.createPcd({
      nome: dados.nomeCompleto.trim(),
      email: dados.email.trim(),
      senha: senhaHash,
      telefone: dados.telefone.trim(),
      cpf: dados.cpf.trim(),
      dataNasc: new Date(dados.dataNasc),
      escolaridade: dados.escolaridade ?? null,
      enderecoId: endereco.id,
      curriculoUrl: dados.curriculoUrl ?? null,
    });

    const usuario = await UsuariosRepo.create({
      nome: dados.nomeCompleto.trim(),
      cargo: "",
      cpf: dados.cpf.trim(),
      telefone: dados.telefone.trim(),
      email: dados.email.trim(),
      senha: senhaHash,
      tipo: "PCD",
      pcdid: pcd.id,
      empresaId: null,
    });

    // Atualizar o PCD com o usuarioId
    await PcdRepository.update(pcd.id, { usuarioId: usuario.id });

    return {
      mensagem: "Cadastro realizado com sucesso",
      pcd,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        cpf: usuario.cpf,
        telefone: usuario.telefone,
        tipo: usuario.tipo,
        createdAt: usuario.createdAt,
      },
    };
  },

  async buscarPorId(id: number) {
    return PcdRepository.findById(id);
  },

  async buscarPorUsuarioId(usuarioId: number) {
    return PcdRepository.findByUsuarioId(usuarioId);
  },

  async atualizarCurriculo(id: number, url: string) {
    return PcdRepository.update(id, { curriculoUrl: url });
  },
};

export default PcdService;
