Com base na atualização do **ProjectTodo v1.1**, aqui está a nova versão do arquivo **README.md**. Este documento reflete a transição do sistema de uma SPA simples para uma aplicação segura com **Spring Security** e **JWT**.

# 📝 ProjectTodo - Gerenciador de Projetos e Atividades (v1.1)

O **ProjectTodo** é uma Single Page Application (SPA) robusta para gerenciamento de projetos pessoais e profissionais. A versão 1.1 introduz um módulo de autenticação avançado, garantindo que cada usuário tenha seus dados protegidos e isolados.

## 🚀 Novidades da v1.1

**Segurança com JWT:** Implementação de JSON Web Token para autenticação segura.
* 
**Isolamento de Dados:** Usuários autenticados acessam apenas seus próprios projetos e atividades.

**Criptografia:** Senhas armazenadas de forma segura utilizando o algoritmo **BCrypt**.

**Proteção de Endpoints:** Todos os recursos da API REST agora exigem um token válido via Spring Security.

## 🛠️ Stack Tecnológica

**Backend:** Spring Boot 3 + Spring Security.

**Frontend:** React 18 + Vite.

**Banco de Dados:** SQLite (Persistência local).

**Autenticação:** JWT (jjwt) + BCrypt.

## 📋 Requisitos Funcionais (Principais)

**RF-13:** Cadastro de novos usuários com login e senha única.

**RF-14:** Login com validação de credenciais e retorno de token JWT.

**RF-01/06:** CRUD completo de projetos e atividades.

**RF-10:** Kanban Board interativo com sistema *drag and drop*.

**RF-16:** Funcionalidade de Logout com remoção de token do navegador.

## 🔐 Estrutura de Endpoints

| Método | Endpoint | Descrição | Acesso |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | Cadastro de usuário 

 | Público |
| `POST` | `/api/auth/login` | Login e obtenção de token 

 | Público |
| `GET` | `/api/projects` | Listar projetos do usuário 

 | Protegido |
| `POST` | `/api/projects` | Criar novo projeto 

 | Protegido |

## ⚙️ Configuração de Ambiente

Certifique-se de configurar as variáveis de ambiente no frontend para os diferentes estágios de desenvolvimento:

```env
# .env.development
VITE_API_URL=http://localhost:8080/api

```

## 📅 Status do Projeto

**Sprints 0 a 4:** Concluídas (Core do sistema, CRUD e UI).
**Sprint 5:** **Em andamento** (Módulo JWT + Telas de Autenticação).

*ProjectTodo PRD v1.1 - Março 2026 - Confidencial* 
