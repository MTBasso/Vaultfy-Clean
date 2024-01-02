const customMessage = (field: string) => {
  return {
    'string.empty': `The field ${field} can't be empty!`,
    'any.required': `The ${field} field is required!`
  };
};

export { customMessage };
