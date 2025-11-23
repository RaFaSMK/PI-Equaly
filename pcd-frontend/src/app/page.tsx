import Link from "next/link";
import Image from "next/image";
import {
  CheckCircle2,
  Grid3x3,
  Plus,
  Star,
  FileText,
  ArrowRight,
} from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col gap-16 sm:gap-20">
      {/* Hero aprimorado */}
      <section className="relative overflow-hidden rounded-2xl bg-linear-to-br from-[#755fe3] via-[#7f6df0] to-[#a08cf7] px-6 py-16 sm:py-20 text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 -left-16 h-64 w-64 rounded-full bg-white/10 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-black/10 blur-3xl"
        />

        <div className="relative mx-auto max-w-6xl">
          <div className="mx-auto max-w-3xl text-center">
            <Image
              src="/icon.svg"
              alt="Logo EQualy"
              width={56}
              height={56}
              className="mx-auto mb-4 h-14 w-14 brightness-0 invert"
              priority
            />
            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium ring-1 ring-inset ring-white/30">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-300" />
              Empregabilidade sem barreiras
            </p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
              O seu talento merece oportunidades acessíveis
            </h1>
            <p className="mt-4 text-lg text-white/90">
              A EQualy conecta pessoas com deficiência a vagas inclusivas e
              empresas comprometidas com a diversidade.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/vagas"
                className="w-full rounded-md border border-white bg-[#755fe3] px-5 py-3 text-center font-semibold text-white transition-colors hover:bg-white hover:text-[#755fe3] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#755fe3] sm:w-auto"
              >
                Explorar vagas acessíveis
              </Link>
              <Link
                href="/login/empresa"
                className="w-full rounded-md border border-white bg-transparent px-5 py-3 text-center font-semibold text-white transition-colors hover:bg-white hover:text-[#755fe3] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#755fe3] sm:w-auto"
              >
                Sou empresa
              </Link>
            </div>
          </div>

          {/* Destaques rápidos */}
          <div className="mt-10 grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
            <div className="rounded-lg bg-white/10 px-4 py-3 backdrop-blur ring-1 ring-inset ring-white/20">
              <p className="font-semibold">Acessibilidade de verdade</p>
              <p className="text-white/80">
                Navegação simples, leitura ajustável e foco na inclusão.
              </p>
            </div>
            <div className="rounded-lg bg-white/10 px-4 py-3 backdrop-blur ring-1 ring-inset ring-white/20">
              <p className="font-semibold">Para pessoas e empresas</p>
              <p className="text-white/80">
                Conecte talentos PCD a ambientes de trabalho inclusivos.
              </p>
            </div>
            <div className="rounded-lg bg-white/10 px-4 py-3 backdrop-blur ring-1 ring-inset ring-white/20">
              <p className="font-semibold">Sem complicação</p>
              <p className="text-white/80">
                Cadastre-se e comece a participar das oportunidades.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section aria-labelledby="beneficios-title">
        <h2
          id="beneficios-title"
          className="mb-6 text-center text-2xl font-semibold text-zinc-900"
        >
          Por que usar a EQualy?
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border border-zinc-200 bg-white p-5">
            <div className="mb-2 flex items-center gap-2 text-[#755fe3]">
              <CheckCircle2 className="w-5 h-5" aria-hidden />
              <h3 className="text-base font-semibold text-zinc-900">
                Inclusão real
              </h3>
            </div>
            <p className="text-sm text-zinc-600">
              Vagas com requisitos claros e informações de acessibilidade.
            </p>
          </div>

          <div className="rounded-lg border border-zinc-200 bg-white p-5">
            <div className="mb-2 flex items-center gap-2 text-[#755fe3]">
              <Grid3x3 className="w-5 h-5" aria-hidden />
              <h3 className="text-base font-semibold text-zinc-900">
                Experiência simples
              </h3>
            </div>
            <p className="text-sm text-zinc-600">
              Fluxo pensado para facilitar candidatura e gestão de vagas.
            </p>
          </div>

          <div className="rounded-lg border border-zinc-200 bg-white p-5">
            <div className="mb-2 flex items-center gap-2 text-[#755fe3]">
              <Plus className="w-5 h-5" aria-hidden />
              <h3 className="text-base font-semibold text-zinc-900">
                Crescimento
              </h3>
            </div>
            <p className="text-sm text-zinc-600">
              Conecte-se a empresas dispostas a desenvolver talentos PCD.
            </p>
          </div>

          <div className="rounded-lg border border-zinc-200 bg-white p-5">
            <div className="mb-2 flex items-center gap-2 text-[#755fe3]">
              <Star className="w-5 h-5" aria-hidden />
              <h3 className="text-base font-semibold text-zinc-900">
                Qualidade nas vagas
              </h3>
            </div>
            <p className="text-sm text-zinc-600">
              Oportunidades com foco em potencial e compatibilidade.
            </p>
          </div>

          <div className="rounded-lg border border-zinc-200 bg-white p-5">
            <div className="mb-2 flex items-center gap-2 text-[#755fe3]">
              <FileText className="w-5 h-5" aria-hidden />
              <h3 className="text-base font-semibold text-zinc-900">
                Currículo inclusivo
              </h3>
            </div>
            <p className="text-sm text-zinc-600">
              Destaque habilidades, adaptações e preferências de trabalho.
            </p>
          </div>

          <div className="rounded-lg border border-zinc-200 bg-white p-5">
            <div className="mb-2 flex items-center gap-2 text-[#755fe3]">
              <ArrowRight className="w-5 h-5" aria-hidden />
              <h3 className="text-base font-semibold text-zinc-900">
                Comece hoje
              </h3>
            </div>
            <p className="text-sm text-zinc-600">
              Crie sua conta em minutos e participe das vagas.
            </p>
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section aria-labelledby="como-funciona-title">
        <h2
          id="como-funciona-title"
          className="mb-6 text-center text-2xl font-semibold text-zinc-900"
        >
          Como funciona
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-zinc-200 bg-white p-5">
            <p className="text-3xl font-extrabold text-[#755fe3]">1</p>
            <h3 className="mt-1 text-base font-semibold text-zinc-900">
              Crie sua conta
            </h3>
            <p className="mt-1 text-sm text-zinc-600">
              É rápido e gratuito para candidatos.
            </p>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-white p-5">
            <p className="text-3xl font-extrabold text-[#755fe3]">2</p>
            <h3 className="mt-1 text-base font-semibold text-zinc-900">
              Personalize seu perfil
            </h3>
            <p className="mt-1 text-sm text-zinc-600">
              Conte sobre suas habilidades e necessidades de acessibilidade.
            </p>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-white p-5">
            <p className="text-3xl font-extrabold text-[#755fe3]">3</p>
            <h3 className="mt-1 text-base font-semibold text-zinc-900">
              Participe das vagas
            </h3>
            <p className="mt-1 text-sm text-zinc-600">
              Acompanhe candidaturas e converse com empresas.
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/login"
            className="w-full rounded-md bg-[#755fe3] px-5 py-3 text-center font-semibold text-white hover:opacity-95 sm:w-auto"
          >
            Começar agora
          </Link>
          <Link
            href="/vagas"
            className="w-full rounded-md bg-white px-5 py-3 text-center font-semibold text-zinc-900 ring-1 ring-inset ring-zinc-200 hover:bg-zinc-50 sm:w-auto"
          >
            Ver vagas disponíveis
          </Link>
        </div>
      </section>

      {/* Depoimento */}
      <section
        aria-labelledby="depoimento-title"
        className="rounded-2xl bg-zinc-50 p-6 ring-1 ring-inset ring-zinc-200"
      >
        <h2 id="depoimento-title" className="sr-only">
          Depoimento
        </h2>
        <figure className="mx-auto max-w-3xl text-center">
          <blockquote className="text-lg text-zinc-700">
            “Com a EQualy eu encontrei vagas que realmente consideram minhas
            necessidades. O processo foi simples e humano.”
          </blockquote>
          <figcaption className="mt-3 text-sm text-zinc-500">
            Candidato da comunidade EQualy
          </figcaption>
        </figure>
      </section>
    </div>
  );
}
