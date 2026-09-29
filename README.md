# MassPay

Dashboard de uma fintech fictícia que desenvolvi no Challenge da FIAP, durante o curso de Análise e Desenvolvimento de Sistemas.

**Acesse:** https://gabrielmassimini.github.io/Projeto-Fintech-FIAP/

![Dashboard MassPay no desktop](docs/dashboard-desktop.jpg)

## Sobre o projeto

A proposta do Challenge era criar a interface de uma fintech. Nesta primeira fase fiz o dashboard principal, com resumo da conta, gráfico de fluxo de caixa, distribuição de gastos por categoria, transações recentes, cartão e limites da conta. Os valores são fictícios, porque o projeto ainda não tem backend.

No celular, a barra lateral vira um menu que abre pelo botão ☰.

<img src="docs/dashboard-mobile.jpg" alt="Dashboard MassPay no celular" width="260">

Também modelei em Java as entidades do sistema (`Usuario`, `Conta`, `Cartao`, `Transacao`, `Investimento` e `Emprestimo`). Elas vão servir de base para o backend nas próximas etapas.

## Tecnologias

- HTML e CSS (variáveis, Grid, Flexbox e media queries)
- Tailwind CSS
- JavaScript
- Chart.js para os gráficos e Lucide para os ícones
- Java

## Como rodar

Não precisa instalar nada. É só clonar o repositório e abrir o `index.html` no navegador (ou usar o Live Server do VS Code).

```bash
git clone https://github.com/GabrielMassimini/Projeto-Fintech-FIAP.git
```

## O que aprendi

- Montar um layout de dashboard responsivo com Grid e Flexbox e transformar a barra lateral em menu no celular.
- Criar gráficos de linha e de rosca com o Chart.js.
- Organizar o CSS com variáveis para manter as cores e os espaçamentos consistentes.
- Modelar entidades com orientação a objetos em Java (encapsulamento, construtores, getters e setters).
- Publicar o site no GitHub Pages. Aqui tive um problema: meus caminhos começavam com `/` (por exemplo, `/css/style.css`). Isso funcionava no meu computador, mas no GitHub Pages o site fica dentro de uma subpasta, e o CSS e o JavaScript não carregavam. Nessa etapa de revisão e publicação usei o Claude (IA) como mentor. Com ele entendi a diferença entre caminhos absolutos e relativos, reorganizei os arquivos e tirei o JavaScript de dentro do HTML.

## Próximos passos

- Backend em Java com banco de dados
- Dados dinâmicos no dashboard
- Demais telas do menu, login e cadastro

## Contato

Gabriel Massimini · [GitHub](https://github.com/GabrielMassimini) · [LinkedIn](https://www.linkedin.com/in/gabriel-massimini-junqueira/)
