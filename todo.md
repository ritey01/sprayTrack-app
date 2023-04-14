## todo
- remove cypress
- back button on add crop with nothing entered
- Input validation with Joi server and client 
- Standardize input with title so duplicate
- Parametized query with password and email storage
- add a delete to sprayMix display
- date display
- @@index database

  

## Problems
- When selecting a "created" spraylist how that is represented in sprayEvent state versus the table. Currently state is sprayList:[] versus table SprayListID
- When creating a spraymix can proceed without selecting a spray
- Spray Mix Name not persisting when first entered and then go back to add more spray

- fix no border around sprays on spray page when not active
- add message display makeSpray.js when nothing selected

## current status
-Cant get the database to record the users information automatically, it seems the PrismaAdapter is doing something weird, if this is commented out it can log in and out via github, if I enable it I get a user account error.  NOt sure if it is a nexy-auth to Prisma issue or a Prisma to planetscale issue.
