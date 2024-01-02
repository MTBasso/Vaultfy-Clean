import { Joi } from 'celebrate';

import { customMessage } from '../../../../utils/celebrateErrors';

const fetchVaultValidator = Joi.object({
  id: Joi.string().required().messages(customMessage('id'))
});

export { fetchVaultValidator };
