/**
 * External dependencies
 */
import { debounce } from 'lodash';
/**
 * WordPress dependencies
 */
import { useEffect, useMemo, useState } from '@wordpress/element';
import { useDispatch } from '@wordpress/data';

export default function useAutohide( clientId, innerBlocks, ref ) {
	const [ state, setState ] = useState( {
		isWrapping: false,
		visibilityMap: [],
	} );
	const [ defaultView, setDefaultView ] = useState( null );
	const navigationElement = useMemo( () => ref.current );

	const handleResize = debounce( () => {
		const { bottom } = navigationElement.getBoundingClientRect();

		// Create an array of the Navigation DOM Element's children.
		const items = Array.from( navigationElement.childNodes );
		/*
			Create a map with each innerBlock's visibility by block id
		*/
		const visibilityMap = items.reduce( ( result, el ) => {
			/*
				Determine whether an element is hidden based on its position
				relative to the bottom of the navigation element; if an element
				is below the bottom, it means that the browser has determined that
				the element doesn't fit in the screen horizontally.
			*/
			const isHidden = el.getBoundingClientRect().y >= bottom;
			// Get the clientId for each block from their DOM Element's `id` attribute
			const [ , blockId ] = el.id.split( 'block-' );

			return {
				...result,
				[ blockId ]: isHidden,
			};
		}, {} );
		/*
			Determine whether or not the Navigation Element has any
			wrapped (hidden) elements.
		*/
		const isWrapping = Object.values( visibilityMap ).some(
			( isHidden ) => isHidden
		);

		setState( {
			isWrapping,
			visibilityMap,
		} );
	}, 100 );

	/*
		Get and save reference to the window object from the ownerDocumenet of our navigation element.
		Necessary because the resize event is only sent to the window object.
		Reference: https://developer.mozilla.org/en-US/docs/Web/API/Window/resize_event
	*/
	useEffect( () => {
		if ( null !== navigationElement ) {
			const { ownerDocument } = navigationElement;

			setDefaultView( ownerDocument.defaultView );
		}
	}, [ navigationElement ] );

	// Add resize event listener to our window object
	useEffect( () => {
		if ( null !== defaultView ) {
			defaultView.addEventListener( 'resize', handleResize );

			handleResize();

			return () =>
				defaultView.removeEventListener( 'resize', handleResize );
		}
	}, [ defaultView ] );

	const { replaceInnerBlocks } = useDispatch( 'core/block-editor' );

	/*
		Memoize innerBlocks value in order to avoid an infinite look of
		replacing innerBlocks and calling replaceInnerBlocks again on the new blocks.
	*/
	const memoizedInnerBlocks = useMemo( () => innerBlocks, [] );

	/*
		Add an `isHidden` property to the navigation element's innerBlocks to
		determine whether or not they're being wrapped because they don't fit
		in the screen anymore.
	*/
	useMemo( () => {
		const updatedBlocks = memoizedInnerBlocks.map( ( block ) => ( {
			...block,
			isHidden: state.visibilityMap[ block.clientId ],
		} ) );

		replaceInnerBlocks( clientId, updatedBlocks, true );
	}, [ state.visibilityMap, memoizedInnerBlocks ] );

	/*
		Return the state, as it is useful for the main navigation
		element to know if some of its elements are hidden.
	*/
	return state;
}