import { Joi, Segments } from 'celebrate';

import { customMessage } from '../../../../utils/celebrateErrors';

const createVaultValidator = {
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required().messages(customMessage('name'))
  })
};

export { createVaultValidator };
