import { Joi, Segments } from 'celebrate';

import { customMessage } from '../../../../utils/celebrateErrors';

const createCredentialValidator = {
  [Segments.BODY]: Joi.object().keys({
    vaultId: Joi.string().required().messages(customMessage('vaultId')),
    service: Joi.string().required().messages(customMessage('service')),
    username: Joi.string().required().messages(customMessage('username')),
    password: Joi.string().required().messages(customMessage('password'))
  })
};

export { createCredentialValidator };
