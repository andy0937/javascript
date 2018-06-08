import React from "react";
import PropTypes from "prop-types";
import uniqueId from "lodash/uniqueId";
import { __ } from "@wordpress/i18n";

import ReplacementVariableEditorStandalone from "./ReplacementVariableEditorStandalone";
import {
	SimulatedLabel,
	TitleInputContainer,
	DescriptionInputContainer,
	TriggerReplacementVariableSuggestionsButton,
	withCaretStyles,
} from "./Shared";
import SvgIcon from "../../Shared/components/SvgIcon";
import { replacementVariablesShape } from "../constants";

class ReplacementVariableEditor extends React.Component {
	/**
	 * The constructor.
	 *
	 * @param {Object} props The component props.
	 */
	constructor( props ) {
		super( props );

		this.uniqueId = uniqueId();

		switch( props.type ) {
			case "description":
				this.InputContainer = DescriptionInputContainer;
				break;
			case "title":
				this.InputContainer = TitleInputContainer;
				break;
			default:
				this.InputContainer = TitleInputContainer;
		}

		if( props.withCaret ) {
			this.InputContainer = withCaretStyles( this.InputContainer );
		}

		this.triggerReplacementVariableSuggestions = this.triggerReplacementVariableSuggestions.bind( this );
	}

	/**
	 * Inserts a % into a ReplacementVariableEditor to trigger the replacement variable suggestions.
	 *
	 * @param {string} fieldName The field name to get the ref for.
	 *
	 * @returns {void}
	 */
	triggerReplacementVariableSuggestions() {
		const element = this.ref;

		element.triggerReplacementVariableSuggestions();
	}

	/**
	 * Renders the components.
	 *
	 * @returns {ReactElement} The rendered element.
	 */
	render() {
		const {
			label,
			onChange,
			content,
			onFocus,
			isActive,
			isHovered,
			replacementVariables,
			styleForMobile,
			editorRef,
			placeholder,
		} = this.props;

		const InputContainer = this.InputContainer;

		return (
			<React.Fragment>
				<SimulatedLabel
					id={ this.uniqueId }
					onClick={ onFocus } >
					{ label }
				</SimulatedLabel>
				<TriggerReplacementVariableSuggestionsButton
					onClick={ () => this.triggerReplacementVariableSuggestions() }
					isSmallerThanMobileWidth={ styleForMobile }
				>
					<SvgIcon icon="plus-circle" />
					{ __( "Insert snippet variable", "yoast-components" ) }
				</TriggerReplacementVariableSuggestionsButton>
				<InputContainer
					onClick={ onFocus }
					isActive={ isActive }
					isHovered={ isHovered }>
					<ReplacementVariableEditorStandalone
						placeholder={ placeholder }
						content={ content }
						onChange={ onChange }
						onFocus={ onFocus }
						replacementVariables={ replacementVariables }
						ref={ ref => {
							this.ref = ref;
							editorRef( ref );
						} }
						ariaLabelledBy={ this.uniqueId }
					/>
				</InputContainer>
			</React.Fragment>
		);
	}
}

ReplacementVariableEditor.propTypes = {
	editorRef: PropTypes.func,
	content: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
	replacementVariables: replacementVariablesShape,
	isActive: PropTypes.bool,
	isHovered: PropTypes.bool,
	withCaret: PropTypes.bool,
	onFocus: PropTypes.func,
	styleForMobile: PropTypes.bool,
	label: PropTypes.string,
	placeholder: PropTypes.string,
	type: PropTypes.oneOf( [ "title", "description" ] ),
};

ReplacementVariableEditor.defaultProps = {
	replacementVariables: [],
	mobileWidth: 356,
};

export default ReplacementVariableEditor;
