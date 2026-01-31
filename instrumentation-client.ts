import { initBotId } from 'botid/client/core';

// Initialize BotID to protect the analysis endpoint
initBotId({
  protect: [
    {
      path: '/api/analyze',
      method: 'POST',
    },
  ],
});
