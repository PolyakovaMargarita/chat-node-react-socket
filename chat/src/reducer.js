export default (state, action) => {
  switch (action.type) {
  case "JOINED":
    return {
      ...state,
      joined: true,
      roomId: action.payload.roomId,
      name: action.payload.name
    };
  default:
    return state;
  }
};