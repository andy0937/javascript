/* External dependencies */
import React from "react";
import PropTypes from "prop-types";
import uniqueId from "lodash/uniqueId";
import debounce from "lodash/debounce";
import { __ } from "@wordpress/i18n";
import styled from "styled-components";

/* Internal dependencies */
import ReplacementVariableEditorStandalone from "./ReplacementVariableEditorStandalone";
import ReplacementVariableEditor from "./ReplacementVariableEditor";
import { replacementVariablesShape } from "../constants";
import {
	DescriptionInputContainer,
	SimulatedLabel,
	TriggerReplacementVariableSuggestionsButton,
} from "./Shared";
import SvgIcon from "../../Shared/components/SvgIcon";



const FormSection = styled.div`
	margin: 10px 0;
`;

const StyledEditor = styled.div`
	padding: 0 20px;
`;

class SettingsSnippetEditorFields extends React.Component {
	/**
	 * Constructs the snippet editor fields.
	 *
	 * @param {Object}   props                             The props for the editor
	 *                                                     fields.
	 * @param {Object}   props.replacementVariables        The replacement variables
	 *                                                     for this editor.
	 * @param {Object}   props.data                        The initial editor data.
	 * @param {string}   props.data.title                  The initial title.
	 * @param {string}   props.data.description            The initial description.
	 * @param {Function} props.onChange                    Called when the data
	 *                                                     changes.
	 * @param {Function} props.onFocus                     Called when a field is
	 *                                                     focused.
	 * @param {string}   props.activeField                 The field that is
	 *                                                     currently active.
	 * @param {string}   props.hoveredField                The field that is
	 *                                                     currently hovered.
	 *
	 * @returns {void}
	 */
	constructor( props ) {
		super( props );

		this.elements = {
			title: null,
			description: null,
		};

		this.state = {
			isSmallerThanMobileWidth: false,
		};

		this.uniqueId = uniqueId( "snippet-editor-field-" );

		this.setRef = this.setRef.bind( this );
		this.setEditorRef = this.setEditorRef.bind( this );
		this.triggerReplacementVariableSuggestions = this.triggerReplacementVariableSuggestions.bind( this );
		this.debouncedUpdateIsSmallerThanMobileWidth = debounce( this.updateIsSmallerThanMobileWidth.bind( this ), 200 );
	}

	/**
	 * Sets the ref for the editor.
	 *
	 * @param {Object} editor The editor React reference.
	 *
	 * @returns {void}
	 */
	setEditorRef( editor ) {
		this.editor = editor;
	}

	/**
	 * Sets ref for field editor.
	 *
	 * @param {string} field The field for this ref.
	 * @param {Object} ref The Draft.js react element.
	 *
	 * @returns {void}
	 */
	setRef( field, ref ) {
		this.elements[ field ] = ref;
	}

	/**
	 * Ensures isSmallerThanMobileWidth is accurate.
	 *
	 * By running it once and binding it to the window resize event.
	 *
	 * @returns {void}
	 */
	componentDidMount() {
		this.updateIsSmallerThanMobileWidth();
		window.addEventListener( "resize", this.debouncedUpdateIsSmallerThanMobileWidth );
	}

	/**
	 * Removes the window resize event listener.
	 *
	 * @returns {void}
	 */
	componentWillUnmount() {
		window.removeEventListener( "resize", this.debouncedUpdateIsSmallerThanMobileWidth );
	}

	/**
	 * Makes sure the focus is correct after updating the editor fields.
	 *
	 * @param {Object} prevProps The previously received props.
	 *
	 * @returns {void}
	 */
	componentDidUpdate( prevProps ) {
		this.focusOnActiveFieldChange( prevProps.activeField );
	}

	/**
	 * Focuses the currently active field if it wasn't previously active.
	 *
	 * @param {string} prevActiveField The previously active field.
	 *
	 * @returns {void}
	 */
	focusOnActiveFieldChange( prevActiveField ) {
		const { activeField } = this.props;

		if ( activeField && activeField !== prevActiveField ) {
			const activeElement = this.elements[ activeField ];
			activeElement.focus();
		}
	}

	/**
	 * Inserts a % into a ReplacementVariableEditor to trigger the replacement variable suggestions.
	 *
	 * @param {string} fieldName The field name to get the ref for.
	 *
	 * @returns {void}
	 */
	triggerReplacementVariableSuggestions( fieldName ) {
		const element = this.elements[ fieldName ];

		element.triggerReplacementVariableSuggestions();
	}

	/**
	 * Updates isSmallerThanMobileWidth when changed.
	 *
	 * isSmallerThanMobileWidth is true if the editor's client width is smaller than the mobile width prop.
	 *
	 * @returns {void}
	 */
	updateIsSmallerThanMobileWidth() {
		const isSmallerThanMobileWidth = this.editor.clientWidth < this.props.mobileWidth;
		if ( this.state.isSmallerThanMobileWidth !== isSmallerThanMobileWidth ) {
			this.setState( { isSmallerThanMobileWidth } );
		}
	}

	/**
	 * Renders the snippet editor.
	 *
	 * @returns {ReactElement} The snippet editor element.
	 */
	render() {
		const {
			descriptionEditorFieldPlaceholder,
			activeField,
			hoveredField,
			replacementVariables,
			onFocus,
			onChange,
			data: {
				title,
				description,
			},
		} = this.props;

		const isSmallerThanMobileWidth = this.state.isSmallerThanMobileWidth;

		return (
			<StyledEditor
				innerRef={ this.setEditorRef }
			>
				<FormSection>
					<ReplacementVariableEditor
						label={ __( "SEO title", "yoast-components" ) }
						onFocus={ () => onFocus( "title" ) }
						isActive={ activeField === "title" }
						isHovered={ hoveredField === "title" }
						editorRef={ ref => this.setRef( "title", ref ) }
						replacementVariables={ replacementVariables }
						content={ title }
						onChange={ content => onChange( "title", content ) }
						styleForMobile={ isSmallerThanMobileWidth }
					/>
				</FormSection>
				<FormSection>
					<ReplacementVariableEditor
						type="description"
						placeholder={ descriptionEditorFieldPlaceholder }
						label={ __( "Meta description", "yoast-components" ) }
						onFocus={ () => onFocus( "description" ) }
						isActive={ activeField === "description" }
						isHovered={ hoveredField === "description" }
						editorRef={ ref => this.setRef( "description", ref ) }
						replacementVariables={ replacementVariables }
						content={ description }
						onChange={ content => onChange( "description", content ) }
						styleForMobile={ isSmallerThanMobileWidth }
					/>
				</FormSection>
			</StyledEditor>
		);
	}
}

SettingsSnippetEditorFields.propTypes = {
	replacementVariables: replacementVariablesShape,
	onChange: PropTypes.func.isRequired,
	onFocus: PropTypes.func,
	data: PropTypes.shape( {
		title: PropTypes.string,
		description: PropTypes.string,
	} ).isRequired,
	activeField: PropTypes.oneOf( [ "title", "description" ] ),
	hoveredField: PropTypes.oneOf( [ "title", "description" ] ),
	descriptionEditorFieldPlaceholder: PropTypes.string,
	mobileWidth: PropTypes.number,
};

SettingsSnippetEditorFields.defaultProps = {
	replacementVariables: [],
	onFocus: () => {},
	mobileWidth: 356,
};

export default SettingsSnippetEditorFields;
