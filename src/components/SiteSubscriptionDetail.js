import React from "react";
import MediaQuery from "react-responsive";
import styled from "styled-components";
import colors from "yoast-components/style-guide/colors.json";
import { LargeButton } from "./Button";
import Toggle from "./Toggle";
import plusIcon from "../icons/blue-plus-circle.svg";
import { FormattedMessage, FormattedNumber } from "react-intl";
import { Row } from "./Tables";
import _partial from "lodash/partial";
import formatAmount from "../../../shared/currency";
import AddLicensesModal from "./AddLicensesModal";

let responsiveWidthThreshold = 1355;

const SubscriptionLeftContainer = styled.span`
	margin: 0 40px;
	height: 66px;

	@media screen and ( min-width: ${ responsiveWidthThreshold }px ) {
		flex: 0 0 140px;
	}

	@media screen and ( max-width: ${ responsiveWidthThreshold }px ) {
		flex: 0 0 60px;
		margin: 0 10px;
	}
`;

const SubscriptionLogo = styled.img`
	width: 66px;
	height: 66px;

	@media screen and ( min-width: ${ responsiveWidthThreshold }px ) {
		float: right;
		margin-top: -9px;
	}
`;

const SubscriptionToggle = styled.span`
	margin-top: 15px;

	@media screen and ( min-width: ${ responsiveWidthThreshold }px ) {
		float: right;
		margin-right: 40px;
	}

	@media screen and ( max-width: ${ responsiveWidthThreshold }px ) {
		float: left;
		margin-top: 5px;
		margin-left: 20px;
	}
`;

const SubscriptionDetails = styled.div`
	color: ${ colors.$color_black };
	margin: 0 40px 0 0;
	flex: 1 1;
	overflow: hidden;
	max-width: 100%;
	@media screen and ( max-width: ${ responsiveWidthThreshold }px ) {
		margin: 0 10px;
		heigth: 150px;
	}
`;

const ProductName = styled.span`
	font-size: 16px;
	font-weight: 400;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	display: block;

	@media screen and ( max-width: ${ responsiveWidthThreshold }px ) {
		height: 60px;
		line-height: 60px;
	}
	@media screen and ( max-width: 350px ) {
		font-size: 14px;
		text-overflow: hidden;
	}
`;

const SubscriptionUsage = styled.span`
	font-size: 14px;
	font-weight: 300;
	font-style: italic;
	clear: left;

	@media screen and ( max-width: ${ responsiveWidthThreshold }px ) {
		margin-top: 10px;
		float: left;
		height: 20px;
		overflow: hidden;
		max-width: 100%;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
`;

const AddOneSlot = styled.button`
	font-size: 14px;
	font-weight: 300;
	font-style: italic;
	border: none;
	background: transparent url( ${ plusIcon } ) no-repeat 0 0;
	background-size: 16px;
	color: ${ colors.$color_blue };
	cursor: pointer;
	padding: 0 0 0 20px;
	margin-left: 10px;
	text-align: left;

	@media screen and ( max-width: ${ responsiveWidthThreshold }px ) {
		width: 100%;
		margin-left: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
`;

const Buttons = styled.span`
	margin: 0 40px 6px 0;

	button:last-child {
		margin-left: 40px;
	}
`;

/**
 * Creates Site Subscriptions component
 *
 * @param {Object} props The props to use
 *
 * @returns {ReactElement} The rendered component.
 */
export default function SiteSubscriptionDetail( props ) {
	let rowProps = [];
	if ( props.background ) {
		rowProps.background = props.background;
	}
	let modal = (
		<AddLicensesModal isOpen={ props.popupOpen } onUpgrade={ props.onUpgrade } onClose={ props.onClose }/>
	);
	return (
		<Row { ...rowProps }>
			<SubscriptionLeftContainer>
				<SubscriptionLogo src={ props.productLogo } alt="" />
				<SubscriptionToggle>
					<Toggle
						onSetEnablement={ _partial( props.onToggleSubscription, props.id ) }
						isEnabled={ props.isEnabled }
						ariaLabel={ props.productId } />
				</SubscriptionToggle>
			</SubscriptionLeftContainer>

			<SubscriptionDetails>
				<ProductName>{ props.name }</ProductName>
				<SubscriptionUsage>
					<FormattedMessage id="subscriptions.remaining" defaultMessage={" { howMany } remaining "}
						values={{ howMany: ( props.slots.amountAvailable - props.slots.amountUsed ) + " / " + props.slots.amountAvailable }} />
				</SubscriptionUsage>
				{
					props.slots.addMoreSlots && props.slots.addMoreSlots !== "" &&
					<AddOneSlot onClick={ props.onAddMoreSlotsClick }>{ props.slots.addMoreSlots }
						<FormattedNumber value={ formatAmount( props.price ) } style="currency" currency={ props.currency }/>
					</AddOneSlot>

				}

			</SubscriptionDetails>
			{ modal }
			<MediaQuery query={ "(min-width: " + ( responsiveWidthThreshold + 1 ) + "px)" }>
				<Buttons>
					<LargeButton onClick={ props.onMoreInfoClick }><FormattedMessage id="subscriptions.buttons.moreInfo" defaultMessage="More info" /></LargeButton>
					<LargeButton onClick={ props.onSettingsClick }><FormattedMessage id="subscriptions.buttons.settings" defaultMessage="Settings" /></LargeButton>
				</Buttons>
			</MediaQuery>
		</Row>
	);
}

SiteSubscriptionDetail.propTypes = {
	id: React.PropTypes.string.isRequired,
	name: React.PropTypes.string.isRequired,
	onAddMoreSlotsClick: React.PropTypes.func,
	onToggleSubscription: React.PropTypes.func,
	onMoreInfoClick: React.PropTypes.func.isRequired,
	onSettingsClick: React.PropTypes.func.isRequired,
	onUpgrade: React.PropTypes.func.isRequired,
	isEnabled: React.PropTypes.bool,
	price: React.PropTypes.number.isRequired,
	currency: React.PropTypes.string.isRequired,
	productId: React.PropTypes.string.isRequired,
	productLogo: React.PropTypes.string.isRequired,
	slots: React.PropTypes.shape( {
		amountAvailable: React.PropTypes.number.isRequired,
		amountUsed: React.PropTypes.number,
		addMoreSlots: React.PropTypes.string,
	} ).isRequired,
	background: React.PropTypes.string,
	popupOpen: React.PropTypes.bool,
	onClose: React.PropTypes.func.isRequired,
};

SiteSubscriptionDetail.defaultProps = {
	onToggleSubscription: () => {},
	isEnabled: false,
	slots: {
		amountUsed: 0,
		onAddMoreSlotsClick: () => {},
		addMoreSlots: "",
	},
};
