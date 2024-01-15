import { Joi } from 'celebrate';

import { customMessage } from '../../../../utils/celebrateErrors';

const listUserVaultsValidator = Joi.object({
  id: Joi.string().required().messages(customMessage('id'))
});

export { listUserVaultsValidator };
