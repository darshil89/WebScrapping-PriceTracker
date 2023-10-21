import { connectToDb } from '../../../lib/mongoose';
import Product from '../../../lib/models/product.model'
import { scrapAmazonProduct } from '../../../lib/scraper/index'
import { getAveragePrice, getEmailNotifType, getHighestPrice, getLowestPrice } from '@/lib/utils';
export async function GET() {
    try {
        connectToDb();

        const products = await Product.find({})

        if (!products) {
            throw new Error('No products found')
        }

        //Scrap latest product and update DB
        const updatedProduct = await Promise.all(products.map(async (currentProduct) => {
            const scrapedProduct = await scrapAmazonProduct(currentProduct.url)
            if (!scrapedProduct) {
                throw new Error('No products found')
            }
            const updatedPriceHistory = [
                ...currentProduct.priceHistory,
                { price: scrapedProduct.currentPrice },
            ]

            const product = {
                ...scrapedProduct,
                priceHistory: updatedPriceHistory,
                lowestPrice: getLowestPrice(updatedPriceHistory),
                highestPrice: getHighestPrice(updatedPriceHistory),
                averagePrice: getAveragePrice(updatedPriceHistory),
            }

            const updatedProduct = await Product.findOneAndUpdate(
                { url: scrapedProduct.url },
                product,
            )

            // check each product's status and send email if needed

            const emailNotifType = getEmailNotifType(scrapedProduct, currentProduct)


        }))

    } catch (error: any) {
        throw new Error(`Error in get :  ${error.message}`)

    }
}