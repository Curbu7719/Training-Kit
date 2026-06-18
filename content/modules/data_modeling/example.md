# Data Modeling — Worked Example

## A simple online shop

Imagine we are modeling part of an online shop: **customers** and the **orders**
they place. A first instinct might be to keep everything in one big table:

| order_id | customer_name | customer_email | item | total |
|----------|---------------|----------------|------|-------|
| 1001 | Dana Lee | dana@mail.com | Mug | 12.00 |
| 1002 | Dana Lee | dana@mail.com | Pen | 3.00 |

Notice the problem: Dana's name and email are repeated on every order. If Dana
updates her email, we must hunt down *every* row — and if we miss one, the data
now contradicts itself.

## Splitting into two entities

We model **Customer** and **Order** as separate tables, linked by a key.

**Customer**

| customer_id (PK) | name | email |
|------------------|----------|---------------|
| 7 | Dana Lee | dana@mail.com |

**Order**

| order_id (PK) | customer_id (FK) | item | total |
|---------------|------------------|------|-------|
| 1001 | 7 | Mug | 12.00 |
| 1002 | 7 | Pen | 3.00 |

`customer_id` is the **primary key** of Customer and a **foreign key** in Order.
This is a **one-to-many** relationship: one customer has many orders.

## What we gained

Dana's email now lives in exactly one place — update it once and every order
reflects the change. Each fact is stored a single time (**normalization**), and
the foreign key guarantees every order belongs to a real customer.
