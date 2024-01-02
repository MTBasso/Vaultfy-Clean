import { Joi, Segments } from 'celebrate';

import { customMessage } from '../../../../utils/celebrateErrors';

const updateVaultParamsValidator = Joi.object({
  id: Joi.string().required().messages(customMessage('id'))
});

const updateVaultBodyValidator = {
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required().messages(customMessage('name'))
  })
};

export { updateVaultParamsValidator, updateVaultBodyValidator };
