<h1 align="center">Commit Generator</h1>

> Gere commits com IA

<p align="center">
  <img src="../../static/demo.gif">
</p>

<p align="center">
  <a href="../../../README.md">English</a>
  | 
  Português
</p>

**Commit Generator** é uma ferramenta que utiliza IA para gerar automaticamente mensagens de commit com base nas alterações no seu código.

## 📌 Sumário
- [🔹 O Que é o Gerador de Commits?](#-o-que-é-o-gerador-de-commits)
- [🚀 Começando](#-começando)
- [⚙️ Funcionalidades](#️-funcionalidades)
- [📂 Estrutura do Projeto](#-estrutura-do-projeto)
- [📜 Licença](#-licença)

## 🔹 O que é o Gerador de Commits?

Escrever mensagens de commit significativas pode ser tedioso, e mensagens inconsistentes tornam o histórico de versões difícil de navegar.  

**Gerador de Commits** elimina essa dificuldade ao analisar suas mudanças de código e gerar **mensagens de commit claras, estruturadas e relevantes** automaticamente.  

## 🚀 Começando

Atualmente, o **Commit Generator** ainda não está disponível como um pacote NPM, então requer instalação manual.  
A principal forma de interação com ele é por meio da **CLI**.

### 📋 Requisitos

Antes de instalar, certifique-se de que você possui as seguintes dependências:
- [Node.js](https://nodejs.org/en) (Necessário para rodar a CLI) 
- [pnpm](https://pnpm.io/) (Usado para gerenciar workspaces de monorepo) 
- [Git](https://git-scm.com/) (Usado para gerenciamento de repositórios)  

### 🔧 Instalação

Siga os passos abaixo para instalar e configurar o **Commit Generator**:

1. Clone o repositório
```bash
git clone https://github.com/JulioC090/commit-generator.git
cd commit-generator
```

2. Certifique-se de que o [pnpm](https://pnpm.io/) está instalado
```bash
npm install --global pnpm
pnpm --version
```

3. Instale as dependências
```bash
pnpm install
```

4. Compile o projeto
```bash
pnpm build
```

5. Navegue até o pacote da CLI
```bash
cd ./projects/cli
```

6. Crie um link simbólico global
```bash
npm link
```

7. Inicialize a configuração da IA
```bash
commitgen config init
```

### 🎯 Uso

Após a instalação, siga esses passos para gerar mensagens de commit usando IA.

1. Adicione seus arquivos modificados ao staging
```bash
git add .
```

2. Gere uma mensagem de commit
```bash
commitgen
```

🎉 Pronto! O Gerador de Commits irá analisar suas mudanças no staging e sugerir uma mensagem de commit significativa.

Para mais detalhes, consulte a [documentação da CLI ](../../../projects/cli).

## Funcionalidades

✅ **Geração de mensagens de commit com IA** – Usa IA para analisar mudanças no código e gerar mensagens de commit significativas.

✅ **Integração sem falhas com Git** – Analisa diffs do Git e arquivos em staging para sugestões precisas de commits.

✅ **Tipos de commit padronizados** – Suporta `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `style`, `build`, `ci`, `perf`, e `revert`.

✅ **Commits com contexto** – Adiciona contexto extra (por exemplo, números de issue, escopo ou detalhes adicionais) para mais clareza.

✅ **Commits automáticos** – Use `--force`  para realizar commits instantâneos sem confirmação manual.

✅ **Edição e gerenciamento de histórico de commits** – Modifique, emende e valide mensagens de commit facilmente com comandos como `commitgen edit`, `commitgen amend` e `commitgen validate`.

✅ **Validação de mensagens de commit** – Garante que as mensagens sigam as melhores práticas e fornece recomendações.

✅ **Provedor de IA configurável** – Personalize as configurações da IA via `commitgen config`, com opções para definir, remover e listar configurações.

## 📂 Estrutura do Projeto

```
commit-generator/
│── docs/                   # Arquivos de documentação
│── packages/
│   ├── git/                # Integração com Git
│   ├── ai-models/          # Gerencia interações com modelos de IA
│   ├── prompt-parser/      # Converte templates de texto em prompts estruturados
│   ├── commit-history/     # Registra mensagens de commit geradas anteriormente
│   ├── config/             # Gerenciador de configurações
│   ├── eslint-config/      # Configurações do ESLint pré-configuradas
│   ├── typescript-config/  # Configurações do TypeScript
│── projects
│   ├── core/               # Lógica principal para geração de commits
│   ├── cli/                # Interface CLI para o gerador de commits
│── .gitignore
│── package.json
│── README.md
```

Cada pacote é documentado separadamente. Veja:
- [Core](../../../projects/core)
- [Cli](../../../projects/cli)
- [Git](../../../packages/git)
- [AI Models](../../../packages/ai-models/)
- [Prompt Parser](../../../packages/prompt-parser/)
- [Commit History](../../../packages/commit-history)
- [Config Manager](../../../packages/config)

## 📜 Licença

O Gerador de Commits é um projeto open-source e está licenciado sob a Licença MIT.
Fique à vontade para usar, modificar e contribuir!