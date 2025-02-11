import axios from 'axios';

const endpoints = {
  totals:
    'https://sisaludapi-prepro.confluenciait.com/ospacarpqa/affiliates/totals?Clientappid=21&Excludeorigins=3,7,13&Period=202501',
  origin: {
    all: 'https://sisaludapi-prepro.confluenciait.com/ospacarpqa/affiliates/distribution/origin?Clientappid=21&Period=202405',
    specific:
      'https://sisaludapi-prepro.confluenciait.com/ospacarpqa/affiliates/distribution/origin?Clientappid=21&Period=202501&Delegation=:originId',
  },
  delegations: {
    all: 'https://sisaludapi-prepro.confluenciait.com/ospacarpqa/affiliates/distribution/delegation?Clientappid=21&Period=202405',
    specific:
      'https://sisaludapi-prepro.confluenciait.com/ospacarpqa/affiliates/distribution/delegation?Clientappid=21&Period=202501&Origin=:delegationId',
  },
  trendsOrigin:
    'https://sisaludapi-prepro.confluenciait.com/ospacarpqa/affiliates/trends/origin?Clientappid=21&Startperiod=202402&Endperiod=202501&Delegation=:id',
  trendsDelegation:
    'https://sisaludapi-prepro.confluenciait.com/ospacarpqa/affiliates/trends/delegation?Clientappid=21&Startperiod=202402&Endperiod=202501&Origin=:id',
};
