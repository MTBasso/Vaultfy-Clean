import { Joi } from 'celebrate';

import { customMessage } from '../../../../utils/celebrateErrors';

const deleteCredentialValidator = Joi.object({
  id: Joi.string().required().messages(customMessage('id'))
});

export { deleteCredentialValidator };
