import { Joi } from 'celebrate';

import { customMessage } from '../../../../utils/celebrateErrors';

const deleteVaultValidator = Joi.object({
  id: Joi.string().required().messages(customMessage('id'))
});

export { deleteVaultValidator };
