import { Joi, Segments } from 'celebrate';

import { customMessage } from '../../../../utils/celebrateErrors';

const updateCredentialParamsValidator = Joi.object({
  id: Joi.string().required().messages(customMessage('id'))
});

const updateCredentialBodyValidator = {
  [Segments.BODY]: Joi.object().keys({
    service: Joi.string().messages(customMessage('service')),
    username: Joi.string().messages(customMessage('username')),
    password: Joi.string().messages(customMessage('password'))
  })
};

export { updateCredentialParamsValidator, updateCredentialBodyValidator };
