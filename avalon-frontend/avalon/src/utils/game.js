const game = numberOfPlayers => {
  switch (numberOfPlayers) {
    case 5:
      return {
        good: 3,
        evil: 2,
      };
    case 6:
      return {
        good: 4,
        evil: 2,
      };
    case 7:
      return {
        good: 4,
        evil: 3,
      };
    case 8:
      return {
        good: 5,
        evil: 3,
      };
    case 9:
      return {
        good: 6,
        evil: 3,
      };
    case 10:
      return {
        good: 6,
        evil: 4,
      };
    default:
      break;
  }
};

export default game;
