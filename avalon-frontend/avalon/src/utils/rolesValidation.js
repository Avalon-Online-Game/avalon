export const chosenRolesValidation = chosenRoles => {
  if (
    chosenRoles.find(role => role.id === 'merlin') === undefined ||
    chosenRoles.find(role => role.id === 'assassin') === undefined
  ) {
    return {
      validation: false,
      errorMessage: 'Merlin and Assassin must always be in the game',
    };
  }

  if (chosenRoles.find(role => role.id === 'percival') !== undefined) {
    if (
      chosenRoles.find(role => role.id === 'merlin') === undefined ||
      chosenRoles.find(role => role.id === 'morgana') === undefined
    ) {
      return {
        validation: false,
        errorMessage:
          'Both Merlin and Morgana must be in the game when Percival is in',
      };
    }
  }
  return {validation: true};
};
