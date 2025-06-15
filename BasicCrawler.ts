import * as cheerio from 'cheerio';

const MAX_UNIQUE_PAGES = 50;

const seenUrls: { [key: string]: number } = {}
let global_base_url: URL;

export async function CreateCrawler(baseUrl: string, includes?: string[], ignores?: string[]) {
    global_base_url = new URL(baseUrl);
    await crawlHTML(baseUrl);
}

export async function crawlHTML(currentUrl: string) {
    if (Object.keys(seenUrls).length >= MAX_UNIQUE_PAGES) {
        console.log(`Max unique pages (${MAX_UNIQUE_PAGES}) gathered. Closing the crawler...`);
        return seenUrls;
    }
    const currentUrlObj = new URL(currentUrl);

    if (currentUrlObj.hostname != global_base_url.hostname) {
        console.error(`cannot leave basepath of ${global_base_url.hostname} to ${currentUrlObj.hostname}`)
        return seenUrls;
    }

    const response = await fetch(currentUrl);

    if (response.status > 399) {
        console.error(`URL ${normalizeUrl(currentUrl)} gave status code ${response.status} .`)
        return seenUrls;
    }
    const contentType = response.headers.get('content-type')
    if (contentType && !contentType.includes("text/html")) {
        console.error(`Cannot parse non-html response on URL ${normalizeUrl(currentUrl)}`)
        return seenUrls;
    }

    const normalizedUrl = normalizeUrl(currentUrl);
    if (seenUrls[normalizedUrl]) {
        console.log(`Already crawled ${normalizedUrl}. Skipping...`)
        seenUrls[normalizedUrl]++;
        return seenUrls;
    }
    seenUrls[normalizedUrl] = 1;

    console.log(`Now crawling ${currentUrl}`)
    let nextLinks = extractLinks(currentUrl, await response.text());

    for (const nextLink of nextLinks) {
        await crawlHTML(nextLink);
    }

    return seenUrls;
}

export function extractLinks(url: string, HTMLBody: string) {
    const $ = cheerio.load(HTMLBody);

    let links: string[] = []
    $('a').each((_, link) => {
        const currentLink = $(link).attr('href')
        if (currentLink && currentLink != url) {
            const correctLink = new URL(currentLink, url).toString();
            const normalizedUrl = normalizeUrl(correctLink.toString())

            if (!seenUrls[normalizedUrl]) {
                links.push(correctLink.toString())
            }
        }
    })
    return links;

}

export function normalizeUrl(input: string): string {
    if (!input || input.trim().length === 0) {
        console.error("Cannot process empty url.")
        throw new Error("Cannot process empty url.")
    }

    const baseUrl: URL = new URL(input);
    let fullPath = `${baseUrl.hostname}${baseUrl.pathname}`

    if (fullPath.slice(-1) === "/") {
        fullPath = fullPath.slice(0, -1);
    }

    return fullPath;
}

export async function ScrapeHtml(HTMLBody: string){
    
}

CreateCrawler("https://mazautoglass.com/")
