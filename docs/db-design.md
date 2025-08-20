# Database Design

## Schema Choices

- **User** table: Stores registered users. Normalized so credentials and profile data are not duplicated.
- **Book** table: Belongs to a user (`ownerId`), allowing multiple users to track their own collections.
- **LendingRecord**: Captures borrowing history. References both Book and optionally User (`borrowerId`) to allow guest borrowers as well.

## Normalization

- The schema is in **3NF** (no repeating groups, no partial dependencies). This prevents redundant borrower info and maintains integrity.

## Indexing

- Primary keys (`id`) are indexed by default.
- Foreign keys (`bookId`, `borrowerId`, `ownerId`) are indexed automatically by Postgres.
- **Future:** Add a composite index on (`borrowerId`, `actualReturnDate IS NULL`) to quickly fetch currently borrowed books.
  
- 
## To achieve scalability and extensibility for larger datasets, multiuser environments, and future integrations (like Google Books API), consider these key strategies:

1. Backend (NestJS)

- Use a modular architecture: Keep features in separate modules (auth, books, lending, etc.) for easy extension.
- Use TypeORM/Prisma with connection pooling and query optimization for large datasets.
- Implement pagination, filtering, and sorting in all list endpoints.
- Use DTOs and validation to keep APIs robust and adaptable.
- Add caching (e.g., Redis) for frequently accessed data.
- Use async/background jobs (e.g., BullMQ) for heavy or external API tasks.

2. Database

- Normalize schema, use indexes, and optimize queries.
- Consider read replicas or partitioning for very large datasets.

3. API Integration

- Create a dedicated service/module for external APIs (e.g., google-books.service.ts).
- Use environment variables for API keys/configs.
- Handle rate limiting, retries, and error handling for external calls.

4. Frontend

- Use React context or state management for multiuser/session support.
- Implement lazy loading and infinite scroll for large lists.

5. Infrastructure

- Use Docker for containerization and easy scaling.
- Deploy with orchestration (Docker Compose, Kubernetes) for multi-instance scaling.
- Use Nginx as a load balancer if needed.

6. Extensibility

- Follow SOLID principles and keep code loosely coupled.
- Write clear interfaces and use dependency injection.
- Document APIs and use OpenAPI/Swagger for easy future integrations.
- This approach ensures your app can handle growth, new features, and integrations smoothly.