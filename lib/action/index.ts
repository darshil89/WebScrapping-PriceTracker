"use server";
import { scrapAmazonProduct } from "../../scraper/index";
export async function scrapAndStoreProduct(productUrl: string) {
    if (!productUrl) {
        throw new Error('Product url is required')
    }
    try {
        const scrapedProduct = await scrapAmazonProduct(productUrl);

    } catch (error: any) {
        throw new Error(`Error while scrapping product ${error.message}`)
    }

}