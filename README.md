**Contents**

- [Overview](#overview)
- [Quickstart](#quickstart)
- [Features](#features)
- [Specs](#specs)
- [Tech Stack Rationale](#tech-stack-rationale)
- [Backend Logic](#backend-logic)
- [Missing Features](#missing-features)
- [Known Bugs](#known-bugs)
- [Environmental Variables](#environmental-variables)
- [Resources](#resources)

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

To run a local server.
```shell
npm run dev
```

>See below for more information about the environment variables in case server does not start up locally.

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

Finally, `CockroachDB` and `Google Cloud` were selected for the database and hosting owing to their linear price scaling models as well as scaling overall capabilities. `Google Cloud` takes some getting used to, but once the basics are in place it is extremely convenient and flexible, as well as offering a host of other services and tools should one require additional features for the app. Additionally, since the app would first serve a regional purpose rather than something international, both services above had physical locations either in at the client's destination or not far away, this would have aided in the web request speed of the app.

# Backend Logic
### Individual Purchases

<img src="https://firebasestorage.googleapis.com/v0/b/portfolio-d0330.appspot.com/o/next-office-booking-app%2Fnext-office-booking-app-diagram-purchase.png?alt=media&token=2b102214-d081-49fd-aff8-84d96fc923b3" alt="purchase diagram" width="800" />

* GREEN PATHS - User's UI (what the user sees)
* RED PATHS - Backend logic (server)

After `Purchase Booking` has been initiated, the server will proceed with purchaseBooking route, from there there are 4 possible options.
- Successful payment
- Cancellation
- Inactive / Expiry
- Inactive / Resume

The booking page will need to first check whether the user has any pending Stripe sessions. If the user has pending sessions, the booking will be blocked until the user decides what to do with the current session (either cancel it manually or continue purchase) - or until the 30min timeout at which point the session naturally expires. 

### Subscription

<img src="https://firebasestorage.googleapis.com/v0/b/portfolio-d0330.appspot.com/o/next-office-booking-app%2Fnext-office-booking-app-diagram-subscriptions.png?alt=media&token=ea821e65-212d-49cb-898f-607ea96cf003" alt="subscription diagram" width="800" />

**Back End Routes**
- BillingPortal/Cancel `createBillingSession `
- Update To Pro `updateSubscription("toPro") `
- Update To PlusC.` updateSubscription("toPlusC")` 
- Update To PlusP. `updateSubscription("toPlusP")` 
- Update To Basic `updateSubscription("toBasic")` 
- Purchase Basic `createSubscriptionCheckoutSession("basic")` 
- Purchase PlusC. `createSubscriptionCheckoutSession("plusC")` 
- Purchase PlusP. `createSubscriptionCheckoutSession("plusP")` 
- Purchase Pro `createSubscriptionCheckoutSession("pro")` 

**Front End "Profiles"**
The front will first retrieve user data from backend and then display the possible options based on the relevant "profile" setup.
- FlexPay
- Basic
- PlusConference
- PlusPhone
- Pro

What if the user has cancelled their subscription?
If the user has cancelled their subscription, they are only able to manage their billing, through which they can renew their subscription. Downgrading/Upgrading subscriptions on-site are suspended if a subscription has been cancelled (but it's possible to renew and switch immediately into another subscription via the stripe billing portal, but the options here are limited).  If no renewal takes place before the subscription expiry date, the profile will revert back to FlexPay. 


# Missing Features
- Email login option
- Seperate login page
- Suspense and UI indicators during load in certain places
- When a subscription invoice fails, there is currently no interaction on the server to deal with this. The idea was to first build out the email system before implementing this route on the webhook, which itself first required a domain to be set up. 
- SEO and metadata lacking.
- Service contact for registered users.
- See `/TASKLOG.md` for more.

# Known Bugs 🐞
-  App did not display bookings for the relevant day, even though entries were checked out in db. Has not been able to replicate this bug, but something to look out for.

# Environmental Variables
A local server will likely not start without a database connection. There are many stateless database providers out there (CockroachDB, Planetscale, Supabase, Firebase, Google, AWS, etc.). Once you have picked a database, input the connection to `DATABASE_URL` in the `.env` file located in the root folder.

>**Warning** *Make sure to change the `datasource db.provider` in `/prisma/schema.prisma` to fit your database. See [datasource providers at Prima](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference#datasource) for more information.

NextAuth will require a secret made for the app. Generate one using the steps outlined in the `.env.example` file.

Several login providers for NextAuth have been implemented in the app. For documentation and configuration, please find the relevant providers at https://next-auth.js.org/providers/ .

Stripe will not work without the necessary API and webhook keys along with the required product IDs. But Stripe has extensive and thorough documentation available at: https://stripe.com/docs . 

# Resources
### Documentation

- [Next.js](https://nextjs.org/docs)
- [Prisma](https://www.prisma.io/docs)
- [create-t3-app](https://create.t3.gg/en/introduction)
- [TanStack Query](https://tanstack.com/query/latest/docs/react/overview)
- [tRPC](https://trpc.io/docs)
- [NextAuth](https://next-auth.js.org/getting-started/introduction)
- [Stripe](https://stripe.com/docs)
- [TailwindCSS](https://tailwindcss.com/docs/installation)

### Video Tutorials
Shoutout to these amazing developers and their super helpful tutorials. You can find practically everything you need regarding web development, TypeScript, Next.js, Prisma, tRPC, Stripe and much more from these wonderful people!
- [Josh tried coding](https://www.youtube.com/@joshtriedcoding)
- [Christopher Ehrlich](https://www.youtube.com/@ccccjjjjeeee)
- [Matt Pocock](https://www.youtube.com/@mattpocockuk)
- [ByteMonk](https://www.youtube.com/@ByteMonk)
- [Web Dev Simplified](https://www.youtube.com/@WebDevSimplified)
