**Contents**

- [Overview](#overview)
- [Quickstart](#quickstart)
- [Features](#features)
- [Specs](#specs)
- [Tech Stack Rationale](#tech-stack-rationale)
- [Notably Outstanding Features](#notably-outstanding-features)

# Overview

[🌟🔗 Live Link]()

`next-office-booking-app` is a full-stack web app that features a multi-room booking system linked to multi-tiered subscriptions and individual booking purchases. Includes with user authentication and stripe integration. 

>🚧 **Warning** *This app is incomplete.* The project under which this app was supposed to serve was cancelled before completion, but the client has kindly given permission to share the code and run a version for educational and demonstration purposes.

# Quickstart
*min requirements* `nodejs v16.20.1+` |  `npm 9.6.3+`

Fork or clone the repository.
```shell
git clone https://github.com/Firgrep/next-office-booking-app.git
```

CD into the directory, run install and make a new `.env` file using `.env.example` as the schema.
```shell
cd next-office-booking-app
npm i
touch .env #`ni .env` if you are using powershell
```

See below for more information about the environment variables.

To run a local server.
```shell
npm start
```

In order to make stripe work locally with the webhook, you must run a stripe listener instance in a separate terminal. This requires that you install the Stripe CLI and log in to authenticate your account. For more information, see: https://stripe.com/docs/webhooks/test
```shell
npm run stripe:listen
```

# Features
- Multi-tiered subscription that determines whether or not the user will pay for a certain booking for a particular room
- If the user does not have a subscription (default) or the right subscription, they can make individual booking purchases
- Full refund of purchased bookings outside a predetermined window (e.g. 48-hours before the start of the target booking)

# Specs
This is a three-tiered web app that has a front end (client) and back end (server) with an external database. The app itself is stateless, which means that no information is kept beyond its use, and so any persistent information must be stored on the database (or as cookies on the client for authentication).

- Written in **TypeScript**
- Framework: **Next.js**, initial set up with the **create-t3-app** boilerplate
- Routing: Pages Router, file-based routing system from Next.js
- User Authentication: **NextAuth.js** (integration with the create-t3-app)
- Database: **CockroachDB**
- Database ORM: **Prisma** (integration with the create-t3-app)
- Booking Process: **React.js**, **react-calendar**, **tRPC** with **TanStack Query**
- Payment and Subscriptions: **Stripe**
- API and Middlewares: **tRPC**, **Next.js** (create-t3-app integrated)
- Backend Validation: **Zod** (create-t3-app integrated)
- UI/UX Style and Design: **TailwindCSS**, **DaisyUI**
- Animation and Notification: **react-awesome-reveal**, **react-toaster**
- Hosting: **Google Cloud** using **Docker** on **Google Cloud Run**
- CI/CD: **Google Cloud Build** linked to **Github** repository
- Testing: Manual, additional linting and validation during build
- Sensitive Environmental Variables: **Google Secret Manager**
- (Planned): Email: **Resend**, Domain: **Cloudflare**

# Tech Stack Rationale
The principal factor guiding the decision-making regarding the tools and libraries used for this project was that this would be a 1-man job and that technologies were selected based on the development time it would take to learn and use them efficiently and therefore to deliver the product in a timely manner. Likely there are more advanced options, or one can always custom-build from the ground up, but practicality was chosen over optimization. 

The first matter to decide was which programming language and framework architecture to use. At the time of the project inception, I was familiar with React.js and Django, so I could either work with JavaScript or Python, or a combination of the two. For UI, I leaned towards React.js as it is well-established, has great modular functionality and has a giant ecosystem. But it seemed like a lot of additional work then just to get React working with Django. I knew about Next.js and I had recently discovered the T3 Stack, which used Next.js with TypeScript for both the client and server, and, with tRPC, ensured type-safetey in the client API calls to the server. This seemed like an excellent solution, enhancing both development quality and speed, at the relatively small investment of having to learn TypeScript and the relevant libraries.

`Next.js` was chosen primarily due to its integration of `react.js` but also because it comes with many battle-tested features such as server-side rendering and generation of static HTML where no reactivity will be needed. It also features a robust backend and API structure, which makes most sense when using the same typed programming langauge across client- and serverside. At the time of development, the `/app` directory router was still in beta, but the current `/pages` router should be supported for a long time yet. However, one can also incrementally adopt the new routing system should one need to.

The `create-t3-app` comes with a great suite of tools already integrated (should one choose to use them at initialization). It made sense to use Prisma ORM to quickly and effectively build database schema and use it to handle all database interactions. But the greatest advantage of using Prisma is that the database schema, or models, becomes typed such that TypeScript can pick up on errors or invalid use of models during development time. This, whenever there is a change in the database schema, TypeScript will alert any incompatibilities between the code and the latest database. 

Along the same lines, `nextAuth.js` was used for authentication as all basic features were built out at initialization. But it was kept primarily because of its easy integration with other login services. And `tRPC` along with `TanStack` and `Zod` were the main API system between the frontend queries and backend validations. As with everything else, type-safety was enforced between the client and the server during development allowing for convenient access when managing and building out the two sides.

For payment, `Stripe` was selected owing to its extensive API and testing capabilities during development. 

For all matters styling and design, `TailwindCSS` already comes with the territory, and, once learned, it makes UI development much, much better. `DaisyUI` was chosen for certain class styles and because it is built on TailwindCSS, making such that one can modify its classes by overwriting it using TailwindCSS. Since animations were used very sparingly, `react-awesome-reveal` was considered sufficient. `react-toaster` was implemented for handy pop-up notifications to the end user. 

Finally, `CockroachDB` and `Google Cloud` were selected for the database and hosting owing to their linear price scaling models as well as scaling overall capabilities. `Google Cloud` takes some getting used to, but once the basics are in place it is extremely convenient and flexible, as well as offering a host of other services and tools should one require additional features for the app.

# Notably Outstanding Features
- Email login option
- When a subscription invoice fails, there is currently no interaction on the server to deal with this. The idea was to first build out the email system before implementing this route on the webhook, which itself first required a domain to be set up. 
- SEO and metadata lacking.
- Service contact for registered users.
- See `/TASKLOG.md` for more.