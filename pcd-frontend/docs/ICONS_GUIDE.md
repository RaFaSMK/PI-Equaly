# Guia de Ícones - Lucide React

## Biblioteca Padrão

Todos os ícones do projeto agora usam **[Lucide React](https://lucide.dev/)** para consistência visual e acessibilidade.

## Como Usar

### 1. Importar ícones

```tsx
import { Check, X, ChevronDown, User, FileText, Search } from "lucide-react";
```

### 2. Usar no componente

```tsx
<Check className="w-4 h-4 text-green-600" aria-hidden />
<Search className="w-5 h-5" aria-hidden />
```

### 3. Propriedades principais

- **size**: número (ex: `size={20}`)
- **className**: string (Tailwind)
- **strokeWidth**: número (espessura, padrão 2)
- **aria-hidden**: sempre adicionar para ícones decorativos

## Ícones Principais do Projeto

### Navegação e UI

- `ChevronDown` - dropdown, expand/collapse
- `X` - fechar modais/dialogs
- `Menu` - menu hamburguer

### Usuário

- `User` - perfil
- `LogOut` - sair
- `Settings` - configurações
- `Pencil` - editar

### Documentos

- `FileText` - documentos, currículos, inscrições
- `File` - arquivo genérico

### Localização e Tempo

- `MapPin` - localização
- `CalendarDays` - datas

### Ações

- `Search` - busca
- `Check` - confirmação, sucesso, acessibilidades
- `Trash2` - deletar
- `Plus` - adicionar

### Acessibilidade (sugestão futura)

- `Accessibility` - ícone genérico de acessibilidade
- `Eye` - visual
- `Ear` - auditiva

## Exemplos Práticos

### Badge de Acessibilidade

```tsx
<span className="inline-flex items-center gap-1.5 px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full">
  <Check className="w-4 h-4" aria-hidden />
  Intérprete de Libras
</span>
```

### Dropdown de Usuário

```tsx
<button onClick={toggleDropdown}>
  <User className="w-4 h-4" aria-hidden />
  <ChevronDown
    className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
  />
</button>
```

### Link com Ícone

```tsx
<Link href="/vagas" className="flex items-center gap-2">
  <Search className="w-5 h-5" aria-hidden />
  Buscar Vagas
</Link>
```

## Tamanhos Comuns

- **w-3 h-3** (12px): micro, badges
- **w-4 h-4** (16px): inline, menu dropdown
- **w-5 h-5** (20px): botões, cards
- **w-6 h-6** (24px): navbar, títulos
- **w-8 h-8+** (32px+): hero, estados vazios

## Acessibilidade

Sempre use `aria-hidden` para ícones decorativos. Se o ícone transmite informação importante:

```tsx
<Check className="w-4 h-4" aria-label="Item selecionado" role="img" />
```

## Cores Principais do Projeto

- **Primary**: `text-[#755fe3]`
- **Success/Check**: `text-green-600`
- **Error/Delete**: `text-red-600`
- **Neutral**: `text-zinc-600`
- **Muted**: `text-zinc-400`

## Migração de SVG Customizado

Antes:

```tsx
<svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
  <path d="M20 6 9 17l-5-5" />
</svg>
```

Depois:

```tsx
import { Check } from "lucide-react";
<Check className="w-4 h-4" />;
```

## Referência Completa

Explore todos os ícones disponíveis em: [https://lucide.dev/icons](https://lucide.dev/icons)
