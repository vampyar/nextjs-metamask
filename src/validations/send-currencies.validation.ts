import z from 'Zod';
import { zodResolver } from '@hookform/resolvers/zod';

const sendCurrenciesSchema = z.object({
  receiver: z
    .string()
    .nonempty({
      message: 'The receiver is required',
    })
    .min(42)
    .toLowerCase(),
  currency: z.string().nonempty({
    message: 'The currency is required',
  }),
  amount: z.number(),
});

export type TSendCurrencies = z.infer<typeof sendCurrenciesSchema>;

export const sendCurrenciesResolver = zodResolver(sendCurrenciesSchema);
