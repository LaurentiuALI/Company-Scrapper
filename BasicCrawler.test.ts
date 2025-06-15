import { extractLinks } from "./BasicCrawler";

const { normalizeUrl } = require('./BasicCrawler.ts')


test('NormalizeUrl error on empty url', () => {
    const input = ''
    expect(() => normalizeUrl(input)).toThrow("Cannot process empty url.");
})

test('NormalizeUrl lowercase url', () => {
    const input = 'http://YouTUbe.Com'
    const actual = normalizeUrl(input)
    const expected = 'youtube.com'
    expect(actual).toBe(expected);
})

test('NormalizeUrl strip empty path', () => {
    const input = 'http://YouTUbe.Com/'
    const actual = normalizeUrl(input)
    const expected = 'youtube.com'
    expect(actual).toBe(expected);
})


test('NormalizeUrl http strip protocol', () => {
    const input = 'http://youtube.Com/path'
    const actual = normalizeUrl(input)
    const expected = 'youtube.com/path'
    expect(actual).toBe(expected);
})


test('NormalizeUrl https strip protocol', () => {
    const input = 'https://youtube.Com/path'
    const actual = normalizeUrl(input)
    const expected = 'youtube.com/path'
    expect(actual).toBe(expected);
})

test('NormalizeUrl https strip protocol', () => {
    const input = 'https://youtube.Com/path'
    const actual = normalizeUrl(input)
    const expected = 'youtube.com/path'
    expect(actual).toBe(expected);
})


test('extractLinks get absolute link', () => {
    const input = `
    <body>
        <main>
            <a href="https://youtube.com"> Youtube </a>
        </main>
    </body>
    `
    const actual = extractLinks("http://youtube.com", input)
    const expected = ['https://youtube.com']
    expect(actual).toStrictEqual(expected);
})

test('extractLinks get absolute link', () => {
    const input = `
    <body>
        <main>
            <a href="https://youtube.com/path1"> Youtube 1</a>
            <a href="https://youtube.com/path2"> Youtube 2</a>
        </main>
    </body>
    `
    const actual = extractLinks("http://youtube.com", input)
    const expected = ["https://youtube.com/path1", "https://youtube.com/path2"]
    expect(actual).toStrictEqual(expected);
})

test('extractLinks get relative link', () => {
    const input = `
    <body>
        <main>
            <a href="/path1"> Youtube 1</a>
        </main>
    </body>
    `
    const actual = extractLinks("http://youtube.com", input)
    const expected = ["https://youtube.com/path1"]
    expect(actual).toStrictEqual(expected);
})