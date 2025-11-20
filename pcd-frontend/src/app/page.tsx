import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col gap-12">
      {/* Hero */}
      <section className="rounded-xl bg-[#755fe3] px-6 py-16 text-white">
        <div className="mx-auto max-w-3xl text-center">
          <Image
            src="/icon.svg"
            alt="Logo EQualy"
            width={48}
            height={48}
            className="mx-auto mb-4 h-12 w-12"
            priority
          />
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            EQualy
          </h1>
          <p className="mt-4 text-lg text-white/90">
            Plataforma acessível e inclusiva conectando talentos PCD às melhores
            oportunidades.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/cadastro/pcd"
              className="w-full rounded-md bg-white px-5 py-3 text-center text-[#755fe3] sm:w-auto"
            >
              Sou Candidato
            </Link>
            <Link
              href="/login?role=empresa"
              className="w-full rounded-md border border-white/80 px-5 py-3 text-center sm:w-auto"
            >
              Sou Empresa
            </Link>
          </div>
        </div>
      </section>

      {/* Por que escolher */}
      <section>
        <h2 className="mb-6 text-center text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
          Por que escolher a EQualy?
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-5">
            <h3 className="text-base font-medium text-zinc-900 dark:text-zinc-100">
              Inclusão Real
            </h3>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Conectamos empresas comprometidas com a diversidade a
              profissionais PCD qualificados.
            </p>
          </div>
          <div className="rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-5">
            <h3 className="text-base font-medium text-zinc-900 dark:text-zinc-100">
              Oportunidades Reais
            </h3>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Vagas exclusivas pensadas para valorizar o potencial de cada
              profissional.
            </p>
          </div>
          <div className="rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-5">
            <h3 className="text-base font-medium text-zinc-900 dark:text-zinc-100">
              Acessibilidade
            </h3>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Plataforma com foco em uma experiência simples e acessível para
              todos.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
