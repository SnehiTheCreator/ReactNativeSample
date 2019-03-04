import { StyleSheet } from 'react-native';
import { palette } from './palette';

const textStyles = StyleSheet.create({
	 headline: {
		 fontFamily: "Rokkitt",
		 fontSize: 27,
		 fontWeight: "500",
		 color: palette.darkIndigo
	 },
	 headerTitle: {
		 fontFamily: "Rokkitt",
		 fontSize: 22,
		 fontWeight: "500",
		 textAlign: "center",
		 color: palette.darkIndigo
	 },
	 primaryButtonInactive: {
		 fontFamily: "Nunito Sans",
		 fontSize: 18,
		 fontWeight: "bold",
		 textAlign: "center",
		 color: palette.rustRed
	 },
	 primaryButton: {
		 fontFamily: "Nunito Sans",
		 fontSize: 18,
		 fontWeight: "bold",
		 textAlign: "center",
		 color: palette.white
	 },
	 title: {
		 fontFamily: "Nunito Sans",
		 fontSize: 16,
		 fontWeight: "600",
		 color: "#090909"
	 },
	 subheading: {
		 fontFamily: "Nunito Sans",
		 fontSize: 16,
		 color: palette.darkIndigo
	 },
	 textButton: {
		 fontFamily: "Nunito Sans",
		 fontSize: 14,
		 fontWeight: "bold",
		 textAlign: "center",
		 color: palette.blueberry
	 },
	 bodyWhite: {
		 fontFamily: "Avenir",
		 fontSize: 14,
		 fontWeight: "500",
		 textAlign: "center",
		 color: palette.white
	 },
	 hintText: {
		 fontFamily: "Nunito Sans",
		 fontSize: 14,
		 color: "#747474"
	 },
	 bodyBlack: {
		 fontFamily: "Nunito Sans",
		 fontSize: 14,
		 color: "#090909"
	 },
	 sectionHeader: {
		 fontFamily: "Nunito Sans",
		 fontSize: 14,
		 color: palette.darkIndigo
	 },
	 caption: {
		 fontFamily: "Nunito Sans",
		 fontSize: 13,
		 color: "#090909"
	 }
	});

module.exports = {
  textStyles
}
