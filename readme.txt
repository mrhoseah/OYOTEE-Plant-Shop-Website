API Endpoints
============


Categories:
    create new category {name,description} =  POST: /categories
    Browse categories = GET: /categories
    Fetch a category by Id = GET: /categories/:id
    Update by id: PUT: /categories/:id
    Delet a category = DELETE: /categories/:id
Users:
    Create new user {name,email,password} =  POST: /signup
    Browse users = GET: /users
    Fetch a user by Id = GET: /users/:id
    Update by id: PUT: /users/:id
    Delete a user  = DELETE: /users/:id

    Forgot passsword {email} = POST: auth/forgot-password
    Reset passsword {code,passsword, passwordConfirmation} = POST: auth/reset-password

Products:
    Create new product {name,description,otherDetails,image,quantity,price,published,categoryId} =  POST: /products
    Browse products = GET: /products
    Browse reviews on a specific products = GET: /products/:id/reviews
    Fetch a product by Id = GET: /products/:id
    Update by id: PUT: /products/:id
    Delete a product= DELETE: /products/:id
Coupons:
    Create new coupon {name,discount,startDate,expiryDate} =  POST: /coupons
    Browse coupons = GET: /coupons
    Fetch a coupon by Id = GET: /coupons/:id
    Update by id: PUT: /coupons/:id
    Delete a coupon= DELETE: /coupons/:id
Reviews:
    Create review on product {content,rateValue(float/number),productId} =  POST: /products
    Browse reviews on a specific products = GET: /products/:id/reviews
    Fetch a review by Id = GET: /reviews/:id
    Update by id: PUT: /products/:id/reviews/:id
    Delete a review  = DELETE: /reviews/:id
Likes:
    Createa a like on product {productId} =  POST: /products
    Browse likes on a specific products = GET: /products/:id/likes
    Update by id: PUT: /reviews/products/:id/likes/:id
    Delete a review  = DELETE: /likes/:id
