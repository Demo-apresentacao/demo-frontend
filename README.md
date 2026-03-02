# Demo Front - Plataforma de Gestão de Serviços Automotivos

Uma aplicação web moderna para gerenciamento de serviços automotivos, desenvolvida com as mais recentes tecnologias do ecossistema React.

## 🌐 Acesso à Aplicação

A aplicação está disponível para acesso na web em:

**[https://demo-apresentacao.vercel.app](https://demo-apresentacao.vercel.app)**

---

## 📋 Descrição do Projeto

Urban Front é uma plataforma completa de gestão para serviços automotivos que oferece:

- **Autenticação e Autorização**: Sistema seguro de login, registro e recuperação de senha
- **Dashboard Personalizado**: Painéis específicos para administradores e usuários
- **Gestão de Agendamentos**: Calendário interativo para marcar e gerenciar serviços
- **Catálogo de Serviços**: Exibição de serviços disponíveis com carrossel interativo
- **Gestão de Veículos**: Registro e histórico de veículos dos usuários
- **Análise e Relatórios**: Gráficos e estatísticas em tempo real
- **Interface Responsiva**: Totalmente otimizada para dispositivos móveis e desktop

---

## 🛠️ Ferramentas e Bibliotecas Utilizadas

### Core Framework
- **[Next.js 16.1.6](https://nextjs.org)** - Framework React com renderização no servidor e otimizações
- **[React 19.2.4](https://react.dev)** - Biblioteca para construção de interfaces com componentes
- **[React DOM 19.2.4](https://react.dev)** - Integração do React com o DOM

### Utilitários e Ferramentas
- **[Axios 1.13.2](https://axios-http.com)** - Cliente HTTP para requisições à API
- **[bcrypt 6.0.0](https://www.npmjs.com/package/bcrypt)** - Criptografia de senhas
- **[date-fns 4.1.0](https://date-fns.org)** - Manipulação e formatação de datas
- **[js-cookie 3.0.5](https://github.com/js-cookie/js-cookie)** - Gerenciamento de cookies

### Componentes e UI
- **[Lucide React 0.562.0](https://lucide.dev)** - Ícones vetoriais de alta qualidade
- **[Embla Carousel 8.6.0](https://www.embla-carousel.com)** - Carrossel responsivo e acessível
- **[React Big Calendar 1.19.4](https://jquense.github.io/react-big-calendar)** - Calendário interativo para agendamentos

### Validação e Máscaras
- **[react-imask 7.6.1](https://imask.js.org)** - Máscaras de entrada para formulários
- **[inputmask 5.0.9](https://github.com/RobinHerbots/Inputmask)** - Validação de máscaras de input

### Gráficos e Visualizações
- **[Recharts 3.6.0](https://recharts.org)** - Biblioteca de gráficos baseada em React

### Notificações e Alertas
- **[SweetAlert2 11.26.16](https://sweetalert2.github.io)** - Alertas e modais elegantes

### Desenvolvimento
- **[ESLint 9](https://eslint.org)** - Ferramenta de linting para qualidade de código
- **[ESLint Config Next 16.1.0](https://nextjs.org)** - Configuração ESLint otimizada para Next.js

---

## 🚀 Como Funciona

A aplicação funciona em um arquitetura moderna baseada em componentes React com as seguintes funcionalidades essenciais:

### Autenticação
- Submissão segura de credenciais
- Armazenamento de tokens em cookies
- Proteção de rotas com middleware
- Recuperação de senha via email

### Fluxo de Usuário
1. **Login/Registro** - Acesso inicial à plataforma
2. **Dashboard** - Visualização personalizada conforme perfil (Admin/Usuário)
3. **Agendamentos** - Marcação de serviços com calendário
4. **Gestão de Veículos** - Cadastro e gerenciamento de veículos
5. **Consulta de Serviços** - Visualização do catálogo de serviços

### Integração com API
- Requisições HTTP com **Axios** para comunicação com backend
- Gerenciamento de estado com **React Context**
- Hooks customizados para lógica de negócio

---

## 📁 Estrutura de Pastas

```
src/
├── app/                          # Aplicação principal (Next.js App Router)
│   ├── globals.css              # Estilos globais
│   ├── layout.js                # Layout principal
│   ├── page.jsx                 # Página inicial
│   ├── manifest.js              # Manifest da PWA
│   ├── robots.js                # Arquivo de robots
│   ├── sitemap.js               # Mapa do site
│   ├── auth/                    # Páginas de autenticação
│   │   ├── login/
│   │   ├── register/
│   │   ├── forgot/
│   │   └── reset/
│   ├── (dashboard)/             # Rotas do dashboard
│   │   ├── admin/               # Painel de administrador
│   │   └── user/                # Painel de usuário
│   └── status/                  # Páginas de status
│
├── components/                  # Componentes reutilizáveis
│   ├── dashboard/               # Componentes do dashboard
│   │   ├── statCard/            # Cards de estatísticas
│   │   ├── sectionCard/         # Cards de seções
│   │   └── serviceChart/        # Gráficos de serviços
│   ├── forms/                   # Formulários
│   │   ├── userForm/
│   │   ├── appoitmentsForm/
│   │   ├── servicesForm/
│   │   └── vehicleForm/
│   ├── headers/                 # Componentes header
│   │   ├── headerPainelAdmin/
│   │   └── headerPanelUser/
│   ├── landing page/            # Componentes da página inicial
│   │   ├── hero/
│   │   ├── about/
│   │   ├── footer/
│   │   ├── header/
│   │   ├── calculator/
│   │   └── store/
│   ├── layouts/                 # Layouts
│   │   ├── adminLayoutClient/
│   │   └── userLayoutClient/
│   ├── modals/                  # Componentes modais
│   │   ├── modalCalendar/
│   │   ├── modalVehicleLink/
│   │   ├── modalVehicleHistory/
│   │   └── ...outros modais
│   ├── sidebars/                # Componentes sidebar
│   │   ├── sidebarAdmin/
│   │   └── sidebarUser/
│   ├── services/                # Componentes de serviços
│   │   ├── services.jsx
│   │   └── servicesCarousel.jsx
│   └── ui/                      # Componentes de UI genéricos
│
├── contexts/                    # Context API
│   └── AuthContext.jsx          # Contexto de autenticação
│
├── hooks/                       # Hooks customizados
│   ├── useAuth.js               # Autenticação
│   ├── useAppointments.js       # Agendamentos
│   ├── useServices.js           # Serviços
│   ├── useProfile.js            # Perfil do usuário
│   ├── useUserVehicles.js       # Veículos do usuário
│   └── ...outros hooks
│
├── services/                    # Camada de serviços (API)
│   ├── api.js                   # Configuração do Axios
│   ├── auth.service.js          # Serviços de autenticação
│   ├── appointments.service.js  # Serviços de agendamentos
│   ├── services.service.js      # Serviços de catálogo
│   ├── vehicles.service.js      # Serviços de veículos
│   ├── users.service.js         # Serviços de usuários
│   └── ...outros serviços
│
├── utils/                       # Funções utilitárias
│   └── validators.js            # Validadores de formulários
│
└── middleware.js                # Middleware Next.js
```

---

## 🏃 Como Executar

### Requisitos
- Node.js 18+ 
- npm ou yarn

### Desenvolvimento

1. **Clonar o repositório**
   ```bash
   git clone https://github.com/Demo-apresentacao/demo-frontend.git
   cd demo-frontend
   ```

2. **Instalar dependências**
   ```bash
   npm install
   ```

3. **Executar servidor de desenvolvimento**
   ```bash
   npm run dev
   ```

4. **Acessar a aplicação**
   Abra [http://localhost:3000](http://localhost:3000) em seu navegador

### Produção

1. **Build da aplicação**
   ```bash
   npm run build
   ```

2. **Iniciar servidor de produção**
   ```bash
   npm start
   ```

---

## 📝 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento com hot-reload
- `npm run build` - Compila a aplicação para produção
- `npm start` - Inicia o servidor de produção
- `npm run lint` - Executa análise de código com ESLint

---

## 🔒 Segurança

- Autenticação com tokens seguros
- Criptografia de senhas com bcrypt
- Proteção de rotas com middleware
- Validação de entrada em formulários
- Política de cookies segura

---

## 📱 Responsividade

A aplicação é totalmente responsiva e otimizada para:
- Desktop (1920px+)
- Tablet (768px - 1919px)
- Mobile (até 767px)

---

## 🚀 Deploy

A aplicação está hospedada na **Vercel** e é atualizada automaticamente a cada push para a branch principal.

**URL de Produção:** [https://demo-apresentacao.vercel.app](https://demo-apresentacao.vercel.app)

---

## 📚 Documentação Adicional

- [Documentação Next.js](https://nextjs.org/docs)
- [Documentação React](https://react.dev)
- [Guia de Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)

---

## 📄 Licença

Este projeto é propriedade privada.
