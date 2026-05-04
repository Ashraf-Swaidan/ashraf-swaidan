# Papion System — Owner brief

Reference narrative from the builder. Use this alongside [about-papion.md](./about-papion.md), [ui-ux.md](./ui-ux.md), and [capture-guide.md](./capture-guide.md) when writing case-study copy or planning assets.

## Business context

**Papion** is a multibranch business whose domain is event decorations. One branch is a **print & cut workshop**: wide-format prints, regular prints, laser cut products, and related work. Event planners use this workshop branch daily to bring their decoration ideas to life.

**Papion System** connects all such branches in **eight inventories**, each with a structure suited to its own logic:

| Inventory        | Branch                          |
| ---------------- | ------------------------------- |
| Basic items      | Balloon & Accessories           |
| Balloons         | Balloon & Accessories           |
| Helium           | Balloon & Accessories           |
| Laser cuts       | Workshop                        |
| Flex & vinyl     | Workshop                        |
| Normal prints    | Workshop                        |
| Chocolate items  | Event decoration                |
| Stands           | Event decoration                |

## Customers → sales → mixed orders

Sales needs **customers** first. The customers area handles **retail and wholesale** customers with **general and customer-level insights**.

With customers and inventory in place, **sales** supports smooth selection **across inventories** during order creation—different selection, quantity, and **pricing logic per type**. Staff can put **several line items from completely different inventories** into **one order** for **one customer**.

Selling is **not always fully paid**.

## Wallets, unpaid sales, calendar, tasks

**Wallets** receive payments. Users create wallets of different types (e.g. **cashier**), manage **transactions**, and use **loaning** between wallets.

For **partially paid** orders there is an **UNpaid sales** tab with UI/UX tuned for that workflow. Some orders are instant, some have a **due date**, some are tied to an **event** with its own date—the **sales calendar** acts as a full agenda.

For messy day-to-day work, a **task** section works like a **Papion todo-app**; it became more important than expected and ties into **sales tasks**.

## Insights and sales branches

With customers, inventories, sales, orders, and wallets, **insights** become possible: **meaningful, positioned insights** from a business perspective—not random charts. The sales insights area spans **general, product-level, customer-level, branch-level, and finance-level** views. Admins use it to decide and watch success **live**.

There is also a **dedicated sales branch section** to manage sales across the **three branches**—more than a simple “branch” screen (details to expand later).

## Suppliers, expenses, completing the cycle

**Suppliers** and **supplier orders**: stock does not appear from nowhere; quantities are supplied. The suppliers flow manages suppliers across domain categories, **orders from suppliers** linked to the right **inventories** and the **wallet** paying the transaction. Inventory supports smarter decisions with **stock and cost over time** in a supplier-aware way.

**Expenses**: not only **COGS** (supplier purchases) but **day-to-day** expenses at **business, branch, and personal** levels, tied to **wallets**. The expense area is core for seeing expenses against sales and **real net profit**.

## Users, roles, settings

**Authentication and authorization** matter because many staff use the system. **Users** and **roles** let admins define **custom access combinations** assigned to staff. **Routes are protected** by role and permissions down to fine detail—for example **hiding real inventory item costs** from staff who should not see them while showing other fields. Auth is implemented to reflect **real-world workflow** on screen.

**Settings** offer broad preferences across routes.

## AI

**Papion AI** is the newest route: converse with many models about the business with **careful, secure access** to many kinds of data. Currently **beta**.

## Design and platforms

**Design**: strong, deliberate UI—not merely “responsive.” **Beyond standard responsive**: tuned for **desktop app, web, and mobile PWA**. Some screens are **substantially different** per form factor; mobile can feel **native**, inspired by real mobile apps.

**Availability** across **local desktop, web, and mobile** aims for a **fun, easy, secure** experience for admins and staff from anywhere.
