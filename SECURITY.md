# Security Policy & Master Protection Protocol

**Version:** 2.0.0 (Enterprise Edition)
**Last Updated:** December 2025
**Classification:** PUBLIC
**Maintainers:** Donasiku Security Team

---

# 🛡️ Executive Summary

Security is not a feature; it is the foundation upon which Donasiku is built. We handle sensitive data regarding donations and user identities, and we treat this responsibility with the utmost severity.

This document serves as the **Constitution of Security** for the Donasiku platform. It outlines our policies, procedures, architecture, and response mechanisms. It is intended for developers, security researchers, and auditors.

---

# 📚 Table of Contents

1.  [Vulnerability Disclosure Policy](#1-vulnerability-disclosure-policy)
2.  [Supported Versions](#2-supported-versions)
3.  [Incident Response Plan (IRP)](#3-incident-response-plan-irp)
    *   [Phase 1: Preparation](#phase-1-preparation)
    *   [Phase 2: Identification](#phase-2-identification)
    *   [Phase 3: Containment](#phase-3-containment)
    *   [Phase 4: Eradication](#phase-4-eradication)
    *   [Phase 5: Recovery](#phase-5-recovery)
    *   [Phase 6: Lessons Learned](#phase-6-lessons-learned)
4.  [Architectural Security](#4-architectural-security)
    *   [Network Layer (Nginx & Cloud)](#network-layer)
    *   [Application Layer (Laravel)](#application-layer)
    *   [Presentation Layer (React)](#presentation-layer)
    *   [Data Layer (MySQL & Redis)](#data-layer)
    *   [Infrastructure Layer (Docker)](#infrastructure-layer)
5.  [OWASP Top 10 Mitigation Strategy](#5-owasp-top-10-mitigation-strategy)
    *   [A01: Broken Access Control](#a01-broken-access-control)
    *   [A02: Cryptographic Failures](#a02-cryptographic-failures)
    *   [A03: Injection](#a03-injection)
    *   [A04: Insecure Design](#a04-insecure-design)
    *   [A05: Security Misconfiguration](#a05-security-misconfiguration)
    *   [A06: Vulnerable and Outdated Components](#a06-vulnerable-and-outdated-components)
    *   [A07: Identification and Authentication Failures](#a07-identification-and-authentication-failures)
    *   [A08: Software and Data Integrity Failures](#a08-software-and-data-integrity-failures)
    *   [A09: Security Logging and Monitoring Failures](#a09-security-logging-and-monitoring-failures)
    *   [A10: Server-Side Request Forgery (SSRF)](#a10-server-side-request-forgery-ssrf)
6.  [Compliance & Data Privacy (GDPR/PDPA)](#6-compliance--data-privacy)
7.  [Secure Coding Guidelines](#7-secure-coding-guidelines)
8.  [Security Checklist for Developers](#8-security-checklist-for-developers)
9.  [Security Checklist for DevOps](#9-security-checklist-for-devops)
10. [Audit Logs & Forensics](#10-audit-logs--forensics)

---

# 1. Vulnerability Disclosure Policy

We believe in **Coordinated Vulnerability Disclosure (CVD)**. If you believe you have found a security vulnerability in Donasiku, we encourage you to let us know right away. We will investigate all legitimate reports and do our best to quickly fix the problem.

### Reporting Guidelines
1.  **Do not disclose publicly.** Please give us reasonable time to respond/fix before making it public.
2.  **Email Us**: Send a detailed report to `security@donasiku.com`.
3.  **PGP Encryption**: If the information is sensitive, use our PGP Key (ID: 0xDONASIKU).

### What to Include
*   **Vulnerability Type**: (e.g., XSS, SQLi, RCE).
*   **Affected Endpoint**: (e.g., `POST /api/donations`).
*   **Impact**: What can an attacker do?
*   **Proof of Concept (PoC)**: Curl command, script, or screenshots.
*   **Remediation Suggestion**: How would you fix it?

### Bug Bounty
While we do not have a cash budget, we offer:
*   **Hall of Fame**: Acknowledgement in our README and this file.
*   **Swag**: T-Shirts and Stickers for Critical exploits.

### Safe Harbor
We will not pursue legal action against researchers who:
*   Engage in testing without harming users (e.g., DoS).
*   Adhere to this policy.
*   Do not access data beyond what is needed for the PoC.

---

# 2. Supported Versions

Security updates are provided for the following versions:

| Version | Status | Security Fixes Until | PHP Version | Laravel Version |
| :--- | :--- | :--- | :--- | :--- |
| **2.x (Current)** | **Active** | **Dec 2027** | >= 8.2 | 11.x |
| 1.x | EOL | Dec 2024 | 8.1 | 10.x |
| Beta | EOL | Jan 2024 | 8.0 | 9.x |

If you are running a version older than 2.0, please upgrade immediately.

---

# 3. Incident Response Plan (IRP)

We follow the standard NIST Computer Security Incident Handling Guide (SP 800-61).

## Phase 1: Preparation
*   **Tools**: We maintain audit logs, centralized logging (ELK stack in prod), and uptime monitoring.
*   **Team**: Designated "Incident Commander" is the CTO.
*   **Drills**: We perform simulated breaches annually.

## Phase 2: Identification
*   **Detection**: Automated alerts from IDS/IPS or manual reports.
*   **Triage**:
    *   **Severity 1 (Critical)**: Data Breach, RCE, Downtime. (Response: < 1 Hour)
    *   **Severity 2 (High)**: Non-critical privilege escalation. (Response: < 4 Hours)
    *   **Severity 3 (Medium)**: XSS, CSRF. (Response: < 24 Hours)
    *   **Severity 4 (Low)**: Information leaks. (Response: < 48 Hours)

## Phase 3: Containment
*   **Short-term**: Isolate the affected containers (`docker network disconnect`). Block attacker IP via Nginx/Firewall.
*   **Long-term**: Patch the vulnerability, apply hotfixes to production.

## Phase 4: Eradication
*   Identify the root cause.
*   Remove malware/backdoors.
*   Revoke compromised credentials (API Keys, User Sessions).
*   Perform a clean build of infrastructure.

## Phase 5: Recovery
*   Restore data from backups (if integrity was compromised).
*   Monitor system for 48 hours for re-infection.
*   Gradually lift network blocks.

## Phase 6: Lessons Learned
*   Conduct a **Post-Mortem** meeting within 1 week.
*   Write a "Correction of Error" (COE) document.
*   Update this Security Policy if gaps were found.

---

# 4. Architectural Security

How we secure each layer of the stack.

## Network Layer
*   **HTTPS**: Enforced via Nginx. HSTS (HTTP Strict Transport Security) enabled.
*   **Firewall**: Only ports 80/443 open. SSH (22) restricted to VPN.
*   **DDoS Protection**: Rate limiting via Nginx (`limit_req`).

## Application Layer (Laravel)
*   **Sanctum**: Token-based authentication prevents session hijacking.
*   **Policies**: Granular authorization using Laravel Policies (`$user->can('update', $donation)`).
*   **Validation**: Strict typing and validation in `FormRequests`.
*   **Encryption**: All sensitive columns (PII) are encrypted at rest using `CastAsEncrypted`.

## Presentation Layer (React)
*   **XSS Protection**: React escapes data by default.
*   **CSP**: Content Security Policy headers implemented to prevent unauthorized script execution.
*   **HttpOnly Cookies**: Refresh tokens are stored in HttpOnly cookies to prevent theft via XSS.

## Data Layer
*   **MySQL**:
    *   User `donasiku` has limited privileges (CRUD only), no `DROP` rights on production.
    *   Bind address set to internal network only.
*   **Redis**: Protected with strong password (`requirepass`).

## Infrastructure Layer (Docker)
*   **Non-Root User**: Application runs as `www-data`, not `root`.
*   **Read-Only Filesystem**: Implementation planned for v2.1.
*   **Minimal Base Images**: We use `alpine` variants to reduce attack surface.

---

# 5. OWASP Top 10 Mitigation Strategy

Here is how Donasiku specifically addresses the OWASP Top 10 (2021).

### A01: Broken Access Control
*   **Risk**: Users accessing other users' data.
*   **Mitigation**:
    *   We use Laravel Policies for *every* controller action.
    *   Resource IDs are validated against the authenticated user.
    *   UUIDs (planned) to prevent ID enumeration.
*   **Code Example**:
    ```php
    public function update(Request $r, Donation $donation) {
        $this->authorize('update', $donation); // Throws 403 if not owner
        // ...
    }
    ```

### A02: Cryptographic Failures
*   **Risk**: Sensitive data exposure.
*   **Mitigation**:
    *   `tls 1.2` or `1.3` enforced.
    *   Passwords explicitly hashed using `Bcrypt` (Work factor > 10).
    *   API Tokens hashed in database (Sanctum default).

### A03: Injection (SQL, Log, Command)
*   **Risk**: Malicious queries.
*   **Mitigation**:
    *   Eloquent ORM uses PDO parameter binding automatically.
    *   Raw queries are forbidden in code review unless strictly audited.
*   **Bad**: `$users = DB::select("select * from users where name = '$name'");`
*   **Good**: `$users = User::where('name', $name)->get();`

### A04: Insecure Design
*   **Risk**: Logic flaws.
*   **Mitigation**:
    *   Threat modeling performed during feature planning.
    *   Business logic validation (e.g., "Cannot donate negative items").

### A05: Security Misconfiguration
*   **Risk**: Default passwords, debug mode on.
*   **Mitigation**:
    *   `APP_DEBUG=false` in production.
    *   Error messages generic ("Server Error") vs detailed stack traces.
    *   Docker containers have no default passwords.

### A06: Vulnerable and Outdated Components
*   **Risk**: Using libraries with known CVEs.
*   **Mitigation**:
    *   GitHub Dependabot enabled.
    *   `composer audit` run in CI pipeline.
    *   `npm audit` run in CI pipeline.

### A07: Identification and Authentication Failures
*   **Risk**: Brute force, credential stuffing.
*   **Mitigation**:
    *   Rate limiting on `/login` (5 attempts per minute).
    *   Password complexity rules (Min 8 chars, mixed case/numbers).
    *   Session timeout (Tokens expire after 30 days).

### A08: Software and Data Integrity Failures
*   **Risk**: Code tampering.
*   **Mitigation**:
    *   CI/CD pipeline verifies signatures.
    *   Composer `composer.lock` ensures exact package versions.

### A09: Security Logging and Monitoring Failures
*   **Risk**: Breaches go unnoticed.
*   **Mitigation**:
    *   All critical actions (Login, Delete, Update Role) logged to `activity_log` table.
    *   Failed logins logged with IP address.

### A10: Server-Side Request Forgery (SSRF)
*   **Risk**: Server fetching malicious URLs.
*   **Mitigation**:
    *   We validate user-supplied URLs (e.g., Image URLs) to ensure they match allowed schemas (http/https).
    *   We do not allow fetching from `localhost` or internal IPs.

---

# 6. Compliance & Data Privacy

We respect user privacy and adhere to GDPR/PDPA principles.

### Data Collection
*   We only collect what is needed: Name, Email, Phone, Location.
*   We do not collect: Credit Card numbers (handled by Payment Gateway), Government ID.

### Right to be Forgotten
*   Users can request account deletion.
*   **Implementation**: Hard delete of PII, soft delete of transaction history (for legal/audit reasons).

### Data Portability
*   Users can download a JSON export of their data via `GET /api/user/export`.

---

# 7. Secure Coding Guidelines

For developers contributing to Donasiku.

### Rule 1: Trust No One
Treat all input as malicious. `$_GET`, `$_POST`, Headers, Cookies. Validate everything.

### Rule 2: Output Encoding
*   **HTML Context**: Encode `< > & " '`
*   **Attribute Context**: Encode everything.
*   **JavaScript Context**: Use JSON serialization.

### Rule 3: Authentication
Use the `Auth` facade. `Auth::user()` is your friend. Do not pass user IDs in forms to spoof identity.

### Rule 4: File Uploads
*   Validate MIME type (not just extension).
*   Regenerate filename (UUID).
*   Store outside web root (`storage/app/public`) and symlink.
*   Limit file size (Max 2MB).

---

# 8. Security Checklist for Developers

| Category | Item | Check |
| :--- | :--- | :--- |
| **Auth** | Is `auth` middleware applied? | [ ] |
| **Auth** | Is `Policy` or `Gate` checked? | [ ] |
| **Input** | Is `FormRequest` used? | [ ] |
| **Input** | Is max string length defined? | [ ] |
| **Data** | Is sensitive data encrypted? | [ ] |
| **DB** | Are raw queries avoided? | [ ] |
| **Logic** | Is CSRF protection active? | [ ] |
| **Files** | Are uploads validated? | [ ] |

---

# 9. Security Checklist for DevOps

| Category | Item | Check |
| :--- | :--- | :--- |
| **Server** | Is OS updated? | [ ] |
| **Server** | Is SSH root login disabled? | [ ] |
| **Network** | Are unused ports closed? | [ ] |
| **App** | Is `APP_DEBUG=false`? | [ ] |
| **App** | Is `APP_KEY` rotated? | [ ] |
| **DB** | Is DB remote access disabled? | [ ] |
| **SSL** | Is Certificate valid? | [ ] |
| **Headers** | Are Security Headers (CSP, HSTS) present? | [ ] |

---

# 10. Audit Logs & Forensics

We maintain an audit trail for forensic analysis.

### Log Format
```json
{
    "timestamp": "2025-12-28T14:00:00Z",
    "level": "INFO",
    "user_id": 123,
    "ip_address": "203.0.113.1",
    "host": "api.donasiku.com",
    "action": "DONATION_DELETED",
    "resource_id": 456,
    "user_agent": "Mozilla/5.0..."
}
```

### Log Retention
*   **Hot Logs (File)**: 14 Days.
*   **Cold Logs (S3 Archive)**: 1 Year.

---

# Appendix: Security Contacts

*   **CTO**: Nauval (nauval@donasiku.com)
*   **Lead Security Engineer**: [Vacant]
*   **Emergency Phone**: +62-812-0000-0000

---

*Security is everyone's responsibility. Stay vigilant.*
