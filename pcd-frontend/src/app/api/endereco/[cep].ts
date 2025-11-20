import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { cep } = req.query;
  if (!cep || typeof cep !== "string" || cep.length !== 8) {
    return res.status(400).json({ error: "CEP inválido" });
  }
  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const data = await response.json();
    if (data.erro) {
      return res.status(404).json({ error: "CEP não encontrado" });
    }
    res.status(200).json({
      rua: data.logradouro,
      bairro: data.bairro,
      cidade: data.localidade,
      estado: data.uf,
      cep: data.cep,
      complemento: data.complemento,
    });
  } catch (err: any) {
    res.status(500).json({ error: "Erro ao buscar CEP", details: err.message });
  }
}
