## todo

- Currently if a user deletes a sprayMix it will then only be avaliable to sprayEvents and that sprayMix will not beable to be reused the user will need to recreate the sprayMix to be able to use it again. If the sprayMix is not tied to a sprayEvent then it will be deleted from the database. Not sure if this can be improved or not.
- remove cypress
  -fix delete on spray concoction display
- Input validation with Joi server and client
- Parametized query with password and email storage
- date display
- clean out the users details in the database where the user has authenicated and then not been authorised
- -Add admin https://authjs.dev/guides/basics/role-based-access-control
- Implement server-side validation of user input to prevent XSS attacks, you can follow these steps:

Sanitize user input: Before accepting user input, you should sanitize it by removing any HTML, JavaScript, or other potentially malicious content. You can use libraries like DOMPurify or sanitize-html to sanitize user input on the server-side.

Validate user input: In addition to sanitizing user input, you should also validate it to ensure that it conforms to expected formats and does not contain any unexpected characters or symbols. You can use regular expressions or libraries like Joi or Express Validator to validate user input on the server-side.

Use a Content Security Policy (CSP): A CSP is a security feature that allows you to specify which sources of content are allowed to be loaded on a web page. By using a CSP, you can prevent malicious scripts from being injected into your web pages by blocking any content that does not come from trusted sources.

Use HTTP-only cookies: By using HTTP-only cookies, you can prevent XSS attacks from stealing user session cookies, as the cookies cannot be accessed by JavaScript code.

Use security headers: You can use security headers like X-XSS-Protection, X-Content-Type-Options, and X-Frame-Options to provide additional protection against XSS attacks.

## Problems

- When creating a spraymix can proceed without selecting a spray

## current status

You are about to alter the column `rate` on the `Spray` table, which contains 17 non-null values. The data in that column will be cast from `Int` to `Double`.
• You are about to drop the column `sprayMixId` on the `SprayEvent` table, which still contains 21 non-null values.
