/**
 * External dependencies
 */
import { cx } from 'emotion';

/**
 * WordPress dependencies
 */
import { useMemo } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { useContextSystem } from '../../ui/context';
import * as styles from '../styles';

/**
 * @param {import('../../ui/context').PolymorphicComponentProps<import('../types').FooterProps, 'div'>} props
 */
export function useCardFooter( props ) {
	const {
		className,
		justify = 'flex-end',
		isBorderless = false,
		isShady = false,
		size = 'medium',
		...otherProps
	} = useContextSystem( props, 'CardFooter' );

	const classes = useMemo(
		() =>
			cx(
				styles.Footer,
				styles.borderRadius,
				styles.headerFooter,
				styles.cardPaddings[ size ],
				isBorderless && styles.borderless,
				isShady && styles.shady,
				className
			),
		[ className, isBorderless, isShady, size ]
	);

	return {
		...otherProps,
		className: classes,
		justify,
		isBorderless,
		isShady,
		size,
	};
}