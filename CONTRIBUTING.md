# Contributing to Donasiku: The Ultimate Developer Handbook

**Version:** 2.0.0 (The "Textbook" Edition)
**Last Updated:** December 2025
**Maintainers:** Donasiku Core Team
**Status:** Living Document

---

# � Prologue: The Developer's Journey

Welcome, traveler. You have stumbled upon the source code of **Donasiku**, a platform dedicated to bridging the gap between abundance and scarcity. 

This document is more than just a set of rules. It is a **Masterclass**. 
By reading this document from start to finish, you will not only understand how to contribute to this project, but you will also become a better software engineer. We cover architecture, design patterns, testing strategies, and professional workflows used by top-tier tech companies.

We believe that **Open Source** is the best classroom.

> "I'm not a great programmer; I'm just a good programmer with great habits." — Kent Beck

---

# � Table of Contents

1.  [Philosophy & Core Values](#1-philosophy--core-values)
2.  [Code of Conduct](#2-code-of-conduct)
3.  [Getting Started: The Essentials](#3-getting-started-the-essentials)
4.  [Detailed System Requirements](#4-detailed-system-requirements)
5.  [Setting Up Your Development Environment](#5-setting-up-your-development-environment)
    *   [The Docker Way (Recommended)](#51-the-docker-way)
    *   [The Windows Manual Way (Laragon/XAMPP)](#52-the-windows-manual-way)
    *   [The macOS Manual Way (Homebrew)](#53-the-macos-manual-way)
    *   [The Linux Manual Way (Ubuntu/Debian)](#54-the-linux-manual-way)
    *   [The WSL2 Way](#55-the-wsl2-way)
6.  [Project Architecture Deep Dive](#6-project-architecture-deep-dive)
    *   [Monorepo Structure](#61-monorepo-structure)
    *   [Backend Layer (Laravel)](#62-backend-layer-laravel)
    *   [Frontend Layer (React)](#63-frontend-layer-react)
    *   [Database Layer (MySQL/Redis)](#64-database-layer-mysqlredis)
7.  [Development Workflow & Protocols](#7-development-workflow--protocols)
    *   [Git & GitHub Flow](#71-git--github-flow)
    *   [Commit Message Convention (Conventional Commits)](#72-commit-message-convention)
    *   [Pull Request (PR) Lifecycle](#73-pull-request-pr-lifecycle)
8.  [Coding Standards & Style Guides](#8-coding-standards--style-guides)
    *   [PHP Standards (PSR-12+)](#81-php-standards-psr-12)
    *   [JavaScript/TypeScript Standards](#82-javascripttypescript-standards)
    *   [CSS & Design System (Tailwind)](#83-css--design-system-tailwind)
    *   [SQL & Database Best Practices](#84-sql--database-best-practices)
    *   [REST API Design Standards](#85-rest-api-design-standards)
9.  [Design Patterns Used in Donasiku](#9-design-patterns-used-in-donasiku)
    *   [The Service Pattern](#91-the-service-pattern)
    *   [The Repository Pattern (Why we don't strictly use it)](#92-the-repository-pattern)
    *   [The Observer Pattern](#93-the-observer-pattern)
    *   [The Factory Pattern](#94-the-factory-pattern)
    *   [The Atomic Design Pattern (Frontend)](#95-the-atomic-design-pattern)
10. [Advanced Git Tutorials](#10-advanced-git-tutorials)
    *   [Handling Merge Conflicts](#101-handling-merge-conflicts)
    *   [Interactive Rebase & Squashing](#102-interactive-rebase--squashing)
    *   [Stashing & Cherry Picking](#103-stashing--cherry-picking)
    *   [Bisecting Bugs](#104-bisecting-bugs)
11. [Testing Strategy](#11-testing-strategy)
12. [Security Handbook](#12-security-handbook)
13. [Deployment & DevOps](#13-deployment--devops)
14. [Appendix A: Full Database Schema](#14-appendix-a-full-database-schema)
15. [Appendix B: API Reference (Full JSON Specs)](#15-appendix-b-api-reference-full-json-specs)
16. [Appendix C: Dependency Glossary](#16-appendix-c-dependency-glossary)
17. [Appendix D: Troubleshooting Dictionary](#17-appendix-d-troubleshooting-dictionary)
18. [Appendix E: Mock Interview Questions](#18-appendix-e-mock-interview-questions)

---

# 1. Philosophy & Core Values

At Donasiku, our codebase is a reflection of our culture. We uphold these values in every line of code we write:

### 1.1 User Centricity
Every technical decision must answer one question: **"How does this improve the user's life?"**
- If a query is slow, the user suffers. Optimize it.
- If an error message is vague, the user is confused. Clarify it.
- If the UI is cluttered, the user is overwhelmed. Simplify it.

### 1.2 Simplicity Over Cleverness
We prefer **boring, predictable code** over "clever" one-liners that no one understands 6 months later.
- **Good:** A standard `foreach` loop that is easy to read.
- **Bad:** A complex functional chain of `array_map`, `array_filter`, and `array_reduce` nested 3 levels deep just to save 2 lines of code.

### 1.3 Consistency is King
A codebase should look like it was written by a single person, even if 100 people contributed to it.
- Follow the linter.
- Follow the naming conventions.
- Follow the folder structure.

### 1.4 Leave the Campfire Cleaner Than You Found It
If you touch a file to fix a bug, and you see a typo or bad indentation nearby—fix that too. Small incremental improvements compound over time.

---

# 2. Code of Conduct

We are committed to making participation in this project a harassment-free experience for everyone.

**We adhere to the [Contributor Covenant](https://www.contributor-covenant.org).**

**Quick Summary:**
- Be kind.
- Be respectful of differing viewpoints.
- Accept constructive criticism gracefully.
- Focus on what is best for the community.

**Zero Tolerance:**
- No sexualized language or imagery.
- No personal attacks.
- No public or private harassment.

Violations can be reported to `security@donasiku.com`.

---

# 3. Getting Started: The Essentials

Before diving into the complex setup, ensure you have the fundamental tools.

### 3.1 Cognitive Prerequisites
You should be familiar with:
- **MVC Architecture**: Model-View-Controller pattern.
- **RESTful APIs**: HTTP verbs (GET, POST, PUT, DELETE) and status codes.
- **Asynchronous JS**: Promises, Async/Await.

### 3.2 Tooling Prerequisites
Ensure these are installed on your machine:
- **Git**: Version 2.30+
- **Docker Desktop**: Version 4.0+ (If using Docker)
- **Node.js**: Version 18 LTS or 20 LTS
- **PHP**: Version 8.2 (If running manually)
- **Composer**: Version 2.0+ (If running manually)
- **Editor**: VS Code (Recommended) with these extensions:
    - PHP Intelephense
    - ESLint
    - Prettier
    - Tailwind CSS IntelliSense
    - EditorConfig for VS Code
    - Docker
    - Laravel Blade Snippets

---

# 4. Detailed System Requirements

Donasiku is designed to be lightweight but robust.

### 4.1 Minimum Requirements
- **CPU**: Dual Core 2GHz
- **RAM**: 4GB (8GB if using Docker)
- **Storage**: 5GB Free Space

### 4.2 Recommended Specifications
- **CPU**: Quad Core (Intel i5/i7 or AMD Ryzen 5/7 / Apple M1/M2)
- **RAM**: 16GB LPDDR4X/DDR4/DDR5
- **Storage**: NVMe SSD
- **OS**: Windows 11 (WSL2), macOS Sonoma, or Ubuntu 22.04 LTS

---

# 5. Setting Up Your Development Environment

## 5.1 The Docker Way (Recommended) 🐳

This method guarantees that your environment matches production exactly.

### Step 1: Clone the Repository
```bash
git clone https://github.com/Mazkad12/DONASIKU-WEBPRO.git
cd DONASIKU-WEBPRO
```

### Step 2: Configure Environment
Copy the example environment file.
```bash
# Windows (PowerShell)
Copy-Item backend/.env.example backend/.env

# Mac/Linux
cp backend/.env.example backend/.env
```

### Step 3: Build & Start Containers
```bash
docker-compose up -d --build
```
*Note: The first build may take 5-10 minutes depending on your internet connection.*

### Step 4: Verify Status
Run `docker-compose ps`. You should see:
- `donasiku-app` (Up)
- `donasiku-webserver` (Up)
- `donasiku-db` (Up)
- `donasiku-frontend` (Up)
- `donasiku-adminer` (Up)

### Step 5: Install Dependencies & Run Migrations
We need to run these commands *inside* the backend container.
```bash
docker-compose exec app composer install
docker-compose exec app php artisan key:generate
docker-compose exec app php artisan migrate:fresh --seed
```

### Step 6: Access the App
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **Database Manager**: http://localhost:8081 (System: MySQL, Server: db, User: root, Pass: rootpassword)

---

## 5.2 The Windows Manual Way (Laragon/XAMPP) 🪟

### Step 1: Software Installation
1.  Download and install **Laragon** (Full Version).
2.  Laragon usually comes with PHP. Ensure it is PHP 8.2+. If not, download PHP 8.2 binaries and add to Laragon.
3.  Install **Node.js** (LTS).
4.  Install **Composer**.

### Step 2: Database Setup
1.  Open Laragon -> Start All.
2.  Click **Database** (HeidiSQL).
3.  Right click on connection -> Create new -> Database.
4.  Name it: `donasiku`.

### Step 3: Backend Setup
1.  Open Terminal (Cmder/Git Bash) inside `DONASIKU-WEBPRO/backend`.
2.  Install dependencies:
    ```bash
    composer install
    ```
3.  Setup Environment:
    ```bash
    cp .env.example .env
    ```
4.  Open `.env` and configure:
    ```ini
    DB_CONNECTION=mysql
    DB_HOST=127.0.0.1
    DB_PORT=3306
    DB_DATABASE=donasiku
    DB_USERNAME=root
    DB_PASSWORD=
    ```
5.  Generate Key & Migrate:
    ```bash
    php artisan key:generate
    php artisan migrate --seed
    ```
6.  Serve:
    ```bash
    php artisan serve
    ```
    (Runs on http://127.0.0.1:8000)

### Step 4: Frontend Setup
1.  Open new Terminal inside `DONASIKU-WEBPRO/frontend`.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run Dev Server:
    ```bash
    npm run dev
    ```
    (Runs on http://localhost:5173)

---

## 5.3 The macOS Manual Way (Homebrew) 🍎

(Requires Homebrew)

**1. Install Services:**
```bash
brew install php@8.2
brew install composer
brew install mysql
brew install node
```

**2. Start Services:**
```bash
brew services start mysql
```

**3. Configure Project:**
(Follow the same steps as Windows Backend/Frontend setup).

---

## 5.5 The WSL2 Way (Windows Subsystem for Linux) 🐧

This is the best manual way for Windows users.

1.  **Install WSL2**: `wsl --install`.
2.  **Install Ubuntu**: From Microsoft Store.
3.  **Install PHP & Extensions**:
    ```bash
    sudo apt update
    sudo apt install php8.2 php8.2-cli php8.2-fpm php8.2-mysql php8.2-curl php8.2-mbstring php8.2-xml php8.2-bcmath composer unzip
    ```
4.  **Install MySQL**:
    ```bash
    sudo apt install mysql-server
    sudo systemctl start mysql
    ```
5.  **Follow Linux Manual Steps**.

---

# 6. Project Architecture Deep Dive

Understanding the codebase structure is crucial for contribution.

## 6.1 Monorepo Structure

We organize code by "Service".

```text
DONASIKU-WEBPRO/
├── .github/                # DevOps & Process
│   ├── workflows/          # CI/CD Pipelines
│   ├── ISSUE_TEMPLATE/     # Bug Report/Feature Request templates
│   └── PULL_REQUEST_TEMPLATE.md
├── backend/                # The Brain (Laravel)
│   ├── app/                # Core Business Logic
│   ├── config/             # Framework Configuration
│   ├── database/           # Schemas & Factories
│   ├── docker/             # Backend-specific Docker setup
│   ├── public/             # Entry point (index.php)
│   ├── routes/             # API definition (api.php)
│   ├── tests/              # Automated Tests
│   └── composer.json       # PHP Dependencies
├── frontend/               # The Face (React)
│   ├── public/             # Static assets (favicon, manifest)
│   ├── src/                # React Source Code
│   │   ├── components/     # Reusable building blocks (Buttons, Inputs)
│   │   ├── layouts/        # Page wrappers (AuthLayout, DashboardLayout)
│   │   ├── pages/          # Application Screens
│   │   ├── services/       # API integration layers
│   │   └── utils/          # Helpers (validation, formatting)
│   ├── index.html          # HTML entry point
│   └── package.json        # JS Dependencies
├── docker/                 # Global Infrastructure
│   └── nginx/              # Web Server Config
├── docker-compose.yml      # Orchestrator (Dev)
├── railway.json            # Deployment Config
└── README.md               # Project Landing Page
```

## 6.2 Backend Layer (Laravel)

We treat Laravel primarily as an **API Provider**.

### Core Directories
- **`app/Http/Controllers`**: The entry point for requests. Controllers should be "thin". They validate input, call a service/model, and return a response.
- **`app/Models`**: Eloquent models. Contains relationships (`hasMany`, `belongsTo`) and scopes (`scopeActive`).
- **`app/Http/Requests`**: Specialized Validation Logic. We NEVER validate in the controller.
- **`app/Http/Resources`**: Transformation Logic. Converts Models into JSON responses. This acts as the "View" layer for our API.

### Authentication Flow
We use **Laravel Sanctum**.
1.  User sends credential to `/login`.
2.  Server verifies and returns an API Token (Bearer Token).
3.  Frontend attaches `Authorization: Bearer <token>` to every subsequent request.

## 6.3 Frontend Layer (React)

We use **Vite** for lightning-fast HMR (Hot Module Replacement).

### Component Philosophy
We follow Atomic Design principles loosely.
- **Atoms**: `Button.jsx`, `Input.jsx` (Generic, no business logic).
- **Molecules**: `LoginForm.jsx`, `DonationCard.jsx` (Combines atoms, has UI logic).
- **Organisms**: `Navbar.jsx`, `Sidebar.jsx` (Complex, connected to state).
- **Templates/Pages**: `HomePage.jsx` (Connects everything).

### State Management
- **Local State**: `useState` (Forms, Toggles).
- **Global State**: `React.Context` (Auth User, Theme). We avoid Redux/Zustand unless absolutely necessary to keep complexity low.

## 6.4 Database Layer (MySQL/Redis)

- **MySQL**: Persistent storage. We use InnoDB engine for foreign key constraints.
- **Redis**: In-memory store. Used for:
    1.  **Cache**: Storing API responses for popular endpoints.
    2.  **Session**: Storing session data for speed.
    3.  **Queues**: Storing background jobs (Email sending).

---

# 7. Development Workflow & Protocols

How to work with the team without breaking things.

## 7.1 Git & GitHub Flow

We follow a modified **Gitflow**.

1.  **`main`**: The Holy Grail. Production code. Deploys to Railway automatically.
2.  **`develop`**: Staging code.
3.  **Feature Branches**: `feat/new-feature`.
4.  **Fix Branches**: `fix/bug-fix`.

### Step-by-Step Feature Workflow

1.  **Sync Local Master**:
    ```bash
    git checkout main
    git pull origin main
    ```
2.  **Create Branch**:
    ```bash
    git checkout -b feat/add-wishlist
    ```
3.  **Work & Commit**:
    ```bash
    git add .
    git commit -m "feat: implement wishlist backend logic"
    ```
4.  **Keep it Fresh** (Rebase frequently):
    If `main` has moved ahead, rebase your branch on top of it.
    ```bash
    git fetch origin
    git rebase origin/main
    ```
5.  **Push**:
    ```bash
    git push origin feat/add-wishlist
    ```

## 7.2 Commit Message Convention

We strictly enforce [Conventional Commits](https://www.conventionalcommits.org/).

**Format**: `<type>(<scope>): <subject>`

**Allowed Types:**
- `feat`: New feature for the user, not a new feature for build script.
- `fix`: Bug fix for the user, not a fix to a build script.
- `docs`: Documentation only changes.
- `style`: Formatting, missing semi colons, etc; no production code change.
- `refactor`: Refactoring production code, eg. renaming a variable.
- `test`: Adding missing tests, refactoring tests; no production code change.
- `chore`: Updating grunt tasks etc; no production code change.

**Examples:**
- `feat(auth): add google oauth login`
- `fix(donation): prevent negative quantity input`
- `docs(readme): add docker setup instructions`
- `style(css): fix padding on mobile navbar`

## 7.3 Pull Request (PR) Lifecycle

1.  **Draft PR**: Open a PR as soon as you start working if you want feedback. Mark as "Draft".
2.  **Description**: Fill out the PR template completely. Explain "Why" not just "What".
3.  **Screenshots**: If you changed UI, include Before/After screenshots.
4.  **Review**: Assign a peer.
5.  **Address Feedback**: Don't argue; discuss. Make changes.
6.  **Merge**: Squash and Merge.

---

# 8. Coding Standards & Style Guides

## 8.1 PHP Standards (PSR-12)

We stick to PSR-12.

**Class Structure:**
```php
<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\User;

class UserService
{
    private const MAX_RETRIES = 3;

    public function __construct(
        private readonly UserRepository $userRepo
    ) {}

    public function register(array $data): User
    {
        if ($this->exists($data['email'])) {
            throw new UserExistsException();
        }

        return $this->userRepo->create($data);
    }
}
```

**Key Rules:**
- 4 spaces indentation.
- Opening braces on new line for Class and Method.
- Typing hinting is **mandatory**.
- Return types are **mandatory**.

## 8.2 JavaScript/TypeScript Standards

**General:**
- Use **ES6+** syntax (`const`, `let`, Arrow functions).
- Prefer `async/await` over `.then()`.

**React:**
- Functional Components always.
- Hooks at the top.
- Custom hooks for complex logic (`useDonationLogic`).

**Naming:**
- Components: `PascalCase` (`ConfirmationModal.jsx`)
- Functions: `camelCase` (`handleSubmit`)
- Constants: `UPPER_SNAKE_CASE` (`MAX_UPLOAD_SIZE`)

## 8.3 CSS & Design System (Tailwind)

We use Tailwind CSS.

**Ordering:**
Use the `concentric-css` model mentally, but Tailwind usually handles this via prettier plugin.
1.  Layout (`display`, `position`)
2.  Box Model (`width`, `margin`, `padding`)
3.  Typography (`font`, `text-color`)
4.  Visuals (`background`, `border`, `shadow`)
5.  Interactivity (`hover`, `focus`)

**Example:**
```jsx
<div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-md hover:shadow-xl">
    ...
</div>
```

## 8.4 SQL & Database Best Practices

- **Snake Case**: Tables (`user_profiles`) and Columns (`first_name`).
- **Foreign Keys**: Always define constraints (`constrained()->onDelete('cascade')`).
- **Indexes**: Index columns used in `WHERE`, `ORDER BY`, and `JOIN`.
- **Soft Deletes**: Use when data shouldn't be permanently destroyed immediately.

## 8.5 REST API Design Standards

We follow standard HTTP semantics.

- **GET /resource**: Retrieve list.
- **GET /resource/1**: Retrieve detail.
- **POST /resource**: Create new.
- **PUT /resource/1**: Replace completely.
- **PATCH /resource/1**: Update partially.
- **DELETE /resource/1**: Remove.

**Response Envelope:**
All responses should follow this envelope:
```json
{
    "success": true,
    "message": "Operation successful",
    "data": { ... },
    "errors": null
}
```

---

# 9. Design Patterns Used in Donasiku

Design patterns are reusable solutions to common problems. We use several.

## 9.1 The Service Pattern
**Problem**: Controllers becoming too "fat" with business logic.
**Solution**: Move logic to a Service class.

**Code Example:**
```php
// Bad (Logic in Controller)
public function store(Request $request) {
    if($request->amount > 100) { ... }
    $donation = Donation::create(...);
    Mail::to($user)->send(...);
    return response(...);
}

// Good (Logic in Service)
public function store(Request $request, DonationService $service) {
    try {
        $donation = $service->createDonation($request->validated());
        return response()->json($donation);
    } catch (Exception $e) {
        return response()->error($e->getMessage());
    }
}
```

## 9.2 The Repository Pattern
**Note**: We use a *light* version of this. We don't always create Interfaces for every repository unless we plan to swap implementations (e.g., MySQL to Mongo).
**Usage**: Encapsulate complex database queries (Reports, Analytics) in a Repository to keep Models clean.

## 9.3 The Observer Pattern
**Problem**: Performing side-effects (Sending Email, Logging) when a model is updated.
**Solution**: Use Eloquent Observers.
**Usage**: When a `Donation` is created, a `DonationObserver` triggers a notification to the Admins.

## 9.4 The Factory Pattern
**Usage**: Used extensively in Testing (`UserFactory`, `DonationFactory`) to generate dummy data.

## 9.5 The Atomic Design Pattern (Frontend)
As mentioned in architecture, we break UI into atoms, molecules, and organisms.
- **Atom**: `Avatar.jsx`
- **Molecule**: `UserBadge.jsx` (Avatar + Name)
- **Organism**: `TopNav.jsx` (Logo + Search + UserBadge)

---

# 10. Advanced Git Tutorials

Mastering Git is a superpower. Here are some scenarios you might encounter.

## 10.1 Handling Merge Conflicts
It happens to the best of us.

1.  **Don't Panic.**
2.  Run `git status`. It will show you the conflicting files.
3.  Open the file. You will see markers:
    ```text
    <<<<<<< HEAD
    Your code
    =======
    Incoming code
    >>>>>>> feature/branch
    ```
4.  Decide which block to keep (or combine them).
5.  Remove markers.
6.  `git add filename`.
7.  `git commit`.

## 10.2 Interactive Rebase & Squashing
Clean up your messy commit history before merging.

1.  `git rebase -i HEAD~3` (Edit last 3 commits).
2.  Editor opens. Change `pick` to `squash` (or `s`) for commits you want to merge into the previous one.
3.  Save and close.
4.  Editor opens again for Commit Message. Rewrite it to be one nice message.
5.  `git push -f` (Force push required after rebase).

## 10.3 Stashing & Cherry Picking
**Scenario**: You are working on Branch A, but need to fix a critical bug on Branch B.
1.  `git stash` (Save work on A).
2.  `git checkout B`.
3.  Fix bug. Commit.
4.  `git checkout A`.
5.  `git stash pop` (Restore work).

**Scenario**: You made a commit on the wrong branch.
1.  On wrong branch: `git log` (Copy Hash `abc1234`).
2.  Go to right branch: `git checkout right-branch`.
3.  `git cherry-pick abc1234`.

## 10.4 Bisecting Bugs
**Scenario**: A bug appeared sometime in the last 50 commits. You don't know where.
1.  `git bisect start`.
2.  `git bisect bad` (Current version is bad).
3.  `git bisect good <commit-hash>` (A version from last week that was good).
4.  Git will jump to the middle. Test it.
5.  If good: `git bisect good`. If bad: `git bisect bad`.
6.  Repeat until Git tells you exact suspect commit.

---

# 11. Testing Strategy

## 11.1 Types of Tests
1.  **Unit Tests**: Test a single function/class in isolation. Fast.
2.  **Feature Tests**: Test a full HTTP request/response cycle. Slower but more valuable.

## 11.2 Writing a Feature Test (Laravel)

```php
public function test_user_can_create_donation()
{
    // 1. Arrange
    $user = User::factory()->create();
    $category = Category::factory()->create();

    // 2. Act
    $response = $this->actingAs($user)->postJson('/api/donations', [
        'title' => 'Old Sofa',
        'category_id' => $category->id,
        'description' => 'A bit dusty but usable.'
    ]);

    // 3. Assert
    $response->assertStatus(201)
             ->assertJsonPath('data.title', 'Old Sofa');

    $this->assertDatabaseHas('donations', ['title' => 'Old Sofa']);
}
```

## 11.3 Testing Checklist
- Happy Path (It works as expected).
- Validation Errors (Invalid email, missing fields).
- Authorization Errors (User tries to delete someone else's item).
- Edge Cases (Empty lists, max string length, zero values).

---

# 12. Security Handbook 🛡️

## 12.1 Authentication
- Never assume the user is logged in. Use `auth:sanctum` middleware.
- Never store passwords plain text. Use `Hash::make()`.

## 12.2 Authorization
Always use Policies or Gates.
```php
// Bad
if ($user->id === $post->user_id) { ... }

// Good
if ($user->can('update', $post)) { ... }
```

## 12.3 XSS & CSRF
- Laravel Blade `{{ }}` automatically escapes output.
- In React, React automatically escapes content unless using `dangerouslySetInnerHTML`. **Avoid `dangerouslySetInnerHTML`**.
- CSRF is handled by Laravel Sanctum automatically for SPA.

## 12.4 SQL Injection
- Never raw query with user input.
- **Bad**: `DB::select("SELECT * FROM users WHERE name = '$name'")`
- **Good**: `DB::select("SELECT * FROM users WHERE name = ?", [$name])`
- **Better**: `User::where('name', $name)->get()`

---

# 13. Deployment & DevOps 🚀

## 13.1 CI/CD (GitHub Actions)
We have a workflow `.github/workflows/ci.yml`.
- Triggers on Push to `main` and `develop`.
- Installs PHP & Node.
- Runs `composer install` & `npm install`.
- Runs `php artisan test`.
- Runs `npm run build`.

## 13.2 Production Server (VPS)
If deploying to a VPS (Ubuntu 22.04 + Nginx + PHP-FPM):

1.  **Update OS**: `apt update && apt upgrade`.
2.  **Install Stack**: Nginx, MySQL, PHP 8.2, Redis, Certbot.
3.  **Clone Code**: `/var/www/donasiku`.
4.  **Permissions**:
    ```bash
    chown -R www-data:www-data /var/www/donasiku
    chmod -R 775 storage bootstrap/cache
    ```
5.  **Env**: Set `APP_ENV=production` and `APP_DEBUG=false`.
6.  **Optimization**:
    ```bash
    php artisan config:cache
    php artisan route:cache
    php artisan view:cache
    ```
7.  **SSL**: `certbot --nginx -d donasiku.com`.

---

# 14. Appendix A: Full Database Schema

 Detailed schema definition for reference.

## Users Table (`users`)
| Column | Type | Attributes | Description |
| --- | --- | --- | --- |
| `id` | BIGINT | PK, AI, UNSIGNED | Unique ID |
| `name` | VARCHAR(255) | NOT NULL | Full Name |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | Email Address |
| `password` | VARCHAR(255) | NOT NULL | Bcrypt Hash |
| `role` | ENUM | 'donatur', 'penerima', 'admin' | User Role |
| `phone` | VARCHAR(20) | NULLABLE | Contact Number |
| `avatar` | VARCHAR(255) | NULLABLE | Path to image |
| `created_at` | TIMESTAMP | NULLABLE | timestamps |
| `updated_at` | TIMESTAMP | NULLABLE | timestamps |

## Donations Table (`donations`)
| Column | Type | Attributes | Description |
| --- | --- | --- | --- |
| `id` | BIGINT | PK, AI, UNSIGNED | Unique ID |
| `user_id` | BIGINT | FK -> users(id) | Owner of donation |
| `title` | VARCHAR(255) | NOT NULL | Item Name |
| `slug` | VARCHAR(255) | UNIQUE, NOT NULL | SEO Friendly URL |
| `description` | TEXT | NOT NULL | Details |
| `category` | VARCHAR(50) | NOT NULL | Type of item |
| `status` | ENUM | 'active', 'booked', 'done' | Availability |
| `location` | VARCHAR(255) | NOT NULL | City/Address |
| `image_url` | VARCHAR(255) | NULLABLE | Main photo |
| `created_at` | TIMESTAMP | NULLABLE | timestamps |
| `updated_at` | TIMESTAMP | NULLABLE | timestamps |

## Requests Table (`donation_requests`)
| Column | Type | Attributes | Description |
| --- | --- | --- | --- |
| `id` | BIGINT | PK, AI, UNSIGNED | Unique ID |
| `donation_id` | BIGINT | FK -> donations(id) | Item requested |
| `requester_id` | BIGINT | FK -> users(id) | Who requested |
| `message` | TEXT | NULLABLE | Reason for request |
| `status` | ENUM | 'pending', 'approved', 'rejected' | Request status |
| `created_at` | TIMESTAMP | NULLABLE | timestamps |
| `updated_at` | TIMESTAMP | NULLABLE | timestamps |

## Categories Table (`categories`)
| Column | Type | Attributes | Description |
| --- | --- | --- | --- |
| `id` | BIGINT | PK, AI, UNSIGNED | Unique ID |
| `name` | VARCHAR(50) | NOT NULL | Category Name |
| `slug` | VARCHAR(50) | UNIQUE | URL slug |

## Messages Table (`messages`)
| Column | Type | Attributes | Description |
| --- | --- | --- | --- |
| `id` | BIGINT | PK, AI, UNSIGNED | Unique ID |
| `sender_id` | BIGINT | FK -> users | Sender |
| `receiver_id` | BIGINT | FK -> users | Receiver |
| `content` | TEXT | NOT NULL | Message body |
| `is_read` | BOOLEAN | DEFAULT 0 | Read status |

---

# 15. Appendix B: API Reference (Full JSON Specs)

(This is a copy of our Living Documentation in `DocsAPI.md`)

## Public Endpoints

### POST /register
Register a new user to the system.

**Request:**
```json
{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword",
    "role": "donatur"
}
```

**Response (201 Created):**
```json
{
    "success": true,
    "message": "User registered successfully",
    "data": {
        "user": {
            "id": 1,
            "name": "John Doe",
            "email": "john@example.com",
            "role": "donatur"
        },
        "token": "1|abcdef12345..."
    }
}
```

### POST /login
Authenticate a user.

**Request:**
```json
{
    "email": "john@example.com",
    "password": "securepassword"
}
```

**Response (200 OK):**
```json
{
    "success": true,
    "message": "Login successful",
    "data": {
        "user": {
            "id": 1,
            "role": "donatur"
        },
        "token": "2|xyzw..."
    }
}
```

### GET /donations
List all donations.

**Query Parameters:**
- `page` (int): Page number.
- `category` (string): Filter by category slug.
- `search` (string): Filter by title.

**Response (200 OK):**
```json
{
    "success": true,
    "data": [
        {
            "id": 10,
            "title": "Unused Bicycle",
            "category": "sports",
            "location": "Bandung",
            "image_url": "http://..."
        },
        {
            "id": 11,
            "title": "Math Textbook",
            "category": "education",
            "location": "Jakarta",
            "image_url": "http://..."
        }
    ],
    "meta": {
        "current_page": 1,
        "last_page": 5,
        "total": 50
    }
}
```

## Protected Endpoints

### POST /donations
Create a new donation.

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
    "title": "Gaming Laptop",
    "description": "Used for 2 years, works perfectly.",
    "category": "electronics",
    "location": "Surabaya",
    "image": "(Binary File)"
}
```

**Response (201 Created):**
```json
{
    "success": true,
    "data": {
        "id": 12,
        "title": "Gaming Laptop",
        "slug": "gaming-laptop-123",
        "status": "active"
    }
}
```

### PATCH /requests/{id}/approve
Approve a request (Owner only).

**Response (200 OK):**
```json
{
    "success": true,
    "message": "Request approved. Donation status updated to Booked."
}
```

---

# 16. Appendix C: Dependency Glossary

Understanding our `composer.json` and `package.json`.

## Backend (Composer)
- **`laravel/framework`**: The core framework.
- **`laravel/sanctum`**: API Authentication system.
- **`laravel/tinker`**: Interactive REPL for debugging.
- **`guzzlehttp/guzzle`**: HTTP Client (to make requests to other APIs).
- **`fakerphp/faker`**: Generates fake data for testing/seeding.
- **`mockery/mockery`**: Mocking library for Unit Tests.
- **`phpunit/phpunit`**: Testing framework.
- **`spatie/laravel-permission`**: (Optional) For advanced roles.
- **`barryvdh/laravel-debugbar`**: Debugging toolbar (Dev only).

## Frontend (NPM)
- **`react`**: The UI library.
- **`react-dom`**: React renderer for Web.
- **`react-router-dom`**: Routing (SPA navigation).
- **`axios`**: HTTP Client to talk to Laravel.
- **`tailwindcss`**: CSS Framework.
- **`vite`**: Build tool / Dev server.
- **`postcss`**: Tool for transforming CSS with JavaScript.
- **`autoprefixer`**: PostCSS plugin to parse CSS and add vendor prefixes.
- **`eslint`**: Linter.
- **`framer-motion`**: (Optional) Animation library.
- **`react-icons`**: Icon pack.

---

# 17. Appendix D: Troubleshooting Dictionary

**Error: `SQLSTATE[HY000] [2002] Connection refused`**
- **Cause**: Laravel cannot connect to MySQL.
- **Fix**: Check `.env`. If using Docker, `DB_HOST` must be `db`. If Manual, `127.0.0.1`. Ensure MySQL service is running.

**Error: `Target class [Something] does not exist.`**
- **Cause**: Missing class import or dependency.
- **Fix**: Run `composer dump-autoload` or check namespaces.

**Error: `500 Internal Server Error` (No log)**
- **Cause**: Permissions issue often.
- **Fix**: `chmod -R 777 storage bootstrap/cache`.

**Error: `vite: command not found`**
- **Cause**: Node modules not installed / bin not linked.
- **Fix**: Run `npm install` again.

**Error: `Mixed Content` (HTTPS/HTTP)**
- **Cause**: App is loaded via HTTPS but API calls are HTTP.
- **Fix**: Force HTTPS in `AppServiceProvider` or setup SSL locally.

---

# 18. Appendix E: Mock Interview Questions

Since you are contributing to this project, you might want to use it in your portfolio. Here is how to explain it.

**Q: What is Donasiku?**
A: It's a full-stack donation management platform. It allows users to list items for donation and others to request them.

**Q: What architecture did you use?**
A: I used a decoupled Monorepo architecture. The backend is a RESTful API built with Laravel, and the frontend is a SPA built with React and Vite. They communicate via JSON.

**Q: How do you handle authentication?**
A: We use token-based authentication with Laravel Sanctum. It's secure and stateless, perfect for SPAs.

**Q: How did you handle deployment?**
A: The application is fully Dockerized. We have a `docker-compose` for development and a optimized production configuration. We use GitHub Actions for CI/CD to run tests automatically.

**Q: What was the hardest challenge?**
A: (Example) Configuring Nginx to reverse proxy correctly to the Docker containers while handling CORS issues between the frontend and backend.

---

**End of Handbook.**
*Code bold, commit often, and deploy on Fridays (just kidding, never deploy on Fridays).*
