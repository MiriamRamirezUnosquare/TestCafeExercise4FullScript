import { Selector } from 'testcafe';

const getElementsByXPath = Selector(xpath => {
    const iterator = document.evaluate(xpath, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
    const items = [];    let item = iterator.iterateNext();
    while (item) {
        items.push(item);
        item = iterator.iterateNext();
    }
    return items;
});
export default function (xpath) {
    return Selector(getElementsByXPath(xpath));
}

fixture `Amazon page`
    .page `https://www.amazon.com/`;    

test('First Full Script - Amazon page', async t => {
    await t
    .maximizeWindow()
    .wait(15000)
    .click(Selector('input[id="twotabsearchtextbox"]'))
    .typeText(Selector('input[id="twotabsearchtextbox"]'), 'Samsung Galaxy Note 20')
    .pressKey('enter')
    .expect(Selector('h2').count).gt(0, {timeout:5000}, 'Assert items are displayed' )
    .takeScreenshot()

    const priceFirstElement = await Selector(getElementsByXPath('//div[@data-component-type="s-search-result"][1]//span[@class="a-offscreen"]')).textContent
    await t
    .wait(2000)
    .click(Selector(getElementsByXPath('//div[@data-component-type="s-search-result"][1]//span[@class="a-offscreen"]')))
    .wait(5000)
    .expect(Selector('div[id^="apex_desktop"][style=""] span.a-offscreen').textContent).eql(priceFirstElement, {timeout:5000}, 'Assert price on details equal to saved price')
    .takeScreenshot()

    .click(Selector('span').withExactText('Add to Cart'))
    .wait(3000)
    .expect(Selector('span#nav-cart-count').textContent).eql('1', 'Assert cart count equal to 1')
    .click('a#nav-cart')
    .expect(Selector('p.a-spacing-mini>span').textContent).eql(priceFirstElement, {timeout:5000}, 'Assert price on cart equal to saved price')
    .takeScreenshot()

    .click('input[data-action="delete"]')
    .expect(Selector('span#nav-cart-count').textContent).eql('0', {timeout:5000}, 'Assert cart count equal to 0')
}); 