# Data Modeling — Worked Example (L2)

## A reporting screen that got slow

A team models a **fully normalized** shop: Customer, Order, OrderLine, Product,
and Category are all separate tables linked by foreign keys. This is textbook
clean — every fact lives once.

Then the business adds a "Top Customers" dashboard showing, per customer, their
**total lifetime spend**. Computing it means joining Customer → Order →
OrderLine → Product and summing across potentially thousands of orders, *every
time the page loads*. The page is opened constantly, and it slows to a crawl.

## The trade-off decision

The team considers **denormalizing**: storing a `lifetime_spend` column directly
on the Customer row, updated whenever an order is finalized.

- **Gain:** the dashboard reads one column instead of a five-table join —
  dramatically faster, simpler query.
- **Cost:** `lifetime_spend` is now a redundant copy. Every code path that
  changes an order must also update this column, or it silently drifts out of
  sync.

## What makes it the right call here

The data is **read far more often than written**, and a slightly stale total is
acceptable for a dashboard. So the redundancy buys a large, frequent benefit for
a small, controllable cost. The team adds the column *deliberately*, documents
that it is derived, and centralises its update in one place — turning a
forbidden duplication into a justified engineering trade-off.
