import { Joi, Segments } from 'celebrate';

import { customMessage } from '../../../../utils/celebrateErrors';

const registerValidator = {
  [Segments.BODY]: Joi.object().keys({
    username: Joi.string().required().messages(customMessage('username')),
    email: Joi.string().required().messages(customMessage('email')),
    password: Joi.string().required().messages(customMessage('password'))
  })
};

export { registerValidator };
