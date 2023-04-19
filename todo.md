## todo
- remove cypress
- back button on add crop with nothing entered
- Input validation with Joi server and client 
- Parametized query with password and email storage
- add a delete to sprayMix display
- date display
- @@index database
- clean out the users details in the database where the user has authenicated and then not been authorised
- -Add admin https://authjs.dev/guides/basics/role-based-access-control
- Implement server-side validation of user input to prevent XSS attacks, you can follow these steps:

Sanitize user input: Before accepting user input, you should sanitize it by removing any HTML, JavaScript, or other potentially malicious content. You can use libraries like DOMPurify or sanitize-html to sanitize user input on the server-side.

Validate user input: In addition to sanitizing user input, you should also validate it to ensure that it conforms to expected formats and does not contain any unexpected characters or symbols. You can use regular expressions or libraries like Joi or Express Validator to validate user input on the server-side.

Use a Content Security Policy (CSP): A CSP is a security feature that allows you to specify which sources of content are allowed to be loaded on a web page. By using a CSP, you can prevent malicious scripts from being injected into your web pages by blocking any content that does not come from trusted sources.

Use HTTP-only cookies: By using HTTP-only cookies, you can prevent XSS attacks from stealing user session cookies, as the cookies cannot be accessed by JavaScript code.

Use security headers: You can use security headers like X-XSS-Protection, X-Content-Type-Options, and X-Frame-Options to provide additional protection against XSS attacks.



  

## Problems
- When selecting a "created" spraylist how that is represented in sprayEvent state versus the table. Currently state is sprayList:[] versus table SprayListID
- When creating a spraymix can proceed without selecting a spray
- Spray Mix Name not persisting when first entered and then go back to add more spray

- fix no border around sprays on spray page when not active
- add message display makeSpray.js when nothing selected

## current status

