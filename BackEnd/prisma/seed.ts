import { prisma } from "../prisma/client";
import bcrypt from "bcryptjs";

async function main() {
  // Reset completo (somente DEV)
  // Ordem importa por conta de FKs
  await prisma.vinculo.deleteMany();
  await prisma.vagaAcessibilidade.deleteMany();
  await prisma.vagaSubtipo.deleteMany();
  await prisma.candidatura.deleteMany();
  await prisma.pcdBarreira.deleteMany();
  await prisma.pcdSubtipo.deleteMany();
  await prisma.vaga.deleteMany();
  await prisma.empresa.updateMany({ data: { responsavelId: null } });
  await prisma.pcd.deleteMany();
  await prisma.endereco.deleteMany();
  await prisma.usuario.deleteMany();
  await prisma.subtipoBarreira.deleteMany();
  await prisma.barreiraAcessibilidade.deleteMany();
  await prisma.acessibilidade.deleteMany();
  await prisma.barreira.deleteMany();
  await prisma.subtipoDeficiencia.deleteMany();
  await prisma.tipoDeficiencia.deleteMany();

  // Tipos de deficiência
  const [motora, auditiva, visual, intelectual, psicossocial] =
    await prisma.$transaction([
      prisma.tipoDeficiencia.create({ data: { nome: "Deficiência Motora" } }),
      prisma.tipoDeficiencia.create({ data: { nome: "Deficiência Auditiva" } }),
      prisma.tipoDeficiencia.create({ data: { nome: "Deficiência Visual" } }),
      prisma.tipoDeficiencia.create({
        data: { nome: "Deficiência Intelectual" },
      }),
      prisma.tipoDeficiencia.create({
        data: { nome: "Deficiência Psicossocial" },
      }),
    ]);

  // Subtipos
  const [
    sub_motora1,
    sub_motora2,
    sub_auditiva1,
    sub_auditiva2,
    sub_visual1,
    sub_visual2,
    sub_intelectual1,
    sub_psico1,
  ] = await prisma.$transaction([
    prisma.subtipoDeficiencia.create({
      data: { nome: "Amputação MIE com muleta", tipoId: motora.id },
    }),
    prisma.subtipoDeficiencia.create({
      data: { nome: "Usuário de cadeira de rodas", tipoId: motora.id },
    }),
    prisma.subtipoDeficiencia.create({
      data: { nome: "Usuário de Libras", tipoId: auditiva.id },
    }),
    prisma.subtipoDeficiencia.create({
      data: { nome: "Perda auditiva moderada", tipoId: auditiva.id },
    }),
    prisma.subtipoDeficiencia.create({
      data: { nome: "Baixa visão", tipoId: visual.id },
    }),
    prisma.subtipoDeficiencia.create({
      data: { nome: "Cegueira", tipoId: visual.id },
    }),
    prisma.subtipoDeficiencia.create({
      data: { nome: "Deficiência Intelectual Leve", tipoId: intelectual.id },
    }),
    prisma.subtipoDeficiencia.create({
      data: { nome: "Transtorno do Espectro Autista", tipoId: psicossocial.id },
    }),
  ]);

  // Barreiras
  const [
    escadas,
    degrausAltos,
    pisoIrregular,
    faltaInterprete,
    comunicacaoOral,
    faltaContraste,
    faltaSinalizacaoTatil,
    linguagemComplexa,
    ruídoElevado,
  ] = await prisma.$transaction([
    prisma.barreira.create({ data: { descricao: "Escadas" } }),
    prisma.barreira.create({ data: { descricao: "Degraus altos" } }),
    prisma.barreira.create({ data: { descricao: "Piso irregular" } }),
    prisma.barreira.create({
      data: { descricao: "Ausência de intérprete de Libras" },
    }),
    prisma.barreira.create({
      data: { descricao: "Dificuldade de comunicação oral" },
    }),
    prisma.barreira.create({
      data: { descricao: "Falta de contraste visual" },
    }),
    prisma.barreira.create({
      data: { descricao: "Falta de sinalização tátil" },
    }),
    prisma.barreira.create({
      data: { descricao: "Linguagem técnica/complexa" },
    }),
    prisma.barreira.create({
      data: { descricao: "Ambiente com ruído elevado" },
    }),
  ]);

  // Acessibilidades
  const [
    rampa,
    pisoAntid,
    elevador,
    interprete,
    chatInterno,
    altoContraste,
    pisoGuia,
    linguagemSimples,
    salaSilenciosa,
    remoto,
    horarioFlex,
  ] = await prisma.$transaction([
    prisma.acessibilidade.create({
      data: { descricao: "Rampa com inclinação adequada" },
    }),
    prisma.acessibilidade.create({
      data: { descricao: "Piso antiderrapante" },
    }),
    prisma.acessibilidade.create({
      data: { descricao: "Elevador / acesso em nível" },
    }),
    prisma.acessibilidade.create({
      data: { descricao: "Intérprete de Libras" },
    }),
    prisma.acessibilidade.create({
      data: { descricao: "Comunicação por chat interno" },
    }),
    prisma.acessibilidade.create({
      data: { descricao: "Sinalização de alto contraste" },
    }),
    prisma.acessibilidade.create({
      data: { descricao: "Piso guia / sinalização tátil" },
    }),
    prisma.acessibilidade.create({ data: { descricao: "Linguagem simples" } }),
    prisma.acessibilidade.create({ data: { descricao: "Sala silenciosa" } }),
    prisma.acessibilidade.create({ data: { descricao: "Trabalho remoto" } }),
    prisma.acessibilidade.create({ data: { descricao: "Horário flexível" } }),
  ]);

  // Subtipo ↔ Barreiras (N:N)
  await prisma.subtipoBarreira.createMany({
    data: [
      { subtipoId: sub_motora1.id, barreiraId: escadas.id },
      { subtipoId: sub_motora1.id, barreiraId: degrausAltos.id },
      { subtipoId: sub_motora1.id, barreiraId: pisoIrregular.id },
      { subtipoId: sub_motora2.id, barreiraId: escadas.id },
      { subtipoId: sub_motora2.id, barreiraId: pisoIrregular.id },

      { subtipoId: sub_auditiva1.id, barreiraId: comunicacaoOral.id },
      { subtipoId: sub_auditiva1.id, barreiraId: faltaInterprete.id },
      { subtipoId: sub_auditiva2.id, barreiraId: comunicacaoOral.id },

      { subtipoId: sub_visual1.id, barreiraId: pisoIrregular.id },
      { subtipoId: sub_visual1.id, barreiraId: faltaContraste.id },
      { subtipoId: sub_visual1.id, barreiraId: faltaSinalizacaoTatil.id },
      { subtipoId: sub_visual2.id, barreiraId: faltaSinalizacaoTatil.id },

      { subtipoId: sub_intelectual1.id, barreiraId: linguagemComplexa.id },
      { subtipoId: sub_psico1.id, barreiraId: ruídoElevado.id },
    ],
    skipDuplicates: true,
  });

  // Barreira ↔ Acessibilidade (N:N)
  await prisma.barreiraAcessibilidade.createMany({
    data: [
      // Motora
      { barreiraId: escadas.id, acessibilidadeId: rampa.id },
      { barreiraId: escadas.id, acessibilidadeId: elevador.id },
      { barreiraId: degrausAltos.id, acessibilidadeId: rampa.id },
      { barreiraId: degrausAltos.id, acessibilidadeId: elevador.id },
      { barreiraId: pisoIrregular.id, acessibilidadeId: pisoAntid.id },

      // Auditiva
      { barreiraId: faltaInterprete.id, acessibilidadeId: interprete.id },
      { barreiraId: comunicacaoOral.id, acessibilidadeId: chatInterno.id },
      { barreiraId: comunicacaoOral.id, acessibilidadeId: linguagemSimples.id },

      // Visual
      { barreiraId: faltaContraste.id, acessibilidadeId: altoContraste.id },
      { barreiraId: faltaSinalizacaoTatil.id, acessibilidadeId: pisoGuia.id },

      // Intelectual e Psicossocial
      {
        barreiraId: linguagemComplexa.id,
        acessibilidadeId: linguagemSimples.id,
      },
      { barreiraId: ruídoElevado.id, acessibilidadeId: salaSilenciosa.id },
      { barreiraId: ruídoElevado.id, acessibilidadeId: remoto.id },
      { barreiraId: ruídoElevado.id, acessibilidadeId: horarioFlex.id },
    ],
    skipDuplicates: true,
  });

  // Empresas + Usuários (responsáveis)
  const empresas = await prisma.$transaction([
    prisma.empresa.create({
      data: {
        razaoSocial: "Tech Solutions Ltda",
        nomeFantasia: "TechSol",
        cnpj: "12345678000199",
        inscricaoEstadual: "123456789",
        porteEmpresa: "Média",
        setorAtuacao: "Tecnologia",
        sobre: "Soluções tecnológicas com foco em inclusão e acessibilidade.",
        site: "https://techsol.com.br",
        cep: "14400-000",
        estado: "SP",
        cidade: "Franca",
        endereco: "Rua Principal",
        numero: "100",
        bairro: "Centro",
        complemento: "Sala 10",
      },
    }),
    prisma.empresa.create({
      data: {
        razaoSocial: "Comércio Verde S.A.",
        nomeFantasia: "EcoMarket",
        cnpj: "22345678000155",
        porteEmpresa: "Grande",
        setorAtuacao: "Varejo",
        sobre: "Rede varejista com programas robustos de inclusão PCD.",
        site: "https://ecomarket.com",
        cep: "01000-000",
        estado: "SP",
        cidade: "São Paulo",
        endereco: "Av. Paulista",
        numero: "1500",
        bairro: "Bela Vista",
      },
    }),
    prisma.empresa.create({
      data: {
        razaoSocial: "Saúde Plena LTDA",
        nomeFantasia: "Plena Saúde",
        cnpj: "32345678000177",
        porteEmpresa: "Média",
        setorAtuacao: "Saúde",
        sobre: "Clínicas e operação hospitalar com ambientes acessíveis.",
        site: "https://plena-saude.com.br",
        cep: "30140-110",
        estado: "MG",
        cidade: "Belo Horizonte",
        endereco: "Rua da Bahia",
        numero: "250",
        bairro: "Funcionários",
      },
    }),
  ]);

  // Usuários responsáveis por empresas
  const senhaHash = await bcrypt.hash("senha123", 10);
  const [resp1, resp2, resp3] = await prisma.$transaction([
    prisma.usuario.create({
      data: {
        nome: "Marina Souza",
        cargo: "Tech Lead",
        cpf: "12345678901",
        telefone: "11999990001",
        email: "marina@techsol.com",
        senha: senhaHash,
        tipo: "EMPRESA",
        empresaId: empresas[0].id,
      },
    }),
    prisma.usuario.create({
      data: {
        nome: "Carlos Pereira",
        cargo: "Gerente de RH",
        cpf: "12345678902",
        telefone: "11999990002",
        email: "carlos@ecomarket.com",
        senha: senhaHash,
        tipo: "EMPRESA",
        empresaId: empresas[1].id,
      },
    }),
    prisma.usuario.create({
      data: {
        nome: "André Lima",
        cargo: "Coordenador",
        cpf: "12345678903",
        telefone: "31988887777",
        email: "andre@plena-saude.com.br",
        senha: senhaHash,
        tipo: "EMPRESA",
        empresaId: empresas[2].id,
      },
    }),
  ]);

  await prisma.$transaction([
    prisma.empresa.update({
      where: { id: empresas[0].id },
      data: { responsavelId: resp1.id },
    }),
    prisma.empresa.update({
      where: { id: empresas[1].id },
      data: { responsavelId: resp2.id },
    }),
    prisma.empresa.update({
      where: { id: empresas[2].id },
      data: { responsavelId: resp3.id },
    }),
  ]);

  // Vagas (diversas)
  const vagas = await prisma.$transaction([
    prisma.vaga.create({
      data: {
        empresaId: empresas[0].id,
        titulo: "Desenvolvedor Frontend",
        descricao: "Trabalhe com React/Next.js em projetos de acessibilidade.",
        escolaridade: "Ensino Superior Completo",
        metodoTrabalho: "Remoto",
        faixaSalarial: "R$ 6.000,00 - R$ 9.000,00",
      },
    }),
    prisma.vaga.create({
      data: {
        empresaId: empresas[0].id,
        titulo: "QA Engineer",
        descricao: "Garantir qualidade com foco em testes de acessibilidade.",
        escolaridade: "Ensino Superior Incompleto",
        metodoTrabalho: "Híbrido",
        faixaSalarial: "R$ 4.000,00 - R$ 6.000,00",
      },
    }),
    prisma.vaga.create({
      data: {
        empresaId: empresas[1].id,
        titulo: "Analista de Suporte",
        descricao:
          "Atendimento por chat e e-mail. Comunicação escrita predominante.",
        escolaridade: "Ensino Médio Completo",
        metodoTrabalho: "Presencial",
        faixaSalarial: "R$ 2.500,00 - R$ 3.500,00",
      },
    }),
    prisma.vaga.create({
      data: {
        empresaId: empresas[1].id,
        titulo: "Auxiliar Administrativo",
        descricao: "Atividades administrativas, documentação e cadastros.",
        escolaridade: "Ensino Médio Completo",
        metodoTrabalho: "Presencial",
        faixaSalarial: "R$ 2.000,00 - R$ 2.800,00",
      },
    }),
    prisma.vaga.create({
      data: {
        empresaId: empresas[2].id,
        titulo: "Recepcionista Clínica",
        descricao: "Recepção, orientação ao paciente e organização de agenda.",
        escolaridade: "Ensino Médio Completo",
        metodoTrabalho: "Presencial",
        faixaSalarial: "R$ 2.200,00 - R$ 3.000,00",
      },
    }),
    prisma.vaga.create({
      data: {
        empresaId: empresas[2].id,
        titulo: "Analista de Dados",
        descricao: "Análises e relatórios para área de gestão hospitalar.",
        escolaridade: "Ensino Superior Completo",
        metodoTrabalho: "Híbrido",
        faixaSalarial: "R$ 5.000,00 - R$ 7.500,00",
      },
    }),
  ]);

  // Vaga ↔ Subtipos aceitos
  await prisma.vagaSubtipo.createMany({
    data: [
      { vagaId: vagas[0].id, subtipoId: sub_motora1.id },
      { vagaId: vagas[0].id, subtipoId: sub_visual1.id },
      { vagaId: vagas[1].id, subtipoId: sub_motora2.id },
      { vagaId: vagas[2].id, subtipoId: sub_auditiva1.id },
      { vagaId: vagas[3].id, subtipoId: sub_intelectual1.id },
      { vagaId: vagas[4].id, subtipoId: sub_psico1.id },
      { vagaId: vagas[5].id, subtipoId: sub_visual2.id },
    ],
    skipDuplicates: true,
  });

  // Vaga ↔ Acessibilidades
  await prisma.vagaAcessibilidade.createMany({
    data: [
      { vagaId: vagas[0].id, acessibilidadeId: remoto.id },
      { vagaId: vagas[0].id, acessibilidadeId: horarioFlex.id },
      { vagaId: vagas[1].id, acessibilidadeId: salaSilenciosa.id },
      { vagaId: vagas[1].id, acessibilidadeId: linguagemSimples.id },
      { vagaId: vagas[2].id, acessibilidadeId: chatInterno.id },
      { vagaId: vagas[2].id, acessibilidadeId: interprete.id },
      { vagaId: vagas[3].id, acessibilidadeId: rampa.id },
      { vagaId: vagas[3].id, acessibilidadeId: elevador.id },
      { vagaId: vagas[4].id, acessibilidadeId: altoContraste.id },
      { vagaId: vagas[4].id, acessibilidadeId: pisoGuia.id },
      { vagaId: vagas[5].id, acessibilidadeId: remoto.id },
      { vagaId: vagas[5].id, acessibilidadeId: linguagemSimples.id },
    ],
    skipDuplicates: true,
  });

  // Vincular barreiras relevantes por vaga (para cálculo/visão)
  await prisma.vinculo.createMany({
    data: [
      { vagaId: vagas[0].id, barreiraId: ruídoElevado.id },
      { vagaId: vagas[1].id, barreiraId: linguagemComplexa.id },
      { vagaId: vagas[2].id, barreiraId: comunicacaoOral.id },
      { vagaId: vagas[3].id, barreiraId: escadas.id },
      { vagaId: vagas[4].id, barreiraId: faltaSinalizacaoTatil.id },
      { vagaId: vagas[5].id, barreiraId: faltaContraste.id },
    ],
    skipDuplicates: true,
  });

  // PCDs + Usuários + Endereços
  const enderecos = await prisma.$transaction([
    prisma.endereco.create({
      data: {
        rua: "Rua das Flores",
        numero: "10",
        bairro: "Jardins",
        cidade: "São Paulo",
        estado: "SP",
        cep: "01400-000",
      },
    }),
    prisma.endereco.create({
      data: {
        rua: "Av. Brasil",
        numero: "500",
        bairro: "Centro",
        cidade: "Franca",
        estado: "SP",
        cep: "14400-000",
      },
    }),
  ]);

  const pcds = await prisma.$transaction([
    prisma.pcd.create({
      data: {
        nome: "João Ribeiro",
        email: "joao.pcd@example.com",
        senha: await bcrypt.hash("senha123", 10),
        telefone: "11988887777",
        cpf: "11122233344",
        dataNasc: new Date("1992-05-10"),
        escolaridade: "Ensino Médio Completo",
        enderecoId: enderecos[0].id,
        aceitouTermos: true,
      },
    }),
    prisma.pcd.create({
      data: {
        nome: "Maria Alves",
        email: "maria.pcd@example.com",
        senha: await bcrypt.hash("senha123", 10),
        telefone: "11977776666",
        cpf: "55566677788",
        dataNasc: new Date("1988-11-22"),
        escolaridade: "Ensino Superior Completo",
        enderecoId: enderecos[1].id,
        aceitouTermos: true,
      },
    }),
  ]);

  // Subtipos/Barreiras dos PCDs
  await prisma.pcdSubtipo.createMany({
    data: [
      { pcdId: pcds[0].id, subtipoId: sub_motora2.id },
      { pcdId: pcds[1].id, subtipoId: sub_auditiva1.id },
    ],
    skipDuplicates: true,
  });
  await prisma.pcdBarreira.createMany({
    data: [
      { pcdId: pcds[0].id, barreiraId: escadas.id },
      { pcdId: pcds[1].id, barreiraId: comunicacaoOral.id },
    ],
    skipDuplicates: true,
  });

  // Usuários PCDs vinculados (para login unificado)
  const [userPcd1, userPcd2] = await prisma.$transaction([
    prisma.usuario.create({
      data: {
        nome: pcds[0].nome,
        cpf: "99988877766",
        telefone: pcds[0].telefone,
        email: pcds[0].email,
        senha: await bcrypt.hash("senha123", 10),
        tipo: "PCD",
      },
    }),
    prisma.usuario.create({
      data: {
        nome: pcds[1].nome,
        cpf: "99988877755",
        telefone: pcds[1].telefone,
        email: pcds[1].email,
        senha: await bcrypt.hash("senha123", 10),
        tipo: "PCD",
      },
    }),
  ]);
  await prisma.$transaction([
    prisma.pcd.update({
      where: { id: pcds[0].id },
      data: { usuarioId: userPcd1.id },
    }),
    prisma.pcd.update({
      where: { id: pcds[1].id },
      data: { usuarioId: userPcd2.id },
    }),
  ]);

  // Candidaturas
  await prisma.candidatura.createMany({
    data: [
      { vagaId: vagas[0].id, pcdId: pcds[0].id, status: "ENVIADA" },
      { vagaId: vagas[2].id, pcdId: pcds[1].id, status: "ACEITA" },
      { vagaId: vagas[3].id, pcdId: pcds[1].id, status: "REJEITADA" },
    ],
  });

  console.log("Seed concluído ✅");
  console.log(`Empresas: ${empresas.length}`);
  console.log(`Vagas: ${vagas.length}`);
  console.log(`PCDs: ${pcds.length}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => prisma.$disconnect());
