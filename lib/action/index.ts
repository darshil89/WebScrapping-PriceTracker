"use server";

import { revalidatePath } from "next/cache";
import { scrapAmazonProduct } from "../scraper/index";
import { connectToDb } from "../mongoose";
import Product from "../models/product.model";
import { getAveragePrice, getHighestPrice, getLowestPrice } from "../utils";
import { User } from "@/types";
import { generateEmailBody, sendEmail } from "../nodemailer";

export async function scrapAndStoreProduct(productUrl: string) {
    if (!productUrl) {
        throw new Error('Product url is required')
    }
    try {
        await connectToDb();
        const scrapedProduct = await scrapAmazonProduct(productUrl);
        if (!scrapedProduct) return;

        let product = scrapedProduct;

        // console.log('scrapedProduct = ', product)

        const existingProduct = await Product.findOne({
            url: scrapedProduct.url,
        });

        if (existingProduct) {
            const updatedPriceHistory: any = [
                ...existingProduct.priceHistory,
                { price: scrapedProduct.currentPrice },
            ]

            product = {
                ...scrapedProduct,
                priceHistroy: updatedPriceHistory,
                lowestPrice: getLowestPrice(updatedPriceHistory),
                highestPrice: getHighestPrice(updatedPriceHistory),
                avaragePrice: getAveragePrice(updatedPriceHistory),
            }
        }
        const newProduct = await Product.findOneAndUpdate(
            { url: scrapedProduct.url },
            product,
            { upsert: true, new: true }
        )

        revalidatePath(`/products/${newProduct._id}`)

    } catch (error: any) {
        throw new Error(`Error while scrapping product ${error.message}`)
    }

}

export async function getProductById(productId: string) {
    if (!productId) {
        throw new Error('Product id is required')
    }
    try {
        await connectToDb();
        const product = await Product.findById({ _id: productId });
        if (!product) {
            throw new Error('Product not found')
        }
        return product;
    } catch (error: any) {
        throw new Error(`Error while getting product ${error.message}`)
    }
}


export async function getSimilarProducts(productId: string) {
    try {
        await connectToDb();
        const currProduct = await Product.findById(productId)
        if (!currProduct) {
            return null
        }
        const similarProducts = await Product.find({
            _id: { $ne: productId },
        }).limit(3)

        return similarProducts;

    } catch (error: any) {
        throw new Error(`Error while getting products ${error.message}`)
    }
}
export async function getAllProducts() {
    try {
        await connectToDb();
        const products = await Product.find()
        return products;
    } catch (error: any) {
        throw new Error(`Error while getting products ${error.message}`)
    }
}


export async function addUserEmailToProduct(productId: string, userEmail: string) {
    try {
      const product = await Product.findById(productId);
  
      if(!product) return;
  
      const userExists = product.users.some((user: User) => user.email === userEmail);
  
      if(!userExists) {
        product.users.push({ email: userEmail });
  
        await product.save();
  
        const emailContent = await generateEmailBody(product, "WELCOME");
  
        await sendEmail(emailContent, [userEmail]);
      }
    } catch (error) {
      console.log(error);
    }
  }