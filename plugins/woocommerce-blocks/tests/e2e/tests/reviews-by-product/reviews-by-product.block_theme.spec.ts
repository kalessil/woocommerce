/**
 * External dependencies
 */
import { expect, test } from '@woocommerce/e2e-utils';

/**
 * Internal dependencies
 */
import { allReviews, hoodieReviews } from '../../test-data/data/data';

const BLOCK_NAME = 'woocommerce/reviews-by-product';

const latestReview = allReviews[ allReviews.length - 1 ];

const highestRating = [ ...allReviews ].sort(
	( a, b ) => b.rating - a.rating
)[ 0 ];

const lowestRating = [ ...allReviews ].sort(
	( a, b ) => a.rating - b.rating
)[ 0 ];

test.describe( `${ BLOCK_NAME } Block`, () => {
	test.beforeEach( async ( { admin, editor } ) => {
		await admin.createNewPost();
		await editor.insertBlock( { name: BLOCK_NAME } );
	} );

	test( 'block can be inserted and it successfully renders a review in the editor and the frontend', async ( {
		page,
		editor,
	} ) => {
		const productCheckbox = page.getByLabel( 'Hoodie, has 2 reviews' );
		await productCheckbox.check();
		await expect( productCheckbox ).toBeChecked();

		const doneButton = page.getByRole( 'button', { name: 'Done' } );
		await doneButton.click();

		await expect(
			page.getByText( hoodieReviews[ 0 ].review )
		).toBeVisible();

		await editor.publishAndVisitPost();

		await expect(
			page.getByText( hoodieReviews[ 0 ].review )
		).toBeVisible();
	} );

	test( 'sorts by most recent by default and can sort by highest rating', async ( {
		page,
		frontendUtils,
		editor,
	} ) => {
		await editor.publishAndVisitPost();
		const block = await frontendUtils.getBlockByName( BLOCK_NAME );

		const reviews = block.locator(
			'.wc-block-components-review-list-item__text'
		);

		await expect( reviews.first() ).toHaveText( latestReview.review );

		const select = page.getByLabel( 'Order by' );
		await select.selectOption( 'Highest rating' );

		await expect( reviews.first() ).toHaveText( highestRating.review );
	} );

	test( 'can sort by lowest rating', async ( {
		page,
		frontendUtils,
		editor,
	} ) => {
		await editor.publishAndVisitPost();
		const block = await frontendUtils.getBlockByName( BLOCK_NAME );

		const reviews = block.locator(
			'.wc-block-components-review-list-item__text'
		);

		await expect( reviews.first() ).toHaveText( latestReview.review );

		const select = page.getByLabel( 'Order by' );
		await select.selectOption( 'Lowest rating' );

		await expect( reviews.first() ).toHaveText( lowestRating.review );
	} );
} );