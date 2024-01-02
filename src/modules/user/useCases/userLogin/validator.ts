import { Joi, Segments } from 'celebrate';

import { customMessage } from '../../../../utils/celebrateErrors';

const loginValidator = {
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().required().messages(customMessage('email')),
    password: Joi.string().required().messages(customMessage('password'))
  })
};

export { loginValidator };
