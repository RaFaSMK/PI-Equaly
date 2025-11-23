import { NextRequest, NextResponse } from "next/server";

interface ViaCepResponse {
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  cep: string;
  complemento: string;
  erro?: boolean;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ cep: string }> }
) {
  const { cep } = await params;

  if (!cep || cep.length !== 8) {
    return NextResponse.json({ error: "CEP inválido" }, { status: 400 });
  }

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const data: ViaCepResponse = await response.json();

    if (data.erro) {
      return NextResponse.json(
        { error: "CEP não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      rua: data.logradouro,
      bairro: data.bairro,
      cidade: data.localidade,
      estado: data.uf,
      cep: data.cep,
      complemento: data.complemento,
    });
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: "Erro ao buscar CEP", details: errorMsg },
      { status: 500 }
    );
  }
}
