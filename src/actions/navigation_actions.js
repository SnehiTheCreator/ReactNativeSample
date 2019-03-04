
export const navigationActions = {
  NEXT_SCENE: "NEXT_SCENE",
  GO_BACK: "GO_BACK",
  RESET_TO_OFFER_LIST: "RESET_TO_OFFER_LIST",
  RESET_TO_LANDING: "RESET_TO_LANDING",
  GO_TO_LAST_SCREEN: "GO_TO_LAST_SCREEN",
  RESET_TO_REGISTRATION: "RESET_TO_REGISTRATION",
	RESET_TO_LOGIN: "RESET_TO_LOGIN",
  POP_TO: "POP_TO",
  SYSTEM_ERROR: "SYSTEM_ERROR",
  CONNECTIVITY_ERROR: "CONNECTIVITY_ERROR"
}

export const navigateTo = (scene, props) => ({
  type: navigationActions.NEXT_SCENE,
  scene,
  props
})

export const resetToContent = () => ({
  type: navigationActions.RESET_TO_OFFER_LIST
})

export const goBack = () => ({
  type: navigationActions.GO_BACK
})

export const resetToLanding = () => ({
  type: navigationActions.RESET_TO_LANDING
})

export const goToLastScreen = (scene) => ({
  type: navigationActions.GO_TO_LAST_SCREEN,
  scene
})

export const systemError = () => ({
  type: navigationActions.SYSTEM_ERROR
})

export const connectivityError = () => ({
  type: navigationActions.CONNECTIVITY_ERROR
})

export const resetToRegistration = () => ({
  type: navigationActions.RESET_TO_REGISTRATION
})

export const resetToLogin = () => ({
	type: navigationActions.RESET_TO_LOGIN
})

export const popTo = (scene) => ({
  type: navigationActions.POP_TO,
  scene
})