import PropTypes from "prop-types";
import React from "react";
import { injectIntl, defineMessages, FormattedMessage } from "react-intl";
import warningTriangle from "../icons/exclamation-triangle.svg";
import styled from "styled-components";
import colors from "yoast-components/style-guide/colors.json";
import defaults from "../config/defaults.json";

let messages = defineMessages( {
	contactSupportLink: {
		id: "contact.support.link",
		defaultMessage: "please contact support",
	},
} );

const YellowWarning = styled.div`
	padding: 4px;
	background-color: ${ colors.$color_yellow };
	margin: 0.5em 0;
	overflow: auto;
	display: flex;
	align-items: center;
	@media screen and ( max-width: ${ defaults.css.breakpoint.mobile } ) {
		flex-direction: column;
		text-align: left;
	}
`;

const NoActiveProductIcon = styled.img`
	width: 15%;
	height: 10%;
	padding: 20px;
	min-width: 75px;
	display: flex;
	@media screen and ( max-width: ${ defaults.css.breakpoint.mobile } ) {
		padding: 10px;
	}
`;

const WarningText = styled.span`
	font-size: 1em;
`;

const PurpleLink = styled.a`
	color: ${ colors.$color_purple };
`;

/**
 * This class can render error messages in our custom style. It outputs the styled error message if its errorMessage prop is not empty.
 * Else, it renders null.
 *
 * @param {Object} props The props to use.
 *
 * @returns {ReactElement} The rendered ErrorMessage component.
 */
class ErrorMessage extends React.Component {
	/**
	 * Sets the ErrorMessage object.
	 *
	 * @param {Object} props The props passed to the component.
	 * @returns {void}
	 */
	constructor( props ) {
		super( props );
	}

	/**
	 * Checks the errormessage for placeholders, replaces them with desired content. Outputs an object that can be used by formatErrorMessage().
	 *
	 * @param {string} errorMessage The string to check for placeholders.
	 * @returns {Object} An object with a defaultMessage and values, which can be used by FormattedMessage.
	 */
	handlePlaceholders( errorMessage ) {
		let defaultMessage = "{ errorMessage }";
		let values = { errorMessage };

		// In the case of a [customer_support_link] placeholder, replace with an e-mail link to support. Will eventually link to Knowledge base.
		if ( errorMessage.indexOf( "[customer_support_link]" ) > -1 ) {
			errorMessage = errorMessage.replace( "[customer_support_link]", "" );
			let contactLink = (
				<PurpleLink href="mailto:support@yoast.com">
					<FormattedMessage id={ messages.contactSupportLink.id } defaultMessage={ messages.contactSupportLink.defaultMessage } />
				</PurpleLink> );
			defaultMessage = "{ errorMessage }{ contactLink }.";
			values = Object.assign( values, values, { errorMessage, contactLink } );
		}

		return(
		{
			defaultMessage,
			values,
		}
		);
	}

	/**
	 * Formats an object containing a defaultMessage and values into a FormattedMessage component.
	 *
	 * @param {Object} messageFormatObject An object containing a defaultMessage and values that replace defaultMessage sections.
	 * @returns {ReactElement} A FormattedMessage component that contains the formatted error message.
	 */
	formatErrorMessage( messageFormatObject ) {
		return(
			<FormattedMessage
				id="sites.add-site.error"
				defaultMessage={ messageFormatObject.defaultMessage }
				values={ messageFormatObject.values }
			/>
		);
	}

	/**
	 * Sets the error message to be rendered, or null.
	 *
	 * @param {string} errorMessage The error message to render.
	 * @returns {ReactElement} The rendered JSX element.
	 */
	getErrorMessage( errorMessage ) {
		if ( errorMessage === "" ) {
			return null;
		}

		let messageFormatObject = this.handlePlaceholders( errorMessage );
		let finalErrorMessage = this.formatErrorMessage( messageFormatObject );

		return(
			<YellowWarning role="alert">
				<NoActiveProductIcon src={ warningTriangle } alt=""/>
				<WarningText>
					{ finalErrorMessage }
				</WarningText>
			</YellowWarning>
		);
	}

	/**
	 * Returns the rendered html.
	 *
	 * @returns {ReactElement} The rendered html.
	 */
	render() {
		return (
				this.getErrorMessage( this.props.errorMessage )
		);
	}
}

ErrorMessage.propTypes = {
	errorMessage: PropTypes.string,
};

ErrorMessage.defaultProps = {
	errorMessage: "",
};

export default injectIntl( ErrorMessage );
