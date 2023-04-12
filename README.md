This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

https://www.loom.com/share/c7270758f53f40dc93f9dce1d8e7b725

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Connect the database 

```bash 
pscale connect sprayapp initial-setup --port 3309 
```
## User stories

As a cropping farmer I want a way to record the details of any crop spraying I do so that I meet the legal requirements of recording spray events and I have a record for future review.

As a rural farmer I need an application that can work on an internet connection that can be minimal at times.

As a spray truck operator I want to be able to easily enter the required data so that I can use the application while I am driving in the paddock.

As a cropping farmer I want to be able to see previous spraying events so that I can make decisions on similar future spraying events.

---

NOTE:  This application is currently being built so full features have not been implemented and the UI is not finished.  Next steps:

1) Implement Authorisation so a user can login and only get their spray information.
2) Create dashboard to view spraying activites
3) Put it out for user testing and feedback to make user focused and ensure it meets their needs
4) Port it across to React Native