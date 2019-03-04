import { Error as _Error } from "./Error";
import { goToLastScreen } from "../../actions/navigation_actions";
import {connect} from 'react-redux';

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = (dispatch) => ({
	goToLastScreen: (scene) => {dispatch(goToLastScreen(scene))}
})

export const Error = connect(
	mapStateToProps,
	mapDispatchToProps
)(_Error)