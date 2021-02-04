## Resource Listing Server

<p>Code for server hosted at <a href="https://resource-listing.azurewebsites.net" target="_blank">https://resource-listing.azurewebsites.net</a> using <a href="https://azure.microsoft.com/" target="_blank">Azure</a> built with <a href="https://expressjs.com/" target="_blank">ExpressJS Framework</a> on <a href="https://nodejs.org/en/" target="_blank">NodeJS<a/></p>

<p>Server for <a href="https://resourcelisting.netlify.app" target="_blank">Aspire</a>, A resource sharing website where users can share their curated list of learning resources</p>

<p><a href="https://github.com/AbhinavRajesh/Resource-Listing-Client" target="_blank" >Code for Client</a></p>
<p><a href="https://resourcelisting.netlify.app" target="_blank">Client</a></p>

## 🛠 Installation & Set Up

<b>Required Node version: 14 or higher</b>

1. Cloning the repository

   ```sh
   git clone https://github.com/AbhinavRajesh/Resource-Listing-Server.git
   ```

2. Going into the directory and installing dependencies

   Using Yarn
   ```sh
   cd Resource-Listing-Server
   yarn
   ```
   
   Using npm
   ```sh
   cd Resource-Listing-Server
   npm i
   ```

3. Start the development server

    Using Yarn
   ```sh
   yarn run dev
   ```
   
   Using npm
   ```sh
   npm run dev
   ```
   
4. Server would be up and running at <a href="http://localhost:5000">http://localhost:5000</a>
   
   
## 📦 Routes

#### AUTH ROUTES

1.  ```http 
    GET /api/v1/auth/google
    ```
    **Route for Google Auth. On success returns the `token` as url parameter to client else redirects back to google signin**
    
2.  ```http
    GET /api/v1/user
    ```
    **Route for getting the user details. `token` is required to get the user Details**
    | PARAMETERS | TYPE     | DESCRIPTION |
    | :---       | :---     | :---        |
    | `token` | `Header` | **Required.** |
    
3.  ```http 
    POST /api/v1/email/signup 
    ```
    **Route for Email Signup On success returns the `token` as url parameter to client else redirects back to email signin**
    | PARAMETERS | TYPE     | DESCRIPTION |
    | :---       | :---     | :---        |
    | `displayName` | `string` | **Required.** |
    | `firstName` | `string` | **Required.** |
    | `lastName` | `string` | **Required.** |
    | `email` | `string` | **Required.** |
    | `password` | `string` | **Required. Password is hashed and stored in the DB using `bcrypt`** |
    
    
4.  ```http
    POST /api/v1/email/login
    ```
    **Route for Email Login On success returns the `token` as url parameter to client else redirects back to email signin**
    | PARAMETERS | TYPE     | DESCRIPTION |
    | :---       | :---     | :---        |
    | `email` | `string` | **Required.** |
    | `password` | `string` | **Required.** |



#### API ROUTES

**All the routes require `token` sent as Header with the `request`**


1.  ```http 
    GET /api/v1/posts
    ```
    **Returns all the latest posts**
2.  ```http 
    GET /api/v1/posts/:searchTag   
    ```
    **Returns all the posts with matching `searchTag`**
    | PARAMETERS | TYPE     | DESCRIPTION |
    | :---       | :---     | :---        |
    | `searchTag`| `string` | **Required.** Searches DB for matching posts |

3.  ```http 
    GET /api/v1/post/toggleSaved/:postId
    ```
    **Returns a message letting know if the post was saved or not**
    | PARAMETERS | TYPE     | DESCRIPTION |
    | :---       | :---     | :---        |
    | `postId`| `string` | **Required.** Adds the `postId` to the array of saved posts in the User model|

4.  ```http   
    GET /api/v1/user/posts
    ```
    **Returns all the posts sent by the user `Self Post`**

5.  ```http 
    GET /api/v1/account/:userId
    ```
    **Returns all the posts sent by the user `Other User's post`**
    | PARAMETERS | TYPE     | DESCRIPTION |
    | :---       | :---     | :---        |
    | `userId`| `string` | **Required.** Searches the DB for the posts of the user with `_id` : `userid`|
    
6.  ```http 
    GET /api/v1/savedPost
    ```
    **Returns all the saved posts of the user**
    
7.  ```http 
    POST /api/v1/post/add
    ```
    **Returns the updated token**
    | PARAMETERS | TYPE     | DESCRIPTION |
    | :---       | :---     | :---        |
    | `title`    | `string` | **Required.** Saves the `title` as `title` in the DB for the Post Model|
    | `resource` | `string` | **Required.** Saves the `resource` as `description` in the DB for the Post Model|
    | `tags`    | `array` | **Required.** Saves the `tags` as `tags` and also as `tags_lower` [ Saves the tags in lowercase for finding posts related to a topic ] in the DB for the Post Model|
    
    
**A Star ⭐ to the repository would be highly appreciated 😁** 
