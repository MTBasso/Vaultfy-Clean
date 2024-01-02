import { Joi } from 'celebrate';

import { customMessage } from '../../../../utils/celebrateErrors';

const fetchCredentialValidator = Joi.object({
  id: Joi.string().required().messages(customMessage('id'))
});

export { fetchCredentialValidator };
