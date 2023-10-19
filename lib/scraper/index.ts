"use server"
import { extractCurrency, extractDescription, extractPrice, extractRating } from "../utils"
import axios from "axios"
import * as cheerio from "cheerio"
export async function scrapAmazonProduct(url: string) {
    if (!url) {
        return
    }
    // curl --proxy brd.superproxy.io:22225 --proxy-user brd-customer-hl_802dd9fc-zone-unblocker:uujm00av2jco -k https://lumtest.com/myip.json

    //BrightData proxy configuration
    const username = String(process.env.BRIGHTDATA_USERNAME)
    const password = String(process.env.BRIGHTDATA_PASSWORD)
    const port = 22225
    const session_id = (1000000 * Math.random()) | 0;
    const options = {
        auth: {
            username: `${username}-session-${session_id}`,
            password,
        },
        host: 'brd.superproxy.io',
        port,
        rejectUnauthorized: false,
    }
    try {

        // fetch the product page
        const response = await axios.get(url, options)
        const $ = cheerio.load(response.data)
        //extract the product data
        const title = $("#productTitle").text().trim()
        const currentPrice = extractPrice(
            $('.priceToPay span.a-price-whole'),
            $('.a-price.a-text-price.apexPriceToPay span.a-offscreen'),
            $('a.size.base.a-color-price'),
            $('a-button-selected .a-color-base'),
        )

        const originalPrice = extractPrice(
            $('#priceblock_ourprice'),
            $('.a-color-secondary .a-price.a-text-price span.a-offscreen'),
            $('#listPrice'),
            $('#priceblock_dealprice'),
            $('.a-size-base.a-color-price')

        )

        const outOfStock = $('#availability .a-color-state').text().trim().toLowerCase() === 'currently unavailable.'

        const images = $('#imgBlkFront').attr('data-a-dynamic-image') || $('#landingImage').attr('data-a-dynamic-image')

        const imageUrls = images ? Object.keys(JSON.parse(images)) : []

        const description = extractDescription($)


        const currency = extractCurrency(

            $('.a-price-symbol'),
        )
        const discountRate = $('.savingsPercentage').text().replace(/[-%]/g, '')
        const rating = extractRating($('.a-icon-alt'))
        //construct the product object
        const data = {
            url,
            title,
            currentPrice: Number(currentPrice) || Number(originalPrice),
            originalPrice: Number(originalPrice) || Number(currentPrice),
            isOutOfStock: outOfStock,
            image: imageUrls[0],
            priceHistroy: [],
            currency,
            discountRate: Number(discountRate),
            rating: Number(rating),
            description,
            lowestPrice: Number(currentPrice) || Number(originalPrice),
            highestPrice: Number(originalPrice) || Number(currentPrice),
            avaragePrice: Number(currentPrice) || Number(originalPrice),
        }
        // console.log("data = ", data)
        return data


    } catch (error: any) {
        throw new Error(`Error while scrapping product ${error.message}`)

    }
}