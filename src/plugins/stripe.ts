import { paymentSucceeded } from '@/stripe/webhooks/paymentSucceeded'
import { productUpdated } from '@/stripe/webhooks/productUpdated'
import { stripePlugin } from '@payloadcms/plugin-stripe'

export const stripePluginConfig = stripePlugin({
  isTestKey: Boolean(process.env.PAYLOAD_PUBLIC_STRIPE_IS_TEST_KEY),
  logs: true,
  rest: false,
  stripeSecretKey: process.env.STRIPE_SECRET_KEY || '',
  stripeWebhooksEndpointSecret: process.env.STRIPE_WEBHOOKS_SIGNING_SECRET,
  webhooks: {
    'payment_intent.succeeded': paymentSucceeded,
    'product.updated': productUpdated,
  },
})