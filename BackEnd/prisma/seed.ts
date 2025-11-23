import { prisma } from "../prisma/client";

async function main() {
  // limpa dados (apenas para desenvolvimento)
  await prisma.subtipoBarreira.deleteMany();
  await prisma.barreiraAcessibilidade.deleteMany();
  await prisma.acessibilidade.deleteMany();
  await prisma.barreira.deleteMany();
  await prisma.subtipoDeficiencia.deleteMany();
  await prisma.tipoDeficiencia.deleteMany();

  // Tipos
  const motora = await prisma.tipoDeficiencia.create({
    data: { nome: "Deficiência Motora" },
  });
  const auditiva = await prisma.tipoDeficiencia.create({
    data: { nome: "Deficiência Auditiva" },
  });
  const visual = await prisma.tipoDeficiencia.create({
    data: { nome: "Deficiência Visual" },
  });

  // Subtipos
  const sub_motora1 = await prisma.subtipoDeficiencia.create({
    data: { nome: "Amputação MIE com muleta", tipoId: motora.id },
  });
  const sub_auditiva1 = await prisma.subtipoDeficiencia.create({
    data: { nome: "Usuário de Libras", tipoId: auditiva.id },
  });
  const sub_visual1 = await prisma.subtipoDeficiencia.create({
    data: { nome: "Baixa visão", tipoId: visual.id },
  });

  // Barreiras
  const [
    escadas,
    degrausAltos,
    pisoIrregular,
    faltaInterprete,
    comunicacaoOral,
    faltaContraste,
    faltaSinalizacaoTatil,
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
  ]);

  // Subtipo ↔ Barreiras (N:N)
  await prisma.subtipoBarreira.createMany({
    data: [
      { subtipoId: sub_motora1.id, barreiraId: escadas.id },
      { subtipoId: sub_motora1.id, barreiraId: degrausAltos.id },
      { subtipoId: sub_motora1.id, barreiraId: pisoIrregular.id },

      { subtipoId: sub_auditiva1.id, barreiraId: comunicacaoOral.id },
      { subtipoId: sub_auditiva1.id, barreiraId: faltaInterprete.id },

      { subtipoId: sub_visual1.id, barreiraId: pisoIrregular.id },
      { subtipoId: sub_visual1.id, barreiraId: faltaContraste.id },
      { subtipoId: sub_visual1.id, barreiraId: faltaSinalizacaoTatil.id },
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

      // Visual
      { barreiraId: faltaContraste.id, acessibilidadeId: altoContraste.id },
      { barreiraId: faltaSinalizacaoTatil.id, acessibilidadeId: pisoGuia.id },
    ],
    skipDuplicates: true,
  });

  // Criar empresa de exemplo
  const empresaExemplo = await prisma.empresa.create({
    data: {
      razaoSocial: "Tech Solutions Ltda",
      nomeFantasia: "TechSol",
      cnpj: "12345678000199",
      inscricaoEstadual: "123456789",
      porteEmpresa: "Média",
      setorAtuacao: "Tecnologia",
      sobre: "Empresa de soluções tecnológicas focada em inclusão",
      site: "https://techsol.com.br",
      cep: "14400000",
      estado: "SP",
      cidade: "Franca",
      endereco: "Rua Principal",
      numero: "100",
      bairro: "Centro",
      complemento: "Sala 10",
    },
  });

  // Criar vagas de exemplo
  const vaga1 = await prisma.vaga.create({
    data: {
      empresaId: empresaExemplo.id,
      titulo: "Desenvolvedor Frontend",
      descricao:
        "Desenvolvedor React/Next.js para trabalhar em projetos inclusivos. Requisitos: conhecimento em TypeScript, React, Next.js. Oferecemos ambiente acessível e equipe diversa.",
      escolaridade: "Ensino Superior Completo",
    },
  });

  const vaga2 = await prisma.vaga.create({
    data: {
      empresaId: empresaExemplo.id,
      titulo: "Analista de Suporte",
      descricao:
        "Analista para atendimento ao cliente via chat e e-mail. Ambiente totalmente acessível com comunicação por texto.",
      escolaridade: "Ensino Médio Completo",
    },
  });

  // Associar subtipos aceitos às vagas
  await prisma.vagaSubtipo.createMany({
    data: [
      { vagaId: vaga1.id, subtipoId: sub_motora1.id },
      { vagaId: vaga1.id, subtipoId: sub_visual1.id },
      { vagaId: vaga2.id, subtipoId: sub_auditiva1.id },
    ],
    skipDuplicates: true,
  });

  // Associar acessibilidades às vagas
  await prisma.vagaAcessibilidade.createMany({
    data: [
      { vagaId: vaga1.id, acessibilidadeId: rampa.id },
      { vagaId: vaga1.id, acessibilidadeId: elevador.id },
      { vagaId: vaga2.id, acessibilidadeId: chatInterno.id },
    ],
    skipDuplicates: true,
  });

  console.log("Seed concluído ✅");
  console.log(`- ${empresaExemplo.nomeFantasia} criada`);
  console.log(`- ${2} vagas criadas`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => prisma.$disconnect());
