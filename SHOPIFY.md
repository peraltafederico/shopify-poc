# Shopify Setup Guide for Next.js Integration (Beginner-Friendly)

## What You'll Need

- An email address
- No credit card needed (we'll use the free development store)
- About 30 minutes

## 💰 Cost Information

### For Learning/Development: **FREE**
- Shopify Partner account: Free forever
- Development stores: Unlimited and free
- Test as long as you want

### For Real Business: **PAID**
- Basic Plan: $29/month
- Shopify Plan: $79/month
- Advanced: $299/month

**We'll use the FREE option in this guide!**

## Step 1: Create Your FREE Shopify Development Store

### 1.1 Create a Shopify Partner Account (Free)

1. **Open your browser** and go to: https://partners.shopify.com

2. **Click "Join now"** (green button)

3. **Fill the signup form:**
   - Email address
   - Create a password
   - Business name (can be anything, like "My Dev Store")
   - Check "I agree to the Partner Program Agreement"
   - Click "Create account"

4. **Verify your email**
   - Check your inbox
   - Click the verification link

### 1.2 Create Your First Development Store

1. **After logging in**, you'll see the Partner Dashboard

2. **Click "Stores"** in the left sidebar

3. **Click "Add store"** button

4. **Choose store type:**
   - Select "Development store" (this is FREE!)
   - Click "Next"

5. **Fill store information:**
   - Store name: `nextjs-shopify-test` (or any name)
   - Store URL: Will auto-generate like `nextjs-shopify-test.myshopify.com`
   - Password: Auto-generated (save this!)
   - Store purpose: Select "Build a new app or theme"
   - Click "Create development store"

6. **Wait a moment** while Shopify creates your store (usually 30 seconds)

### 1.3 Access Your New Store

1. **Click "Log in to store"** when it appears
2. **You're now in your Shopify Admin!** 🎉

## Step 2: Understanding Shopify Apps (Skip for Now)

For this basic setup, you don't need any additional apps. Later you might want:
- **Shopify Headless** (helps manage headless stores)
- **Metafields** (for custom product fields)

But let's skip this for now and focus on the essentials!

## Step 3: Create API Access for Next.js (Most Important Part!)

This is where we get the "key" that lets Next.js talk to Shopify.

### 3.1 Enable Custom App Development

1. **In your Shopify Admin**, look at the left sidebar

2. **Click "Settings"** (at the very bottom)

3. **In Settings, click "Apps and sales channels"**

4. **Click "Develop apps"** (might be at the top)

5. **First time?** You'll see "Enable custom app development"
   - Click "Enable custom app development"
   - Read the warning and click "Enable custom app development" again

### 3.2 Create Your App

1. **Click "Create an app"** button

2. **Fill in:**
   - App name: `Next.js Storefront`
   - App developer: Select your email
   - Click "Create app"

### 3.3 Configure What Your App Can Access

1. **Click "Configure Storefront API scopes"**

2. **Check these boxes** (scroll to find them):
   
   **Products (so Next.js can show products):**
   - ✅ `Read product listings`
   - ✅ `Read product inventory`
   - ✅ `Read collection listings`
   
   **Cart & Checkout (so customers can buy):**
   - ✅ `Read and modify checkouts`
   
   **Customers (for accounts):**
   - ✅ `Read customer details`
   - ✅ `Modify customer details`

3. **Click "Save"** at the top right

### 3.4 Configure Admin API (Quick Step)

1. **Click "Configure Admin API scopes"**

2. **Just check these basic ones:**
   - ✅ `read_products`
   - ✅ `read_product_listings`

3. **Click "Save"

### 3.5 Install Your App

1. **Click "Install app"** button (top right)

2. **Confirm by clicking "Install"** in the popup

### 3.6 Get Your Secret Access Token (VERY IMPORTANT!)

1. **Click "API credentials"** tab

2. **Scroll to "Storefront API access token"**

3. **Click "Reveal token once"**

4. **⚠️ IMPORTANT: Copy this token NOW!**
   - It looks like: `shpat_1234567890abcdef`
   - Save it in a text file
   - You can't see it again after leaving this page!
   - This is what Next.js will use to get your store data

## Step 4: Add Some Test Products

Before connecting to Next.js, let's add some products to display!

### 4.1 Add Your First Product

1. **In the left sidebar, click "Products"**

2. **Click "Add product"**

3. **Fill in:**
   - Title: `Cool T-Shirt`
   - Description: `This is an awesome t-shirt!`
   
4. **Add a price:**
   - Scroll to "Pricing"
   - Price: `29.99`
   
5. **Add an image:**
   - In "Media" section, click "Add"
   - You can use free images from Unsplash (built-in!)
   - Or upload your own
   
6. **Set inventory:**
   - Scroll to "Inventory"
   - Check "Track quantity"
   - Available: `100`
   
7. **Make it active:**
   - On the right side, under "Status"
   - Select "Active"
   
8. **Click "Save"** (top right)

### 4.2 Add 2-3 More Products

Repeat the above steps to add a few more products. Ideas:
- "Awesome Hoodie" - $59.99
- "Classic Jeans" - $79.99
- "Summer Hat" - $19.99

## Step 5: Test If Everything Works

### 5.1 Find Your Store Information

1. **Your store domain:** Look at your browser URL
   - It's like: `nextjs-shopify-test.myshopify.com`
   - Write this down!

2. **Your access token:** The one you copied in Step 3.6
   - Like: `shpat_1234567890abcdef`

### 5.2 Quick Test (Optional)

If you want to test if your API works, you can:

1. **Open a new browser tab**

2. **Go to:** `https://your-store-name.myshopify.com/api/2024-01/graphql`
   - Replace `your-store-name` with your actual store name

3. **If you see any response**, your store is ready!

## Step 6: Create a Collection (Optional but Recommended)

Collections group products together (like "Summer Sale" or "T-Shirts").

### 6.1 Create Your First Collection

1. **Click "Products"** in sidebar

2. **Click "Collections"**

3. **Click "Create collection"**

4. **Fill in:**
   - Title: `All Products`
   - Description: `Browse all our products`
   
5. **Collection type:**
   - Select "Automated"
   - Conditions: "Product price is greater than $0"
   - This automatically includes all products!
   
6. **Click "Save"**

## Step 7: Quick Settings Check

### 7.1 Enable Customer Accounts

1. **Go to Settings** → **Checkout**

2. **Scroll to "Customer accounts"**

3. **Select:** "Accounts are optional"
   - This lets customers checkout as guests
   - Easier for testing!

4. **Click "Save"

## Step 8: Skip Complex Setup (Use Defaults)

For development, Shopify's default settings work perfectly:

✅ **Checkout:** Already configured  
✅ **Payments:** Test mode is automatic in dev stores  
✅ **Shipping:** Default rates are fine for testing  

**Note:** In development stores, you can place test orders without real payment!

## Step 9: Your Store URLs

### For Development (What We're Using)
✅ Your store URL: `https://your-store-name.myshopify.com`  
✅ Admin URL: `https://your-store-name.myshopify.com/admin`

### For Real Business (Future)
- You can add custom domains like `www.mycoolstore.com`
- This costs extra (domain registration)
- Not needed for development!

## Step 10: Collect Your Information for Next.js

### Write Down These Two Things:

1. **Your Store Domain:**
   - Look at your browser URL
   - Example: `nextjs-shopify-test.myshopify.com`
   - Write: `SHOPIFY_STORE_DOMAIN=nextjs-shopify-test.myshopify.com`

2. **Your Access Token:**
   - The long code from Step 3.6
   - Example: `shpat_1234567890abcdef`
   - Write: `SHOPIFY_STOREFRONT_ACCESS_TOKEN=shpat_1234567890abcdef`

**Save these in a text file called `shopify-info.txt` - you'll need them in the next guide!**

## Checklist - Are You Ready?

Before moving to the Next.js setup, make sure:

✅ You have a Shopify Partner account  
✅ You created a development store (free!)  
✅ You created a private app  
✅ You saved your access token  
✅ You added at least 2-3 products  
✅ You know your store domain  

If you checked all boxes, you're ready for `DEV.md`!

## Common Questions for Beginners

### Q: Do I need to pay anything?
**A:** No! Development stores are completely free.

### Q: Can I delete and start over?
**A:** Yes! You can create unlimited dev stores.

### Q: What if I lost my access token?
**A:** Create a new one in API credentials (you can have multiple).

### Q: Can I use fake products?
**A:** Yes! This is just for learning.

### Q: Do I need a business to start?
**A:** No! Anyone can create a partner account.

## Important Notes for Beginners

### What Shopify Handles for You:
- ✅ Secure checkout and payments
- ✅ Inventory management
- ✅ Customer accounts
- ✅ Order management
- ✅ Email notifications

### What You'll Build with Next.js:
- 🛍️ Beautiful product pages
- 🔍 Search and filters
- 🛒 Shopping cart interface
- 📱 Custom design and layout

## Need Help?

- **Shopify Help Center:** help.shopify.com
- **Partner Support:** partners.shopify.com/support
- **Community Forums:** community.shopify.com

## Ready for the Next Step?

You've successfully:
1. Created a FREE Shopify development store
2. Set up API access for Next.js
3. Added test products
4. Saved your credentials

**Now let's build your Next.js app! Continue to `DEV.md` →**